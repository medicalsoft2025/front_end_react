import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export function StickyHeaderManualSection({
    isScrolled,
    searchTerm,
    setSearchTerm,
    setShowCategoryModal,
    setShowVideoModal
}) {
    return (
        <div className={`sticky-header px-4 fade-in ${isScrolled ? 'active' : ''}`}>
            <div className="row align-items-center">
                <div className="col-lg-6 mb-3 mb-lg-0">
                    <div className="search-container">
                        <i className="fas fa-search search-icon"></i>
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar videos o categorías..."
                            className="w-100 ps-5"
                            style={{ height: '48px', borderRadius: '25px', fontSize: '1rem' }}
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="d-flex gap-3 justify-content-lg-end justify-content-start flex-wrap">
                        <Button
                            label="Nueva Categoría"
                            className="p-button-success p-button-raised"
                            onClick={() => setShowCategoryModal(true)}
                        />
                        <Button
                            label="Agregar Video"
                            className="p-button-info p-button-raised"
                            onClick={() => setShowVideoModal(true)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}