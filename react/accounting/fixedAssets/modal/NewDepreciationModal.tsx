import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import { NewDepreciationForm } from "../form/NewDepreciationForm";
import CustomModalConfirm from "../../../components/CustomModalConfirm";
import { DepreciationFormInputs } from "../interfaces/NewDepreciationForm";

interface DepreciationModalProps {
    isVisible: boolean;
    onSave: (data: DepreciationFormInputs) => Promise<void>;
    onClose: () => void;
    assetOptions: { label: string; value: string }[];
    changeTypeOptions: { label: string; value: string }[];
    records: any[];
    closable?: boolean;
}

export const NewDepreciationModal: React.FC<DepreciationModalProps> = ({
    isVisible,
    onSave,
    onClose,
    assetOptions,
    changeTypeOptions,
    records,
    closable = true,
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

    const handleSave = async (data: DepreciationFormInputs) => {
        setLoading(true);
        try {
            await onSave(data);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CustomModal
                show={isVisible}
                onHide={handleCloseAttempt}
                title="Nuevo Registro de Depreciación/Apreciación"
                width="60vw"
            >
                <NewDepreciationForm
                    formId="depreciationForm"
                    onSubmit={handleSave}
                    onCancel={handleCloseAttempt}
                    loading={loading}
                    assetOptions={assetOptions}
                    changeTypeOptions={changeTypeOptions}
                    records={records}
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