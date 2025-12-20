import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from "primereact/progressspinner";
import {
    CustomPRTable,
    CustomPRTableColumnProps,
} from "../components/CustomPRTable";
import { usePreadmissions } from "./hooks/usePreadmission";

export const PreadmissionTable: React.FC = () => {
    const { preadmissions, fetchPreadmissions } = usePreadmissions();
    const [tableLoading, setTableLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");

    // Estado para filtros
    const [filters, setFilters] = useState({
        weight: "",
        size: "",
        imc: "",
        glycemia: "",
        dateRange: null as Date[] | null,
    });

    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadData(1, rows);
    }, []);

    const loadData = async (page = 1, perPage = 10) => {
        setTableLoading(true);
        try {
            // Aquí deberías adaptar tu hook usePreadmissions para aceptar parámetros de paginación
            await fetchPreadmissions();
            // Si tu hook no soporta paginación, puedes simularla con slice
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;
            // setPreadmissions(paginatedData);
            setTotalRecords(preadmissions.length);
        } catch (error) {
            console.error("Error cargando preadmisiones:", error);
            showToast(
                "error",
                "Error",
                "No se pudieron cargar las preadmisiones"
            );
        } finally {
            setTableLoading(false);
        }
    };

    const onPageChange = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        loadData(event.page + 1, event.rows);
    };

    const aplicarFiltros = async (page = 1, per_page = 10) => {
        setTableLoading(true);
        try {
            // Aplicar lógica de filtrado aquí
            await loadData(page, per_page);
        } catch (error) {
            console.error("Error aplicando filtros:", error);
            showToast("error", "Error", "No se pudieron aplicar los filtros");
        } finally {
            setTableLoading(false);
        }
    };

    const handleFilterChange = (field: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const limpiarFiltros = () => {
        setFilters({
            weight: "",
            size: "",
            imc: "",
            glycemia: "",
            dateRange: null,
        });
        loadData(1, rows);
    };

    const handleSearchChange = (searchValue: string) => {
        setGlobalFilter(searchValue);
        // Aquí puedes implementar búsqueda global si es necesario
    };

    const handleRefresh = async () => {
        limpiarFiltros();
        await loadData(1, rows);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-DO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const showToast = (
        severity: "success" | "error" | "info" | "warn",
        summary: string,
        detail: string
    ) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    // Mapear los datos para la tabla
    const tableItems = preadmissions.map((preadmission: any) => ({
        id: preadmission.id || Math.random(),
        weight: preadmission.weight,
        size: preadmission.size,
        imc: preadmission.imc,
        glycemia: preadmission.glycemia,
        createdAt: preadmission.createdAt,
    }));

    const columns: CustomPRTableColumnProps[] = [
        {
            field: "weight",
            header: "Peso",
            sortable: true,
            body: (rowData: any) => `${rowData.weight} kg`,
        },
        {
            field: "size",
            header: "Tamaño",
            sortable: true,
            body: (rowData: any) => `${rowData.size} cm`,
        },
        {
            field: "imc",
            header: "IMC",
            sortable: true,
            body: (rowData: any) => rowData.imc,
        },
        {
            field: "glycemia",
            header: "Glucosa",
            sortable: true,
            body: (rowData: any) => `${rowData.glycemia} mg/dL`,
        },
        {
            field: "createdAt",
            header: "Fecha de creación",
            sortable: true,
            body: (rowData: any) => formatDate(rowData.createdAt),
        },
    ];

    return (
        <main className="main w-100 pt-3 mb-2" id="top">
            <Toast ref={toast} />
            <div className="w-100">
                <div
                    className="h-100 w-100 d-flex flex-column"
                    style={{ marginTop: "-30px" }}
                >
                    <Accordion>
                        <AccordionTab header="Filtros de Búsqueda">
                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label">
                                        Rango de Fechas
                                    </label>
                                    <Calendar
                                        value={filters.dateRange}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "dateRange",
                                                e.value
                                            )
                                        }
                                        selectionMode="range"
                                        readOnlyInput
                                        dateFormat="dd/mm/yy"
                                        placeholder="Seleccione rango"
                                        className="w-100"
                                        showIcon
                                    />
                                </div>

                                <div className="col-12 d-flex justify-content-end gap-2">
                                    <Button
                                        label="Limpiar"
                                        icon="pi pi-trash"
                                        className="p-button-secondary"
                                        onClick={limpiarFiltros}
                                    />
                                    <Button
                                        label="Aplicar Filtros"
                                        icon="pi pi-filter"
                                        className="p-button-primary"
                                        onClick={() => aplicarFiltros()}
                                        loading={tableLoading}
                                    />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>

                    <CustomPRTable
                        columns={columns}
                        data={tableItems}
                        loading={tableLoading}
                        onSearch={handleSearchChange}
                        onReload={handleRefresh}
                        lazy
                        rows={rows}
                        first={first}
                        onPage={onPageChange}
                        totalRecords={totalRecords}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} preadmisiones"
                        emptyMessage="No se encontraron preadmisiones"
                    />
                </div>
            </div>
        </main>
    );
};
