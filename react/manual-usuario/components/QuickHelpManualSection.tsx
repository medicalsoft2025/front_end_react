import React from "react";

export function QuickHelpManualSection() {
    return (
        <div className="mt-5 p-4 bg-light rounded fade-in">
            <h5 className="fw-bold mb-4">
                <i className="fas fa-question-circle text-primary me-2"></i>
                ¿Necesitas ayuda adicional?
            </h5>
            <div className="row">
                <div className="col-xl-4 col-md-6 mb-3">
                    <div className="d-flex align-items-center p-3 bg-white rounded shadow-sm h-100">
                        <i className="fas fa-headset text-primary me-3" style={{ fontSize: '2rem' }}></i>
                        <div>
                            <h6 className="mb-1 fw-bold">Soporte Técnico</h6>
                            <small className="text-muted">Equipo especializado 24/7</small>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-md-6 mb-3">
                    <div className="d-flex align-items-center p-3 bg-white rounded shadow-sm h-100">
                        <i className="fas fa-envelope text-primary me-3" style={{ fontSize: '2rem' }}></i>
                        <div>
                            <h6 className="mb-1 fw-bold">Email de Soporte</h6>
                            <small className="text-muted">soporte@medicalsoft.com</small>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-md-6 mb-3">
                    <div className="d-flex align-items-center p-3 bg-white rounded shadow-sm h-100">
                        <i className="fas fa-phone text-primary me-3" style={{ fontSize: '2rem' }}></i>
                        <div>
                            <h6 className="mb-1 fw-bold">Teléfono</h6>
                            <small className="text-muted">+1 (555) 123-4567</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}