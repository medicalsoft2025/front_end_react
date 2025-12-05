import React, { ReactNode, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { useDebounce } from 'primereact/hooks';
import { DisabilityTableProps } from "../enums/table-types";
import { CustomPRTable } from "../../components/CustomPRTable";

const DisabilityTable: React.FC<DisabilityTableProps> = ({
    data,
    columns,
    lazy = false,
    first = 0,
    rows = 5,
    totalRecords = 0,
    sortField,
    sortOrder,
    selectionActive,
    globalFilterFields,
    customFilters,
    disableSearch,
    onSelectedRow,
    onReload,
    onExport,
    onSearch,
    loading,
    onSort,
    onPage,
    paginator = true,
    rowsPerPageOptions = [5, 10, 25, 50],
    emptyMessage = "No se encontraron registros",
    stripedRows = false,
    showGridlines = true,
    size = "normal",
}) => {

    const [filters, setFilters] = useState<any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ...customFilters
    });
    const [globalFilterValue, debounceGlobalFilterValue, setGlobalFilterValue] = useDebounce('', 500);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleOnSelectionChange = (e: any) => {
        if (!selectionActive) return;
        setSelectedItem(e.value);
        onSelectedRow && onSelectedRow(e.value);
    };

    const handleExportClick = (type: 'excel' | 'pdf' | 'csv') => {
        onExport && onExport(type);
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="d-flex gap-2">
                    {onReload && (
                        <Button
                            type="button"
                            icon="pi pi-refresh"
                            className="p-button-outlined p-button-secondary"
                            onClick={onReload}
                            tooltip="Recargar"
                            tooltipOptions={{ position: 'top' }}
                        />
                    )}

                    {onExport && (
                        <div className="p-buttonset">
                            <Button
                                icon="pi pi-file-excel"
                                className="p-button-success"
                                onClick={() => handleExportClick('excel')}
                                tooltip="Exportar a Excel"
                                tooltipOptions={{ position: 'top' }}
                            />
                            <Button
                                icon="pi pi-file-pdf"
                                className="p-button-danger"
                                onClick={() => handleExportClick('pdf')}
                                tooltip="Exportar a PDF"
                                tooltipOptions={{ position: 'top' }}
                            />
                            <Button
                                icon="pi pi-download"
                                className="p-button-info"
                                onClick={() => handleExportClick('csv')}
                                tooltip="Exportar a CSV"
                                tooltipOptions={{ position: 'top' }}
                            />
                        </div>
                    )}
                </div>

                {!disableSearch && (
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Buscar..."
                            className="p-inputtext-sm"
                        />
                    </span>
                )}
            </div>
        );
    };

    useEffect(() => {
        onSearch && onSearch(debounceGlobalFilterValue);
    }, [debounceGlobalFilterValue]);

    return (
        <div className="card">
            <CustomPRTable
                data={data}
                columns={columns}
                lazy={lazy}
                first={first}
                rows={rows}
                totalRecords={totalRecords}
                sortField={sortField}
                sortOrder={sortOrder}
                selectionActive={selectionActive}
                globalFilterFields={globalFilterFields}
                customFilters={customFilters}
                disableSearch={disableSearch}
                onSelectedRow={onSelectedRow}
                onReload={onReload}
                onExport={onExport}
                onSearch={onSearch}
                loading={loading}
                onSort={onSort}
                onPage={onPage}
                paginator={paginator}
                rowsPerPageOptions={rowsPerPageOptions}
                emptyMessage={emptyMessage}
                stripedRows={stripedRows}
                showGridlines={showGridlines}
                size={size}
                header={renderHeader}
                filters={filters}
                selection={selectedItem}
                onSelectionChange={handleOnSelectionChange}
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
            />
        </div>
    );
};

export default DisabilityTable;