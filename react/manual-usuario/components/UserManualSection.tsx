import React from "react";

export function UserManualSection({ totalVideos, totalMinutes, categoriesCount }) {
    return (
        <div className="hero-section">
            <div className="row align-items-center">
                <div className="col-lg-8">
                    <h1 className="display-4 fw-bold mb-3 slide-in-left">
                        Manual de Usuario MedicalSoft
                        <i className="fas fa-book-medical me-3" style={{ fontSize: "30px", marginLeft: "15px" }}></i>
                    </h1>
                    <p className="lead mb-4 fs-8">
                        Domina todas las funcionalidades del sistema con nuestra completa
                        documentación en video paso a paso y guías interactivas.
                    </p>
                    <div className="d-flex flex-wrap gap-3 justify-content-center">
                        <span className="badge bg-light text-dark fs-6 p-3">
                            <i className="fas fa-star me-2 text-warning"></i>
                            Tutoriales Actualizados
                        </span>
                        <span className="badge bg-light text-dark fs-6 p-3">
                            <i className="fas fa-clock me-2 text-info"></i>
                            +{totalMinutes} Minutos
                        </span>
                        <span className="badge bg-light text-dark fs-6 p-3">
                            <i className="fas fa-video me-2 text-success"></i>
                            {totalVideos} Videos
                        </span>
                    </div>
                </div>
                <div className="col-lg-4 text-center mt-4 mt-lg-0">
                    <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center pulse-animation"
                        style={{ width: '140px', height: '140px', background: 'rgba(255,255,255,0.2)' }}>
                        <i className="fas fa-play-circle" style={{ fontSize: '3.5rem', color: 'white' }}></i>
                    </div>
                </div>
            </div>
        </div>
    );
}