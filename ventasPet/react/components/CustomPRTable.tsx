import React, { ReactNode, useState } from "react";
import { DataTable, DataTableFilterMeta, SortOrder } from 'primereact/datatable';
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

export interface CustomPRTableColumnProps {
    field: string;
    header: string;
    body?: (rowData: any) => ReactNode;
    sortable?: boolean
    frozen?: boolean
}

export interface CustomPRTableProps {
    data: any;
    columns: CustomPRTableColumnProps[];
    sortField?: string
    sortOrder?: SortOrder
    selectionActive?: boolean
    loading?: boolean
    globalFilterFields?: string[]
    customFilters?: DataTableFilterMeta
    onSelectedRow?: (rowData: any) => void
    onReload?: () => void
}

export const CustomPRTable: React.FC<CustomPRTableProps> = ({
    data,
    columns,
    sortField,
    sortOrder,
    selectionActive,
    globalFilterFields,
    customFilters,
    onSelectedRow,
    onReload,
    loading
}) => {

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ...customFilters
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
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

    const header = () => {
        return (
            <div className="d-flex justify-content-end">
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
            </div>
        );
    };

    return (
        <DataTable
            dataKey={"uuid"}
            value={data}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            globalFilterFields={globalFilterFields}
            tableStyle={{ minWidth: '50rem' }}
            showGridlines
            header={header}
            filters={filters}
            selectionMode={"single"}
            selection={selectedItem}
            onSelectionChange={handleOnSelectionChange}
            emptyMessage="No se encontraron registros."
            scrollable
            loading={loading}
            sortField={sortField}
            sortOrder={sortOrder || 1}
        >
            {columns.map((column) => (
                <Column
                    key={column.field}
                    field={column.field}
                    header={column.header}
                    body={column.body}
                    sortable={column.sortable}
                    alignFrozen="right"
                    frozen={column.frozen}
                />
            ))}
        </DataTable>
    );
};