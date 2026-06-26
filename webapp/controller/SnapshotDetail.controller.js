sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend(
      "odata.metadata.manager.controller.SnapshotDetail",
      {
        // ─── XML data (mirrors mockData) ──────────────────────────────
        _xmlLines: [
          { n: 1, t: "pi", c: '&lt;?xml version="1.0" encoding="utf-8"?&gt;' },
          {
            n: 2,
            t: "tag",
            c: '&lt;edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx"',
          },
          {
            n: 3,
            t: "tag",
            c: '    xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"',
          },
          {
            n: 4,
            t: "tag",
            c: '    xmlns:sap="http://www.sap.com/Protocols/SAPData"&gt;',
          },
          {
            n: 5,
            t: "tag",
            c: '  &lt;edmx:DataServices m:DataServiceVersion="2.0"&gt;',
          },
          {
            n: 6,
            t: "tag",
            c: '    &lt;Schema Namespace="SAP_MM_PUR" xml:lang="en"',
          },
          {
            n: 7,
            t: "tag",
            c: '        xmlns="http://schemas.microsoft.com/ado/2008/09/edm"&gt;',
          },
          {
            n: 8,
            t: "tag",
            c: '      &lt;EntityType Name="PurchaseOrderSet" sap:content-version="1"&gt;',
            highlight: "PurchaseOrderSet",
          },
          {
            n: 9,
            t: "tag",
            c: '        &lt;Key&gt;&lt;PropertyRef Name="PurchaseOrder"/&gt;&lt;/Key&gt;',
          },
          {
            n: 10,
            t: "tag",
            c: '        &lt;Property Name="PurchaseOrder" Type="Edm.String" Nullable="false" MaxLength="10"/&gt;',
          },
          {
            n: 11,
            t: "tag",
            c: '        &lt;Property Name="CompanyCode"   Type="Edm.String" MaxLength="4"/&gt;',
          },
          {
            n: 12,
            t: "tag",
            c: '        &lt;Property Name="Vendor"        Type="Edm.String" MaxLength="20"/&gt;',
          },
          {
            n: 13,
            t: "tag",
            c: '        &lt;Property Name="TotalAmount"   Type="Edm.Decimal" Precision="13" Scale="2"/&gt;',
          },
          {
            n: 14,
            t: "tag",
            c: '        &lt;NavigationProperty Name="Items"     Relationship="SAP_MM_PUR.PO_Items_Assoc"/&gt;',
          },
          {
            n: 15,
            t: "tag",
            c: '        &lt;NavigationProperty Name="Approvals" Relationship="SAP_MM_PUR.PO_Approval_Assoc"/&gt;',
          },
          { n: 16, t: "tag", c: "      &lt;/EntityType&gt;" },
          {
            n: 17,
            t: "tag",
            c: '      &lt;EntityType Name="PurchaseOrderItemSet"&gt;',
            highlight: "PurchaseOrderItemSet",
          },
          {
            n: 18,
            t: "tag",
            c: '        &lt;Key&gt;&lt;PropertyRef Name="ItemNumber"/&gt;&lt;/Key&gt;',
          },
          {
            n: 19,
            t: "tag",
            c: '        &lt;Property Name="ItemNumber" Type="Edm.String" Nullable="false"/&gt;',
          },
          {
            n: 20,
            t: "tag",
            c: '        &lt;Property Name="Material"   Type="Edm.String" MaxLength="18"/&gt;',
          },
          {
            n: 21,
            t: "tag",
            c: '        &lt;Property Name="Quantity"   Type="Edm.Decimal" Precision="13" Scale="6"/&gt;',
          },
          { n: 22, t: "tag", c: "      &lt;/EntityType&gt;" },
          {
            n: 23,
            t: "new",
            c: '      &lt;EntityType Name="BusinessPartnerSet" sap:label="Business Partner"&gt;',
            highlight: "BusinessPartnerSet",
          },
          {
            n: 24,
            t: "new",
            c: '        &lt;Key&gt;&lt;PropertyRef Name="PartnerId"/&gt;&lt;/Key&gt;',
          },
          {
            n: 25,
            t: "new",
            c: '        &lt;Property Name="PartnerId"   Type="Edm.String" Nullable="false" MaxLength="10"/&gt;',
          },
          {
            n: 26,
            t: "new",
            c: '        &lt;Property Name="PartnerName" Type="Edm.String" MaxLength="80"/&gt;',
          },
          { n: 27, t: "new", c: "      &lt;/EntityType&gt;" },
          {
            n: 28,
            t: "new",
            c: '      &lt;EntityType Name="ApprovalStepSet"&gt;',
            highlight: "ApprovalStepSet",
          },
          {
            n: 29,
            t: "new",
            c: '        &lt;Key&gt;&lt;PropertyRef Name="StepId"/&gt;&lt;/Key&gt;',
          },
          {
            n: 30,
            t: "new",
            c: '        &lt;Property Name="StepId"    Type="Edm.String" Nullable="false"/&gt;',
          },
          {
            n: 31,
            t: "new",
            c: '        &lt;Property Name="StepName"  Type="Edm.String" MaxLength="50"/&gt;',
          },
          {
            n: 32,
            t: "new",
            c: '        &lt;Property Name="Approver"  Type="Edm.String" MaxLength="12"/&gt;',
          },
          { n: 33, t: "new", c: "      &lt;/EntityType&gt;" },
          {
            n: 34,
            t: "new",
            c: '      &lt;EntityType Name="AddressSet"&gt;',
            highlight: "AddressSet",
          },
          {
            n: 35,
            t: "new",
            c: '        &lt;Key&gt;&lt;PropertyRef Name="AddressId"/&gt;&lt;/Key&gt;',
          },
          {
            n: 36,
            t: "new",
            c: '        &lt;Property Name="AddressId" Type="Edm.String" Nullable="false"/&gt;',
          },
          {
            n: 37,
            t: "new",
            c: '        &lt;Property Name="Street"    Type="Edm.String" MaxLength="60"/&gt;',
          },
          { n: 38, t: "new", c: "      &lt;/EntityType&gt;" },
          {
            n: 39,
            t: "tag",
            c: '      &lt;Association Name="PO_Items_Assoc"&gt;',
          },
          {
            n: 40,
            t: "tag",
            c: '        &lt;End Type="SAP_MM_PUR.PurchaseOrderSet" Multiplicity="1" Role="FromRole"/&gt;',
          },
          {
            n: 41,
            t: "tag",
            c: '        &lt;End Type="SAP_MM_PUR.PurchaseOrderItemSet" Multiplicity="*" Role="ToRole"/&gt;',
          },
          { n: 42, t: "tag", c: "      &lt;/Association&gt;" },
          {
            n: 43,
            t: "new",
            c: '      &lt;Association Name="PO_Approval_Assoc"&gt;',
            highlight: "PO_Approval_Assoc",
          },
          {
            n: 44,
            t: "new",
            c: '        &lt;End Type="SAP_MM_PUR.PurchaseOrderSet" Multiplicity="1" Role="FromRole"/&gt;',
          },
          {
            n: 45,
            t: "new",
            c: '        &lt;End Type="SAP_MM_PUR.ApprovalStepSet" Multiplicity="*" Role="ToRole"/&gt;',
          },
          { n: 46, t: "new", c: "      &lt;/Association&gt;" },
          {
            n: 47,
            t: "new",
            c: '      &lt;FunctionImport Name="GetApprovalStatus" ReturnType="Edm.String" m:HttpMethod="GET"/&gt;',
            highlight: "GetApprovalStatus",
          },
          { n: 48, t: "tag", c: "    &lt;/Schema&gt;" },
          { n: 49, t: "tag", c: "  &lt;/edmx:DataServices&gt;" },
          { n: 50, t: "tag", c: "&lt;/edmx:Edmx&gt;" },
        ],

        _highlightedLine: null,
        _wrapMode: false,

        // ─── Life-cycle ──────────────────────────────────────────────
        onInit: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter
            .getRoute("snapshotDetail")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
          this._renderXmlLines(null);
          // Highlight first active node by default (PurchaseOrderSet = line 8)
          this._highlightLine(8);
        },

        onAfterRendering: function () {
          this._renderXmlLines(null);
          setTimeout(
            function () {
              this._highlightLine(8);
            }.bind(this),
            200,
          );
        },

        // ─── XML Rendering ──────────────────────────────────────────
        _renderXmlLines: function (sFilter) {
          var oContainer = this.byId("xmlLinesContainer");
          if (!oContainer) return;

          // Clear existing content
          oContainer.destroyItems ? oContainer.destroyItems() : null;

          var oDomRef = oContainer.getDomRef();
          if (!oDomRef) {
            // fallback: attach after render
            oContainer.addEventDelegate({
              onAfterRendering: function () {
                this._renderXmlLinesDOM(oContainer, sFilter);
              }.bind(this),
            });
            return;
          }
          this._renderXmlLinesDOM(oContainer, sFilter);
        },

        _renderXmlLinesDOM: function (oContainer, sFilter) {
          var oDomRef = oContainer.getDomRef();
          if (!oDomRef) return;

          var sFilterLower = sFilter ? sFilter.toLowerCase() : "";
          var html = "";
          this._xmlLines.forEach(
            function (line) {
              if (
                sFilterLower &&
                line.c.toLowerCase().indexOf(sFilterLower) < 0
              )
                return;
              var isNew = line.t === "new";
              var isCls = isNew ? "xml-line xml-line-new" : "xml-line";
              var isMark =
                this._highlightedLine === line.n ? " xml-line-highlight" : "";
              var wrapCls = this._wrapMode ? " xml-wrap" : "";
              html +=
                '<div class="' +
                isCls +
                isMark +
                wrapCls +
                '" id="xmlLine_' +
                line.n +
                '">' +
                '<span class="xml-ln">' +
                line.n +
                "</span>" +
                '<span class="xml-content">' +
                line.c +
                "</span>" +
                "</div>";
            }.bind(this),
          );

          oDomRef.innerHTML = html;
        },

        // ─── Tree node interaction ───────────────────────────────────
        onTreeNodePress: function (oEvent) {
          var oSource = oEvent.getSource();
          // Read custom data
          var nLine = null;
          var aCd = oSource.getCustomData ? oSource.getCustomData() : [];
          aCd.forEach(function (cd) {
            if (cd.getKey() === "xmlLine") nLine = parseInt(cd.getValue(), 10);
          });

          // Deactivate all tree nodes
          var oTree = this.byId("entityTreeContainer");
          if (oTree && oTree.getDomRef()) {
            oTree
              .getDomRef()
              .querySelectorAll(".treeNode-active")
              .forEach(function (el) {
                el.classList.remove("treeNode-active");
              });
          }

          // Activate this node
          var oDomRef = oSource.getDomRef();
          if (oDomRef) oDomRef.classList.add("treeNode-active");

          if (nLine) {
            this._highlightLine(nLine);
          }
        },

        _highlightLine: function (nLine) {
          this._highlightedLine = nLine;
          this._renderXmlLines(null);

          // Scroll line into view
          setTimeout(
            function () {
              var oScroll = this.byId("xmlScrollContainer");
              if (!oScroll) return;
              var oScrollDom = oScroll.getDomRef();
              if (!oScrollDom) return;
              var oLineDom = oScrollDom.querySelector("#xmlLine_" + nLine);
              if (oLineDom) {
                oLineDom.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }.bind(this),
            100,
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
                !sQuery || sText.toLowerCase().indexOf(sQuery) >= 0
                  ? ""
                  : "none";
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
                .replace(/&amp;/g, "&");
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
          var oBtn = this.byId("btnWrap");
          if (oBtn) oBtn.setPressed(this._wrapMode);
        },

        // ─── Navigation ───────────────────────────────────────────────
        onNavBack: function () {
          this.getOwnerComponent().getRouter().navTo("dashboard");
        },

        onCompareTo: function () {
          this.getOwnerComponent().getRouter().navTo("versionCompare", {
            service: "ZMM_PURCHASE_SRV",
          });
        },

        onTabSelect: function () {
          /* handled by IconTabBar internally */
        },

        // ─── Footer actions ───────────────────────────────────────────
        onDownloadXml: function () {
          sap.m.MessageToast.show("Downloading $metadata.xml for version v7…");
        },
        onExportAllZip: function () {
          sap.m.MessageToast.show("Preparing ZIP of all 7 versions…");
        },
        onExportSelected: function () {
          sap.m.MessageToast.show("Select versions to export…");
        },
      },
    );
  },
);
