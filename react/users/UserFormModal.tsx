import React from 'react';
import UserForm, { UserFormConfig, UserFormInputs } from './UserForm';
import { CustomFormModal } from '../components/CustomFormModal';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface UserFormModalProps {
    title: string;
    show: boolean;
    handleSubmit: (data: UserFormInputs) => void;
    initialData?: UserFormInputs;
    config?: UserFormConfig;
    onHide?: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ title, show, handleSubmit, onHide, initialData, config }) => {

    const formId = 'createDoctor'

    const footer = (
        <>
            <div className="d-flex gap-2 align-items-center">
                <Button
                    className="p-button-secondary"
                    aria-label="Close"
                    icon={<i className="fas fa-times"></i>}
                    label="Cerrar"
                    onClick={onHide}
                />
                <Button
                    type='submit'
                    form={formId}
                    className="p-button-primary"
                    icon={<i className="fas fa-save"></i>}
                    label="Guardar"
                />
            </div>
        </>
    )
    return (
        <Dialog
            visible={show}
            onHide={() => { onHide?.() }}
            header={title}
            footer={footer}
            style={{ width: "80vw", height: "100%", maxHeight: "90%" }}
        >
            <UserForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
                config={config}
            ></UserForm>
        </Dialog>
    );
};

export default UserFormModal;
