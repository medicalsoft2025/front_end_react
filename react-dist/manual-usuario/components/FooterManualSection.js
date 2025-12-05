import React from "react";
export function FooterManualSection() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-5 text-center text-muted fade-in"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-sync-alt me-2"
  }), "Actualizado por \xFAltima vez: ", new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "MedicalSoft v1.0 \u2022 Manual de Usuario Interactivo"));
}