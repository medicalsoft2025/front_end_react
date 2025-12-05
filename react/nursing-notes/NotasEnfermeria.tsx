// src/components/NotasEnfermeria/NotasEnfermeria.tsx
import React, { useState, useRef, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { useNotasEnfermeria } from './hooks/useNotasEnfermeria';
import { useFiltrosNotas } from './hooks/useFiltrosNotas';
import FiltrosNotas from './components/FiltrosNotas';
import AcordeonNotas from './components/AcordeonNotas';
import ModalNuevaNota from './modal/ModalNuevaNota';
import PatientBreadcrumb from '../config/asignar-consentimiento/components/PatientBreadcrumb';


interface NotasEnfermeriaProps {
    patientId?: string;
}

const NotasEnfermeria: React.FC<NotasEnfermeriaProps> = ({ patientId }) => {
    const toast = useRef<Toast>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);

    const {
        notas,
        patient,
        loading,
        error,
        enfermeras,
        reload,
        setPatientId: updatePatientId,
        agregarNota
    } = useNotasEnfermeria(patientId || '');

    const { filtros, notasFiltradas, aplicarFiltros } = useFiltrosNotas(notas);

    useEffect(() => {
        if (patientId) {
            updatePatientId(patientId);
        }
    }, [patientId, updatePatientId]);

    const handleGuardarNota = async (nuevaNota: any) => {
        try {
            agregarNota({
                id: Date.now().toString(),
                ...nuevaNota,
                created_at: new Date().toISOString(),
                user_id: nuevaNota.user_id
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Nota guardada correctamente',
                life: 3000
            });

            setModalVisible(false);
            setCurrentNote(null);
        } catch (error) {
            console.error('Error al guardar nota:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al guardar la nota',
                life: 3000
            });
            throw error;
        }
    };

    const handleEditarNota = (id: string) => {
        const noteToEdit = notas.find((note) => note.id === id);
        if (noteToEdit) {
            setCurrentNote(noteToEdit);
            setModalVisible(true);
        }
    };

    const handleEliminarNota = async (id: string) => {
        try {
            // Aquí necesitarías agregar la función deleteNursingNote a tu hook
            // Por ahora solo eliminamos del estado local
            // await deleteNursingNote(id);

            toast.current?.show({
                severity: 'success',
                summary: 'Eliminado',
                detail: 'Nota eliminada correctamente',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar la nota',
                life: 3000
            });
        }
    };

    // Manejo de errores
    if (error) {
        return (
            <div className="content">
                <div className="container-small">
                    <div className="alert alert-danger">
                        <strong>Error:</strong> {error}
                        <button
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={reload}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PrimeReactProvider
            value={{
                appendTo: typeof window !== "undefined" ? document.body : undefined,
                zIndex: {
                    overlay: 100000,
                    modal: 110000,
                },
            }}
        >
            <div className="componete">
                <div className="content">
                    <div className="container-small">
                        <PatientBreadcrumb
                            patient={patient}
                            loading={loading && !patient}
                        />

                        <Toast ref={toast} />

                        <div className="pb-9">
                            <div className="grid">
                                <div className="col-12">
                                    <div className="flex justify-content-between align-items-center mb-4">
                                        <h2 className="m-0 text-900">
                                            {loading && !patient ? (
                                                <span>Cargando paciente...</span>
                                            ) : patient ? (
                                                `Notas de Enfermería - ${patient.first_name} ${patient.last_name}`
                                            ) : (
                                                'Notas de Enfermería'
                                            )}
                                        </h2>
                                        <Button
                                            label="Agregar Nueva Nota"
                                            icon="pi pi-plus"
                                            onClick={() => {
                                                setCurrentNote(null);
                                                setModalVisible(true);
                                            }}
                                            className="p-button-primary"
                                            disabled={!patient || loading}
                                        >
                                            <i className="fas fa-plus" style={{ marginLeft: "5px" }}></i>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid p-5 gap-4">
                                <div className="col-12 md:col-8">
                                    <Card>
                                        <TabView>
                                            <TabPanel
                                                header={
                                                    <span className="flex align-items-center gap-2">
                                                        <i className="pi pi-notes"></i>
                                                        Notas de Enfermería
                                                    </span>
                                                }
                                            >
                                                <FiltrosNotas
                                                    filtros={filtros}
                                                    onFiltrosChange={aplicarFiltros}
                                                    enfermeras={enfermeras}
                                                />

                                                <AcordeonNotas
                                                    notas={notasFiltradas}
                                                    loading={loading}
                                                    onEdit={handleEditarNota}
                                                    onDelete={handleEliminarNota}
                                                />
                                            </TabPanel>
                                        </TabView>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        <ModalNuevaNota
                            visible={modalVisible}
                            onHide={() => {
                                setModalVisible(false);
                                setCurrentNote(null);
                            }}
                            onGuardarNota={handleGuardarNota}
                            initialData={currentNote}
                            loading={loading}
                            patient={patient}
                            enfermeras={enfermeras}
                        />
                    </div>
                </div>
            </div>
        </PrimeReactProvider>
    );
};

export default NotasEnfermeria;