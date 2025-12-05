import React, { useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast'; // Importar Toast
import { PatientInfoContainer } from "../../../PatientInfoContainer.js";
export const PatientEditModal = ({
  visible,
  onHide,
  patientId,
  onSuccess
}) => {
  const toast = useRef(null);
  const handleSuccess = () => {
    if (toast.current) {
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Paciente actualizado correctamente',
        life: 3000
      });
    }
    if (onSuccess) {
      onSuccess();
    }
    setTimeout(() => {
      onHide();
    }, 1500);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    header: "Editar Paciente",
    visible: visible,
    onHide: () => {
      onHide();
    },
    style: {
      width: '90vw',
      maxWidth: '1200px'
    },
    breakpoints: {
      '960px': '95vw',
      '640px': '100vw'
    },
    modal: true,
    className: "patient-edit-modal"
  }, /*#__PURE__*/React.createElement(PatientInfoContainer, {
    patientId: patientId,
    onSuccess: handleSuccess
  })));
};