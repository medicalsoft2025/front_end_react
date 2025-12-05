import React from 'react';
import { Dialog } from 'primereact/dialog';
import { PastMedicalHistoryDetail } from "../../../../past-medical-history/PastMedicalHistoryDetail.js";
export const MedicalHistoryModal = ({
  visible,
  onHide,
  patientId
}) => {
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Antecedentes M\xE9dicos Detallados",
    visible: visible,
    onHide: onHide,
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
  }, /*#__PURE__*/React.createElement(PastMedicalHistoryDetail, null));
};