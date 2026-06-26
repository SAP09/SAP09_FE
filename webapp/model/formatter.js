sap.ui.define([], function () {
    "use strict";

    return {
        // ── Type badge class ────────────────────────────────────────────────
        typeBadgeClass: function (sType) {
            if (sType === "V2") return "badge badge-v2";
            if (sType === "V4") return "badge badge-v4";
            return "badge";
        },

        // ── Prefix badge class ──────────────────────────────────────────────
        prefixBadgeClass: function (sPrefix) {
            if (sPrefix === "ZI") return "badge badge-zi";
            if (sPrefix === "ZC") return "badge badge-zc";
            return "badge";
        },

        // ── Status badge class ──────────────────────────────────────────────
        statusBadgeClass: function (sStatus) {
            if (sStatus === "Active")   return "badge badge-active";
            if (sStatus === "Inactive") return "badge badge-inactive";
            if (sStatus === "Deleted")  return "badge badge-deleted";
            return "badge";
        },

        // ── Scan-type badge class ───────────────────────────────────────────
        scanTypeBadgeClass: function (sScanType) {
            if (sScanType === "Auto")   return "badge badge-auto";
            if (sScanType === "Manual") return "badge badge-manual";
            return "badge";
        },

        // ── Trend icon ──────────────────────────────────────────────────────
        trendIcon: function (sTrend) {
            if (sTrend === "positive") return "sap-icon://trend-up";
            if (sTrend === "negative") return "sap-icon://trend-down";
            return "sap-icon://less";
        },

        // ── Trend state ─────────────────────────────────────────────────────
        trendState: function (sTrend) {
            if (sTrend === "positive") return "Positive";
            if (sTrend === "negative") return "Negative";
            return "None";
        },

        // ── Delta color class ───────────────────────────────────────────────
        deltaClass: function (sTrend) {
            if (sTrend === "positive") return "kpi-delta kpi-delta-positive";
            if (sTrend === "negative") return "kpi-delta kpi-delta-negative";
            return "kpi-delta kpi-delta-neutral";
        },

        // ── Diff row class for structural diff ──────────────────────────────
        diffRowClass: function (sStatus) {
            if (sStatus === "added")   return "diff-added";
            if (sStatus === "removed") return "diff-removed";
            if (sStatus === "changed") return "diff-changed";
            return "";
        },

        // ── Diff symbol ─────────────────────────────────────────────────────
        diffSymbol: function (sStatus) {
            if (sStatus === "added")   return "+";
            if (sStatus === "removed") return "−";
            if (sStatus === "changed") return "~";
            return " ";
        },

        // ── Tree node class ─────────────────────────────────────────────────
        treeNodeClass: function (bIsNew) {
            return bIsNew ? "tree-node tree-node-new" : "tree-node";
        },

        // ── Visible if not deleted ───────────────────────────────────────────
        visibleIfNotDeleted: function (bDeleted, bShowDeleted) {
            if (bDeleted) return bShowDeleted;
            return true;
        },

        // ── Deleted item opacity ─────────────────────────────────────────────
        deletedOpacity: function (bDeleted) {
            return bDeleted ? "0.5" : "1";
        },

        // ── Format selected item highlight ──────────────────────────────────
        isSelected: function (sId, sSelectedId) {
            return sId === sSelectedId ? "Active" : "Inactive";
        },

        // ── Short hash ──────────────────────────────────────────────────────
        shortHash: function (sHash) {
            if (!sHash) return "";
            return sHash.substring(0, 8) + "…";
        },

        // ── Boolean to visibility ────────────────────────────────────────────
        boolToVisible: function (bVal) {
            return !!bVal;
        },

        // ── Negate boolean ──────────────────────────────────────────────────
        notBool: function (bVal) {
            return !bVal;
        },

        // ── Pill count label ─────────────────────────────────────────────────
        addedLabel:   function (n) { return "+" + n + " added"; },
        removedLabel: function (n) { return "−" + n + " removed"; },
        changedLabel: function (n) { return "~" + n + " changed"; },
        unchangedLabel: function (n) { return n + " unchanged"; }
    };
});
