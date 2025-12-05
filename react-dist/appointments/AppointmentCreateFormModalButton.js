import React from 'react';
import { AppointmentFormModal } from "./AppointmentFormModal.js";
import { Button } from 'primereact/button';
export const AppointmentCreateFormModalButton = () => {
  const [visible, setVisible] = React.useState(false);
  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Cita",
    className: "p-button-primary",
    type: "button",
    onClick: showModal
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus me-2",
    style: {
      marginLeft: "5px"
    }
  })), /*#__PURE__*/React.createElement(AppointmentFormModal, {
    isOpen: visible,
    onClose: handleCancel
  }));
};