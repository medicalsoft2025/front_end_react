import React from 'react';
import { bloodTypeMap, getAvatarUrl } from '../utils/utilsPatient';

const PatientHeader = ({ patient }) => {
    if (!patient) return null;

    return (
        <div className="profile-header">
            <div className="avatar-section">
                <img
                    className="patient-avatar"
                    src={getAvatarUrl(patient.minio_url)}
                    alt={`Avatar de ${patient.full_name}`}
                    onError={(e) => {
                        e.target.src = "../assets/img/profile/profile_default.jpg";
                    }}
                />
            </div>

            <div className="profile-info">
                <h2 className="patient-name">{patient.full_name}</h2>
                <div className="contact-info-grid">
                    <ContactItem
                        icon="fas fa-mobile-alt"
                        value={patient.full_phone || patient.whatsapp || "No disponible"}
                    />
                    <ContactItem
                        icon="fas fa-tint blood-type"
                        value={bloodTypeMap[patient.blood_type] || "No especificado"}
                    />
                    <ContactItem
                        icon="fas fa-id-card"
                        value={patient.document_number || "No disponible"}
                    />
                    <ContactItem
                        icon="fas fa-envelope"
                        value={patient.email || "No disponible"}
                    />
                </div>
            </div>
        </div>
    );
};

const ContactItem = ({ icon, value }) => (
    <div className="contact-item">
        <i className={`contact-icon ${icon}`}></i>
        <span className="contact-value">{value}</span>
    </div>
);

export default PatientHeader;