import React from "react";
import { Button } from "primereact/button";
export function EmptyStateManualSection({
  searchTerm,
  setShowCategoryModal,
  setShowVideoModal,
  isCategoryEmpty = false
}) {
  if (isCategoryEmpty) {
    return /*#__PURE__*/React.createElement("div", {
      className: "empty-state py-4"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-video-slash"
    }), /*#__PURE__*/React.createElement("h5", null, "No hay videos en esta categor\xEDa"), /*#__PURE__*/React.createElement("p", {
      className: "text-muted"
    }, "Agrega el primer video tutorial para esta categor\xEDa."), /*#__PURE__*/React.createElement(Button, {
      label: "Agregar Video",
      className: "p-button-outlined",
      onClick: () => setShowVideoModal(true)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus"
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "empty-state fade-in"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-search"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "mb-3"
  }, "No se encontraron resultados"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-4 fs-5"
  }, searchTerm ? `No hay videos o categorías que coincidan con "${searchTerm}"` : 'Comienza creando tu primera categoría para organizar los videos tutoriales.'), !searchTerm && /*#__PURE__*/React.createElement(Button, {
    label: "Crear Primera Categor\xEDa",
    className: "p-button-success p-button-raised",
    onClick: () => setShowCategoryModal(true)
  }), /*#__PURE__*/React.createElement("style", null, `
     
        `));
}