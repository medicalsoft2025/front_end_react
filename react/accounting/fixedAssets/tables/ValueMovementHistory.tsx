// ValueMovementHistory.jsx
import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useAssetValueMovementHistory } from "../hooks/useAssetValueMovementHistory";

interface TableAsset {
    id: number;
    assetName: string;
    internalCode: string;
    currentValue: number;
    status: string;
    valueMovements: TableValueMovement[];
}

interface TableValueMovement {
    id: number;
    date: Date;
    previousValue: number;
    newValue: number;
    changeAmount: number;
    changeType: "depreciation" | "appreciation";
    changePercentage: number;
    notes?: string;
    description: string;
}

const ValueMovementHistory = () => {
    const {
        data: assets,
        loading,
        refreshValueMovements,
        dateRange,
        setDateRange,
        type,
        setType,
        first,
        totalRecords,
        handlePageChange,
        perPage,
    } = useAssetValueMovementHistory();

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
                valueMovements: asset.value_movements.map((movement) => {
                    const isDepreciation = movement.type === "depreciation";

                    // Para depreciación restamos el amount, para apreciación lo sumamos
                    const amountAdjustment = isDepreciation
                        ? -movement.amount
                        : movement.amount;

                    const previousValue = movement.previous_asset_unit_price
                        ? parseFloat(movement.previous_asset_unit_price)
                        : 0;

                    const newValue = movement.previous_asset_unit_price
                        ? previousValue + amountAdjustment
                        : asset.current_unit_price;

                    const changePercentage = movement.previous_asset_unit_price
                        ? (amountAdjustment / previousValue) * 100
                        : 0;

                    return {
                        id: movement.id,
                        date: new Date(movement.created_at),
                        previousValue: previousValue,
                        newValue: newValue,
                        changeAmount: Math.abs(movement.amount),
                        changeType: movement.type as
                            | "depreciation"
                            | "appreciation",
                        changePercentage: changePercentage,
                        notes: movement.description,
                        description: movement.description,
                    };
                }),
            }));
            setMappedAssets(mappedData);
        }
    }, [assets]);

    const changeTypeOptions = [
        { label: "Depreciación", value: "depreciation" },
        { label: "Apreciación", value: "appreciation" },
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

    const getChangeTypeSeverity = (type: string) => {
        return type === "depreciation" ? "danger" : "success";
    };

    const getChangeTypeLabel = (type: string) => {
        return type === "depreciation" ? "Depreciación" : "Apreciación";
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

    const calculatePercentageVariation = (
        previousValue: number,
        newValue: number,
        decimals: number = 2
    ): string => {
        if (previousValue === 0 || isNaN(previousValue) || isNaN(newValue)) {
            return "0.00%";
        }

        const variation = ((newValue - previousValue) / previousValue) * 100;
        const sign = variation > 0 ? "+" : "";
        const formattedVariation = variation.toFixed(decimals);

        return `${sign}${formattedVariation}%`;
    };

    // Template para la expansión de filas (movimientos de valor)
    const rowExpansionTemplate = (asset: TableAsset) => {
        return (
            <div className="p-3 bg-gray-50">
                <h5>Movimientos de Valor - {asset.assetName}</h5>
                <DataTable value={asset.valueMovements} size="small">
                    <Column
                        field="date"
                        header="Fecha"
                        body={(rowData: TableValueMovement) =>
                            formatDate(rowData.date)
                        }
                        sortable
                    />
                    <Column
                        field="previousValue"
                        header="Valor Anterior"
                        body={(rowData: TableValueMovement) =>
                            formatCurrency(rowData.previousValue)
                        }
                        sortable
                    />
                    <Column
                        field="newValue"
                        header="Nuevo Valor"
                        body={(rowData: TableValueMovement) =>
                            formatCurrency(rowData.newValue)
                        }
                        sortable
                    />
                    <Column
                        field="changeType"
                        header="Tipo"
                        body={(rowData: TableValueMovement) => (
                            <Tag
                                value={getChangeTypeLabel(rowData.changeType)}
                                severity={getChangeTypeSeverity(
                                    rowData.changeType
                                )}
                                icon={
                                    rowData.changeType === "depreciation"
                                        ? "pi pi-arrow-down"
                                        : "pi pi-arrow-up"
                                }
                            />
                        )}
                        sortable
                    />
                    <Column
                        field="changeAmount"
                        header="Monto Cambio"
                        body={(rowData: TableValueMovement) =>
                            formatCurrency(rowData.changeAmount)
                        }
                        sortable
                    />
                    <Column
                        field="changePercentage"
                        header="Variación %"
                        body={(rowData: TableValueMovement) => {
                            const isDepreciation =
                                rowData.changeType === "depreciation";
                            const color = isDepreciation
                                ? "text-red-500"
                                : "text-green-500";
                            return (
                                <span className={color}>
                                    {calculatePercentageVariation(
                                        rowData.previousValue,
                                        rowData.newValue,
                                        2
                                    )}
                                </span>
                            );
                        }}
                        sortable
                    />
                    <Column field="description" header="Descripción" />
                </DataTable>
            </div>
        );
    };

    const clearFilters = () => {
        setDateRange(null);
        setType(null);
    };

    const applyFilters = () => {
        refreshValueMovements();
    };

    const handleReload = () => {
        refreshValueMovements();
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

    return (
        <>
            <Accordion className="mb-3">
                <AccordionTab
                    header={
                        <div className="d-flex align-items-center">
                            <i className="fas fa-filter me-2"></i>
                            Filtros - Historial de Activos
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
                            <label className="form-label">Tipo de Cambio</label>
                            <Dropdown
                                value={type}
                                options={changeTypeOptions}
                                onChange={(e) => {
                                    setType(e.value);
                                }}
                                optionLabel="label"
                                placeholder="Todos los tipos de cambio"
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

            <Card
                title="Historial Detallado de Movimientos de Valor"
                className="mb-3"
            >
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
                        field="valueMovements"
                        header="Movimientos"
                        body={(asset: TableAsset) => (
                            <>
                                <div className="d-flex justify-content-center">
                                    <Tag
                                        value={asset.valueMovements.length}
                                        severity="info"
                                    />
                                </div>
                            </>
                        )}
                        sortable
                    />
                </DataTable>
            </Card>
        </>
    );
};

export default ValueMovementHistory;
