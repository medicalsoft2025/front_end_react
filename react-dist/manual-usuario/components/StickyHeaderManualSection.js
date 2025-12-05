import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
export function StickyHeaderManualSection({
  isScrolled,
  searchTerm,
  setSearchTerm,
  setShowCategoryModal,
  setShowVideoModal
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `sticky-header px-4 fade-in ${isScrolled ? 'active' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "row align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6 mb-3 mb-lg-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-container"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-search search-icon"
  }), /*#__PURE__*/React.createElement(InputText, {
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    placeholder: "Buscar videos o categor\xEDas...",
    className: "w-100 ps-5",
    style: {
      height: '48px',
      borderRadius: '25px',
      fontSize: '1rem'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-3 justify-content-lg-end justify-content-start flex-wrap"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Categor\xEDa",
    className: "p-button-success p-button-raised",
    onClick: () => setShowCategoryModal(true)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Video",
    className: "p-button-info p-button-raised",
    onClick: () => setShowVideoModal(true)
  })))));
}