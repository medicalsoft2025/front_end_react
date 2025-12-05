import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { SwalManager } from '../../../../services/alertManagerImported';

interface Enfermera {
    id: string;
    nombre: string;
    value: string;
}

interface NotaData {
    tituloNota: string;
    user_id: string;
    note: string;
}

interface ModalNuevaNotaProps {
    visible: boolean;
    onHide: () => void;
    onGuardarNota: (data: NotaData) => Promise<void>;
    enfermeras: Enfermera[];
    loading?: boolean;
    initialData?: NotaData & { id?: string };
}

const PatientsNursingNotesModal: React.FC<ModalNuevaNotaProps> = ({
    visible,
    onHide,
    onGuardarNota,
    enfermeras,
    loading = false,
    initialData
}) => {
    const [nuevaNota, setNuevaNota] = useState<NotaData>({
        tituloNota: '',
        user_id: '',
        note: ''
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setNuevaNota({
                tituloNota: initialData.tituloNota || '',
                user_id: initialData.user_id || '',
                note: initialData.note || ''
            });
        } else {
            setNuevaNota({
                tituloNota: '',
                user_id: '',
                note: ''
            });
        }
    }, [initialData, visible]);

    const opcionesEnfermeras = enfermeras.map(enfermera => ({
        label: enfermera.nombre,
        value: enfermera.id
    }));

    const handleInputChange = (field: keyof NotaData, value: string) => {
        setNuevaNota(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGuardar = async () => {
        if (!nuevaNota.tituloNota || !nuevaNota.user_id || !nuevaNota.note) {
            SwalManager.error('Por favor complete todos los campos obligatorios');
            return;
        }

        setSubmitting(true);
        try {
            await onGuardarNota(nuevaNota);
            setNuevaNota({ tituloNota: '', user_id: '', note: '' });
            onHide();
        } catch (error) {
            console.error('Error guardando nota:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelar = () => {
        setNuevaNota({ tituloNota: '', user_id: '', note: '' });
        onHide();
    };

    const footer = (
        <div className="d-flex gap-3 justify-content-end">
            <Button
                label="Cancelar"
                onClick={handleCancelar}
                className="p-button-secondary"
                disabled={submitting}
            > <i className="fas fa-times" style={{ marginLeft: "10px" }}></i> </Button>
            <Button
                label={initialData ? "Actualizar Nota" : "Guardar Nota"}
                onClick={handleGuardar}
                loading={submitting}
                disabled={!nuevaNota.tituloNota || !nuevaNota.user_id || !nuevaNota.note || submitting}
            ><i className='fas fa-check' style={{ marginLeft: "10px" }}></i></Button>
        </div>
    );
    return (
        <Dialog
            header={initialData ? "Editar Nota de Enfermería" : "Nueva Nota de Enfermería"}
            visible={visible}
            style={{ width: '50vw' }}
            footer={footer}
            onHide={handleCancelar}
            closable={!submitting}
        >
            <div className="grid p-fluid">
                <div className="col-12">
                    <label htmlFor="tituloNota" className="block text-sm font-medium mb-2">
                        Título *
                    </label>
                    <InputText
                        id="tituloNota"
                        value={nuevaNota.tituloNota}
                        onChange={(e) => handleInputChange('tituloNota', e.target.value)}
                        placeholder="Ingrese el título de la nota"
                        className="w-full"
                        disabled={submitting}
                    />
                </div>

                <div className="col-12">
                    <label htmlFor="user_id" className="block text-sm font-medium mb-2">
                        Enfermera *
                    </label>
                    <Dropdown
                        id="user_id"
                        value={nuevaNota.user_id}
                        options={opcionesEnfermeras}
                        onChange={(e) => handleInputChange('user_id', e.value)}
                        placeholder="Seleccione una enfermera"
                        className="w-full"
                        disabled={submitting || loading}
                    />
                </div>

                <div className="col-12">
                    <label htmlFor="note" className="block text-sm font-medium mb-2">
                        Nota *
                    </label>
                    <InputTextarea
                        id="note"
                        value={nuevaNota.note}
                        onChange={(e) => handleInputChange('note', e.target.value)}
                        rows={4}
                        placeholder="Escriba la nota aquí"
                        className="w-full"
                        disabled={submitting}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default PatientsNursingNotesModal;