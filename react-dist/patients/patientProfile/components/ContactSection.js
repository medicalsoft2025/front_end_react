import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { PatientEditModal } from "./modal/PatientEditModal.js";
const ContactSection = ({
  patient,
  refresh
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const toast = useRef(null);
  if (!patient) return null;
  const handleEditSuccess = () => {
    console.log('Paciente editado exitosamente');
    if (toast.current) {
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Paciente actualizado correctamente',
        life: 3000
      });
    }

    // Refrescar datos
    if (refresh) {
      refresh();
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "contact-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "section-title"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-atlas me-2"
  }), "Informaci\xF3n de Contacto", /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: () => setShowEditModal(true),
    tooltip: "Editar informaci\xF3n del paciente",
    tooltipOptions: {
      position: 'top'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "contact-details-grid"
  }, /*#__PURE__*/React.createElement(ContactDetailItem, {
    icon: "fas fa-map-marker-alt",
    label: "Direcci\xF3n:",
    value: patient.address || "No disponible"
  }), /*#__PURE__*/React.createElement(ContactDetailItem, {
    icon: "fas fa-phone",
    label: "Tel\xE9fono:",
    value: patient.full_phone || patient.whatsapp || "No disponible"
  }), /*#__PURE__*/React.createElement(ContactDetailItem, {
    icon: "fas fa-envelope",
    label: "Correo:",
    value: patient.email || "No disponible"
  }), /*#__PURE__*/React.createElement(ContactDetailItem, {
    icon: "fas fa-globe-americas",
    label: "Ciudad:",
    value: patient.city_id || "No especificada"
  }))), patient.id && /*#__PURE__*/React.createElement(PatientEditModal, {
    visible: showEditModal,
    onHide: () => setShowEditModal(false),
    patientId: patient.id.toString(),
    onSuccess: handleEditSuccess
  }));
};
const ContactDetailItem = ({
  icon,
  label,
  value
}) => /*#__PURE__*/React.createElement("div", {
  className: "contact-detail-item"
}, /*#__PURE__*/React.createElement("div", {
  className: "contact-detail-label"
}, /*#__PURE__*/React.createElement("i", {
  className: `${icon} me-2`
}), label), /*#__PURE__*/React.createElement("div", {
  className: "contact-detail-value"
}, value));
export default ContactSection;