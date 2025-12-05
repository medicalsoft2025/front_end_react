import React, { useState, useRef } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useNotasEnfermeria } from './hooks/useNotasEnfermeria';
import { useFiltrosNotas } from './hooks/useFiltrosNotas';
import FiltrosNotas from './components/FiltrosNotas';
import ModalNuevaNota from './modal/ModalNuevaNota';
import NotasCards from './components/AcordeonNotas';

interface NotasEnfermeriaProps {
    patientId?: string;
}

const NursingNotes: React.FC<NotasEnfermeriaProps> = ({ patientId }) => {
    const toast = useRef<Toast>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [guardando, setGuardando] = useState(false);

    const {
        notas,
        patient,
        loading,
        error,
        enfermeras,
        reload,
        agregarNota,
        eliminarNota,
        editarNota
    } = useNotasEnfermeria(patientId);

    const { filtros, notasFiltradas, aplicarFiltros } = useFiltrosNotas(notas);

    const handleGuardarNota = async (nuevaNota: any) => {
        setGuardando(true);
        try {
            if (currentNote) {
                await editarNota(currentNote.id, nuevaNota);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Nota actualizada correctamente',
                    life: 3000
                });
            } else {
                await agregarNota(nuevaNota); 
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Nota guardada correctamente',
                    life: 3000
                });
            }

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
        } finally {
            setGuardando(false);
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
            await eliminarNota(id);
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

    const styles = {
        container: {
            minHeight: '100vh'
        },
        contentCard: {
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden' as const
        },
        headerGradient: {
            background: 'linear-gradient(90deg, #1A99FB, #29F6C1)',
            color: 'white',
            padding: '2rem'
        },
        statsCard: {
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }
    };

    const leftToolbarTemplate = () => (
        <div className="d-flex align-items-center gap-3">
            <div>
                <h2 className="text-white mb-1 fw-bold">Notas de Enfermería</h2>
                <p className="text-white mb-0">
                    {patient
                        ? `Paciente: ${patient.first_name} ${patient.last_name}`
                        : 'Gestión de notas médicas'
                    }
                </p>
            </div>
        </div>
    );

    const rightToolbarTemplate = () => (
        <div className="d-flex align-items-center gap-3">
            {notas.length > 0 && (
                <div style={styles.statsCard} className="text-center">
                    <div className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>
                        {notas.length}
                    </div>
                    <small className="text-muted">
                        {notas.length === 1 ? 'NOTA' : 'NOTAS'}
                    </small>
                </div>
            )}
            <Button
                label="Nueva Nota"
                onClick={() => {
                    setCurrentNote(null);
                    setModalVisible(true);
                }}
                className="p-button-primary"
                disabled={loading}
            >
                <i className="fas fa-plus" style={{ marginLeft: "5px" }}></i>
            </Button>
        </div>
    );

    if (!patientId) {
        return (
            <div style={styles.container} className="d-flex align-items-center justify-content-center">
                <Card style={{ ...styles.contentCard, maxWidth: '500px' }}>
                    <div className="text-center p-5">
                        <div
                            className="mx-auto mb-4"
                            style={{
                                width: '100px',
                                height: '100px',
                                background: 'linear-gradient(135deg, var(--primary-color) 0%, #4585d8 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <i className="pi pi-user text-white" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h3 className="text-muted mb-3">Paciente no seleccionado</h3>
                        <p className="text-muted mb-4">
                            Seleccione un paciente desde la lista para gestionar sus notas de enfermería.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div style={styles.container} className="d-flex align-items-center justify-content-center">
                <Card style={{ ...styles.contentCard, maxWidth: '500px' }}>
                    <div className="text-center p-5">
                        <i className="pi pi-spin pi-spinner text-primary" style={{ fontSize: '3rem' }}></i>
                        <h3 className="text-muted mt-4 mb-3">Cargando notas</h3>
                        <p className="text-muted mb-0">Estamos recuperando la información del paciente...</p>
                    </div>
                </Card>
            </div>
        );
    }

    // Manejo de errores
    if (error) {
        return (
            <div style={styles.container} className="d-flex align-items-center justify-content-center">
                <Card style={{ ...styles.contentCard, maxWidth: '500px' }}>
                    <div className="text-center p-5">
                        <div
                            className="mx-auto mb-4"
                            style={{
                                width: '100px',
                                height: '100px',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <i className="pi pi-exclamation-triangle text-white" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h3 className="text-danger mb-3">Error al cargar</h3>
                        <p className="text-muted mb-4">{error}</p>
                        <Button
                            label="Reintentar"
                            icon="pi pi-refresh"
                            onClick={reload}
                            className="p-button-outlined p-button-danger"
                        />
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <PrimeReactProvider>
            <Toast ref={toast} />

            <div style={styles.container}>
                <div className="container-fluid py-4">
                    {/* Header con gradiente */}
                    <Card className="mb-4 border-0" style={styles.headerGradient}>
                        <Toolbar
                            left={leftToolbarTemplate}
                            right={rightToolbarTemplate}
                            className="border-0 bg-transparent"
                        />
                    </Card>
                    <Card className="border-0" style={styles.contentCard}>
                        <div className="p-4">
                            <FiltrosNotas
                                filtros={filtros}
                                onFiltrosChange={aplicarFiltros}
                                enfermeras={enfermeras}
                            />
                            <NotasCards
                                notas={notasFiltradas}
                                loading={loading}
                                onEdit={handleEditarNota}
                                onDelete={handleEliminarNota}
                            />
                        </div>
                    </Card>

                    {/* Modal para nueva/editar nota */}
                    <ModalNuevaNota
                        visible={modalVisible}
                        onHide={() => {
                            setModalVisible(false);
                            setCurrentNote(null);
                        }}
                        onGuardarNota={handleGuardarNota}
                        initialData={currentNote}
                        loading={guardando}
                        enfermeras={enfermeras}
                    />
                </div>
            </div>
        </PrimeReactProvider>
    );
};

export default NursingNotes;