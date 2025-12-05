import React, { useState, useEffect } from 'react';
import { usePatientInfo } from '../hooks/usePatientInfoProfile';
import { updateBreadcrumbAndLinks } from '../utils/utilsPatient';
import PatientHeader from './PatientHeader';
import MedicalSection from './MedicalSection';
import ContactSection from './ContactSection';
import PatientProfileSkeleton from '../components/skeleton/PatientProfileSkeleton';
import MedicalHistoryModal from './MedicalHistoryModal';
import PatientNotesImportant from './PatientNotesImportant';

export const PatientProfileCard = () => {
    const patientId = new URLSearchParams(window.location.search).get("id") ||
        new URLSearchParams(window.location.search).get("patient_id");

    const { patientData, loading, error } = usePatientInfo(patientId);
    const [showMedicalModal, setShowMedicalModal] = useState(false);

    useEffect(() => {
        if (patientData) {
            updateBreadcrumbAndLinks(patientData);
        }
    }, [patientData]);

    if (error) {
        return <ErrorState error={error} />;
    }

    if (loading) {
        return <PatientProfileSkeleton />;
    }

    return (
        <div className="patient-profile-wrapper">
            <div className="patient-profile-card">
                <div className="card-body">
                    <PatientHeader patient={patientData} />

                    <div className="profile-divider my-4"></div>

                    <div className="row">
                        {/* Columna izquierda - Sección Médica */}
                        <div className="col-lg-6 col-md-6 mb-3 mb-md-0">
                            <MedicalSection
                                patient={patientData}
                                onShowMedicalDetails={() => setShowMedicalModal(true)}
                            />
                        </div>

                        {/* Columna derecha - Sección de Contacto */}
                        <div className="col-lg-6 col-md-6">
                            <ContactSection patient={patientData} />
                        </div>
                        <div className="col-lg-12 col-md-12">
                            <PatientNotesImportant patient={patientData} />
                        </div>
                    </div>
                </div>
            </div>

            <MedicalHistoryModal
                visible={showMedicalModal}
                onHide={() => setShowMedicalModal(false)}
                patient={patientData}
            />
        </div>
    );
};

const ErrorState = ({ error }) => (
    <div className="patient-profile-card error-state">
        <div className="card-body text-center py-5">
            <i className="pi pi-exclamation-triangle text-muted mb-3" style={{ fontSize: '3rem' }}></i>
            <h5 className="text-muted mb-2">Error al cargar el perfil</h5>
            <p className="text-muted">{error}</p>
            <button
                className="p-button p-button-secondary p-button-sm mt-2"
                onClick={() => window.location.reload()}
            >
                Reintentar
            </button>
        </div>
    </div>
);