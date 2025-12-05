import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { Checkbox } from 'primereact/checkbox';

// Definición de tipos TypeScript
type BalanceCuentaContable = {
    codigo: string;
    nombre: string;
    nivel: number;
    saldoAnterior: number;
    debito: number;
    credito: number;
    saldoActual: number;
    naturaleza: 'Deudor' | 'Acreedor';
    tieneMovimientos: boolean;
};

type FiltrosBusqueda = {
    cuentaContable: string;
    incluyeSinMovimientos: boolean;
    anioFiscal: Date | null;
    mesInicial: number | null;
    mesFinal: number | null;
    naturaleza: string | null;
};

export const BalanceAccountingAccount: React.FC = () => {
    // Estado para los datos de la tabla
    const [datosBalance, setDatosBalance] = useState<BalanceCuentaContable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalGeneral, setTotalGeneral] = useState({
        saldoAnterior: 0,
        debito: 0,
        credito: 0,
        saldoActual: 0
    });

    // Estado para los filtros
    const [filtros, setFiltros] = useState<FiltrosBusqueda>({
        cuentaContable: '',
        incluyeSinMovimientos: false,
        anioFiscal: null,
        mesInicial: null,
        mesFinal: null,
        naturaleza: null
    });

    // Opciones para los selects
    const opcionesNaturaleza = [
        { label: 'Todas', value: null },
        { label: 'Deudor', value: 'Deudor' },
        { label: 'Acreedor', value: 'Acreedor' }
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
            const datosMock: BalanceCuentaContable[] = [
                { codigo: '1101', nombre: 'Caja General', nivel: 1, saldoAnterior: 1500000, debito: 500000, credito: 200000, saldoActual: 1800000, naturaleza: 'Deudor', tieneMovimientos: true },
                { codigo: '110101', nombre: 'Caja Principal', nivel: 2, saldoAnterior: 1000000, debito: 300000, credito: 100000, saldoActual: 1200000, naturaleza: 'Deudor', tieneMovimientos: true },
                { codigo: '1102', nombre: 'Cuentas Bancarias', nivel: 1, saldoAnterior: 5000000, debito: 2000000, credito: 1500000, saldoActual: 5500000, naturaleza: 'Deudor', tieneMovimientos: true },
                { codigo: '110201', nombre: 'Banco Popular', nivel: 2, saldoAnterior: 3000000, debito: 1000000, credito: 500000, saldoActual: 3500000, naturaleza: 'Deudor', tieneMovimientos: true },
                { codigo: '1201', nombre: 'Cuentas por Cobrar', nivel: 1, saldoAnterior: 3000000, debito: 1000000, credito: 500000, saldoActual: 3500000, naturaleza: 'Deudor', tieneMovimientos: true },
                { codigo: '2101', nombre: 'Proveedores Nacionales', nivel: 1, saldoAnterior: 2000000, debito: 500000, credito: 800000, saldoActual: 2300000, naturaleza: 'Acreedor', tieneMovimientos: true },
                { codigo: '3101', nombre: 'Capital Social', nivel: 1, saldoAnterior: 10000000, debito: 0, credito: 0, saldoActual: 10000000, naturaleza: 'Acreedor', tieneMovimientos: false },
                { codigo: '4101', nombre: 'Ventas Nacionales', nivel: 1, saldoAnterior: 0, debito: 0, credito: 15000000, saldoActual: 15000000, naturaleza: 'Acreedor', tieneMovimientos: true },
                { codigo: '5101', nombre: 'Costos de Ventas', nivel: 1, saldoAnterior: 0, debito: 8000000, credito: 0, saldoActual: 8000000, naturaleza: 'Deudor', tieneMovimientos: true },
            ];

            setDatosBalance(datosMock);
            calcularTotales(datosMock);
            setLoading(false);
        }, 1000);
    }, []);

    // Calcular totales generales
    const calcularTotales = (datos: BalanceCuentaContable[]) => {
        const totales = {
            saldoAnterior: 0,
            debito: 0,
            credito: 0,
            saldoActual: 0
        };

        datos.forEach(item => {
            totales.saldoAnterior += item.saldoAnterior;
            totales.debito += item.debito;
            totales.credito += item.credito;
            totales.saldoActual += item.saldoActual;
        });

        setTotalGeneral(totales);
    };

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
        // Simulación de filtrado
        setTimeout(() => {
            let datosFiltrados = datosBalance.filter(cuenta => {
                // Filtro por cuenta contable
                if (filtros.cuentaContable &&
                    !cuenta.codigo.includes(filtros.cuentaContable) &&
                    !cuenta.nombre.toLowerCase().includes(filtros.cuentaContable.toLowerCase())) {
                    return false;
                }

                // Filtro por naturaleza
                if (filtros.naturaleza && cuenta.naturaleza !== filtros.naturaleza) {
                    return false;
                }

                // Filtro por cuentas sin movimientos
                if (!filtros.incluyeSinMovimientos && !cuenta.tieneMovimientos) {
                    return false;
                }

                return true;
            });

            setDatosBalance(datosFiltrados);
            calcularTotales(datosFiltrados);
            setLoading(false);
        }, 500);
    };

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setFiltros({
            cuentaContable: '',
            incluyeSinMovimientos: false,
            anioFiscal: null,
            mesInicial: null,
            mesFinal: null,
            naturaleza: null
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

    // Footer para los totales generales
    const footerTotales = (
        <div className="grid">
            <div className="col-12 md:col-3">
                <strong>Total Saldo Anterior:</strong> {formatCurrency(totalGeneral.saldoAnterior)}
            </div>
            <div className="col-12 md:col-3">
                <strong>Total Débitos:</strong> {formatCurrency(totalGeneral.debito)}
            </div>
            <div className="col-12 md:col-3">
                <strong>Total Créditos:</strong> {formatCurrency(totalGeneral.credito)}
            </div>
            <div className="col-12 md:col-3">
                <strong>Total Saldo Actual:</strong> {formatCurrency(totalGeneral.saldoActual)}
            </div>
        </div>
    );

    // Estilo condicional para la naturaleza
    const naturalezaBodyTemplate = (rowData: BalanceCuentaContable) => {
        return (
            <span className={`badge bg-${rowData.naturaleza === 'Deudor' ? 'info' : 'success'}`}>
                {rowData.naturaleza}
            </span>
        );
    };

    return (
        <div className="container-fluid mt-4" style={{ padding: '0 15px' }}>
            {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <Button
                    label="Exportar a Excel"
                    icon="pi pi-file-excel"
                    className="btn btn-primary"
                    onClick={() => console.log('Exportar a Excel')}
                />
            </div> */}

            <Card title="Filtros de Búsqueda" className="mb-4">
                <div className="row g-3">
                    {/* Filtro: Cuenta contable */}
                    <div className="col-md-6">
                        <label className="form-label">Buscar Cuenta</label>
                        <InputText
                            value={filtros.cuentaContable}
                            onChange={(e) => handleFilterChange('cuentaContable', e.target.value)}
                            placeholder="Buscar por código o nombre..."
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Naturaleza */}
                    <div className="col-md-6">
                        <label className="form-label">Naturaleza</label>
                        <SelectButton
                            value={filtros.naturaleza}
                            options={opcionesNaturaleza}
                            onChange={(e) => handleFilterChange('naturaleza', e.value)}
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Año fiscal */}
                    <div className="col-md-4">
                        <label className="form-label">Año fiscal</label>
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
                    <div className="col-md-4">
                        <label className="form-label">Mes inicial</label>
                        <Dropdown
                            value={filtros.mesInicial}
                            options={meses}
                            onChange={(e) => handleFilterChange('mesInicial', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione mes inicial"
                            className="w-100"
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Mes final</label>
                        <Dropdown
                            value={filtros.mesFinal}
                            options={meses}
                            onChange={(e) => handleFilterChange('mesFinal', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione mes final"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Incluir sin movimientos */}
                    <div className="col-md-12">
                        <div className="field-checkbox">
                            <Checkbox
                                inputId="incluyeSinMovimientos"
                                checked={filtros.incluyeSinMovimientos}
                                onChange={(e) => handleFilterChange('incluyeSinMovimientos', e.checked)}
                            />
                            <label htmlFor="incluyeSinMovimientos" className="ml-2">Incluir cuentas sin movimientos</label>
                        </div>
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
                            label="Generar Balance"
                            className='btn btn-primary'
                            icon="pi pi-filter"
                            onClick={aplicarFiltros}
                            loading={loading}
                        />
                    </div>
                </div>
            </Card>

            {/* Tabla de resultados */}
            <Card title="Resultados del Balance">
                <DataTable
                    value={datosBalance}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    emptyMessage="No se encontraron resultados"
                    className="p-datatable-striped p-datatable-gridlines"
                    responsiveLayout="scroll"
                    footer={footerTotales}
                >
                    <Column field="codigo" header="Código" sortable />
                    <Column field="nombre" header="Nombre Cuenta" sortable />
                    <Column field="nivel" header="Nivel" sortable />
                    <Column
                        field="naturaleza"
                        header="Naturaleza"
                        body={naturalezaBodyTemplate}
                        sortable
                    />
                    <Column
                        field="saldoAnterior"
                        header="Saldo Anterior"
                        body={(rowData) => formatCurrency(rowData.saldoAnterior)}
                        sortable
                    />
                    <Column
                        field="debito"
                        header="Débitos"
                        body={(rowData) => formatCurrency(rowData.debito)}
                        sortable
                    />
                    <Column
                        field="credito"
                        header="Créditos"
                        body={(rowData) => formatCurrency(rowData.credito)}
                        sortable
                    />
                    <Column
                        field="saldoActual"
                        header="Saldo Actual"
                        body={(rowData) => formatCurrency(rowData.saldoActual)}
                        sortable
                    />
                </DataTable>
            </Card>
        </div>
    );
};

