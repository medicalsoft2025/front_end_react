import React from "react";
import { Divider } from "primereact/divider";
export function StatsSection({
  categories,
  totalVideos,
  totalMinutes
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "row mb-5 fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-xl-3 col-md-6 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stats-card"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-layer-group stats-icon text-primary"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "fw-bold text-primary mb-2"
  }, categories.length), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-0"
  }, "Categor\xEDas Organizadas"))), /*#__PURE__*/React.createElement("div", {
    className: "col-xl-3 col-md-6 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stats-card"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-video stats-icon text-success"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "fw-bold text-success mb-2"
  }, totalVideos), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-0"
  }, "Videos Tutoriales"))), /*#__PURE__*/React.createElement("div", {
    className: "col-xl-3 col-md-6 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stats-card"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-clock stats-icon text-info"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "fw-bold text-info mb-2"
  }, totalMinutes, "+"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-0"
  }, "Minutos de Contenido"))), /*#__PURE__*/React.createElement("div", {
    className: "col-xl-3 col-md-6 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stats-card"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-users stats-icon text-warning"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "fw-bold text-warning mb-2"
  }, categories.length * 3, "+"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-0"
  }, "M\xF3dulos Disponibles")))), /*#__PURE__*/React.createElement(Divider, null));
}