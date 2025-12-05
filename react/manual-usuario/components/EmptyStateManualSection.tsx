import React from "react";
import { Button } from "primereact/button";

export function EmptyStateManualSection({ searchTerm, setShowCategoryModal, setShowVideoModal, isCategoryEmpty = false }) {
    if (isCategoryEmpty) {
        return (
            <div className="empty-state py-4">
                <i className="fas fa-video-slash"></i>
                <h5>No hay videos en esta categoría</h5>
                <p className="text-muted">
                    Agrega el primer video tutorial para esta categoría.
                </p>
                <Button
                    label="Agregar Video"
                    className="p-button-outlined"
                    onClick={() => setShowVideoModal(true)}
                ><i className="fas fa-plus"></i></Button>
            </div>
        );
    }

    return (
        <div className="empty-state fade-in">
            <i className="fas fa-search"></i>
            <h3 className="mb-3">No se encontraron resultados</h3>
            <p className="text-muted mb-4 fs-5">
                {searchTerm ?
                    `No hay videos o categorías que coincidan con "${searchTerm}"` :
                    'Comienza creando tu primera categoría para organizar los videos tutoriales.'
                }
            </p>
            {!searchTerm && (
                <Button
                    label="Crear Primera Categoría"
                    className="p-button-success p-button-raised"
                    onClick={() => setShowCategoryModal(true)}
                ><i className="fas fa-plus"></i></Button
            )}

            <style>
                {`
     
        `}
            </style>
        </div>
    );
}