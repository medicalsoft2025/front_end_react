import React from 'react';
import { Dialog } from 'primereact/dialog';
import { formatDate, bloodTypeMap } from '../utils/utilsPatient';

const MedicalHistoryModal = ({ visible, onHide, patient }) => {
    if (!patient) return null;

    return (
        <Dialog
            header="Historial Médico Completo"
            visible={visible}
            style={{ width: '90vw', maxWidth: '600px' }}
            onHide={onHide}
            className="patient-modal"
        >
            <MedicalHistoryContent patient={patient} />
        </Dialog>
    );
};

const MedicalHistoryContent = ({ patient }) => (
    <div className="medical-history-modal">
        <InfoSection
            title="Información Personal"
            icon="pi pi-user"
            items={[
                { label: 'Fecha de Nacimiento:', value: `${formatDate(patient.date_of_birth)} (${patient.age} años)` },
                { label: 'Género:', value: patient.gender === 'MALE' ? 'Masculino' : 'Femenino' },
                { label: 'Estado Civil:', value: patient.civil_status || "No especificado" },
                { label: 'Tipo de Sangre:', value: bloodTypeMap[patient.blood_type] || "No especificado" }
            ]}
        />

        <InfoSection
            title="Seguridad Social"
            icon="pi pi-shield"
            items={[
                { label: 'Entidad:', value: patient.social_security?.entity?.name || "Particular" },
                { label: 'Tipo de Afiliación:', value: patient.social_security?.affiliate_type || "No especificado" }
            ]}
        />

        <InfoSection
            title="Ubicación"
            icon="pi pi-map-marker"
            items={[
                { label: 'Departamento:', value: patient.department_id || "No especificado" },
                { label: 'País:', value: patient.country_id || "No especificado" },
                { label: 'Nacionalidad:', value: patient.nationality || "No especificado" }
            ]}
        />

        <InfoSection
            title="Notificaciones"
            icon="pi pi-bell"
            items={[
                { label: 'WhatsApp:', value: patient.whatsapp_notifications ? 'Activas' : 'Inactivas' },
                { label: 'Email:', value: patient.email_notifications ? 'Activas' : 'Inactivas' }
            ]}
        />
    </div>
);

const InfoSection = ({ title, icon, items }) => (
    <div className="info-section">
        <h5 className="section-title mb-3">
            <i className={`${icon} me-2`}></i>
            {title}
        </h5>
        <div className="info-grid">
            {items.map((item, index) => (
                <InfoItem key={index} label={item.label} value={item.value} />
            ))}
        </div>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="info-item">
        <label>{label}</label>
        <span>{value}</span>
    </div>
);

export default MedicalHistoryModal;