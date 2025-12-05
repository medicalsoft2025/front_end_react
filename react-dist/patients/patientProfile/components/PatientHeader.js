import React from 'react';
import { bloodTypeMap } from "../utils/utilsPatient.js";
const PatientHeader = ({
  patient
}) => {
  if (!patient) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "profile-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar-section"
  }, /*#__PURE__*/React.createElement("img", {
    className: "patient-avatar",
    src: getUrlImage(patient.minio_url),
    alt: `Avatar de ${patient.full_name}`,
    onError: e => {
      e.target.src = "../assets/img/profile/profile_default.jpg";
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "profile-info"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "patient-name"
  }, patient.full_name), /*#__PURE__*/React.createElement("div", {
    className: "contact-info-grid"
  }, /*#__PURE__*/React.createElement(ContactItem, {
    icon: "fas fa-mobile-alt",
    value: patient.full_phone || patient.whatsapp || "No disponible"
  }), /*#__PURE__*/React.createElement(ContactItem, {
    icon: "fas fa-tint blood-type",
    value: bloodTypeMap[patient.blood_type] || "No especificado"
  }), /*#__PURE__*/React.createElement(ContactItem, {
    icon: "fas fa-id-card",
    value: patient.document_number || "No disponible"
  }), /*#__PURE__*/React.createElement(ContactItem, {
    icon: "fas fa-envelope",
    value: patient.email || "No disponible"
  }))));
};
const ContactItem = ({
  icon,
  value
}) => /*#__PURE__*/React.createElement("div", {
  className: "contact-item"
}, /*#__PURE__*/React.createElement("i", {
  className: `contact-icon ${icon}`
}), /*#__PURE__*/React.createElement("span", {
  className: "contact-value"
}, value));
export default PatientHeader;