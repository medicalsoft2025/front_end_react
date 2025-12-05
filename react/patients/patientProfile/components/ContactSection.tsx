import { Button } from 'primereact/button';
import React from 'react';

const ContactSection = ({ patient }) => {
    if (!patient) return null;

    return (
        <div className="contact-section">
            <h3 className="section-title">
                <i className="fas fa-atlas me-2"></i>
                Información de Contacto
                <div className='d-flex'>
                    <Button
                        className="p-button-primary"
                        style={{ width: "100%", marginLeft: "10px", fontSize: "10px", marginTop: "10px" }}
                    ><i className='fas fa-edit'></i></Button>
                </div>
            </h3>

            <div className="contact-details-grid">
                <ContactDetailItem
                    icon="fas fa-map-marker-alt"
                    label="Dirección:"
                    value={patient.address || "No disponible"}
                />

                <ContactDetailItem
                    icon="fas fa-phone"
                    label="Teléfono:"
                    value={patient.full_phone || patient.whatsapp || "No disponible"}
                />

                <ContactDetailItem
                    icon="fas fa-envelope"
                    label="Correo:"
                    value={patient.email || "No disponible"}
                />

                <ContactDetailItem
                    icon="fas fa-globe-americas"
                    label="Ciudad:"
                    value={patient.city_id || "No especificada"}
                />

            </div>
        </div>
    );
};

const ContactDetailItem = ({ icon, label, value }) => (
    <div className="contact-detail-item">
        <div className="contact-detail-label">
            <i className={`${icon} me-2`}></i>
            {label}
        </div>
        <div className="contact-detail-value">{value}</div>
    </div>
);

const InsuranceBadge = ({ entityName }) => (
    <div className="insurance-section">
        <div className="insurance-badge">
            <i className="pi pi-id-card me-2"></i>
            {entityName || "Particular"}
        </div>
    </div>
);

export default ContactSection;