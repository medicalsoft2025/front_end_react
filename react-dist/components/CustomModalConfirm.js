import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
const ConfirmModal = ({
  visible,
  onHide,
  onConfirm,
  title = "Confirmar",
  message = "¿Estás seguro que deseas descartar los cambios?",
  confirmText = "Sí, descartar",
  cancelText = "No",
  confirmButtonClass = "p-button-primary"
}) => {
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: onHide,
    header: title,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center gap-3"
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-secondary d-flex justify-content-center align-items-center",
      onClick: onHide,
      style: {
        minWidth: "100px"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-times me-2"
    }), cancelText), /*#__PURE__*/React.createElement(Button, {
      className: `${confirmButtonClass} d-flex justify-content-center align-items-center`,
      onClick: onConfirm,
      style: {
        minWidth: "140px"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-check me-2"
    }), confirmText))
  }, /*#__PURE__*/React.createElement("p", null, message));
};
export default ConfirmModal;