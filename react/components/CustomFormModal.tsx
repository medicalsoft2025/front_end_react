import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface Props {
    children: React.ReactNode;
    formId: string;
    title: string;
    show: boolean;
    scrollable?: boolean;
    width?: string;
    onSave?: () => void;
    onHide?: () => void;
}

export const CustomFormModal: React.FC<Props> = ({ children, formId, title, show, scrollable, width, onSave, onHide }) => {

    const footer = (
        <>
            <div className="d-flex justify-content-end align-items-center gap-2">
                <Button
                    className="p-button-secondary"
                    aria-label="Close"
                    onClick={onHide}
                    icon={<i className="fas fa-times me-2"></i>}
                    label="Cerrar"
                />
                <Button
                    type='submit'
                    form={formId}
                    className="p-button-primary"
                    onClick={onSave}
                    icon={<i className="fas fa-save me-2"></i>}
                    label="Guardar"
                />
            </div>
        </>
    )

    return (
        <Dialog
            visible={show}
            onHide={() => onHide?.()}
            header={title}
            footer={footer}
            style={{ width: width || '50vw' }}
        >
            {children}
        </Dialog>
    );
};
