import React from "react";
import { ComissionForm } from "./Comissions.js";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
export const ComissionFormModal = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = "createDoctor";
  const footer = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "p-button-primary px-3 my-0 me-2",
    "aria-label": "Close",
    onClick: onHide
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-left",
    style: {
      marginLeft: "10px"
    }
  })), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    type: "submit",
    form: formId,
    className: "p-button-primary my-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-bookmark",
    style: {
      marginLeft: "10px"
    }
  })));
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: show,
    onHide: () => {
      onHide?.();
    },
    header: title,
    footer: footer,
    style: {
      width: "80vw",
      height: "75%",
      maxHeight: "90%"
    }
  }, /*#__PURE__*/React.createElement(ComissionForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};