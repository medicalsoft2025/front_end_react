import React from 'react';
import { Dialog } from 'primereact/dialog';
import { formatDate, bloodTypeMap } from "../utils/utilsPatient.js";
const MedicalHistoryModal = ({
  visible,
  onHide,
  patient
}) => {
  if (!patient) return null;
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Historial M\xE9dico Completo",
    visible: visible,
    style: {
      width: '90vw',
      maxWidth: '600px'
    },
    onHide: onHide,
    className: "patient-modal"
  }, /*#__PURE__*/React.createElement(MedicalHistoryContent, {
    patient: patient
  }));
};
const MedicalHistoryContent = ({
  patient
}) => /*#__PURE__*/React.createElement("div", {
  className: "medical-history-modal"
}, /*#__PURE__*/React.createElement(InfoSection, {
  title: "Informaci\xF3n Personal",
  icon: "pi pi-user",
  items: [{
    label: 'Fecha de Nacimiento:',
    value: `${formatDate(patient.date_of_birth)} (${patient.age} años)`
  }, {
    label: 'Género:',
    value: patient.gender === 'MALE' ? 'Masculino' : 'Femenino'
  }, {
    label: 'Estado Civil:',
    value: patient.civil_status || "No especificado"
  }, {
    label: 'Tipo de Sangre:',
    value: bloodTypeMap[patient.blood_type] || "No especificado"
  }]
}), /*#__PURE__*/React.createElement(InfoSection, {
  title: "Seguridad Social",
  icon: "pi pi-shield",
  items: [{
    label: 'Entidad:',
    value: patient.social_security?.entity?.name || "Particular"
  }, {
    label: 'Tipo de Afiliación:',
    value: patient.social_security?.affiliate_type || "No especificado"
  }]
}), /*#__PURE__*/React.createElement(InfoSection, {
  title: "Ubicaci\xF3n",
  icon: "pi pi-map-marker",
  items: [{
    label: 'Departamento:',
    value: patient.department_id || "No especificado"
  }, {
    label: 'País:',
    value: patient.country_id || "No especificado"
  }, {
    label: 'Nacionalidad:',
    value: patient.nationality || "No especificado"
  }]
}), /*#__PURE__*/React.createElement(InfoSection, {
  title: "Notificaciones",
  icon: "pi pi-bell",
  items: [{
    label: 'WhatsApp:',
    value: patient.whatsapp_notifications ? 'Activas' : 'Inactivas'
  }, {
    label: 'Email:',
    value: patient.email_notifications ? 'Activas' : 'Inactivas'
  }]
}));
const InfoSection = ({
  title,
  icon,
  items
}) => /*#__PURE__*/React.createElement("div", {
  className: "info-section"
}, /*#__PURE__*/React.createElement("h5", {
  className: "section-title mb-3"
}, /*#__PURE__*/React.createElement("i", {
  className: `${icon} me-2`
}), title), /*#__PURE__*/React.createElement("div", {
  className: "info-grid"
}, items.map((item, index) => /*#__PURE__*/React.createElement(InfoItem, {
  key: index,
  label: item.label,
  value: item.value
}))));
const InfoItem = ({
  label,
  value
}) => /*#__PURE__*/React.createElement("div", {
  className: "info-item"
}, /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("span", null, value));
export default MedicalHistoryModal;