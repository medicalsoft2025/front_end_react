import React from 'react';
import NursingNotes from "./NursingNotes.js";
export const NursingNotesApp = ({
  patientId
}) => {
  return /*#__PURE__*/React.createElement(NursingNotes, {
    patientId: patientId
  });
};
export default NursingNotesApp;