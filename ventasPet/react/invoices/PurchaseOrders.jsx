import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

export const PurchaseOrders = () => {
    // Estado para los datos de la tabla
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado para los filtros
    const [filtros, setFiltros] = useState({
        numeroOrden: "",
        numeroComprobante: "",
        producto: "",
        identificacion: "",
        sucursal: null,
        fechaInicio: null,
        fechaFin: null,
        valorMinimo: null,
        valorMaximo: null,
    });

    // Opciones para los selects
    const sucursales = [
        { label: "Sucursal Principal", value: "Principal" },
        { label: "Sucursal Norte", value: "Norte" },
        { label: "Sucursal Sur", value: "Sur" },
        { label: "Sucursal Este", value: "Este" },
        { label: "Sucursal Oeste", value: "Oeste" },
    ];

    const estadosOrden = [
        { label: "Pendiente", value: "Pendiente" },
        { label: "Aprobada", value: "Aprobada" },
        { label: "Rechazada", value: "Rechazada" },
        { label: "En proceso", value: "En proceso" },
        { label: "Completada", value: "Completada" },
    ];

    // Simular carga de datos
    useEffect(() => {
        setLoading(true);
        // Simulación de llamada a API
        setTimeout(() => {
            const datosMock = [
                {
                    id: "1",
                    numeroOrden: "OC-001-0000001",
                    numeroComprobante: "CP-001-0000001",
                    producto: "Laptop HP EliteBook",
                    identificacion: "131246375",
                    proveedor: "TecnoSuministros S.A.",
                    sucursal: "Principal",
                    fechaOrden: new Date(2023, 0, 15),
                    valorTotal: 125000,
                    estado: "Aprobada",
                },
                {
                    id: "2",
                    numeroOrden: "OC-001-0000002",
                    numeroComprobante: "CP-001-0000002",
                    producto: "Impresora LaserJet",
                    identificacion: "101584796",
                    proveedor: "Equipos Office RD",
                    sucursal: "Norte",
                    fechaOrden: new Date(2023, 0, 16),
                    valorTotal: 87500,
                    estado: "Completada",
                },
                {
                    id: "3",
                    numeroOrden: "OC-001-0000003",
                    numeroComprobante: "CP-001-0000003",
                    producto: "Router WiFi 6",
                    identificacion: "130456892",
                    proveedor: "Tecnología Avanzada",
                    sucursal: "Sur",
                    fechaOrden: new Date(2023, 0, 18),
                    valorTotal: 45600,
                    estado: "En proceso",
                },
                {
                    id: "4",
                    numeroOrden: "OC-001-0000004",
                    numeroComprobante: "CP-001-0000004",
                    producto: "Monitor 24\" Full HD",
                    identificacion: "101234567",
                    proveedor: "Distribuidora Tecno",
                    sucursal: "Este",
                    fechaOrden: new Date(2023, 1, 2),
                    valorTotal: 210000,
                    estado: "Pendiente",
                },
                {
                    id: "5",
                    numeroOrden: "OC-001-0000005",
                    numeroComprobante: "CP-001-0000005",
                    producto: "Teclado mecánico",
                    identificacion: "131987654",
                    proveedor: "Periféricos Premium",
                    sucursal: "Oeste",
                    fechaOrden: new Date(2023, 1, 5),
                    valorTotal: 6890,
                    estado: "Rechazada",
                },
                {
                    id: "6",
                    numeroOrden: "OC-001-0000006",
                    numeroComprobante: "CP-001-0000006",
                    producto: "Mouse inalámbrico",
                    identificacion: "101112131",
                    proveedor: "Accesorios Digitales",
                    sucursal: "Principal",
                    fechaOrden: new Date(2023, 1, 10),
                    valorTotal: 3150,
                    estado: "Completada",
                },
                {
                    id: "7",
                    numeroOrden: "OC-001-0000007",
                    numeroComprobante: "CP-001-0000007",
                    producto: "Disco Duro SSD 1TB",
                    identificacion: "130987654",
                    proveedor: "Almacenamiento RD",
                    sucursal: "Norte",
                    fechaOrden: new Date(2023, 1, 15),
                    valorTotal: 78500,
                    estado: "Aprobada",
                },
            ];
            setOrdenes(datosMock);
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
            numeroOrden: "",
            numeroComprobante: "",
            producto: "",
            identificacion: "",
            sucursal: null,
            fechaInicio: null,
            fechaFin: null,
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

    // Estilo para los tags de estado
    const getEstadoSeverity = (estado) => {
        switch (estado) {
            case "Aprobada":
            case "Completada":
                return "success";
            case "Pendiente":
                return "warning";
            case "En proceso":
                return "info";
            case "Rechazada":
                return "danger";
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
                    label="Nueva Orden de Compra"
                    icon="pi pi-file-edit"
                    className="btn btn-primary"
                    onClick={() => (window.location.href = "Ordenes_Compra")}
                />
            </div>
            <Card title="Filtros de Búsqueda" style={styles.card}>
                <div className="row g-3">
                    {/* Filtro: Número de orden */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>No. Orden</label>
                        <InputText
                            value={filtros.numeroOrden}
                            onChange={(e) =>
                                handleFilterChange("numeroOrden", e.target.value)
                            }
                            placeholder="OC-001-0000001"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Número de comprobante */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>No. Comprobante</label>
                        <InputText
                            value={filtros.numeroComprobante}
                            onChange={(e) =>
                                handleFilterChange("numeroComprobante", e.target.value)
                            }
                            placeholder="CP-001-0000001"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Producto */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Producto</label>
                        <InputText
                            value={filtros.producto}
                            onChange={(e) => handleFilterChange("producto", e.target.value)}
                            placeholder="Nombre del producto"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Identificación */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Identificación</label>
                        <InputText
                            value={filtros.identificacion}
                            onChange={(e) => handleFilterChange("identificacion", e.target.value)}
                            placeholder="RNC/Cédula del proveedor"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Sucursal */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Sucursal</label>
                        <Dropdown
                            value={filtros.sucursal}
                            options={sucursales}
                            onChange={(e) => handleFilterChange("sucursal", e.value)}
                            optionLabel="label"
                            placeholder="Seleccione sucursal"
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
            <Card title="Órdenes de Compra" style={styles.card}>
                <DataTable
                    value={ordenes}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    className="p-datatable-striped p-datatable-gridlines"
                    emptyMessage="No se encontraron órdenes"
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: "50rem" }}
                >
                    <Column
                        field="numeroOrden"
                        header="No. Orden"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="numeroComprobante"
                        header="No. Comprobante"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="producto"
                        header="Producto"
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
                        field="sucursal"
                        header="Sucursal"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="proveedor"
                        header="Proveedor"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="fechaOrden"
                        header="Fecha"
                        sortable
                        body={(rowData) => formatDate(rowData.fechaOrden)}
                        style={styles.tableCell}
                    />
                    <Column
                        field="valorTotal"
                        header="Valor Total"
                        sortable
                        body={(rowData) => formatCurrency(rowData.valorTotal)}
                        style={styles.tableCell}
                    />
                    <Column
                        field="estado"
                        header="Estado"
                        sortable
                        body={(rowData) => (
                            <Tag
                                value={rowData.estado}
                                severity={getEstadoSeverity(rowData.estado)}
                            />
                        )}
                        style={styles.tableCell}
                    />
                </DataTable>
            </Card>
        </div>
    );
};