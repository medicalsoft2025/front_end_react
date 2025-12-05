import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';

export const Sales_Invoices = () => {
    // Estado para los datos de la tabla
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado para los filtros
    const [filtros, setFiltros] = useState({
        numeroFactura: '',
        cliente: '',
        fechaInicio: null,
        fechaFin: null,
        tipoFactura: null,
        estado: null,
        montoMinimo: null,
        montoMaximo: null
    });

    // Opciones para los selects
    const tiposFactura = [
        { label: 'Contado', value: 'Contado' },
        { label: 'Crédito', value: 'Crédito' }
    ];

    const estadosFactura = [
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'Pagada', value: 'Pagada' },
        { label: 'Anulada', value: 'Anulada' },
        { label: 'Vencida', value: 'Vencida' }
    ];

    // Simular carga de datos
    useEffect(() => {
        setLoading(true);
        // Simulación de llamada a API
        setTimeout(() => {
            const datosMock = [
                {
                    id: '1',
                    numeroFactura: 'B01-001-0000001',
                    fecha: new Date(2023, 0, 15),
                    cliente: 'Distribuidora Pérez S.A.',
                    monto: 125000,
                    tipoFactura: 'Crédito',
                    estado: 'Pagada',
                    rncCliente: '131246375',
                    formaPago: 'Transferencia'
                },
                {
                    id: '2',
                    numeroFactura: 'B01-001-0000002',
                    fecha: new Date(2023, 0, 16),
                    cliente: 'Supermercado Nacional',
                    monto: 87500,
                    tipoFactura: 'Contado',
                    estado: 'Pagada',
                    rncCliente: '101584796'
                },
                {
                    id: '3',
                    numeroFactura: 'B01-001-0000003',
                    fecha: new Date(2023, 0, 18),
                    cliente: 'Farmacia Carol',
                    monto: 45600,
                    tipoFactura: 'Crédito',
                    estado: 'Pendiente',
                    rncCliente: '130456892',
                    formaPago: '30 días'
                },
                {
                    id: '4',
                    numeroFactura: 'B01-001-0000004',
                    fecha: new Date(2023, 1, 2),
                    cliente: 'Tiendas Bravo',
                    monto: 210000,
                    tipoFactura: 'Crédito',
                    estado: 'Vencida',
                    rncCliente: '101234567'
                },
                {
                    id: '5',
                    numeroFactura: 'B01-001-0000005',
                    fecha: new Date(2023, 1, 5),
                    cliente: 'Restaurante El Conuco',
                    monto: 68900,
                    tipoFactura: 'Contado',
                    estado: 'Pagada',
                    rncCliente: '131987654'
                },
                {
                    id: '6',
                    numeroFactura: 'B01-001-0000006',
                    fecha: new Date(2023, 1, 10),
                    cliente: 'Hotel Jaragua',
                    monto: 315000,
                    tipoFactura: 'Crédito',
                    estado: 'Pagada',
                    rncCliente: '101112131'
                },
                {
                    id: '7',
                    numeroFactura: 'B01-001-0000007',
                    fecha: new Date(2023, 1, 15),
                    cliente: 'Distribuidora Olivo',
                    monto: 78500,
                    tipoFactura: 'Crédito',
                    estado: 'Anulada',
                    rncCliente: '130987654'
                }
            ];
            setFacturas(datosMock);
            setLoading(false);
        }, 1000);
    }, []);

    // Manejadores de cambio de filtros
    const handleFilterChange = (field, value) => {
        setFiltros(prev => ({
            ...prev,
            [field]: value
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
            numeroFactura: '',
            cliente: '',
            fechaInicio: null,
            fechaFin: null,
            tipoFactura: null,
            estado: null,
            montoMinimo: null,
            montoMaximo: null
        });
    };

    // Formatear número para montos en pesos dominicanos (DOP)
    const formatCurrency = (value) => {
        return value.toLocaleString('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Formatear fecha
    const formatDate = (value) => {
        return value.toLocaleDateString('es-DO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Estilo para los tags de estado
    const getEstadoSeverity = (estado) => {
        switch (estado) {
            case 'Pagada':
                return 'success';
            case 'Pendiente':
                return 'warning';
            case 'Anulada':
                return 'danger';
            case 'Vencida':
                return 'danger';
            default:
                return null;
        }
    };

    // Estilos integrados
    const styles = {
        card: {
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
        },
        cardTitle: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#333'
        },
        tableHeader: {
            backgroundColor: '#f8f9fa',
            color: '#495057',
            fontWeight: 600
        },
        tableCell: {
            padding: '0.75rem 1rem'
        },
        formLabel: {
            fontWeight: 500,
            marginBottom: '0.5rem',
            display: 'block'
        }
    };

    return (
        <div className="container-fluid mt-4" style={{ width: '100%', padding: '0 15px' }}>
            <Card title="Filtros de Búsqueda" style={styles.card}>
                <div className="row g-3">
                    {/* Filtro: Número de factura */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Número de factura</label>
                        <InputText
                            value={filtros.numeroFactura}
                            onChange={(e) => handleFilterChange('numeroFactura', e.target.value)}
                            placeholder="B01-001-0000001"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Cliente */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Cliente</label>
                        <InputText
                            value={filtros.cliente}
                            onChange={(e) => handleFilterChange('cliente', e.target.value)}
                            placeholder="Nombre del cliente"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Rango de fechas */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Fecha desde</label>
                        <Calendar
                            value={filtros.fechaInicio}
                            onChange={(e) => handleFilterChange('fechaInicio', e.value)}
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
                            onChange={(e) => handleFilterChange('fechaFin', e.value)}
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/aaaa"
                            className="w-100"
                            showIcon
                        />
                    </div>

                    {/* Filtro: Tipo de factura */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Tipo de factura</label>
                        <Dropdown
                            value={filtros.tipoFactura}
                            options={tiposFactura}
                            onChange={(e) => handleFilterChange('tipoFactura', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione tipo"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Estado */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Estado</label>
                        <Dropdown
                            value={filtros.estado}
                            options={estadosFactura}
                            onChange={(e) => handleFilterChange('estado', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione estado"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Monto mínimo */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Monto mínimo</label>
                        <InputText
                            value={filtros.montoMinimo || ''}
                            onChange={(e) => handleFilterChange('montoMinimo', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="0.00"
                            className="w-100"
                            keyfilter="num"
                        />
                    </div>

                    {/* Filtro: Monto máximo */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Monto máximo</label>
                        <InputText
                            value={filtros.montoMaximo || ''}
                            onChange={(e) => handleFilterChange('montoMaximo', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="0.00"
                            className="w-100"
                            keyfilter="num"
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
                            className='btn btn-primary'
                            onClick={aplicarFiltros}
                            loading={loading}
                        />
                    </div>
                </div>
            </Card>

            {/* Tabla de resultados */}
            <Card title="Facturas de Venta" style={styles.card}>
                <DataTable
                    value={facturas}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    className="p-datatable-striped p-datatable-gridlines"
                    emptyMessage="No se encontraron facturas"
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column field="numeroFactura" header="Factura" sortable style={styles.tableCell} />
                    <Column 
                        field="fecha" 
                        header="Fecha" 
                        sortable 
                        body={(rowData) => formatDate(rowData.fecha)}
                        style={styles.tableCell} 
                    />
                    <Column field="cliente" header="Cliente" sortable style={styles.tableCell} />
                    <Column 
                        field="monto" 
                        header="Monto" 
                        sortable 
                        body={(rowData) => formatCurrency(rowData.monto)}
                        style={styles.tableCell} 
                    />
                    <Column 
                        field="tipoFactura" 
                        header="Tipo" 
                        sortable 
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