// MaintenanceHistory.jsx
import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useAssetMaintenanceHistory } from "../hooks/useAssetMaintenanceHistory";

interface TableAsset {
    id: number;
    assetName: string;
    internalCode: string;
    currentValue: number;
    status: string;
    maintenances: TableMaintenance[];
}

interface TableMaintenance {
    id: number;
    date: Date;
    maintenanceType: string;
    cost: number;
    description: string;
}

const MaintenanceHistory = () => {
    const {
        data: assets,
        loading,
        refreshMaintenanceHistory,
        dateRange,
        setDateRange,
        maintenanceType,
        setMaintenanceType,
        first,
        totalRecords,
        handlePageChange,
        perPage,
    } = useAssetMaintenanceHistory();

    const [mappedAssets, setMappedAssets] = useState<TableAsset[]>([]);
    const [expandedRows, setExpandedRows] = useState<any>(null);

    useEffect(() => {
        if (assets) {
            const mappedData = assets.map((asset) => ({
                id: asset.id,
                assetName: asset.description,
                internalCode: asset.internal_code,
                currentValue: asset.current_unit_price,
                status: asset.status,
                maintenances: asset.maintenances.map((maintenance) => ({
                    id: maintenance.id,
                    date: new Date(maintenance.created_at),
                    maintenanceType: maintenance.type,
                    cost: parseFloat(maintenance.cost.toString()),
                    description: maintenance.description,
                })),
            }));
            setMappedAssets(mappedData);
        }
    }, [assets]);

    const maintenanceTypeOptions = [
        { label: "Preventivo", value: "preventive" },
        { label: "Correctivo", value: "corrective" },
        { label: "Calibración", value: "calibration" },
        { label: "Predictivo", value: "predictive" },
    ];

    const formatCurrency = (value: number) => {
        try {
            return new Intl.NumberFormat("es-DO", {
                style: "currency",
                currency: "DOP",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value);
        } catch (error) {
            return `DOP $${value.toFixed(2)}`;
        }
    };

    const formatDate = (value: Date | string | null | undefined) => {
        if (!value) return "N/A";
        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleDateString("es-DO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getMaintenanceTypeLabel = (type: string) => {
        switch (type) {
            case "preventive":
                return "Preventivo";
            case "corrective":
                return "Correctivo";
            case "predictive":
                return "Predictivo";
            case "calibration":
                return "Calibración";
            default:
                return type;
        }
    };

    const getMaintenanceTypeSeverity = (type: string) => {
        switch (type) {
            case "preventive":
                return "info";
            case "corrective":
                return "warning";
            case "predictive":
                return "success";
            case "calibration":
                return "secondary";
            default:
                return null;
        }
    };

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case "active":
                return "success";
            case "inactive":
                return "warning";
            case "maintenance":
                return "info";
            case "disposed":
                return "danger";
            default:
                return null;
        }
    };

    const getStatusLabel = (status: string) => {
        const statusOptions = [
            { label: "Activo", value: "active" },
            { label: "Inactivo", value: "inactive" },
            { label: "En Mantenimiento", value: "maintenance" },
            { label: "Dado de Baja", value: "disposed" },
        ];
        const option = statusOptions.find((opt) => opt.value === status);
        return option ? option.label : status;
    };

    // Template para la expansión de filas (mantenimientos)
    const rowExpansionTemplate = (asset: TableAsset) => {
        return (
            <div className="p-3 bg-gray-50">
                <h5>Historial de Mantenimientos - {asset.assetName}</h5>
                <DataTable value={asset.maintenances} size="small">
                    <Column
                        field="date"
                        header="Fecha"
                        body={(rowData: TableMaintenance) =>
                            formatDate(rowData.date)
                        }
                        sortable
                    />
                    <Column
                        field="maintenanceType"
                        header="Tipo"
                        body={(rowData: TableMaintenance) => (
                            <Tag
                                value={getMaintenanceTypeLabel(
                                    rowData.maintenanceType
                                )}
                                severity={getMaintenanceTypeSeverity(
                                    rowData.maintenanceType
                                )}
                            />
                        )}
                        sortable
                    />
                    <Column
                        field="cost"
                        header="Costo"
                        body={(rowData: TableMaintenance) =>
                            formatCurrency(rowData.cost)
                        }
                        sortable
                    />
                    <Column
                        field="description"
                        header="Descripción"
                        body={(rowData: TableMaintenance) => (
                            <div className="max-w-300">
                                {rowData.description || "Sin descripción"}
                            </div>
                        )}
                    />
                </DataTable>
            </div>
        );
    };

    const clearFilters = () => {
        setDateRange(null);
        setMaintenanceType(null);
    };

    const applyFilters = () => {
        refreshMaintenanceHistory();
    };

    const handleReload = () => {
        refreshMaintenanceHistory();
    };

    const expandAll = () => {
        const expandedRowsArray: any = {};
        mappedAssets.forEach((asset) => {
            expandedRowsArray[asset.id] = true;
        });
        setExpandedRows(expandedRowsArray);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };

    const header = (
        <div className="d-flex justify-content-between align-items-center gap-2">
            <Button
                type="button"
                className="p-button-primary me-2"
                onClick={handleReload}
            >
                <i className="fas fa-sync"></i>
            </Button>
            <div className="d-flex flex-wrap gap-2">
                <Button
                    icon={<i className="fas fa-plus me-1" />}
                    label="Expandir Todos"
                    onClick={expandAll}
                />
                <Button
                    icon={<i className="fas fa-minus me-1" />}
                    label="Colapsar Todos"
                    onClick={collapseAll}
                />
            </div>
        </div>
    );

    const statusBodyTemplate = (asset: TableAsset) => {
        return (
            <Tag
                value={getStatusLabel(asset.status)}
                severity={getStatusSeverity(asset.status)}
            />
        );
    };

    const valueBodyTemplate = (asset: TableAsset) => {
        return formatCurrency(asset.currentValue);
    };

    const totalMaintenanceCostBodyTemplate = (asset: TableAsset) => {
        const totalCost = asset.maintenances.reduce(
            (sum, maintenance) => sum + maintenance.cost,
            0
        );
        return formatCurrency(totalCost);
    };

    return (
        <>
            <Accordion className="mb-3">
                <AccordionTab
                    header={
                        <div className="d-flex align-items-center">
                            <i className="fas fa-filter me-2"></i>
                            Filtros - Historial de Mantenimientos
                        </div>
                    }
                >
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">
                                Rango de Fechas
                            </label>
                            <Calendar
                                value={dateRange}
                                onChange={(e) => {
                                    setDateRange(e.value);
                                }}
                                selectionMode="range"
                                readOnlyInput
                                dateFormat="dd/mm/yy"
                                placeholder="Seleccione rango"
                                className="w-100"
                                showIcon
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">
                                Tipo de Mantenimiento
                            </label>
                            <Dropdown
                                value={maintenanceType}
                                options={maintenanceTypeOptions}
                                onChange={(e) => {
                                    setMaintenanceType(e.value);
                                }}
                                optionLabel="label"
                                placeholder="Todos los tipos de mantenimiento"
                                className="w-100"
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button
                            label="Limpiar Filtros"
                            icon="pi pi-trash"
                            className="p-button-secondary"
                            onClick={clearFilters}
                        />
                        <Button
                            label="Aplicar Filtros"
                            icon="pi pi-filter"
                            className="p-button-primary"
                            onClick={applyFilters}
                        />
                    </div>
                </AccordionTab>
            </Accordion>

            <Card title="Historial de Mantenimientos" className="mb-3">
                <DataTable
                    value={mappedAssets}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="id"
                    header={header}
                    loading={loading}
                    paginator
                    rows={perPage}
                    totalRecords={totalRecords}
                    first={first}
                    onPage={handlePageChange}
                    tableStyle={{ minWidth: "60rem" }}
                >
                    <Column expander style={{ width: "3rem" }} />
                    <Column
                        field="internalCode"
                        header="Código Interno"
                        sortable
                    />
                    <Column field="assetName" header="Activo" sortable />
                    <Column
                        field="currentValue"
                        header="Valor Actual"
                        body={valueBodyTemplate}
                        sortable
                    />
                    <Column
                        field="status"
                        header="Estado"
                        body={statusBodyTemplate}
                        sortable
                    />
                    <Column
                        field="maintenances"
                        header="Total Mantenimientos"
                        body={(asset: TableAsset) => (
                            <div className="d-flex justify-content-center">
                                <Tag
                                    value={asset.maintenances.length}
                                    severity="info"
                                />
                            </div>
                        )}
                        sortable
                    />
                    <Column
                        header="Costo Total"
                        body={totalMaintenanceCostBodyTemplate}
                        sortable
                    />
                </DataTable>
            </Card>
        </>
    );
};

export default MaintenanceHistory;
