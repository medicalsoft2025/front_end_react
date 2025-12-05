import React, { useState, useEffect } from 'react';
import { usePatientInfo } from "../hooks/usePatientInfoProfile.js";
import { updateBreadcrumbAndLinks } from "../utils/utilsPatient.js";
import PatientHeader from "./PatientHeader.js";
import MedicalSection from "./MedicalSection.js";
import ContactSection from "./ContactSection.js";
import PatientProfileSkeleton from "../components/skeleton/PatientProfileSkeleton.js";
import MedicalHistoryModal from "./MedicalHistoryModal.js";
import PatientNotesImportant from "./PatientNotesImportant.js";
export const PatientProfileCard = () => {
  const patientId = new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("patient_id");
  const {
    patientData,
    loading,
    refresh,
    error
  } = usePatientInfo(patientId);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  useEffect(() => {
    if (patientData) {
      updateBreadcrumbAndLinks(patientData);
    }
  }, [patientData]);
  if (error) {
    return /*#__PURE__*/React.createElement(ErrorState, {
      error: error
    });
  }
  if (loading) {
    return /*#__PURE__*/React.createElement(PatientProfileSkeleton, null);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "patient-profile-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "patient-profile-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(PatientHeader, {
    patient: patientData
  }), /*#__PURE__*/React.createElement("div", {
    className: "profile-divider my-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6 col-md-6 mb-3 mb-md-0"
  }, /*#__PURE__*/React.createElement(MedicalSection, {
    patient: patientData,
    onShowMedicalDetails: () => setShowMedicalModal(true)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6 col-md-6"
  }, /*#__PURE__*/React.createElement(ContactSection, {
    refresh: refresh,
    patient: patientData
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 col-md-12"
  }, /*#__PURE__*/React.createElement(PatientNotesImportant, {
    patient: patientData
  }))))), /*#__PURE__*/React.createElement(MedicalHistoryModal, {
    visible: showMedicalModal,
    onHide: () => setShowMedicalModal(false),
    patient: patientData
  }));
};
const ErrorState = ({
  error
}) => /*#__PURE__*/React.createElement("div", {
  className: "patient-profile-card error-state"
}, /*#__PURE__*/React.createElement("div", {
  className: "card-body text-center py-5"
}, /*#__PURE__*/React.createElement("i", {
  className: "pi pi-exclamation-triangle text-muted mb-3",
  style: {
    fontSize: '3rem'
  }
}), /*#__PURE__*/React.createElement("h5", {
  className: "text-muted mb-2"
}, "Error al cargar el perfil"), /*#__PURE__*/React.createElement("p", {
  className: "text-muted"
}, error), /*#__PURE__*/React.createElement("button", {
  className: "p-button p-button-secondary p-button-sm mt-2",
  onClick: () => window.location.reload()
}, "Reintentar")));