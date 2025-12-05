import React from "react";

export function FooterManualSection() {
    return (
        <div className="mt-5 text-center text-muted fade-in">
            <p className="mb-2">
                <i className="fas fa-sync-alt me-2"></i>
                Actualizado por última vez: {new Date().toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </p>
            <small className="text-muted">
                MedicalSoft v1.0 • Manual de Usuario Interactivo
            </small>
        </div>
    );
}