import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

interface ConfirmModalProps {
    visible: boolean;
    onHide: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    onHide,
    onConfirm,
    title = "Confirmar",
    message = "¿Estás seguro que deseas descartar los cambios?",
    confirmText = "Sí, descartar",
    cancelText = "No",
    confirmButtonClass = "p-button-primary"
}) => {
    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={title}
            footer={
                <div className="d-flex justify-content-center gap-3">
                    <Button
                        className="p-button-secondary d-flex justify-content-center align-items-center"
                        onClick={onHide}
                        style={{ minWidth: "100px" }}
                    >
                        <i className="fas fa-times me-2"></i>
                        {cancelText}
                    </Button>
                    <Button
                        className={`${confirmButtonClass} d-flex justify-content-center align-items-center`}
                        onClick={onConfirm}
                        style={{ minWidth: "140px" }}
                    >
                        <i className="fas fa-check me-2"></i>
                        {confirmText}
                    </Button>
                </div>
            }
        >
            <p>{message}</p>
        </Dialog>
    );
};

export default ConfirmModal;