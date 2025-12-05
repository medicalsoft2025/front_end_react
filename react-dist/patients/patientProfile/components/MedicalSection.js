import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { formatDate, getLastAppointment } from "../utils/utilsPatient.js";
import { Dialog } from 'primereact/dialog';
import { PastMedicalHistoryDetail } from "../../../past-medical-history/PastMedicalHistoryDetail.js";
const MedicalSection = ({
  patient
}) => {
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  if (!patient) return null;
  const lastAppointment = getLastAppointment(patient.appointments);
  const handleShowMedicalDetails = () => {
    setShowMedicalHistoryModal(true);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "medical-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "section-title"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-heartbeat me-2"
  }), /*#__PURE__*/React.createElement("span", null, "Antecedentes M\xE9dicos"), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: handleShowMedicalDetails,
    tooltip: "Ver antecedentes m\xE9dicos detallados",
    tooltipOptions: {
      position: 'top'
    },
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-eye"
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "medical-info-grid"
  }, /*#__PURE__*/React.createElement(MedicalItem, {
    icon: "fas fa-calendar-alt",
    label: "\xDAltima consulta:",
    value: lastAppointment ? formatDate(lastAppointment.appointment_date) : "No disponible"
  }), /*#__PURE__*/React.createElement(MedicalItem, {
    icon: "fas fa-shield-alt",
    label: "Alergias:",
    value: patient.has_allergies ? patient.allergies : "Ninguna registrada"
  }), /*#__PURE__*/React.createElement(MedicalItem, {
    icon: "fas fa-briefcase-medical",
    label: "Enfermedades:",
    value: patient.has_special_condition ? patient.special_condition : "Ninguna registrada"
  }))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Antecedentes M\xE9dicos Detallados",
    visible: showMedicalHistoryModal,
    onHide: () => setShowMedicalHistoryModal(false),
    style: {
      width: '90vw',
      maxWidth: '1200px'
    },
    breakpoints: {
      '960px': '95vw',
      '640px': '100vw'
    },
    modal: true,
    className: "medical-history-modal"
  }, /*#__PURE__*/React.createElement(PastMedicalHistoryDetail, {
    patientId: patient.id.toString()
  })));
};
const MedicalItem = ({
  icon,
  label,
  value
}) => /*#__PURE__*/React.createElement("div", {
  className: "medical-item"
}, /*#__PURE__*/React.createElement("div", {
  className: "medical-label"
}, /*#__PURE__*/React.createElement("i", {
  className: `${icon} me-2`
}), label), /*#__PURE__*/React.createElement("div", {
  className: "medical-value"
}, value));
export default MedicalSection;