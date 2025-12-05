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
type CuentaContable = {
    nivel: string;
    transaccional: boolean;
    codigo: string;
    nombre: string;
    saldoInicial: number;
    movimientoDebito: number;
    movimientoCredito: number;
    saldoFinal: number;
    diferenciaFiscal: boolean;
};

type FiltrosBusqueda = {
    cuentaContable: string;
    incluyeDiferenciaFiscal: string | null;
    anioFiscal: Date | null;
    mesInicial: number | null;
    mesFinal: number | null;
    incluyeCierre: boolean;
};

export const BalanceSheet: React.FC = () => {
    // Estado para los datos de la tabla
    const [cuentasContables, setCuentasContables] = useState<CuentaContable[]>([]);
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
        incluyeDiferenciaFiscal: null,
        anioFiscal: null,
        mesInicial: null,
        mesFinal: null,
        incluyeCierre: false
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
                { nivel: '1', transaccional: false, codigo: '1101', nombre: 'Caja General', saldoInicial: 1000000, movimientoDebito: 500000, movimientoCredito: 200000, saldoFinal: 1300000, diferenciaFiscal: false },
                { nivel: '2', transaccional: true, codigo: '110101', nombre: 'Caja Principal', saldoInicial: 800000, movimientoDebito: 300000, movimientoCredito: 100000, saldoFinal: 1000000, diferenciaFiscal: false },
                { nivel: '1', transaccional: false, codigo: '1102', nombre: 'Cuentas Bancarias', saldoInicial: 5000000, movimientoDebito: 2000000, movimientoCredito: 1500000, saldoFinal: 5500000, diferenciaFiscal: true },
                { nivel: '2', transaccional: true, codigo: '110201', nombre: 'Banco Popular', saldoInicial: 3000000, movimientoDebito: 1000000, movimientoCredito: 500000, saldoFinal: 3500000, diferenciaFiscal: true },
                { nivel: '1', transaccional: false, codigo: '1201', nombre: 'Cuentas por Cobrar', saldoInicial: 3000000, movimientoDebito: 1000000, movimientoCredito: 500000, saldoFinal: 3500000, diferenciaFiscal: false },
            ];

            setCuentasContables(datosMock);
            calcularTotales(datosMock);
            setLoading(false);
        }, 1000);
    }, []);

    // Calcular totales generales
    const calcularTotales = (datos: CuentaContable[]) => {
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
        // Aquí iría la lógica para filtrar los datos, normalmente una llamada a API
        setTimeout(() => {
            // Simulación de filtrado
            const datosFiltrados = cuentasContables.filter(cuenta => {
                // Filtro por cuenta contable
                if (filtros.cuentaContable &&
                    !cuenta.codigo.includes(filtros.cuentaContable) &&
                    !cuenta.nombre.toLowerCase().includes(filtros.cuentaContable.toLowerCase())) {
                    return false;
                }

                // Filtro por diferencia fiscal
                if (filtros.incluyeDiferenciaFiscal === 'si' && !cuenta.diferenciaFiscal) {
                    return false;
                }
                if (filtros.incluyeDiferenciaFiscal === 'no' && cuenta.diferenciaFiscal) {
                    return false;
                }

                return true;
            });

            setCuentasContables(datosFiltrados);
            calcularTotales(datosFiltrados);
            setLoading(false);
        }, 500);
    };

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setFiltros({
            cuentaContable: '',
            incluyeDiferenciaFiscal: null,
            anioFiscal: null,
            mesInicial: null,
            mesFinal: null,
            incluyeCierre: false
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
                <strong>Saldo Inicial:</strong> {formatCurrency(totalGeneral.saldoInicial)}
            </div>
            <div className="col-12 md:col-3">
                <strong>Total Débito:</strong> {formatCurrency(totalGeneral.debito)}
            </div>
            <div className="col-12 md:col-3">
                <strong>Total Crédito:</strong> {formatCurrency(totalGeneral.credito)}
            </div>
            <div className="col-12 md:col-3">
                <strong>Saldo Final:</strong> {formatCurrency(totalGeneral.saldoFinal)}
            </div>
        </div>
    );

    return (
        <div className="container-fluid mt-4" style={{ padding: '0 15px' }}>
            {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <Button
                    label="Nuevo Comprobante Contable"
                    icon="pi pi-plus"
                    className="btn btn-primary"
                    onClick={() => console.log('Nuevo comprobante')}
                />
            </div> */}
            <Card title="Filtros de Búsqueda" className="mb-4">
                <div className="row g-3">
                    {/* Filtro: Cuenta contable */}
                    <div className="col-md-6">
                        <label className="form-label">Cuenta Contable</label>
                        <InputText
                            value={filtros.cuentaContable}
                            onChange={(e) => handleFilterChange('cuentaContable', e.target.value)}
                            placeholder="Buscar por código o nombre..."
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Incluye cuenta contable de diferencia fiscal */}
                    <div className="col-md-6">
                        <label className="form-label">Incluye diferencia fiscal</label>
                        <SelectButton
                            value={filtros.incluyeDiferenciaFiscal}
                            options={opcionesSiNo}
                            onChange={(e) => handleFilterChange('incluyeDiferenciaFiscal', e.value)}
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

                    {/* Filtro: Incluye cierre */}
                    <div className="col-md-12">
                        <div className="field-checkbox">
                            <Checkbox
                                inputId="incluyeCierre"
                                checked={filtros.incluyeCierre}
                                onChange={(e) => handleFilterChange('incluyeCierre', e.checked)}
                            />
                            <label htmlFor="incluyeCierre" className="ml-2">Incluir cierre contable</label>
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
                            label="Generar Reporte"
                            className='btn btn-primary'
                            icon="pi pi-filter"
                            onClick={aplicarFiltros}
                            loading={loading}
                        />
                    </div>
                </div>
            </Card>

            {/* Tabla de resultados */}
            <Card title="Resultados del Reporte">
                <DataTable
                    value={cuentasContables}
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
                        body={(rowData) => rowData.transaccional ? 'Sí' : 'No'}
                        sortable
                    />
                    <Column field="codigo" header="Código" sortable />
                    <Column field="nombre" header="Nombre Cuenta" sortable />
                    <Column
                        field="saldoInicial"
                        header="Saldo Inicial"
                        body={(rowData) => formatCurrency(rowData.saldoInicial)}
                        sortable
                    />
                    <Column
                        field="movimientoDebito"
                        header="Débito"
                        body={(rowData) => formatCurrency(rowData.movimientoDebito)}
                        sortable
                    />
                    <Column
                        field="movimientoCredito"
                        header="Crédito"
                        body={(rowData) => formatCurrency(rowData.movimientoCredito)}
                        sortable
                    />
                    <Column
                        field="saldoFinal"
                        header="Saldo Final"
                        body={(rowData) => formatCurrency(rowData.saldoFinal)}
                        sortable
                    />
                </DataTable>
            </Card>
        </div>
    );
};

