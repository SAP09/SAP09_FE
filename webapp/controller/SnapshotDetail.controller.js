sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend(
      "odata.metadata.manager.controller.SnapshotDetail",
      {
        // ─── State ────────────────────────────────────────────────────
        _xmlLines: [],
        _highlightedLine: null,
        _wrapMode: false,
        _sGroupId: null,
        _sVersionId: null,

        // ─── Life-cycle ──────────────────────────────────────────────
        onInit: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter
            .getRoute("snapshotDetail")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
          var oArgs = oEvent.getParameter("arguments");
          this._sGroupId  = oArgs.service;  // GroupId GUID
          this._sVersionId = oArgs.version; // VersionId GUID

          // Reset state
          this._highlightedLine = null;
          this._wrapMode = false;

          // Attempt to load real data from the backend
          this._loadRealData();
        },

        onAfterRendering: function () {
          // Only render XML if we already have lines loaded
          if (this._xmlLines && this._xmlLines.length) {
            this._renderXmlLines(null);
          }
        },

        // ─── Real-data loading ───────────────────────────────────────
        _loadRealData: function () {
          var that = this;
          var oComp = this.getOwnerComponent();
          var oDataService = oComp.getDataService ? oComp.getDataService() : null;

          if (!oDataService || !oDataService.fetchVersionsForGroup || !this._sGroupId) {
            // No service or no group — fall back to placeholder
            this._showPlaceholder("No data service or missing route parameters.");
            return;
          }

          // Show loading state
          this._showLoadingState();

          oDataService
            .fetchVersionsForGroup(this._sGroupId)
            .then(function (oData) {
              var aVersions = oData.value || [];

              // Find the matching version by VersionId
              var oVersion = aVersions.find(function (v) {
                return v.VersionId === that._sVersionId;
              });

              if (!oVersion) {
                that._showPlaceholder(
                  "Version not found (VersionId: " + that._sVersionId + ")"
                );
                return null;
              }

              // Get the first Detail's ID for this version
              var aDetails = oVersion._Detail || [];
              if (aDetails.length === 0) {
                that._showPlaceholder(
                  "No detail snapshots found for version " + oVersion.VersionNo
                );
                return null;
              }

              var sDetailId = aDetails[0].DetailId;
              console.log(
                "[SnapshotDetail] Fetching XML for DetailId:",
                sDetailId
              );

              return oDataService.fetchDetailXml(sDetailId).then(function (oResult) {
                return { version: oVersion, result: oResult };
              });
            })
            .then(function (oPayload) {
              if (!oPayload) return;
              var oVersion = oPayload.version;
              var oResult  = oPayload.result;

              console.log("[SnapshotDetail] fetchDetailXml payload resolved:", oPayload);

              if (!oResult || !oResult.MetadataXml) {
                that._showPlaceholder("Empty metadata XML returned from backend.");
                return;
              }

              // Parse the raw XML string into display lines
              that._xmlLines = that._parseXmlToLines(oResult.MetadataXml);
              that._renderXmlLines(null);

              // Highlight first significant line
              var nFirstTag = that._xmlLines.findIndex(function (l) {
                return l.t === "tag";
              });
              if (nFirstTag >= 0) {
                that._highlightLine(that._xmlLines[nFirstTag].n);
              }

              // Update header info with real version data
              that._updateHeader(oVersion);

              // Render the entity tree dynamically
              that._parseMetadataAndRenderTree(oResult.MetadataXml, oVersion.VersionNo);
            })
            .catch(function (oError) {
              console.error("[SnapshotDetail] Failed to load detail XML:", oError);
              that._showPlaceholder(
                "Failed to load metadata: " + (oError.message || String(oError))
              );
            });
        },

        /**
         * Simple XML beautifier / formatter
         */
        _formatXml: function (sXml) {
          if (!sXml) return "";
          var sClean = sXml.replace(/>\s+</g, '><').trim();
          var sRaw = sClean.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');
          
          var aLines = sRaw.split(/\r?\n/);
          var sFormatted = "";
          var nIndent = 0;
          var sGap = "  ";
          
          aLines.forEach(function (sLine) {
            var sTrim = sLine.trim();
            if (!sTrim) return;

            var bIsClosing = /^<\//.test(sTrim);
            var bIsSelfClosing = /\/>$/.test(sTrim) || /^<\?|^<!--/.test(sTrim);
            var bHasInlineClose = /<[^\/!>][^>]*>.*<\//.test(sTrim);
            var bIsOpening = /^<[^\/!>]/.test(sTrim) && !bIsClosing && !bIsSelfClosing && !bHasInlineClose;

            if (bIsClosing) {
              nIndent = Math.max(0, nIndent - 1);
            }

            var sPadding = "";
            for (var i = 0; i < nIndent; i++) {
              sPadding += sGap;
            }
            sFormatted += sPadding + sTrim + "\n";

            if (bIsOpening) {
              nIndent++;
            }
          });

          return sFormatted.trim();
        },

        /**
         * Parse a raw XML string into the _xmlLines format used by the renderer.
         * Each line: { n: lineNumber, t: "pi"|"comment"|"tag", c: htmlEscapedContent }
         */
        _parseXmlToLines: function (sXml) {
          var sFormatted = this._formatXml(sXml);
          var aRaw = sFormatted.split(/\r?\n|\n/);
          return aRaw.map(function (sLine, i) {
            // store a raw/unescaped version for reliable searches
            var sRaw = sLine.trimStart();
            var sType = "tag";
            if (sRaw.indexOf("<?") === 0) {
              sType = "pi";
            } else if (sRaw.indexOf("<!--") === 0) {
              sType = "comment";
            }
            // HTML-escape for safe innerHTML rendering
            var sEscaped = sLine
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;");
            return { n: i + 1, t: sType, c: sEscaped, r: sRaw };
          });
        },

        /**
         * Update the detail header panel with real version metadata.
         */
        _updateHeader: function (oVersion) {
          if (!oVersion) return;

          // 1. Get the parent service details from component JSONModel
          var oComp = this.getOwnerComponent();
          var oModel = oComp ? oComp.getModel() : null;
          var aServices = oModel ? (oModel.getProperty("/services") || []) : [];
          var that = this;
          var oService = aServices.find(function (s) {
            return s.id === that._sGroupId;
          });

          // 2. Set dynamic texts in the top bar header
          var oVersionTitle = this.byId("versionTitle");
          if (oVersionTitle) {
            oVersionTitle.setText("Version v" + (oVersion.VersionNo || ""));
          }

          var oWfSubtitle = this.byId("wfPaneSubtitle");
          if (oWfSubtitle) {
            oWfSubtitle.setText("Version v" + (oVersion.VersionNo || "") + " — event chain that triggered this capture");
          }

          var sTrigger = oVersion.TriggerText || (oVersion.TriggerType === "A" ? "Auto" : "Manual");
          var oBadgeTrigger = this.byId("badgeTrigger");
          if (oBadgeTrigger) {
            oBadgeTrigger.setText(sTrigger === "Auto" ? "🤖 Auto" : "👤 Manual");
          }

          var oBadgeVersionType = this.byId("badgeVersionType");
          if (oBadgeVersionType) {
            oBadgeVersionType.setText(oService ? oService.type : "OData");
          }

          var oBadgePrefix = this.byId("badgePrefix");
          if (oBadgePrefix) {
            oBadgePrefix.setText(oService ? oService.prefix : "—");
          }

          var oBadgeStatus = this.byId("badgeStatus");
          if (oBadgeStatus) {
            var bLatest = oVersion.LatestVersion || oVersion.LatestVersion === "true";
            oBadgeStatus.setText(bLatest ? "Latest" : "Immutable");
            oBadgeStatus.removeStyleClass("badge-active");
            oBadgeStatus.removeStyleClass("badge-inactive");
            oBadgeStatus.addStyleClass(bLatest ? "badge-active" : "badge-inactive");
          }

          // 3. Set values in the metadata row
          var oMetaService = this.byId("metaService");
          if (oMetaService) {
            oMetaService.setText(oService ? oService.name : (this._sGroupId || "—"));
          }

          var oMetaDate = this.byId("metaDate");
          if (oMetaDate) {
            oMetaDate.setText(this._formatDate(oVersion.CreatedAt));
          }

          var oMetaCreatedBy = this.byId("metaCreatedBy");
          if (oMetaCreatedBy) {
            oMetaCreatedBy.setText(oVersion.CreatedBy || "—");
          }

          var oMetaTransport = this.byId("metaTransport");
          if (oMetaTransport) {
            oMetaTransport.setText(oVersion.TransportNo || oVersion.Transport || "Local");
          }

          var oMetaTriggeringApp = this.byId("metaTriggeringApp");
          if (oMetaTriggeringApp) {
            var sApp = oVersion.TriggeringApp || oVersion.App;
            if (!sApp) {
              sApp = oVersion.TriggerType === "A" ? "Auto-Scan Agent" : "Management UI";
            }
            oMetaTriggeringApp.setText(sApp);
          }

          var oMetaHash = this.byId("metaHash");
          if (oMetaHash) {
            var sHash = oVersion.GroupHash || "";
            oMetaHash.setText(sHash ? sHash.substring(0, 16) + "…" : "—");
          }
        },

        _showLoadingState: function () {
          this._xmlLines = [
            { n: 1, t: "pi", c: "Loading $metadata.xml from backend…" }
          ];
          this._renderXmlLines(null);
        },

        _showPlaceholder: function (sMsg) {
          this._xmlLines = [
            { n: 1, t: "pi",  c: "&lt;!-- " + sMsg + " --&gt;" },
            { n: 2, t: "tag", c: "&lt;!-- Check browser console for details --&gt;" }
          ];
          this._renderXmlLines(null);
        },

        _renderXmlLines: function (sFilter) {
          var oHtmlControl = this.byId("xmlHtmlControl");
          if (!oHtmlControl) return;

          var sFilterLower = sFilter ? sFilter.toLowerCase() : "";
          var sViewId = this.getView().getId();

          // Build XML line rows
          var linesHtml = "";
          this._xmlLines.forEach(function (line) {
            if (sFilterLower && line.c.toLowerCase().indexOf(sFilterLower) < 0) return;
            var cls = (line.t === "pi" || line.t === "comment") ? "xml-line xml-line-pi" : "xml-line";
            if (this._highlightedLine === line.n) cls += " xml-line-highlight";
            if (this._wrapMode) cls += " xml-wrap";
            linesHtml +=
              '<div class="' + cls + '" id="xmlLine_' + line.n + '">' +
                '<span class="xml-ln">' + line.n + '</span>' +
                '<span class="xml-content">' + line.c + '</span>' +
              '</div>';
          }.bind(this));

          var html =
            '<div class="xmlOuterWrapper">' +
              '<div class="xmlToolbar">' +
                '<input id="xmlSearchInput_' + sViewId + '" type="text" class="xmlSearchNative" placeholder="Search in XML\u2026" ' +
                  'oninput="(function(v){sap.ui.getCore().byId(\'' + sViewId + '\').getController()._onNativeSearch(v);})(this.value)" />' +
                '<span style="flex:1"></span>' +
                '<button class="xmlToolbarBtnNative" onclick="sap.ui.getCore().byId(\'' + sViewId + '\').getController().onCopyXml()">&#x2398; Copy</button>' +
                '<button class="xmlToolbarBtnNative" onclick="sap.ui.getCore().byId(\'' + sViewId + '\').getController().onToggleWrap()" style="margin-left:4px">' + (this._wrapMode ? '&#x21B5; Wrap ON' : '&#x21AA; Wrap') + '</button>' +
              '</div>' +
              '<div class="xmlScrollArea" id="xmlScrollNative_' + sViewId + '">' +
                '<div class="xmlLinesContainer">' + linesHtml + '</div>' +
              '</div>' +
            '</div>';

          oHtmlControl.setContent(html);
        },

        _onNativeSearch: function (sVal) {
          this._renderXmlLines(sVal || null);
        },

        // ─── Tree node interaction ───────────────────────────────────
        onTreeNodePress: function (oEvent) {
          var oSource = oEvent.getSource();
          var nLine = null;
          var aCd = oSource.getCustomData ? oSource.getCustomData() : [];
          aCd.forEach(function (cd) {
            if (cd.getKey() === "xmlLine") nLine = parseInt(cd.getValue(), 10);
          });

          var oTree = this.byId("entityTreeContainer");
          if (oTree && oTree.getDomRef()) {
            oTree
              .getDomRef()
              .querySelectorAll(".treeNode-active")
              .forEach(function (el) {
                el.classList.remove("treeNode-active");
              });
          }

          var oDomRef = oSource.getDomRef();
          if (oDomRef) oDomRef.classList.add("treeNode-active");

          if (nLine) {
            this._highlightLine(nLine);
          }
        },

        _highlightLine: function (nLine) {
          this._highlightedLine = nLine;
          this._renderXmlLines(null);
          setTimeout(
            function () {
              // Scroll to the highlighted line in the native scroll area
              var oHtmlCtrl = this.byId("xmlHtmlControl");
              var oCtrlDom = oHtmlCtrl ? oHtmlCtrl.getDomRef() : null;
              if (!oCtrlDom) return;
              var oLineDom = oCtrlDom.querySelector("#xmlLine_" + nLine);
              if (oLineDom) {
                oLineDom.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }.bind(this),
            150
          );
        },

        // ─── Entity tree search ──────────────────────────────────────
        onEntitySearch: function (oEvent) {
          var sQuery = (oEvent.getParameter("newValue") || "").toLowerCase();
          var oTree = this.byId("entityTreeContainer");
          if (!oTree || !oTree.getDomRef()) return;
          oTree
            .getDomRef()
            .querySelectorAll(".treeNode")
            .forEach(function (el) {
              var label = el.querySelector(".treeNodeLabel");
              if (!label) return;
              var sText = label.textContent || label.innerText || "";
              el.style.display =
                !sQuery || sText.toLowerCase().indexOf(sQuery) >= 0 ? "" : "none";
            });
        },

        // ─── XML toolbar ──────────────────────────────────────────────
        onXmlSearch: function (oEvent) {
          var sQuery = oEvent.getParameter("newValue") || "";
          this._renderXmlLines(sQuery || null);
        },

        onCopyXml: function () {
          var xml = this._xmlLines
            .map(function (l) {
              return l.c
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"');
            })
            .join("\n");
          if (navigator.clipboard) {
            navigator.clipboard.writeText(xml).then(function () {
              sap.m.MessageToast.show("XML copied to clipboard");
            });
          } else {
            sap.m.MessageToast.show("Copy not supported in this browser");
          }
        },

        onToggleWrap: function () {
          this._wrapMode = !this._wrapMode;
          this._renderXmlLines(null);
        },

        // ─── Navigation ───────────────────────────────────────────────
        onNavBack: function () {
          this.getOwnerComponent().getRouter().navTo("dashboard");
        },

        onCompareTo: function () {
          this.getOwnerComponent().getRouter().navTo("versionCompare", {
            service: this._sGroupId || "",
          });
        },

        onTabSelect: function () {
          /* handled by IconTabBar internally */
        },

        // ─── Footer actions ───────────────────────────────────────────
        onDownloadXml: function () {
          // Trigger browser download of the raw XML content
          var sXml = this._xmlLines
            .map(function (l) {
              return l.c
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"');
            })
            .join("\n");

          if (!sXml) {
            sap.m.MessageToast.show("No XML loaded yet.");
            return;
          }

          var oBlob = new Blob([sXml], { type: "application/xml" });
          var sUrl = URL.createObjectURL(oBlob);
          var oLink = document.createElement("a");
          oLink.href = sUrl;
          oLink.download = "metadata_v" + (this._sVersionId || "snapshot") + ".xml";
          oLink.click();
          URL.revokeObjectURL(sUrl);
        },

        onExportAllZip: function () {
          sap.m.MessageToast.show("Preparing ZIP of all versions…");
        },

        onExportSelected: function () {
          sap.m.MessageToast.show("Select versions to export…");
        },

        // ─── Helpers ──────────────────────────────────────────────────
        _formatDate: function (sIso) {
          if (!sIso) return "—";
          try {
            var oDate = new Date(sIso);
            if (isNaN(oDate.getTime())) return sIso;
            return oDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          } catch (e) {
            return sIso;
          }
        },

        _parseMetadataAndRenderTree: function (sXml, sVersionNo) {
          var oTitle = this.byId("entityTreeTitle");
          if (oTitle) {
            oTitle.setText("Entity tree · v" + (sVersionNo || "?"));
          }

          var oContainer = this.byId("entityTreeContainer");
          if (!oContainer) return;

          // Clear previous items
          oContainer.destroyItems();

          try {
            var oParser = new DOMParser();
            var oXmlDoc = oParser.parseFromString(sXml, "text/xml");

            // Helper to create a section header
            function createSectionHeader(sText) {
              return new sap.m.Text({
                text: sText
              }).addStyleClass("treeSectionHeader");
            }

            // Helper to create a tree node
            var that = this;
            function createTreeNode(sText, sIcon, sColor, nLine, bBold, nIndentLevel) {
              var oIcon = new sap.ui.core.Icon({
                src: sIcon,
                size: nIndentLevel > 0 ? "0.625rem" : "0.75rem",
                color: sColor
              }).addStyleClass("treeNodeIcon");

              var oLabel = new sap.m.Text({
                text: sText
              }).addStyleClass("treeNodeLabel");
              
              if (nIndentLevel > 0) {
                oLabel.addStyleClass("treeNodeLabel-sm");
              }
              if (bBold) {
                oLabel.addStyleClass("treeNodeLabel-bold");
              }

              var oHBox = new sap.m.HBox({
                alignItems: "Center",
                items: [oIcon, oLabel]
              }).addStyleClass("treeNode");

              if (nIndentLevel === 1) {
                oHBox.addStyleClass("treeNode-indent1");
              }

              // Click handler
              if (nLine && nLine > 0) {
                oHBox.attachBrowserEvent("click", function () {
                  oContainer.getItems().forEach(function (item) {
                    item.removeStyleClass("treeNode-active");
                  });
                  oHBox.addStyleClass("treeNode-active");
                  that._highlightLine(nLine);
                });
              }

              return oHBox;
            }

            // 1. Entity Types
            var aEntityTypes = oXmlDoc.getElementsByTagName("EntityType");
            if (aEntityTypes.length > 0) {
              oContainer.addItem(createSectionHeader("ENTITY TYPES (" + aEntityTypes.length + ")"));

              for (var i = 0; i < aEntityTypes.length; i++) {
                var oType = aEntityTypes[i];
                var sTypeName = oType.getAttribute("Name");

                // Find line number of this EntityType
                var nLine = this._xmlLines.findIndex(function (l) {
                  return (l.r && l.r.indexOf('Name="' + sTypeName + '"') >= 0) || (l.r && l.r.indexOf("Name='" + sTypeName + "'") >= 0);
                }) + 1;

                oContainer.addItem(createTreeNode(sTypeName, "sap-icon://table-view", "#556b82", nLine, true, 0));

                // Properties
                var aKeys = [];
                var oKeyNode = oType.getElementsByTagName("Key")[0];
                if (oKeyNode) {
                  var aPropRefs = oKeyNode.getElementsByTagName("PropertyRef");
                  for (var k = 0; k < aPropRefs.length; k++) {
                    aKeys.push(aPropRefs[k].getAttribute("Name"));
                  }
                }

                var aProps = oType.getElementsByTagName("Property");
                for (var p = 0; p < aProps.length; p++) {
                  var oProp = aProps[p];
                  var sPropName = oProp.getAttribute("Name");
                  var bIsKey = aKeys.indexOf(sPropName) >= 0;
                  var sIcon = bIsKey ? "sap-icon://key" : "sap-icon://bullet-text";
                  var sColor = bIsKey ? "#e78c07" : "#8094a8";

                  oContainer.addItem(createTreeNode(sPropName, sIcon, sColor, null, false, 1));
                }

                // Navigation Properties
                var aNavProps = oType.getElementsByTagName("NavigationProperty");
                for (var n = 0; n < aNavProps.length; n++) {
                  var oNav = aNavProps[n];
                  var sNavName = oNav.getAttribute("Name");
                  var oNavNode = createTreeNode(sNavName + " (nav)", "sap-icon://arrow-right", "#0a6ed1", null, false, 1);
                  oNavNode.addStyleClass("treeNode-nav");
                  oContainer.addItem(oNavNode);
                }
              }
            }

            // 2. Associations
            var aAssoc = oXmlDoc.getElementsByTagName("Association");
            if (aAssoc.length > 0) {
              oContainer.addItem(createSectionHeader("ASSOCIATIONS (" + aAssoc.length + ")"));
              for (var j = 0; j < aAssoc.length; j++) {
                var sAssocName = aAssoc[j].getAttribute("Name");
                oContainer.addItem(createTreeNode(sAssocName, "sap-icon://chain-link", "#8094a8", null, false, 0));
              }
            }

            // 3. Functions
            var aFunctions = oXmlDoc.getElementsByTagName("FunctionImport");
            if (aFunctions.length === 0) {
              aFunctions = oXmlDoc.getElementsByTagName("Function");
            }
            if (aFunctions.length > 0) {
              oContainer.addItem(createSectionHeader("FUNCTIONS (" + aFunctions.length + ")"));
              for (var f = 0; f < aFunctions.length; f++) {
                var sFuncName = aFunctions[f].getAttribute("Name");
                oContainer.addItem(createTreeNode(sFuncName, "sap-icon://fx", "#8094a8", null, false, 0));
              }
            }

          } catch (e) {
            console.error("[SnapshotDetail] Error building entity tree:", e);
            oContainer.addItem(new sap.m.Text({
              text: "Error parsing metadata tree"
            }).addStyleClass("treeError"));
          }
        },
      }
    );

    // Module-level HTML escape helper
    function _esc(s) {
      return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
  }
);
