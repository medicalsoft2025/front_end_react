import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

const ModalNuevaNota = ({ visible, onHide, onGuardarNota, enfermeras, loading, initialData }) => {
    const [nuevaNota, setNuevaNota] = useState({
        tituloNota: '',
        user_id: '',
        note: ''
    });

    const [submitting, setSubmitting] = useState(false);

    // Efecto para cargar datos iniciales cuando se edita
    useEffect(() => {
        if (initialData) {
            setNuevaNota({
                tituloNota: initialData.tituloNota || initialData.titulo || '',
                user_id: initialData.user_id || '',
                note: initialData.nota || initialData.note || ''
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
        label: enfermera.nombre || `Enfermera ${enfermera.id}`,
        value: enfermera.id.toString()
    }));

    const handleInputChange = (field, value) => {
        setNuevaNota(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGuardar = async () => {
        if (!nuevaNota.tituloNota || !nuevaNota.user_id || !nuevaNota.note) {
            return;
        }
        setSubmitting(true);
        try {
            const datosParaGuardar = {
                tituloNota: nuevaNota.tituloNota,
                user_id: nuevaNota.user_id,
                note: nuevaNota.note,
                guardarNota: "" 
            };

            await onGuardarNota(datosParaGuardar);
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
        <div>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={handleCancelar}
                className="p-button-text"
                disabled={submitting}
            />
            <Button
                label={initialData ? "Actualizar Nota" : "Guardar Nota"}
                icon="pi pi-check"
                onClick={handleGuardar}
                loading={submitting}
                disabled={!nuevaNota.tituloNota || !nuevaNota.user_id || !nuevaNota.note}
            />
        </div>
    );

    return (
        <Dialog
            header={initialData ? "Editar Nota" : "Nueva Nota"}
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
                        placeholder="Seleccione una opción"
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

export default ModalNuevaNota;