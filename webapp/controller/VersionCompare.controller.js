sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend(
      "odata.metadata.manager.controller.VersionCompare",
      {
        // ─── State ────────────────────────────────────────────────────
        _sGroupId: null,
        _aVersions: [],       // mapped version objects for this group
        _baseVersionId: null, // VersionId GUID of selected base
        _compareVersionId: null,
        _activeTab: "structural",
        _compareResult: null, // Last ZDDETAILCOMPARERESULT from BE

        // ─── Life-cycle ──────────────────────────────────────────────
        onInit: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter
            .getRoute("versionCompare")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
          var oArgs = oEvent.getParameter("arguments");
          this._sGroupId = oArgs.service; // GroupId GUID
          this._aVersions = [];
          this._compareResult = null;

          // Clear diff panels
          this._clearDiffPanels();

          // Load versions for this group from the backend
          this._loadVersions();
        },

        // ─── Load versions ────────────────────────────────────────────
        _loadVersions: function () {
          var that = this;
          var oDataService =
            this.getOwnerComponent().getDataService &&
            this.getOwnerComponent().getDataService();

          if (!oDataService || !oDataService.fetchVersionsForGroup || !this._sGroupId) {
            // Try to read from model (preloaded from Dashboard)
            this._loadVersionsFromModel();
            return;
          }

          oDataService
            .fetchVersionsForGroup(this._sGroupId)
            .then(function (oData) {
              var aRaw = (oData.value || []).sort(function (a, b) {
                return parseInt(b.VersionNo, 10) - parseInt(a.VersionNo, 10);
              });

              that._aVersions = aRaw.map(function (v) {
                return {
                  versionId: v.VersionId,
                  groupId: v.GroupId,
                  versionNo: v.VersionNo,
                  triggerText:
                    v.TriggerText ||
                    (v.TriggerType === "A" ? "Auto" : "Manual"),
                  createdAt: v.CreatedAt,
                  createdBy: v.CreatedBy,
                  isLatest: v.LatestVersion,
                  detailId:
                    v._Detail && v._Detail[0] ? v._Detail[0].DetailId : null,
                };
              });

              that._populateVersionSelects();

              // Auto-run compare with latest 2 versions if we have them
              if (that._aVersions.length >= 2) {
                that._baseVersionId    = that._aVersions[1].versionId; // second latest = base
                that._compareVersionId = that._aVersions[0].versionId; // latest = compare
                that._runCompare();
              }
            })
            .catch(function (oErr) {
              console.error("[VersionCompare] Failed to load versions:", oErr);
              that._showDiffError(
                "Failed to load versions: " + (oErr.message || String(oErr))
              );
            });
        },

        _loadVersionsFromModel: function () {
          // Fallback: read from global model /services if versions already loaded
          var oModel = this.getOwnerComponent().getModel();
          var aServices = oModel ? oModel.getProperty("/services") : [];
          var oService = (aServices || []).find(function (s) {
            return s.id === this._sGroupId || s.groupId === this._sGroupId;
          }.bind(this));

          if (oService && oService.versions && oService.versions.length) {
            this._aVersions = oService.versions;
            this._populateVersionSelects();
            if (this._aVersions.length >= 2) {
              this._baseVersionId    = this._aVersions[1].versionId;
              this._compareVersionId = this._aVersions[0].versionId;
              this._runCompare();
            }
          } else {
            this._showDiffError("No versions available for this service.");
          }
        },

        // ─── Populate version dropdowns ───────────────────────────────
        _populateVersionSelects: function () {
          var oBaseSelect    = this.byId("baseVersionSelect");
          var oCompareSelect = this.byId("compareVersionSelect");

          if (!oBaseSelect || !oCompareSelect) return;

          // Destroy existing items
          oBaseSelect.destroyItems();
          oCompareSelect.destroyItems();

          this._aVersions.forEach(function (v) {
            var sLabel =
              "v" +
              v.versionNo +
              " — " +
              (v.triggerText || "—") +
              " · " +
              this._formatDate(v.createdAt);

            oBaseSelect.addItem(
              new sap.ui.core.Item({ key: v.versionId, text: sLabel })
            );
            oCompareSelect.addItem(
              new sap.ui.core.Item({ key: v.versionId, text: sLabel })
            );
          }.bind(this));

          // Default selection: index 1 as base, index 0 as compare
          if (this._aVersions.length >= 2) {
            oBaseSelect.setSelectedKey(this._aVersions[1].versionId);
            oCompareSelect.setSelectedKey(this._aVersions[0].versionId);

            // Update the large version name labels
            var oBaseLbl = this.byId("baseVersionName");
            if (oBaseLbl) oBaseLbl.setText("v" + this._aVersions[1].versionNo);
            var oCmpLbl = this.byId("compareVersionName");
            if (oCmpLbl) oCmpLbl.setText("v" + this._aVersions[0].versionNo);
          } else if (this._aVersions.length === 1) {
            oBaseSelect.setSelectedKey(this._aVersions[0].versionId);
            oCompareSelect.setSelectedKey(this._aVersions[0].versionId);
          }
        },

        // ─── Run Compare bound action ─────────────────────────────────
        _runCompare: function () {
          var that = this;

          // Resolve DetailIds for the selected versions
          var oBase = this._aVersions.find(function (v) {
            return v.versionId === that._baseVersionId;
          });
          var oCmp = this._aVersions.find(function (v) {
            return v.versionId === that._compareVersionId;
          });

          if (!oBase || !oCmp) {
            this._showDiffError("Selected versions not found.");
            return;
          }
          if (!oBase.detailId || !oCmp.detailId) {
            this._showDiffError(
              "One or both selected versions have no detail snapshot yet. " +
                "Try generating a detail first."
            );
            return;
          }
          if (oBase.detailId === oCmp.detailId) {
            this._showDiffError(
              "Both versions point to the same detail — no diff to show."
            );
            return;
          }

          var oDataService =
            this.getOwnerComponent().getDataService &&
            this.getOwnerComponent().getDataService();

          if (!oDataService || !oDataService.compareDetails) {
            this._showDiffError("Compare service not available.");
            return;
          }

          // Show loading state in both panels
          this._showDiffLoading();

          oDataService
            .compareDetails(oBase.detailId, oCmp.detailId)
            .then(function (oResult) {
              that._compareResult = oResult;
              // Update summary pills
              that._updateSummaryPills(oResult, oBase, oCmp);
              // Render diffs
              that._renderStructDiff(oResult);
              that._renderXmlDiff(oResult);
            })
            .catch(function (oErr) {
              console.error("[VersionCompare] Compare action failed:", oErr);
              that._showDiffError(
                "Compare failed: " + (oErr.message || String(oErr))
              );
            });
        },

        // ─── Summary pills update ─────────────────────────────────────
        _updateSummaryPills: function (oResult, oBase, oCmp) {
          var oAdded   = this.byId("pillAdded");
          var oRemoved = this.byId("pillRemoved");
          var oChanged = this.byId("pillChanged");
          var oUnchanged = this.byId("pillUnchanged");
          var oDeltaInfo = this.byId("deltaInfo");

          if (oAdded)     oAdded.setText("+" + (oResult.ADDED   || 0) + " added");
          if (oRemoved)   oRemoved.setText("−" + (oResult.REMOVED || 0) + " removed");
          if (oChanged)   oChanged.setText("~" + (oResult.CHANGED || 0) + " changed");
          if (oUnchanged) oUnchanged.setText((oResult.UNCHANGED || 0) + " unchanged");
          if (oDeltaInfo) {
            oDeltaInfo.setText(
              "v" + (oBase.versionNo  || "?") +
              " → v" + (oCmp.versionNo || "?") +
              " · " + (oResult.ODATAVERSION || "OData") +
              " · " + (oResult.ADDED || 0) + " added, " +
              (oResult.REMOVED || 0) + " removed, " +
              (oResult.CHANGED || 0) + " changed"
            );
          }

          // Update column headers
          var oTopBar = this.byId("comparePageRoot");
          if (oTopBar && oTopBar.getDomRef()) {
            var aTitles = oTopBar.getDomRef().querySelectorAll(".appTopBarTitle");
            if (aTitles[0]) {
              var oService = this._getServiceName();
              aTitles[0].textContent =
                "Version comparison — " + oService;
            }
          }
        },

        _getServiceName: function () {
          var oModel = this.getOwnerComponent().getModel();
          var aServices = oModel ? oModel.getProperty("/services") : [];
          var oSvc = (aServices || []).find(function (s) {
            return s.id === this._sGroupId || s.groupId === this._sGroupId;
          }.bind(this));
          return oSvc ? oSvc.name : this._sGroupId || "—";
        },

        // ─── Structural diff rendering ────────────────────────────────
        _renderStructDiff: function (oResult) {
          var oContainer = this.byId("structDiffContainer");
          if (!oContainer) return;
          var oDom = oContainer.getDomRef();
          if (!oDom) return;

          var aStructDiff = oResult.STRUCTDIFF || [];
          if (aStructDiff.length === 0) {
            oDom.innerHTML =
              '<div style="padding:1rem;color:#8a9ba8;font-size:0.875rem">' +
              "No structural differences found." +
              "</div>";
            return;
          }

          var html = "";
          aStructDiff.forEach(function (item) {
            var sType = (item.CHANGETYPE || "").toUpperCase();
            var sPath = item.NODEPATH || "—";
            var sNote = item.NOTE || "";

            var sSym = " ";
            var sCls = "diffItemRow";
            var sLeftCls = "diffCell diffCell-left";
            var sRightCls = "diffCell diffCell-right";

            if (sType === "A" || sType === "ADD" || sType === "ADDED") {
              sSym = "+"; sCls += ""; sLeftCls += " diff-empty"; sRightCls += " diff-added";
              html +=
                '<div class="' + sCls + '">' +
                  '<div class="' + sLeftCls + '"><span class="diffItemText"></span></div>' +
                  '<div class="' + sRightCls + '"><span class="diffItemText">+ ' + _esc(sPath) + (sNote ? " (" + _esc(sNote) + ")" : "") + "</span></div>" +
                "</div>";
            } else if (sType === "D" || sType === "DELETE" || sType === "REMOVED") {
              sLeftCls += " diff-removed"; sRightCls += " diff-empty";
              html +=
                '<div class="' + sCls + '">' +
                  '<div class="' + sLeftCls + '"><span class="diffItemText">− ' + _esc(sPath) + (sNote ? " (" + _esc(sNote) + ")" : "") + "</span></div>" +
                  '<div class="' + sRightCls + '"><span class="diffItemText"></span></div>' +
                "</div>";
            } else if (sType === "C" || sType === "CHANGE" || sType === "CHANGED") {
              sLeftCls += " diff-changed"; sRightCls += " diff-changed";
              html +=
                '<div class="' + sCls + '">' +
                  '<div class="' + sLeftCls + '"><span class="diffItemText">~ ' + _esc(sPath) + "</span></div>" +
                  '<div class="' + sRightCls + '"><span class="diffItemText">~ ' + _esc(sPath) + (sNote ? " (" + _esc(sNote) + ")" : "") + "</span></div>" +
                "</div>";
            } else {
              // unchanged
              html +=
                '<div class="' + sCls + '">' +
                  '<div class="' + sLeftCls + '"><span class="diffItemText">  ' + _esc(sPath) + "</span></div>" +
                  '<div class="' + sRightCls + '"><span class="diffItemText">  ' + _esc(sPath) + "</span></div>" +
                "</div>";
            }
          });

          oDom.innerHTML = html;
        },

        _renderXmlDiff: function (oResult) {
          var oContainer = this.byId("xmlDiffContainer");
          if (!oContainer) return;
          var oDom = oContainer.getDomRef();
          if (!oDom) return;

          var sBaseXml    = oResult.BASEXML    || "";
          var sCompareXml = oResult.COMPAREXML || "";
          var aXmlDiff    = oResult.XMLDIFF    || [];

          // Auto-format only if the XML is returned on a single line
          if (sBaseXml && sBaseXml.indexOf("\n") === -1) {
            sBaseXml = this._formatXml(sBaseXml);
          }
          if (sCompareXml && sCompareXml.indexOf("\n") === -1) {
            sCompareXml = this._formatXml(sCompareXml);
          }

          // If the backend provides XMLDIFF change positions, use them to annotate lines
          var aBaseLines    = sBaseXml.split(/\r?\n/);
          var aCompareLines = sCompareXml.split(/\r?\n/);

          // Build a set of changed line numbers for each side
          var oChangedBase    = {};
          var oChangedCompare = {};
          var oAddedCompare   = {};
          var oRemovedBase    = {};

          aXmlDiff.forEach(function (diff) {
            var sType = (diff.CHANGETYPE || "").toUpperCase();
            if (sType === "A" || sType === "ADD") {
              for (var n = diff.NEWSTARTLINE; n <= diff.NEWENDLINE; n++) {
                oAddedCompare[n] = true;
              }
            } else if (sType === "D" || sType === "DELETE") {
              for (var m = diff.OLDSTARTLINE; m <= diff.OLDENDLINE; m++) {
                oRemovedBase[m] = true;
              }
            } else if (sType === "C" || sType === "CHANGE") {
              for (var p = diff.OLDSTARTLINE; p <= diff.OLDENDLINE; p++) {
                oChangedBase[p] = true;
              }
              for (var q = diff.NEWSTARTLINE; q <= diff.NEWENDLINE; q++) {
                oChangedCompare[q] = true;
              }
            }
          });

          var maxLen = Math.max(aBaseLines.length, aCompareLines.length);
          var leftHtml = "", rightHtml = "";

          for (var i = 0; i < maxLen; i++) {
            var lNo = i + 1;
            var sLeft  = aBaseLines[i]    !== undefined ? aBaseLines[i]    : null;
            var sRight = aCompareLines[i] !== undefined ? aCompareLines[i] : null;

            var sLeftCls  = "diff-line";
            var sRightCls = "diff-line";
            var sLeftSym  = " ";
            var sRightSym = " ";

            if (oRemovedBase[lNo])    { sLeftCls  += " diff-removed"; sLeftSym  = "−"; }
            if (oChangedBase[lNo])    { sLeftCls  += " diff-changed"; sLeftSym  = "~"; }
            if (oAddedCompare[lNo])   { sRightCls += " diff-added";   sRightSym = "+"; }
            if (oChangedCompare[lNo]) { sRightCls += " diff-changed"; sRightSym = "~"; }

            leftHtml +=
              '<div class="' + sLeftCls + '">' +
                '<span class="diff-ln">' + (sLeft !== null ? lNo : "") + "</span>" +
                '<span class="diff-sym">' + (sLeft !== null ? sLeftSym : "") + "</span>" +
                '<span class="diff-code">' + (sLeft !== null ? _esc(sLeft) : "—") + "</span>" +
              "</div>";

            rightHtml +=
              '<div class="' + sRightCls + '">' +
                '<span class="diff-ln">' + (sRight !== null ? lNo : "") + "</span>" +
                '<span class="diff-sym">' + (sRight !== null ? sRightSym : "") + "</span>" +
                '<span class="diff-code">' + (sRight !== null ? _esc(sRight) : "—") + "</span>" +
              "</div>";
          }

          // Get base and compare version numbers for labels
          var oBase = this._aVersions.find(function (v) { return v.versionId === this._baseVersionId; }.bind(this));
          var oCmp  = this._aVersions.find(function (v) { return v.versionId === this._compareVersionId; }.bind(this));
          var sBaseLabel = oBase ? "v" + oBase.versionNo + " · base"    : "base";
          var sCmpLabel  = oCmp  ? "v" + oCmp.versionNo  + " · compare" : "compare";

          oDom.innerHTML =
            '<div style="display:grid;grid-template-columns:1fr 1fr;height:100%;">' +
              '<div style="border-right:1px solid #d9d9d9;overflow:hidden">' +
                '<div style="padding:5px 12px;background:#f5f6f7;border-bottom:1px solid #d9d9d9;font-size:11px;font-weight:600;color:#556b82">' +
                  _esc(sBaseLabel) +
                "</div>" +
                leftHtml +
              "</div>" +
              '<div style="overflow:hidden">' +
                '<div style="padding:5px 12px;background:#f5f6f7;border-bottom:1px solid #d9d9d9;font-size:11px;font-weight:600;color:#556b82">' +
                  _esc(sCmpLabel) +
                "</div>" +
                rightHtml +
              "</div>" +
            "</div>";
        },

        _showDiffLoading: function () {
          var oContainer = this.byId("xmlDiffContainer");
          if (oContainer && oContainer.getDomRef()) {
            oContainer.getDomRef().innerHTML =
              '<div style="padding:2rem;text-align:center;color:#8a9ba8">' +
              "Fetching comparison from backend…" +
              "</div>";
          }
          var oStruct = this.byId("structDiffContainer");
          if (oStruct && oStruct.getDomRef()) {
            oStruct.getDomRef().innerHTML =
              '<div style="padding:2rem;text-align:center;color:#8a9ba8">' +
              "Fetching comparison from backend…" +
              "</div>";
          }
        },

        _showDiffError: function (sMsg) {
          var oContainer = this.byId("xmlDiffContainer");
          if (oContainer && oContainer.getDomRef()) {
            oContainer.getDomRef().innerHTML =
              '<div style="padding:1rem;color:#bb0000;font-size:0.875rem">' +
              _esc(sMsg) +
              "</div>";
          }
          var oStruct = this.byId("structDiffContainer");
          if (oStruct && oStruct.getDomRef()) {
            oStruct.getDomRef().innerHTML =
              '<div style="padding:1rem;color:#bb0000;font-size:0.875rem">' +
              _esc(sMsg) +
              "</div>";
          }
        },

        _clearDiffPanels: function () {
          var oContainer = this.byId("xmlDiffContainer");
          if (oContainer && oContainer.getDomRef()) {
            oContainer.getDomRef().innerHTML = "";
          }
        },

        onAfterRendering: function () {
          // Re-render if compare result already loaded (e.g. navigating back)
          if (this._compareResult) {
            this._renderStructDiff(this._compareResult);
            this._renderXmlDiff(this._compareResult);
          }
        },

        // ─── Version selects ─────────────────────────────────────────
        onBaseVersionChange: function (oEvent) {
          var sKey = oEvent.getSource().getSelectedKey();
          this._baseVersionId = sKey;
          // Update big label
          var oVersion = this._aVersions.find(function (v) { return v.versionId === sKey; });
          var oLbl = this.byId("baseVersionName");
          if (oLbl && oVersion) oLbl.setText("v" + oVersion.versionNo);
        },

        onCompareVersionChange: function (oEvent) {
          var sKey = oEvent.getSource().getSelectedKey();
          this._compareVersionId = sKey;
          var oVersion = this._aVersions.find(function (v) { return v.versionId === sKey; });
          var oLbl = this.byId("compareVersionName");
          if (oLbl && oVersion) oLbl.setText("v" + oVersion.versionNo);
        },

        // ─── Swap button ──────────────────────────────────────────────
        onSwapVersions: function () {
          var tmp = this._baseVersionId;
          this._baseVersionId    = this._compareVersionId;
          this._compareVersionId = tmp;

          var oBaseSelect    = this.byId("baseVersionSelect");
          var oCompareSelect = this.byId("compareVersionSelect");
          if (oBaseSelect)    oBaseSelect.setSelectedKey(this._baseVersionId);
          if (oCompareSelect) oCompareSelect.setSelectedKey(this._compareVersionId);

          var oBaseV = this._aVersions.find(function (v) { return v.versionId === this._baseVersionId;    }.bind(this));
          var oCmpV  = this._aVersions.find(function (v) { return v.versionId === this._compareVersionId; }.bind(this));
          var oBaseLabel    = this.byId("baseVersionName");
          var oCompareLabel = this.byId("compareVersionName");
          if (oBaseLabel    && oBaseV) oBaseLabel.setText("v"    + oBaseV.versionNo);
          if (oCompareLabel && oCmpV)  oCompareLabel.setText("v" + oCmpV.versionNo);

          MessageToast.show("Versions swapped — click Compare to refresh");
        },

        // ─── Tab switching ────────────────────────────────────────────
        onTabSwitch: function (oEvent) {
          var sKey =
            oEvent.getParameter("selectedKey") ||
            oEvent.getSource().getSelectedKey();
          this._activeTab = sKey;

          if (sKey === "xmldiff" && this._compareResult) {
            this._renderXmlDiff(this._compareResult);
          } else if (sKey === "structural" && this._compareResult) {
            this._renderStructDiff(this._compareResult);
          }
        },

        // ─── Actions ──────────────────────────────────────────────────
        onExportDiff: function () {
          if (!this._compareResult) {
            MessageToast.show("Run a comparison first.");
            return;
          }
          var sReport = JSON.stringify(this._compareResult, null, 2);
          var oBlob = new Blob([sReport], { type: "application/json" });
          var sUrl = URL.createObjectURL(oBlob);
          var oLink = document.createElement("a");
          oLink.href = sUrl;
          oLink.download = "diff_result.json";
          oLink.click();
          URL.revokeObjectURL(sUrl);
        },

        onShareDiff: function () {
          MessageToast.show("Sharing diff link…");
        },

        // ─── Navigation ───────────────────────────────────────────────
        onNavBack: function () {
          this.getOwnerComponent().getRouter().navTo("dashboard");
        },

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

        // ─── Helpers ─────────────────────────────────────────────────
        _formatDate: function (sIso) {
          if (!sIso) return "—";
          try {
            return new Date(sIso).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          } catch (e) {
            return sIso;
          }
        },
      }
    );

    // Module-level HTML escape helper (not exposed on prototype)
    function _esc(s) {
      return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
  }
);
