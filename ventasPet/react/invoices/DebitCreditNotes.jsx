import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

export const DebitCreditNotes = () => {
    // Estado para los datos de la tabla
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado para los filtros
    const [filtros, setFiltros] = useState({
        numeroNota: "",
        cliente: "",
        identificacion: "",
        fechaInicio: null,
        fechaFin: null,
        tipoNota: null,
        montoMinimo: null,
        montoMaximo: null,
    });

    // Opciones para los selects
    const tiposNota = [
        { label: "Débito", value: "Débito" },
        { label: "Crédito", value: "Crédito" },
    ];

    // Simular carga de datos
    useEffect(() => {
        setLoading(true);
        // Simulación de llamada a API
        setTimeout(() => {
            const datosMock = [
                {
                    id: "1",
                    numeroNota: "ND-001-0000001",
                    tipoNota: "Débito",
                    cliente: "Distribuidora Pérez S.A.",
                    identificacion: "131246375",
                    fechaNota: new Date(2023, 0, 15),
                    valorNota: 12500,
                    motivo: "Ajuste por diferencia de precio",
                },
                {
                    id: "2",
                    numeroNota: "NC-001-0000001",
                    tipoNota: "Crédito",
                    cliente: "Supermercado Nacional",
                    identificacion: "101584796",
                    fechaNota: new Date(2023, 0, 16),
                    valorNota: 8750,
                    motivo: "Devolución de mercancía",
                },
                {
                    id: "3",
                    numeroNota: "ND-001-0000002",
                    tipoNota: "Débito",
                    cliente: "Farmacia Carol",
                    identificacion: "130456892",
                    fechaNota: new Date(2023, 0, 18),
                    valorNota: 4560,
                    motivo: "Cargo adicional por servicio",
                },
                {
                    id: "4",
                    numeroNota: "NC-001-0000002",
                    tipoNota: "Crédito",
                    cliente: "Tiendas Bravo",
                    identificacion: "101234567",
                    fechaNota: new Date(2023, 1, 2),
                    valorNota: 21000,
                    motivo: "Descuento no aplicado",
                },
                {
                    id: "5",
                    numeroNota: "ND-001-0000003",
                    tipoNota: "Débito",
                    cliente: "Restaurante El Conuco",
                    identificacion: "131987654",
                    fechaNota: new Date(2023, 1, 5),
                    valorNota: 6890,
                    motivo: "Recargo por pago tardío",
                },
                {
                    id: "6",
                    numeroNota: "NC-001-0000003",
                    tipoNota: "Crédito",
                    cliente: "Hotel Jaragua",
                    identificacion: "101112131",
                    fechaNota: new Date(2023, 1, 10),
                    valorNota: 31500,
                    motivo: "Bonificación por volumen",
                },
                {
                    id: "7",
                    numeroNota: "ND-001-0000004",
                    tipoNota: "Débito",
                    cliente: "Distribuidora Olivo",
                    identificacion: "130987654",
                    fechaNota: new Date(2023, 1, 15),
                    valorNota: 7850,
                    motivo: "Ajuste por error en facturación",
                },
            ];
            setNotas(datosMock);
            setLoading(false);
        }, 1000);
    }, []);

    // Manejadores de cambio de filtros
    const handleFilterChange = (field, value) => {
        setFiltros((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Función para aplicar filtros
    const aplicarFiltros = () => {
        setLoading(true);
        // Aquí iría la lógica para filtrar los datos, normalmente una llamada a API
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setFiltros({
            numeroNota: "",
            cliente: "",
            identificacion: "",
            fechaInicio: null,
            fechaFin: null,
            tipoNota: null,
        });
    };

    // Formatear número para montos en pesos dominicanos (DOP)
    const formatCurrency = (value) => {
        return value.toLocaleString("es-DO", {
            style: "currency",
            currency: "DOP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Formatear fecha
    const formatDate = (value) => {
        return value.toLocaleDateString("es-DO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Estilo para los tags de tipo de nota
    const getTipoNotaSeverity = (tipo) => {
        switch (tipo) {
            case "Débito":
                return "danger";
            case "Crédito":
                return "success";
            default:
                return null;
        }
    };

    // Estilos integrados
    const styles = {
        card: {
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
        },
        cardTitle: {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#333",
        },
        tableHeader: {
            backgroundColor: "#f8f9fa",
            color: "#495057",
            fontWeight: 600,
        },
        tableCell: {
            padding: "0.75rem 1rem",
        },
        formLabel: {
            fontWeight: 500,
            marginBottom: "0.5rem",
            display: "block",
        },
    };

    return (
        <div
            className="container-fluid mt-4"
            style={{ width: "100%", padding: "0 15px" }}
        >
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                <Button
                    label="Nueva Nota Débito/Crédito"
                    icon="pi pi-file-edit"
                    className="btn btn-primary"
                    onClick={() => (window.location.href = "NotasDebitoCredito")}
                />
            </div>
            <Card title="Filtros de Búsqueda" style={styles.card}>
                <div className="row g-3">
                    {/* Filtro: Número de nota */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Número de nota</label>
                        <InputText
                            value={filtros.numeroNota}
                            onChange={(e) =>
                                handleFilterChange("numeroNota", e.target.value)
                            }
                            placeholder="ND-001-0000001"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Cliente */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Cliente</label>
                        <InputText
                            value={filtros.cliente}
                            onChange={(e) => handleFilterChange("cliente", e.target.value)}
                            placeholder="Nombre del cliente"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Identificación */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Identificación</label>
                        <InputText
                            value={filtros.identificacion}
                            onChange={(e) => handleFilterChange("identificacion", e.target.value)}
                            placeholder="RNC/Cédula del cliente"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Tipo de nota */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Tipo de nota</label>
                        <Dropdown
                            value={filtros.tipoNota}
                            options={tiposNota}
                            onChange={(e) => handleFilterChange("tipoNota", e.value)}
                            optionLabel="label"
                            placeholder="Seleccione tipo"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Rango de fechas */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Fecha desde</label>
                        <Calendar
                            value={filtros.fechaInicio}
                            onChange={(e) => handleFilterChange("fechaInicio", e.value)}
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/aaaa"
                            className="w-100"
                            showIcon
                        />
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Fecha hasta</label>
                        <Calendar
                            value={filtros.fechaFin}
                            onChange={(e) => handleFilterChange("fechaFin", e.value)}
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/aaaa"
                            className="w-100"
                            showIcon
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="col-12 d-flex justify-content-end gap-2">
                        <Button
                            label="Limpiar"
                            icon="pi pi-trash"
                            className="btn btn-phoenix-secondary"
                            onClick={limpiarFiltros}
                        />
                        <Button
                            label="Aplicar Filtros"
                            icon="pi pi-filter"
                            className="btn btn-primary"
                            onClick={aplicarFiltros}
                            loading={loading}
                        />
                    </div>
                </div>
            </Card>

            {/* Tabla de resultados */}
            <Card title="Notas de Débito/Crédito" style={styles.card}>
                <DataTable
                    value={notas}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    className="p-datatable-striped p-datatable-gridlines"
                    emptyMessage="No se encontraron notas"
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: "50rem" }}
                >
                    <Column
                        field="numeroNota"
                        header="No. Nota"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="tipoNota"
                        header="Tipo nota"
                        sortable
                        body={(rowData) => (
                            <Tag
                                value={rowData.tipoNota}
                                severity={getTipoNotaSeverity(rowData.tipoNota)}
                            />
                        )}
                        style={styles.tableCell}
                    />
                    <Column
                        field="cliente"
                        header="Cliente"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="identificacion"
                        header="Identificación"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="fechaNota"
                        header="Fecha nota"
                        sortable
                        body={(rowData) => formatDate(rowData.fechaNota)}
                        style={styles.tableCell}
                    />
                    <Column
                        field="valorNota"
                        header="Valor nota"
                        sortable
                        body={(rowData) => formatCurrency(rowData.valorNota)}
                        style={styles.tableCell}
                    />
                    <Column
                        field="motivo"
                        header="Motivo"
                        sortable
                        style={styles.tableCell}
                    />
                </DataTable>
            </Card>
        </div>
    );
};