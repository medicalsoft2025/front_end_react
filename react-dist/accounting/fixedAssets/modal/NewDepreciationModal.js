import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import { NewDepreciationForm } from "../form/NewDepreciationForm.js";
import CustomModalConfirm from "../../../components/CustomModalConfirm.js";
export const NewDepreciationModal = ({
  isVisible,
  onSave,
  onClose,
  assetOptions,
  changeTypeOptions,
  records,
  closable = true
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleCloseAttempt = () => {
    if (closable) {
      setShowConfirm(true);
    }
  };
  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };
  const handleSave = async data => {
    setLoading(true);
    try {
      await onSave(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: isVisible,
    onHide: handleCloseAttempt,
    title: "Nuevo Registro de Depreciaci\xF3n/Apreciaci\xF3n",
    width: "60vw"
  }, /*#__PURE__*/React.createElement(NewDepreciationForm, {
    formId: "depreciationForm",
    onSubmit: handleSave,
    onCancel: handleCloseAttempt,
    loading: loading,
    assetOptions: assetOptions,
    changeTypeOptions: changeTypeOptions,
    records: records
  })), /*#__PURE__*/React.createElement(CustomModalConfirm, {
    visible: showConfirm,
    onHide: () => setShowConfirm(false),
    onConfirm: handleConfirmClose
  }));
};