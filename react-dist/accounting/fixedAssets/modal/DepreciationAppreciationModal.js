import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import DepreciationAppreciationForm from "../form/DepreciationAppreciationForm.js";
import CustomModalConfirm from "../../../components/CustomModalConfirm.js";
const DepreciationAppreciationModal = ({
  isVisible,
  onSave,
  onClose,
  asset,
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
    } catch (error) {
      console.error("Error saving adjustment:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: isVisible,
    onHide: handleCloseAttempt,
    title: `Ajuste de Valor - ${asset?.description || "Activo"}`
  }, /*#__PURE__*/React.createElement(DepreciationAppreciationForm, {
    formId: "depreciationAppreciationForm",
    onSubmit: handleSave,
    onCancel: handleCloseAttempt,
    loading: loading,
    currentValue: asset?.current_unit_price || 0
  })), /*#__PURE__*/React.createElement(CustomModalConfirm, {
    visible: showConfirm,
    onHide: () => setShowConfirm(false),
    onConfirm: handleConfirmClose
  }));
};
export default DepreciationAppreciationModal;