// DepreciationHistoryTable.jsx
import React, { useState } from "react";
import ValueMovementHistory from "./ValueMovementHistory.js";
import MaintenanceHistory from "./MaintenanceHistory.js";
export const DepreciationHistoryTable = () => {
  const [activeTab, setActiveTab] = useState("detailed");
  return /*#__PURE__*/React.createElement("main", {
    className: "main",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-professional-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "detailed" ? "active" : ""}`,
    onClick: () => setActiveTab("detailed")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-history"
  }), "Historial Detallado"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "maintenance" ? "active" : ""}`,
    onClick: () => setActiveTab("maintenance")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-wrench"
  }), "Historial Mantenimiento")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "detailed" ? "active" : ""}`
  }, /*#__PURE__*/React.createElement(ValueMovementHistory, null)), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "maintenance" ? "active" : ""}`
  }, /*#__PURE__*/React.createElement(MaintenanceHistory, null)))));
};
export default DepreciationHistoryTable;