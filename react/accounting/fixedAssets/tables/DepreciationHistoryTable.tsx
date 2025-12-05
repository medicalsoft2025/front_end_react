// DepreciationHistoryTable.jsx
import React, { useState } from "react";
import ValueMovementHistory from "./ValueMovementHistory";
import MaintenanceHistory from "./MaintenanceHistory";

export const DepreciationHistoryTable = () => {
    const [activeTab, setActiveTab] = useState<string>("detailed");

    return (
        <main className="main" id="top">
            <div className="tabs-professional-container">
                <div className="tabs-header">
                    <button
                        className={`tab-item ${
                            activeTab === "detailed" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("detailed")}
                    >
                        <i className="fas fa-history"></i>
                        Historial Detallado
                    </button>

                    <button
                        className={`tab-item ${
                            activeTab === "maintenance" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("maintenance")}
                    >
                        <i className="fas fa-wrench"></i>
                        Historial Mantenimiento
                    </button>
                </div>

                <div className="tabs-content">
                    <div
                        className={`tab-panel ${
                            activeTab === "detailed" ? "active" : ""
                        }`}
                    >
                        <ValueMovementHistory />
                    </div>
                    <div
                        className={`tab-panel ${
                            activeTab === "maintenance" ? "active" : ""
                        }`}
                    >
                        <MaintenanceHistory />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DepreciationHistoryTable;
