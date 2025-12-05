import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';


// Definición de tipos TypeScript
type CuentaContable = {
    codigo: string;
    nombre: string;
    anioActual: number;
    saldoInicial: number;
    diferenciaFiscal: boolean;
    centroCosto?: string;
};

type FiltrosBusqueda = {
    incluyeDiferenciaFiscal: string | null;
    incluyeSaldoInicial: string | null;
    muestraCodigoCuenta: string | null;
    anioFiscal: Date | null;
    mesInicial: number | null;
    mesFinal: number | null;
    comparativo: string | null;
    centroCosto: string | null;
};

export const StatusResult: React.FC = () => {
    // Estado para los datos de la tabla
    const [cuentasContables, setCuentasContables] = useState<CuentaContable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Estado para los filtros
    const [filtros, setFiltros] = useState<FiltrosBusqueda>({
        incluyeDiferenciaFiscal: null,
        incluyeSaldoInicial: null,
        muestraCodigoCuenta: 'si',
        anioFiscal: null,
        mesInicial: null,
        mesFinal: null,
        comparativo: null,
        centroCosto: null
    });

    // Opciones para los selects
    const opcionesSiNo = [
        { label: 'Sí', value: 'si' },
        { label: 'No', value: 'no' }
    ];

    const meses = [
        { label: 'Enero', value: 1 },
        { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 },
        { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 },
        { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 },
        { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 },
        { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 },
        { label: 'Diciembre', value: 12 }
    ];

    // Simular carga de datos
    useEffect(() => {
        setLoading(true);
        // Simulación de llamada a API
        setTimeout(() => {
            const datosMock: CuentaContable[] = [
                { codigo: '1101', nombre: 'Caja General', anioActual: 2023, saldoInicial: 1000000, diferenciaFiscal: false, centroCosto: 'ADMIN' },
                { codigo: '1102', nombre: 'Cuentas Bancarias', anioActual: 2023, saldoInicial: 5000000, diferenciaFiscal: true, centroCosto: 'FINANZAS' },
                { codigo: '1201', nombre: 'Cuentas por Cobrar', anioActual: 2023, saldoInicial: 3000000, diferenciaFiscal: false, centroCosto: 'VENTAS' },
                { codigo: '2101', nombre: 'Cuentas por Pagar', anioActual: 2023, saldoInicial: 2000000, diferenciaFiscal: true, centroCosto: 'COMPRAS' },
                { codigo: '3101', nombre: 'Capital Social', anioActual: 2023, saldoInicial: 10000000, diferenciaFiscal: false, centroCosto: 'ADMIN' },
                { codigo: '4101', nombre: 'Ventas Nacionales', anioActual: 2023, saldoInicial: 15000000, diferenciaFiscal: false, centroCosto: 'VENTAS' },
                { codigo: '5101', nombre: 'Costos de Ventas', anioActual: 2023, saldoInicial: 8000000, diferenciaFiscal: true, centroCosto: 'PRODUCCION' },
            ];
            setCuentasContables(datosMock);
            setLoading(false);
        }, 1000);
    }, []);

    // Manejadores de cambio de filtros
    const handleFilterChange = (field: keyof FiltrosBusqueda, value: any) => {
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
            incluyeDiferenciaFiscal: null,
            incluyeSaldoInicial: null,
            muestraCodigoCuenta: 'si',
            anioFiscal: null,
            mesInicial: null,
            mesFinal: null,
            comparativo: null,
            centroCosto: null
        });
    };

    // Formatear número para saldos en pesos dominicanos (DOP)
    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
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
        },
        responsiveAdjustments: {
            '@media (max-width: 768px)': {
                card: {
                    padding: '1rem'
                },
                tableHeaderCell: {
                    padding: '0.5rem'
                },
                tableCell: {
                    padding: '0.5rem'
                }
            }
        }
    };

    return (
        <div className="container-fluid mt-4" style={{ width: '100%', padding: '0 15px' }}>
            <Card title="Filtros de Búsqueda" style={styles.card}>
                <div className="row g-3">
                    {/* Filtro: Incluye cuenta contable de diferencia fiscal */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Incluye diferencia fiscal</label>
                        <SelectButton
                            value={filtros.incluyeDiferenciaFiscal}
                            options={opcionesSiNo}
                            onChange={(e) => handleFilterChange('incluyeDiferenciaFiscal', e.value)}
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Incluye saldo inicial */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Incluye saldo inicial</label>
                        <SelectButton
                            value={filtros.incluyeSaldoInicial}
                            options={opcionesSiNo}
                            onChange={(e) => handleFilterChange('incluyeSaldoInicial', e.value)}
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Muestra código de cuenta contable */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Muestra código de cuenta</label>
                        <SelectButton
                            value={filtros.muestraCodigoCuenta}
                            options={opcionesSiNo}
                            onChange={(e) => handleFilterChange('muestraCodigoCuenta', e.value)}
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Año fiscal */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Año fiscal</label>
                        <Calendar
                            value={filtros.anioFiscal}
                            onChange={(e) => handleFilterChange('anioFiscal', e.value)}
                            view="year"
                            dateFormat="yy"
                            placeholder="Seleccione año"
                            className="w-100"
                            showIcon
                        />
                    </div>

                    {/* Filtro: Rango de meses */}
                    <div className="col-md-6">
                        <label style={styles.formLabel}>Mes inicial</label>
                        <Dropdown
                            value={filtros.mesInicial}
                            options={meses}
                            onChange={(e) => handleFilterChange('mesInicial', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione mes inicial"
                            className="w-100"
                        />
                    </div>

                    <div className="col-md-6">
                        <label style={styles.formLabel}>Mes final</label>
                        <Dropdown
                            value={filtros.mesFinal}
                            options={meses}
                            onChange={(e) => handleFilterChange('mesFinal', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione mes final"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Comparativo */}
                    <div className="col-md-6">
                        <label style={styles.formLabel}>Comparativo</label>
                        <SelectButton
                            value={filtros.comparativo}
                            options={opcionesSiNo}
                            onChange={(e) => handleFilterChange('comparativo', e.value)}
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Centro de costo */}
                    <div className="col-md-6">
                        <label style={styles.formLabel}>Centro de costo</label>
                        <span className="p-input-icon-left w-100">
                            <i className="pi pi-search" />
                            <InputText
                                value={filtros.centroCosto || ''}
                                onChange={(e) => handleFilterChange('centroCosto', e.target.value)}
                                placeholder="Buscar centro de costo..."
                                className="w-100"
                            />
                        </span>
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
            <Card title="Resultados" style={styles.card}>
                <DataTable
                    value={cuentasContables}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    className="p-datatable-striped p-datatable-gridlines"
                    emptyMessage="No se encontraron resultados"
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: '50rem', padding: '0 1rem' }}
                >
                    <Column field="codigo" header="Código" sortable style={styles.tableCell} />
                    <Column field="nombre" header="Nombre Cuenta" sortable style={styles.tableCell} />
                    <Column field="anioActual" header="Año Actual" sortable style={styles.tableCell} />
                    <Column
                        field="saldoInicial"
                        header="Saldo Inicial"
                        sortable
                        body={(rowData) => formatCurrency(rowData.saldoInicial)}
                        style={styles.tableCell}
                    />
                    <Column
                        field="diferenciaFiscal"
                        header="Dif. Fiscal"
                        sortable
                        body={(rowData) => rowData.diferenciaFiscal ? 'Sí' : 'No'}
                        style={styles.tableCell}
                    />
                    <Column
                        field="centroCosto"
                        header="Centro Costo"
                        sortable
                        style={styles.tableCell}
                    />
                </DataTable>
            </Card>
        </div >
    );
};

