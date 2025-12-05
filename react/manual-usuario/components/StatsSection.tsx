import React from "react";
import { Divider } from "primereact/divider";

export function StatsSection({ categories, totalVideos, totalMinutes }) {
    return (
        <>
            <div className="row mb-5 fade-in">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="stats-card">
                        <i className="fas fa-layer-group stats-icon text-primary"></i>
                        <h3 className="fw-bold text-primary mb-2">{categories.length}</h3>
                        <p className="text-muted mb-0">Categorías Organizadas</p>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="stats-card">
                        <i className="fas fa-video stats-icon text-success"></i>
                        <h3 className="fw-bold text-success mb-2">{totalVideos}</h3>
                        <p className="text-muted mb-0">Videos Tutoriales</p>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="stats-card">
                        <i className="fas fa-clock stats-icon text-info"></i>
                        <h3 className="fw-bold text-info mb-2">{totalMinutes}+</h3>
                        <p className="text-muted mb-0">Minutos de Contenido</p>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="stats-card">
                        <i className="fas fa-users stats-icon text-warning"></i>
                        <h3 className="fw-bold text-warning mb-2">{categories.length * 3}+</h3>
                        <p className="text-muted mb-0">Módulos Disponibles</p>
                    </div>
                </div>
            </div>

            <Divider />

        
        </>
    );
}