import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
export const CustomFormModal = ({
  children,
  formId,
  title,
  show,
  scrollable,
  width,
  onSave,
  onHide
}) => {
  const footer = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-secondary",
    "aria-label": "Close",
    onClick: onHide,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-times me-2"
    }),
    label: "Cerrar"
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    form: formId,
    className: "p-button-primary",
    onClick: onSave,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-save me-2"
    }),
    label: "Guardar"
  })));
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: show,
    onHide: () => onHide?.(),
    header: title,
    footer: footer,
    style: {
      width: width || '50vw'
    }
  }, children);
};