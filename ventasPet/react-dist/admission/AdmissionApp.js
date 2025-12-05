import React from 'react';
import { useAdmissions } from "./hooks/useAdmissions.js";
import { PrimeReactProvider } from 'primereact/api';
import { AdmissionTable } from "./AdmissionTable.js";
export const AdmissionApp = () => {
  const {
    admissions,
    fetchAdmissions
  } = useAdmissions();
  const onReload = () => {
    fetchAdmissions();
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement(AdmissionTable, {
    items: admissions,
    onReload: onReload
  })));
};