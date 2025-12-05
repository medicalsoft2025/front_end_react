// components/PatientProfileCard/MedicalSection.jsx
import React from 'react';
import { Button } from 'primereact/button';
import { formatDate, getLastAppointment } from '../utils/utilsPatient';

const MedicalSection = ({ patient, onShowMedicalDetails }) => {
    if (!patient) return null;

    const lastAppointment = getLastAppointment(patient.appointments);

    return (
        <div className="medical-section">
            <div className="section-header">
                <h3 className="section-title">
                    <i className="fas fa-heartbeat me-2"></i>
                    <span style={{ width: "100%" }}>Antecedentes Médicos</span>
                    <Button
                        className="p-button-primary"
                        style={{ width: "auto", fontSize: "10px", marginTop: "10px" }}
                        onClick={onShowMedicalDetails}
                    ><i className='fas fa-eye' ></i></Button>
                </h3>

            </div>

            <div className="medical-info-grid">
                <MedicalItem
                    icon="fas fa-calendar-alt"
                    label="Última consulta:"
                    value={lastAppointment ? formatDate(lastAppointment.appointment_date) : "No disponible"}
                />

                <MedicalItem
                    icon="fas fa-shield-alt"
                    label="Alergias:"
                    value={patient.has_allergies ? patient.allergies : "Ninguna registrada"}
                />

                <MedicalItem
                    icon="fas fa-briefcase-medical"
                    label="Enfermedades:"
                    value={patient.has_special_condition ? patient.special_condition : "Ninguna registrada"}
                />


            </div>
        </div>
    );
};

const MedicalItem = ({ icon, label, value }) => (
    <div className="medical-item">
        <div className="medical-label">
            <i className={`${icon} me-2`}></i>
            {label}
        </div>
        <div className="medical-value">{value}</div>
    </div>
);

export default MedicalSection;