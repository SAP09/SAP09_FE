sap.ui.define([], function () {
    "use strict";

    return {
        getData: function () {
            return {
                // ─── Services list ───────────────────────────────────────────
                services: [
                    {
                        id: "ZMM_PURCHASE_SRV",
                        name: "ZMM_PURCHASE_SRV",
                        type: "V2",
                        prefix: "ZI",
                        status: "Active",
                        is_deleted: false,
                        namespace: "SAP_MM_PUR",
                        package: "ZMM_CORE",
                        owner: "JDOE",
                        versionsCount: 7,
                        entityCount: 14,
                        assocCount: 11,
                        navCount: 32,
                        actionCount: 4
                    },
                    {
                        id: "ZSD_SALES_ORDER_SRV",
                        name: "ZSD_SALES_ORDER_SRV",
                        type: "V2",
                        prefix: "ZC",
                        status: "Active",
                        is_deleted: false,
                        namespace: "SAP_SD_SO",
                        package: "ZSD_CORE",
                        owner: "ASMITH",
                        versionsCount: 4,
                        entityCount: 9,
                        assocCount: 6,
                        navCount: 18,
                        actionCount: 2
                    },
                    {
                        id: "ZBTP_HR_EMPLOYEE",
                        name: "ZBTP_HR_EMPLOYEE",
                        type: "V4",
                        prefix: "ZI",
                        status: "Active",
                        is_deleted: false,
                        namespace: "SAP_HR_EMP",
                        package: "ZBTP_HR",
                        owner: "MKUMAR",
                        versionsCount: 3,
                        entityCount: 6,
                        assocCount: 4,
                        navCount: 12,
                        actionCount: 1
                    },
                    {
                        id: "ZFI_INVOICE_API",
                        name: "ZFI_INVOICE_API",
                        type: "V4",
                        prefix: "ZC",
                        status: "Active",
                        is_deleted: false,
                        namespace: "SAP_FI_INV",
                        package: "ZFI_CORE",
                        owner: "LWANG",
                        versionsCount: 5,
                        entityCount: 8,
                        assocCount: 5,
                        navCount: 20,
                        actionCount: 3
                    },
                    {
                        id: "ZPP_PRODUCTION_SRV",
                        name: "ZPP_PRODUCTION_SRV",
                        type: "V2",
                        prefix: "ZI",
                        status: "Inactive",
                        is_deleted: false,
                        namespace: "SAP_PP_PROD",
                        package: "ZPP_CORE",
                        owner: "RBRAUN",
                        versionsCount: 2,
                        entityCount: 5,
                        assocCount: 3,
                        navCount: 8,
                        actionCount: 0
                    },
                    {
                        id: "ZLG_LEGACY_OBJ",
                        name: "ZLG_LEGACY_OBJ",
                        type: "V2",
                        prefix: "ZI",
                        status: "Deleted",
                        is_deleted: true,
                        namespace: "SAP_LG_OBJ",
                        package: "ZLG_LEGACY",
                        owner: "RETIRED",
                        versionsCount: 1,
                        entityCount: 3,
                        assocCount: 1,
                        navCount: 3,
                        actionCount: 0
                    }
                ],

                // ─── Currently selected service ───────────────────────────────
                selectedServiceId: "ZMM_PURCHASE_SRV",

                // ─── Filters ──────────────────────────────────────────────────
                filterType: "All",
                filterPrefix: "All",
                filterStatus: "All",
                showDeleted: false,
                searchQuery: "",

                // ─── Snapshots for ZMM_PURCHASE_SRV ─────────────────────────
                snapshots: [
                    {
                        id: "v7",
                        version: "v7",
                        label: "Latest",
                        scanType: "Auto",
                        date: "Today 06:00",
                        dateISO: "2026-05-20T06:00:00",
                        createdBy: "SYSTEM",
                        transport: "TR#K9A002",
                        app: "ZMM_PURCHASE_UI",
                        segw: null,
                        entityCount: 14,
                        hash: "a4f8c2d1e9b3f7a0",
                        isLatest: true
                    },
                    {
                        id: "v6",
                        version: "v6",
                        label: null,
                        scanType: "Auto",
                        date: "22 Mar 2025",
                        dateISO: "2025-03-22T06:00:00",
                        createdBy: "SYSTEM",
                        transport: "TR#K9A001",
                        app: "ZMM_PURCHASE_UI",
                        segw: null,
                        entityCount: 12,
                        hash: "b3e7d1c5a9f2e841",
                        isLatest: false
                    },
                    {
                        id: "v5",
                        version: "v5",
                        label: null,
                        scanType: "Manual",
                        date: "10 Feb 2025",
                        dateISO: "2025-02-10T14:30:00",
                        createdBy: "JDOE",
                        transport: "TR#K8X044",
                        app: null,
                        segw: "ZMM_PO_PROJ",
                        entityCount: 12,
                        hash: "c2f1a8b3d7e5c920",
                        isLatest: false
                    },
                    {
                        id: "v4",
                        version: "v4",
                        label: null,
                        scanType: "Auto",
                        date: "15 Jan 2025",
                        dateISO: "2025-01-15T06:00:00",
                        createdBy: "SYSTEM",
                        transport: "TR#K7W033",
                        app: "ZMM_PURCHASE_UI",
                        segw: null,
                        entityCount: 11,
                        hash: "d1e9c4b7a2f3d815",
                        isLatest: false
                    },
                    {
                        id: "v3",
                        version: "v3",
                        label: null,
                        scanType: "Manual",
                        date: "02 Dec 2024",
                        dateISO: "2024-12-02T10:00:00",
                        createdBy: "ASMITH",
                        transport: "TR#K6V022",
                        app: null,
                        segw: "ZMM_PO_PROJ",
                        entityCount: 10,
                        hash: "e8b2f5c1d4a7e309",
                        isLatest: false
                    },
                    {
                        id: "v2",
                        version: "v2",
                        label: null,
                        scanType: "Auto",
                        date: "10 Oct 2024",
                        dateISO: "2024-10-10T06:00:00",
                        createdBy: "SYSTEM",
                        transport: "TR#K5U011",
                        app: null,
                        segw: null,
                        entityCount: 9,
                        hash: "f7a1e3d6c9b4f208",
                        isLatest: false
                    },
                    {
                        id: "v1",
                        version: "v1",
                        label: null,
                        scanType: "Auto",
                        date: "01 Sep 2024",
                        dateISO: "2024-09-01T06:00:00",
                        createdBy: "SYSTEM",
                        transport: "TR#K4T000",
                        app: null,
                        segw: null,
                        entityCount: 8,
                        hash: "a0b2c4d6e8f1a3b5",
                        isLatest: false
                    }
                ],

                // ─── KPI data ─────────────────────────────────────────────────
                kpi: {
                    entityTypes:   { count: 14, delta: "+2 vs v1", trend: "positive" },
                    associations:  { count: 11, delta: "unchanged", trend: "neutral"  },
                    navProperties: { count: 32, delta: "+5 vs v1", trend: "positive" },
                    actions:       { count: 4,  delta: "unchanged", trend: "neutral"  }
                },

                // ─── Version Compare Data ─────────────────────────────────────
                compareBase:    "v5",
                compareTarget:  "v7",
                compareService: "ZMM_PURCHASE_SRV",

                structuralDiff: {
                    leftHeader:  "v5 — base (12 entity types)",
                    rightHeader: "v7 — compare (14 entity types)",
                    summary: {
                        added:     2,
                        removed:   0,
                        changed:   3,
                        unchanged: 22
                    },
                    leftMeta:  "JDOE · TR#K8X044 · SEGW: ZMM_PO_PROJ · 12 entities",
                    rightMeta: "SYSTEM · TR#K9A002 · App: ZMM_PURCHASE_UI · 14 entities",
                    nodes: [
                        {
                            type: "folder", label: "EntityTypes", children: [
                                { type: "item", label: "PurchaseOrderSet", status: "unchanged" },
                                { type: "item", label: "VendorSet",        status: "unchanged" },
                                { type: "item", label: "MaterialSet",      status: "unchanged" },
                                { type: "item", label: "CostCenterSet",    status: "unchanged" },
                                { type: "item", label: "BusinessPartnerSet", leftLabel: "PartnerSet", status: "changed", changeDetail: "PartnerSet→BusinessPartnerSet" },
                                { type: "item", label: "Vendor.MaxLength", status: "changed", changeDetail: "MaxLength 10→20" },
                                { type: "item", label: "Item.Quantity.Scale", status: "changed", changeDetail: "Scale 3→6" },
                                { type: "item", label: "ApprovalStepSet",  status: "added",     changeDetail: "New in v7" },
                                { type: "item", label: "AddressSet",       status: "added",     changeDetail: "New in v7" }
                            ]
                        },
                        {
                            type: "folder", label: "Associations", children: [
                                { type: "item", label: "PO_Items_Assoc",    status: "unchanged" },
                                { type: "item", label: "PO_Partner_Assoc",  status: "unchanged" },
                                { type: "item", label: "PO_Address_Assoc",  status: "added",   changeDetail: "New in v7" },
                                { type: "item", label: "PO_Approval_Assoc", status: "added",   changeDetail: "New in v7" }
                            ]
                        },
                        {
                            type: "folder", label: "FunctionImports", children: [
                                { type: "item", label: "GetOpenOrders",     status: "unchanged" },
                                { type: "item", label: "ConfirmDelivery",   status: "unchanged" },
                                { type: "item", label: "GetApprovalStatus", status: "added",   changeDetail: "New in v7" }
                            ]
                        }
                    ]
                },

                xmlDiff: [
                    { lineNo: 1,  leftLine: "<?xml version=\"1.0\" encoding=\"utf-8\"?>",    rightLine: "<?xml version=\"1.0\" encoding=\"utf-8\"?>",    status: "unchanged" },
                    { lineNo: 2,  leftLine: "<edmx:Edmx Version=\"1.0\" xmlns:edmx=\"...\">", rightLine: "<edmx:Edmx Version=\"1.0\" xmlns:edmx=\"...\">", status: "unchanged" },
                    { lineNo: 3,  leftLine: "  <edmx:DataServices m:DataServiceVersion=\"2.0\">", rightLine: "  <edmx:DataServices m:DataServiceVersion=\"2.0\">", status: "unchanged" },
                    { lineNo: 4,  leftLine: "    <Schema Namespace=\"SAP_MM_PUR\" xmlns=\"...\">", rightLine: "    <Schema Namespace=\"SAP_MM_PUR\" xmlns=\"...\">", status: "unchanged" },
                    { lineNo: 5,  leftLine: "      <EntityType Name=\"PartnerSet\">",           rightLine: "      <EntityType Name=\"BusinessPartnerSet\">",    status: "changed" },
                    { lineNo: 6,  leftLine: "        <Property Name=\"Vendor\" MaxLength=\"10\"/>", rightLine: "        <Property Name=\"Vendor\" MaxLength=\"20\"/>", status: "changed" },
                    { lineNo: 7,  leftLine: "        <Property Name=\"Quantity\" Scale=\"3\"/>", rightLine: "        <Property Name=\"Quantity\" Scale=\"6\"/>",  status: "changed" },
                    { lineNo: 8,  leftLine: "",                                               rightLine: "      <EntityType Name=\"ApprovalStepSet\">",       status: "added"   },
                    { lineNo: 9,  leftLine: "",                                               rightLine: "        <Key><PropertyRef Name=\"StepId\"/></Key>", status: "added"   },
                    { lineNo: 10, leftLine: "",                                               rightLine: "        <Property Name=\"StepId\" Type=\"Edm.String\"/>", status: "added" },
                    { lineNo: 11, leftLine: "",                                               rightLine: "      </EntityType>",                              status: "added"   },
                    { lineNo: 12, leftLine: "",                                               rightLine: "      <EntityType Name=\"AddressSet\">",             status: "added"   },
                    { lineNo: 13, leftLine: "",                                               rightLine: "        <Key><PropertyRef Name=\"AddressId\"/></Key>", status: "added" },
                    { lineNo: 14, leftLine: "",                                               rightLine: "      </EntityType>",                              status: "added"   },
                    { lineNo: 15, leftLine: "    </Schema>",                                  rightLine: "    </Schema>",                                    status: "unchanged" }
                ],

                // ─── Snapshot Detail ──────────────────────────────────────────
                snapshotDetail: {
                    version:    "v7",
                    service:    "ZMM_PURCHASE_SRV",
                    date:       "Today 06:00",
                    createdBy:  "SYSTEM (auto)",
                    transport:  "TR#K9A002",
                    app:        "ZMM_PURCHASE_UI",
                    hash:       "a4f8c2d1e9b3f7a0",
                    scanType:   "Auto",
                    serviceType:"V2",
                    prefix:     "ZI",
                    isImmutable: true,
                    fileInfo:   "$metadata.xml · 48 lines · 3.6 KB · UTF-8",

                    entityTree: [
                        {
                            section: "ENTITY TYPES (14)",
                            items: [
                                {
                                    name: "PurchaseOrderSet", icon: "sap-icon://table-view", isNew: false, isActive: true,
                                    properties: [
                                        { name: "PurchaseOrder", icon: "sap-icon://key",           isNew: false, isNav: false },
                                        { name: "CompanyCode",   icon: "sap-icon://bullet-text",   isNew: false, isNav: false },
                                        { name: "Vendor",        icon: "sap-icon://bullet-text",   isNew: false, isNav: false },
                                        { name: "TotalAmount",   icon: "sap-icon://bullet-text",   isNew: false, isNav: false },
                                        { name: "Items",         icon: "sap-icon://arrow-right",   isNew: false, isNav: true  },
                                        { name: "Approvals",     icon: "sap-icon://arrow-right",   isNew: false, isNav: true  }
                                    ]
                                },
                                {
                                    name: "PurchaseOrderItemSet", icon: "sap-icon://table-view", isNew: false, isActive: false,
                                    properties: [
                                        { name: "ItemNumber", icon: "sap-icon://key",         isNew: false, isNav: false },
                                        { name: "Material",   icon: "sap-icon://bullet-text", isNew: false, isNav: false },
                                        { name: "Quantity",   icon: "sap-icon://bullet-text", isNew: false, isNav: false }
                                    ]
                                },
                                { name: "BusinessPartnerSet", icon: "sap-icon://table-view", isNew: true,  isActive: false, properties: [] },
                                { name: "ApprovalStepSet",   icon: "sap-icon://table-view", isNew: true,  isActive: false, properties: [] },
                                { name: "AddressSet",        icon: "sap-icon://table-view", isNew: true,  isActive: false, properties: [] }
                            ]
                        },
                        {
                            section: "ASSOCIATIONS (11)",
                            items: [
                                { name: "PO_Items_Assoc",    icon: "sap-icon://chain-link", isNew: false, properties: [] },
                                { name: "PO_Partner_Assoc",  icon: "sap-icon://chain-link", isNew: false, properties: [] },
                                { name: "PO_Approval_Assoc", icon: "sap-icon://chain-link", isNew: true,  properties: [] }
                            ]
                        },
                        {
                            section: "FUNCTIONS (4)",
                            items: [
                                { name: "GetOpenOrders",     icon: "sap-icon://fx", isNew: false, properties: [] },
                                { name: "ConfirmDelivery",   icon: "sap-icon://fx", isNew: false, properties: [] },
                                { name: "GetApprovalStatus", icon: "sap-icon://fx", isNew: true,  properties: [] }
                            ]
                        }
                    ],

                    xmlContent: [
                        { lineNo: 1,  content: "<?xml version=\"1.0\" encoding=\"utf-8\"?>" },
                        { lineNo: 2,  content: "<edmx:Edmx Version=\"1.0\" xmlns:edmx=\"http://schemas.microsoft.com/ado/2007/06/edmx\"" },
                        { lineNo: 3,  content: "    xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\"" },
                        { lineNo: 4,  content: "    xmlns:sap=\"http://www.sap.com/Protocols/SAPData\">" },
                        { lineNo: 5,  content: "  <edmx:DataServices m:DataServiceVersion=\"2.0\">" },
                        { lineNo: 6,  content: "    <Schema Namespace=\"SAP_MM_PUR\" xml:lang=\"en\"" },
                        { lineNo: 7,  content: "        xmlns=\"http://schemas.microsoft.com/ado/2008/09/edm\">" },
                        { lineNo: 8,  content: "      <EntityType Name=\"PurchaseOrderSet\" sap:content-version=\"1\">" },
                        { lineNo: 9,  content: "        <Key><PropertyRef Name=\"PurchaseOrder\"/></Key>" },
                        { lineNo: 10, content: "        <Property Name=\"PurchaseOrder\" Type=\"Edm.String\" Nullable=\"false\" MaxLength=\"10\"/>" },
                        { lineNo: 11, content: "        <Property Name=\"CompanyCode\"   Type=\"Edm.String\" MaxLength=\"4\"/>" },
                        { lineNo: 12, content: "        <Property Name=\"Vendor\"        Type=\"Edm.String\" MaxLength=\"20\"/>" },
                        { lineNo: 13, content: "        <Property Name=\"TotalAmount\"   Type=\"Edm.Decimal\" Precision=\"13\" Scale=\"2\"/>" },
                        { lineNo: 14, content: "        <NavigationProperty Name=\"Items\"     Relationship=\"SAP_MM_PUR.PO_Items_Assoc\"/>" },
                        { lineNo: 15, content: "        <NavigationProperty Name=\"Approvals\" Relationship=\"SAP_MM_PUR.PO_Approval_Assoc\"/>" },
                        { lineNo: 16, content: "      </EntityType>" },
                        { lineNo: 17, content: "      <EntityType Name=\"PurchaseOrderItemSet\">" },
                        { lineNo: 18, content: "        <Key><PropertyRef Name=\"ItemNumber\"/></Key>" },
                        { lineNo: 19, content: "        <Property Name=\"ItemNumber\" Type=\"Edm.String\" Nullable=\"false\"/>" },
                        { lineNo: 20, content: "        <Property Name=\"Material\"   Type=\"Edm.String\" MaxLength=\"18\"/>" },
                        { lineNo: 21, content: "        <Property Name=\"Quantity\"   Type=\"Edm.Decimal\" Precision=\"13\" Scale=\"6\"/>" },
                        { lineNo: 22, content: "      </EntityType>" },
                        { lineNo: 23, content: "      <EntityType Name=\"BusinessPartnerSet\" sap:label=\"Business Partner\">" },
                        { lineNo: 24, content: "        <Key><PropertyRef Name=\"PartnerId\"/></Key>" },
                        { lineNo: 25, content: "        <Property Name=\"PartnerId\"   Type=\"Edm.String\" Nullable=\"false\" MaxLength=\"10\"/>" },
                        { lineNo: 26, content: "        <Property Name=\"PartnerName\" Type=\"Edm.String\" MaxLength=\"80\"/>" },
                        { lineNo: 27, content: "      </EntityType>" },
                        { lineNo: 28, content: "      <EntityType Name=\"ApprovalStepSet\">" },
                        { lineNo: 29, content: "        <Key><PropertyRef Name=\"StepId\"/></Key>" },
                        { lineNo: 30, content: "        <Property Name=\"StepId\"    Type=\"Edm.String\" Nullable=\"false\"/>" },
                        { lineNo: 31, content: "        <Property Name=\"StepName\"  Type=\"Edm.String\" MaxLength=\"50\"/>" },
                        { lineNo: 32, content: "        <Property Name=\"Approver\"  Type=\"Edm.String\" MaxLength=\"12\"/>" },
                        { lineNo: 33, content: "      </EntityType>" },
                        { lineNo: 34, content: "      <EntityType Name=\"AddressSet\">" },
                        { lineNo: 35, content: "        <Key><PropertyRef Name=\"AddressId\"/></Key>" },
                        { lineNo: 36, content: "        <Property Name=\"AddressId\" Type=\"Edm.String\" Nullable=\"false\"/>" },
                        { lineNo: 37, content: "        <Property Name=\"Street\"    Type=\"Edm.String\" MaxLength=\"60\"/>" },
                        { lineNo: 38, content: "      </EntityType>" },
                        { lineNo: 39, content: "      <Association Name=\"PO_Items_Assoc\">" },
                        { lineNo: 40, content: "        <End Type=\"SAP_MM_PUR.PurchaseOrderSet\" Multiplicity=\"1\" Role=\"FromRole\"/>" },
                        { lineNo: 41, content: "        <End Type=\"SAP_MM_PUR.PurchaseOrderItemSet\" Multiplicity=\"*\" Role=\"ToRole\"/>" },
                        { lineNo: 42, content: "      </Association>" },
                        { lineNo: 43, content: "      <Association Name=\"PO_Approval_Assoc\">" },
                        { lineNo: 44, content: "        <End Type=\"SAP_MM_PUR.PurchaseOrderSet\" Multiplicity=\"1\" Role=\"FromRole\"/>" },
                        { lineNo: 45, content: "        <End Type=\"SAP_MM_PUR.ApprovalStepSet\" Multiplicity=\"*\" Role=\"ToRole\"/>" },
                        { lineNo: 46, content: "      </Association>" },
                        { lineNo: 47, content: "      <FunctionImport Name=\"GetApprovalStatus\" ReturnType=\"Edm.String\"/>" },
                        { lineNo: 48, content: "    </Schema>" },
                        { lineNo: 49, content: "  </edmx:DataServices>" },
                        { lineNo: 50, content: "</edmx:Edmx>" }
                    ],

                    workflowEvents: [
                        {
                            icon: "sap-icon://status-positive",
                            color: "Positive",
                            title: "Transport released",
                            subtitle: "TR#K9A002 imported to PRD — Today 05:48",
                            description: "App: ZMM_PURCHASE_UI · imported by BASIS team · system detected version table update",
                            dotColor: "green"
                        },
                        {
                            icon: "sap-icon://intelligence",
                            color: "Information",
                            title: "Auto-scan triggered",
                            subtitle: "ZODATA_SCHEDULER detected version change — Today 06:00",
                            description: "Version table updated → daily job fired 2 min early · hash check: NEW",
                            dotColor: "blue"
                        },
                        {
                            icon: "sap-icon://download",
                            color: "Information",
                            title: "Metadata fetched",
                            subtitle: "SYSTEM called /IWFND/CL_SODATA_EDM_PROVIDER — Today 06:00:03",
                            description: "Raw $metadata XML retrieved · 14 entity types parsed",
                            dotColor: "blue"
                        },
                        {
                            icon: "sap-icon://save",
                            color: "Information",
                            title: "Snapshot written",
                            subtitle: "v7 stored in ZODATA_SNAPSHOTS — Today 06:00:04",
                            description: "Hash: a4f8c2d1… · immutable · audit logged to ZODATA_LOG",
                            dotColor: "blue"
                        },
                        {
                            icon: "sap-icon://show",
                            color: "None",
                            title: "Viewed",
                            subtitle: "JDOE opened snapshot detail — Today 09:15",
                            description: "Action: VIEW · logged · no modification",
                            dotColor: "grey"
                        }
                    ]
                }
            };
        }
    };
});
