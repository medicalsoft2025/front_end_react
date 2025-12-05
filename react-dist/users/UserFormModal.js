import React from 'react';
import UserForm from "./UserForm.js";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
const UserFormModal = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
  config
}) => {
  const formId = 'createDoctor';
  const footer = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 justify-content-end align-items-center"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-secondary",
    "aria-label": "Close",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-times me-2"
    }),
    label: "Cerrar",
    onClick: onHide
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    form: formId,
    className: "p-button-primary",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-save me-2"
    }),
    label: "Guardar"
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
      height: "100%",
      maxHeight: "90%"
    }
  }, /*#__PURE__*/React.createElement(UserForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData,
    config: config
  }));
};
export default UserFormModal;