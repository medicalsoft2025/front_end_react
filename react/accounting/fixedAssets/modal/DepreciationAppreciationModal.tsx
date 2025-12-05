import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import DepreciationAppreciationForm from "../form/DepreciationAppreciationForm";
import { DepreciationAppreciationModalProps } from "../interfaces/DepreciationAppreciationModalTypes";
import CustomModalConfirm from "../../../components/CustomModalConfirm";

const DepreciationAppreciationModal: React.FC<
    DepreciationAppreciationModalProps
> = ({ isVisible, onSave, onClose, asset, closable = true }) => {
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

    const handleSave = async (data: any) => {
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

    return (
        <>
            <CustomModal
                show={isVisible}
                onHide={handleCloseAttempt}
                title={`Ajuste de Valor - ${asset?.description || "Activo"}`}
            >
                <DepreciationAppreciationForm
                    formId="depreciationAppreciationForm"
                    onSubmit={handleSave}
                    onCancel={handleCloseAttempt}
                    loading={loading}
                    currentValue={asset?.current_unit_price || 0}
                />
            </CustomModal>

            <CustomModalConfirm
                visible={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={handleConfirmClose}
            />
        </>
    );
};

export default DepreciationAppreciationModal;
