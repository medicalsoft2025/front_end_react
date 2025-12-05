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
type BalancePorTercero = {
    nivel: string;
    transaccional: boolean;
    codigoCuenta: string;
    nombreCuenta: string;
    identificacion: string;
    sucursal: string;
    nombreTercero: string;
    saldoInicial: number;
    movimientoDebito: number;
    movimientoCredito: number;
    saldoFinal: number;
    naturaleza: 'Deudor' | 'Acreedor';
};

type FiltrosBusqueda = {
    cuentaContable: string;
    identificacionTercero: string;
    nombreTercero: string;
    incluyeSinMovimientos: boolean;
    anioFiscal: Date | null;
    mesInicial: number | null;
    mesFinal: number | null;
    naturaleza: string | null;
    sucursal: string | null;
};

export const BalanceThirdParty: React.FC = () => {
    // Estado para los datos de la tabla
    const [datosBalance, setDatosBalance] = useState<BalancePorTercero[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalGeneral, setTotalGeneral] = useState({
        saldoInicial: 0,
        debito: 0,
        credito: 0,
        saldoFinal: 0
    });

    // Estado para los filtros
    const [filtros, setFiltros] = useState<FiltrosBusqueda>({
        cuentaContable: '',
        identificacionTercero: '',
        nombreTercero: '',
        incluyeSinMovimientos: false,
        anioFiscal: null,
        mesInicial: null,
        mesFinal: null,
        naturaleza: null,
        sucursal: null
    });

    // Opciones para los selects
    const opcionesNaturaleza = [
        { label: 'Todas', value: null },
        { label: 'Deudor', value: 'Deudor' },
        { label: 'Acreedor', value: 'Acreedor' }
    ];

    const opcionesSucursal = [
        { label: 'Todas', value: null },
        { label: 'Sucursal Central', value: 'CENTRAL' },
        { label: 'Sucursal Norte', value: 'NORTE' },
        { label: 'Sucursal Sur', value: 'SUR' },
        { label: 'Sucursal Este', value: 'ESTE' },
        { label: 'Sucursal Oeste', value: 'OESTE' }
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
            const datosMock: BalancePorTercero[] = [
                { nivel: '1', transaccional: false, codigoCuenta: '1105', nombreCuenta: 'Cuentas por Cobrar a Clientes', identificacion: '001-1234567-8', sucursal: 'CENTRAL', nombreTercero: 'Juan Pérez', saldoInicial: 500000, movimientoDebito: 200000, movimientoCredito: 100000, saldoFinal: 600000, naturaleza: 'Deudor' },
                { nivel: '2', transaccional: true, codigoCuenta: '110501', nombreCuenta: 'Clientes Nacionales', identificacion: '001-1234567-8', sucursal: 'CENTRAL', nombreTercero: 'Juan Pérez', saldoInicial: 500000, movimientoDebito: 200000, movimientoCredito: 100000, saldoFinal: 600000, naturaleza: 'Deudor' },
                { nivel: '1', transaccional: false, codigoCuenta: '2105', nombreCuenta: 'Cuentas por Pagar a Proveedores', identificacion: '402-9876543-1', sucursal: 'NORTE', nombreTercero: 'Distribuidora ABC', saldoInicial: 300000, movimientoDebito: 100000, movimientoCredito: 150000, saldoFinal: 350000, naturaleza: 'Acreedor' },
                { nivel: '2', transaccional: true, codigoCuenta: '210501', nombreCuenta: 'Proveedores Nacionales', identificacion: '402-9876543-1', sucursal: 'NORTE', nombreTercero: 'Distribuidora ABC', saldoInicial: 300000, movimientoDebito: 100000, movimientoCredito: 150000, saldoFinal: 350000, naturaleza: 'Acreedor' },
                { nivel: '1', transaccional: false, codigoCuenta: '1105', nombreCuenta: 'Cuentas por Cobrar a Clientes', identificacion: '001-5555555-5', sucursal: 'SUR', nombreTercero: 'María Rodríguez', saldoInicial: 750000, movimientoDebito: 300000, movimientoCredito: 200000, saldoFinal: 850000, naturaleza: 'Deudor' },
                { nivel: '1', transaccional: false, codigoCuenta: '2105', nombreCuenta: 'Cuentas por Pagar a Proveedores', identificacion: '131-1111111-1', sucursal: 'ESTE', nombreTercero: 'Suministros XYZ', saldoInicial: 450000, movimientoDebito: 120000, movimientoCredito: 180000, saldoFinal: 510000, naturaleza: 'Acreedor' },
                { nivel: '1', transaccional: false, codigoCuenta: '1105', nombreCuenta: 'Cuentas por Cobrar a Clientes', identificacion: '001-9999999-9', sucursal: 'OESTE', nombreTercero: 'Carlos Martínez', saldoInicial: 250000, movimientoDebito: 80000, movimientoCredito: 50000, saldoFinal: 280000, naturaleza: 'Deudor' },
            ];

            setDatosBalance(datosMock);
            calcularTotales(datosMock);
            setLoading(false);
        }, 1000);
    }, []);

    // Calcular totales generales
    const calcularTotales = (datos: BalancePorTercero[]) => {
        const totales = {
            saldoInicial: 0,
            debito: 0,
            credito: 0,
            saldoFinal: 0
        };

        datos.forEach(item => {
            totales.saldoInicial += item.saldoInicial;
            totales.debito += item.movimientoDebito;
            totales.credito += item.movimientoCredito;
            totales.saldoFinal += item.saldoFinal;
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
            let datosFiltrados = datosBalance.filter(item => {
                // Filtro por cuenta contable
                if (filtros.cuentaContable &&
                    !item.codigoCuenta.includes(filtros.cuentaContable) &&
                    !item.nombreCuenta.toLowerCase().includes(filtros.cuentaContable.toLowerCase())) {
                    return false;
                }

                // Filtro por identificación de tercero
                if (filtros.identificacionTercero &&
                    !item.identificacion.includes(filtros.identificacionTercero)) {
                    return false;
                }

                // Filtro por nombre de tercero
                if (filtros.nombreTercero &&
                    !item.nombreTercero.toLowerCase().includes(filtros.nombreTercero.toLowerCase())) {
                    return false;
                }

                // Filtro por naturaleza
                if (filtros.naturaleza && item.naturaleza !== filtros.naturaleza) {
                    return false;
                }

                // Filtro por sucursal
                if (filtros.sucursal && item.sucursal !== filtros.sucursal) {
                    return false;
                }

                // Filtro por cuentas sin movimientos
                if (!filtros.incluyeSinMovimientos &&
                    item.movimientoDebito === 0 && item.movimientoCredito === 0) {
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
            identificacionTercero: '',
            nombreTercero: '',
            incluyeSinMovimientos: false,
            anioFiscal: null,
            mesInicial: null,
            mesFinal: null,
            naturaleza: null,
            sucursal: null
        });
        // Aquí podrías también resetear los datos a su estado original
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
                <strong>Total Saldo Inicial:</strong> {formatCurrency(totalGeneral.saldoInicial)}
            </div>
            <div className="col-12 md:col-3">
                <strong>Total Débitos:</strong> {formatCurrency(totalGeneral.debito)}
            </div>
            <div className="col-12 md:col-3">
                <strong>Total Créditos:</strong> {formatCurrency(totalGeneral.credito)}
            </div>
            <div className="col-12 md:col-3">
                <strong>Total Saldo Final:</strong> {formatCurrency(totalGeneral.saldoFinal)}
            </div>
        </div>
    );

    // Estilo condicional para la naturaleza
    const naturalezaBodyTemplate = (rowData: BalancePorTercero) => {
        return (
            <span className={`badge bg-${rowData.naturaleza === 'Deudor' ? 'info' : 'success'}`}>
                {rowData.naturaleza}
            </span>
        );
    };

    // Template para campo transaccional
    const transaccionalTemplate = (rowData: BalancePorTercero) => {
        return rowData.transaccional ? 'Sí' : 'No';
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
                    <div className="col-md-4">
                        <label className="form-label">Cuenta Contable</label>
                        <InputText
                            value={filtros.cuentaContable}
                            onChange={(e) => handleFilterChange('cuentaContable', e.target.value)}
                            placeholder="Buscar por código o nombre..."
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Identificación de tercero */}
                    <div className="col-md-4">
                        <label className="form-label">Identificación Tercero</label>
                        <InputText
                            value={filtros.identificacionTercero}
                            onChange={(e) => handleFilterChange('identificacionTercero', e.target.value)}
                            placeholder="Buscar por identificación..."
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Nombre de tercero */}
                    <div className="col-md-4">
                        <label className="form-label">Nombre Tercero</label>
                        <InputText
                            value={filtros.nombreTercero}
                            onChange={(e) => handleFilterChange('nombreTercero', e.target.value)}
                            placeholder="Buscar por nombre..."
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Naturaleza */}
                    <div className="col-md-4">
                        <label className="form-label">Naturaleza</label>
                        <SelectButton
                            value={filtros.naturaleza}
                            options={opcionesNaturaleza}
                            onChange={(e) => handleFilterChange('naturaleza', e.value)}
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Sucursal */}
                    <div className="col-md-4">
                        <label className="form-label">Sucursal</label>
                        <Dropdown
                            value={filtros.sucursal}
                            options={opcionesSucursal}
                            onChange={(e) => handleFilterChange('sucursal', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione sucursal"
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
                    <div className="col-md-6">
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

                    <div className="col-md-6">
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
                            <label htmlFor="incluyeSinMovimientos" className="ml-2">Incluir registros sin movimientos</label>
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
            <Card title="Resultados del Balance por Tercero">
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
                    <Column field="nivel" header="Nivel" sortable />
                    <Column
                        field="transaccional"
                        header="Transaccional"
                        body={transaccionalTemplate}
                        sortable
                    />
                    <Column field="codigoCuenta" header="Código Cuenta" sortable />
                    <Column field="nombreCuenta" header="Nombre Cuenta" sortable />
                    <Column field="identificacion" header="Identificación" sortable />
                    <Column field="sucursal" header="Sucursal" sortable />
                    <Column field="nombreTercero" header="Nombre Tercero" sortable />
                    <Column
                        field="saldoInicial"
                        header="Saldo Inicial"
                        body={(rowData) => formatCurrency(rowData.saldoInicial)}
                        sortable
                    />
                    <Column
                        field="movimientoDebito"
                        header="Mov. Débito"
                        body={(rowData) => formatCurrency(rowData.movimientoDebito)}
                        sortable
                    />
                    <Column
                        field="movimientoCredito"
                        header="Mov. Crédito"
                        body={(rowData) => formatCurrency(rowData.movimientoCredito)}
                        sortable
                    />
                    <Column
                        field="saldoFinal"
                        header="Saldo Final"
                        body={(rowData) => formatCurrency(rowData.saldoFinal)}
                        sortable
                    />
                    <Column
                        field="naturaleza"
                        header="Naturaleza"
                        body={naturalezaBodyTemplate}
                        sortable
                    />
                </DataTable>
            </Card>
        </div>
    );
};

