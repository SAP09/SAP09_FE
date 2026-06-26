sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend(
      "odata.metadata.manager.controller.VersionCompare",
      {
        // ─── State ────────────────────────────────────────────────────
        _baseVersion: "v5",
        _compareVersion: "v7",
        _activeTab: "structural",

        // ─── Structural diff data ─────────────────────────────────────
        _structData: {
          left: [
            {
              type: "folder",
              label: "EntityTypes (12)",
              indent: 0,
              status: "",
            },
            { type: "item", label: "PurchaseOrderSet", indent: 1, status: "" },
            {
              type: "item",
              label: "PurchaseOrder (Key)",
              indent: 2,
              status: "",
            },
            { type: "item", label: "CompanyCode", indent: 2, status: "" },
            { type: "item", label: "DocumentDate", indent: 2, status: "" },
            { type: "item", label: "TotalAmount", indent: 2, status: "" },
            {
              type: "item",
              label: "Vendor (MaxLength=10)",
              indent: 2,
              status: "changed",
            },
            {
              type: "item",
              label: "PurchaseOrderItemSet",
              indent: 1,
              status: "",
            },
            { type: "item", label: "ItemNumber (Key)", indent: 2, status: "" },
            { type: "item", label: "Material", indent: 2, status: "" },
            {
              type: "item",
              label: "Quantity (Scale=3)",
              indent: 2,
              status: "changed",
            },
            { type: "item", label: "PartnerSet", indent: 1, status: "changed" },
            {
              type: "folder",
              label: "Associations (9)",
              indent: 0,
              status: "",
            },
            { type: "item", label: "PO_Items_Assoc", indent: 1, status: "" },
            { type: "item", label: "PO_Partner_Assoc", indent: 1, status: "" },
            {
              type: "folder",
              label: "FunctionImports (3)",
              indent: 0,
              status: "",
            },
            { type: "item", label: "GetOpenOrders", indent: 1, status: "" },
            { type: "item", label: "ConfirmDelivery", indent: 1, status: "" },
          ],
          right: [
            {
              type: "folder",
              label: "EntityTypes (14)",
              indent: 0,
              status: "",
            },
            { type: "item", label: "PurchaseOrderSet", indent: 1, status: "" },
            {
              type: "item",
              label: "PurchaseOrder (Key)",
              indent: 2,
              status: "",
            },
            { type: "item", label: "CompanyCode", indent: 2, status: "" },
            { type: "item", label: "DocumentDate", indent: 2, status: "" },
            { type: "item", label: "TotalAmount", indent: 2, status: "" },
            {
              type: "item",
              label: "Vendor (MaxLength=20) ✦",
              indent: 2,
              status: "changed",
            },
            {
              type: "item",
              label: "PurchaseOrderItemSet",
              indent: 1,
              status: "",
            },
            { type: "item", label: "ItemNumber (Key)", indent: 2, status: "" },
            { type: "item", label: "Material", indent: 2, status: "" },
            {
              type: "item",
              label: "Quantity (Scale=6) ✦",
              indent: 2,
              status: "changed",
            },
            {
              type: "item",
              label: "BusinessPartnerSet ✦",
              indent: 1,
              status: "changed",
            },
            {
              type: "item",
              label: "ApprovalStepSet +",
              indent: 1,
              status: "added",
            },
            { type: "item", label: "AddressSet +", indent: 1, status: "added" },
            {
              type: "folder",
              label: "Associations (11)",
              indent: 0,
              status: "",
            },
            { type: "item", label: "PO_Items_Assoc", indent: 1, status: "" },
            { type: "item", label: "PO_Partner_Assoc", indent: 1, status: "" },
            {
              type: "item",
              label: "PO_Address_Assoc +",
              indent: 1,
              status: "added",
            },
            {
              type: "item",
              label: "PO_Approval_Assoc +",
              indent: 1,
              status: "added",
            },
            {
              type: "folder",
              label: "FunctionImports (4)",
              indent: 0,
              status: "",
            },
            { type: "item", label: "GetOpenOrders", indent: 1, status: "" },
            { type: "item", label: "ConfirmDelivery", indent: 1, status: "" },
            {
              type: "item",
              label: "GetApprovalStatus +",
              indent: 1,
              status: "added",
            },
          ],
        },

        // ─── XML diff data ────────────────────────────────────────────
        _xmlDiffData: [
          {
            lNo: 8,
            lLine: '&lt;EntityType Name="PurchaseOrderSet"&gt;',
            rNo: 8,
            rLine: '&lt;EntityType Name="PurchaseOrderSet"&gt;',
            status: "",
          },
          {
            lNo: 13,
            lLine: '  &lt;Property Name="Vendor" MaxLength="10"/&gt;',
            rNo: 13,
            rLine: '  &lt;Property Name="Vendor" MaxLength="20"/&gt;',
            status: "changed",
          },
          {
            lNo: 16,
            lLine: '  &lt;Property Name="Quantity" Scale="3"/&gt;',
            rNo: 16,
            rLine: '  &lt;Property Name="Quantity" Scale="6"/&gt;',
            status: "changed",
          },
          {
            lNo: 22,
            lLine: '&lt;EntityType Name="PartnerSet"&gt;',
            rNo: 22,
            rLine: '&lt;EntityType Name="BusinessPartnerSet"&gt;',
            status: "changed",
          },
          {
            lNo: null,
            lLine: null,
            rNo: 28,
            rLine: '&lt;EntityType Name="ApprovalStepSet"&gt;',
            status: "added",
          },
          {
            lNo: null,
            lLine: null,
            rNo: 34,
            rLine: '&lt;EntityType Name="AddressSet"&gt;',
            status: "added",
          },
          {
            lNo: 30,
            lLine: '&lt;Association Name="PO_Items_Assoc"&gt;',
            rNo: 41,
            rLine: '&lt;Association Name="PO_Items_Assoc"&gt;',
            status: "",
          },
          {
            lNo: 36,
            lLine: '&lt;Association Name="PO_Partner_Assoc"&gt;',
            rNo: 47,
            rLine: '&lt;Association Name="PO_Partner_Assoc"&gt;',
            status: "",
          },
          {
            lNo: null,
            lLine: null,
            rNo: 53,
            rLine: '&lt;Association Name="PO_Address_Assoc"&gt;',
            status: "added",
          },
          {
            lNo: null,
            lLine: null,
            rNo: 59,
            rLine: '&lt;Association Name="PO_Approval_Assoc"&gt;',
            status: "added",
          },
          {
            lNo: 44,
            lLine: '&lt;FunctionImport Name="GetOpenOrders"/&gt;',
            rNo: 65,
            rLine: '&lt;FunctionImport Name="GetOpenOrders"/&gt;',
            status: "",
          },
          {
            lNo: 46,
            lLine: '&lt;FunctionImport Name="ConfirmDelivery"/&gt;',
            rNo: 67,
            rLine: '&lt;FunctionImport Name="ConfirmDelivery"/&gt;',
            status: "",
          },
          {
            lNo: null,
            lLine: null,
            rNo: 69,
            rLine: '&lt;FunctionImport Name="GetApprovalStatus"/&gt;',
            status: "added",
          },
        ],

        // ─── Life-cycle ──────────────────────────────────────────────
        onInit: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter
            .getRoute("versionCompare")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
          // render after view renders
          setTimeout(
            function () {
              this._renderStructuralDiff();
              this._renderXmlDiff();
            }.bind(this),
            150,
          );
        },

        onAfterRendering: function () {
          this._renderStructuralDiff();
          this._renderXmlDiff();
        },

        // ─── Render: structural diff ──────────────────────────────────
        // Structural diff is rendered inline in the view XML — no DOM rendering needed.
        _renderStructuralDiff: function () {
          /* static in view XML */
        },

        _buildStructHtml: function (aItems) {
          var iconMap = {
            folder: "sap-icon://folder",
            item: "sap-icon://document",
          };
          return aItems
            .map(function (item) {
              var cls = "struct-node struct-indent-" + item.indent;
              if (item.status) cls += " struct-" + item.status;
              var icon = item.type === "folder" ? "📁" : "·";
              if (item.status === "added") icon = "+";
              if (item.status === "removed") icon = "−";
              if (item.status === "changed") icon = "~";
              return (
                '<div class="' +
                cls +
                '">' +
                '<span class="struct-sym">' +
                icon +
                "</span>" +
                '<span class="struct-label">' +
                item.label +
                "</span>" +
                "</div>"
              );
            })
            .join("");
        },

        // ─── Render: XML diff ─────────────────────────────────────────
        _renderXmlDiff: function () {
          var oContainer = this.byId("xmlDiffContainer");
          if (!oContainer) return;
          var oDom = oContainer.getDomRef();
          if (!oDom) return;

          var leftHtml = "",
            rightHtml = "";
          this._xmlDiffData.forEach(function (row) {
            var symLeft = row.status === "changed" ? "~" : row.lLine ? " " : "";
            var symRight =
              row.status === "changed"
                ? "~"
                : row.status === "added"
                  ? "+"
                  : " ";
            var clsLeft =
              row.status === "changed"
                ? "diff-line diff-changed"
                : row.lLine
                  ? "diff-line"
                  : "diff-line diff-empty";
            var clsRight =
              row.status === "added"
                ? "diff-line diff-added"
                : row.status === "changed"
                  ? "diff-line diff-changed"
                  : "diff-line";

            leftHtml +=
              '<div class="' +
              clsLeft +
              '">' +
              '<span class="diff-ln">' +
              (row.lNo || "") +
              "</span>" +
              '<span class="diff-sym">' +
              symLeft +
              "</span>" +
              '<span class="diff-code">' +
              (row.lLine || "—") +
              "</span>" +
              "</div>";
            rightHtml +=
              '<div class="' +
              clsRight +
              '">' +
              '<span class="diff-ln">' +
              (row.rNo || "") +
              "</span>" +
              '<span class="diff-sym">' +
              symRight +
              "</span>" +
              '<span class="diff-code">' +
              (row.rLine || "—") +
              "</span>" +
              "</div>";
          });

          oDom.innerHTML =
            '<div style="display:grid;grid-template-columns:1fr 1fr;height:100%;">' +
            '<div style="border-right:1px solid #d9d9d9;overflow:hidden">' +
            '<div style="padding:5px 12px;background:#f5f6f7;border-bottom:1px solid #d9d9d9;font-size:11px;font-weight:600;color:#556b82">v5 · base</div>' +
            leftHtml +
            "</div>" +
            '<div style="overflow:hidden">' +
            '<div style="padding:5px 12px;background:#f5f6f7;border-bottom:1px solid #d9d9d9;font-size:11px;font-weight:600;color:#556b82">v7 · compare</div>' +
            rightHtml +
            "</div>" +
            "</div>";
        },

        // ─── Tab switching ────────────────────────────────────────────
        onTabSwitch: function (oEvent) {
          var sKey =
            oEvent.getParameter("selectedKey") ||
            oEvent.getSource().getSelectedKey();
          this._activeTab = sKey;
          var oStructView = this.byId("structView");
          var oXmlView = this.byId("xmlView");
          if (oStructView) oStructView.setVisible(sKey === "structural");
          if (oXmlView) oXmlView.setVisible(sKey === "xml");

          if (sKey === "structural") this._renderStructuralDiff();
          if (sKey === "xml") this._renderXmlDiff();
        },

        // ─── Swap button ──────────────────────────────────────────────
        onSwapVersions: function () {
          var tmp = this._baseVersion;
          this._baseVersion = this._compareVersion;
          this._compareVersion = tmp;

          var oBaseLabel = this.byId("baseVersionName");
          var oCompareLabel = this.byId("compareVersionName");
          if (oBaseLabel) oBaseLabel.setText(this._baseVersion);
          if (oCompareLabel) oCompareLabel.setText(this._compareVersion);

          MessageToast.show(
            "Versions swapped: base=" +
              this._baseVersion +
              " compare=" +
              this._compareVersion,
          );
        },

        // ─── Version selects ─────────────────────────────────────────
        onBaseVersionChange: function (oEvent) {
          this._baseVersion = oEvent.getSource().getSelectedKey();
        },

        onCompareVersionChange: function (oEvent) {
          this._compareVersion = oEvent.getSource().getSelectedKey();
        },

        // ─── Actions ──────────────────────────────────────────────────
        onExportDiff: function () {
          MessageToast.show("Exporting diff report…");
        },

        onShareDiff: function () {
          MessageToast.show("Sharing diff link…");
        },

        // ─── Navigation ───────────────────────────────────────────────
        onNavBack: function () {
          this.getOwnerComponent().getRouter().navTo("dashboard");
        },
      },
    );
  },
);
