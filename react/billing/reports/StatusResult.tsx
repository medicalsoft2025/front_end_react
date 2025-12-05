import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { useStatusResult } from './hooks/useStatusResult';
import { useComparativeStatusResult } from './hooks/useComparativeStatusResult';
import { useStatusResultFormat } from '../../documents-generation/hooks/useStatusResultFormat';
import { useComparativeStatusResultFormat } from '../../documents-generation/hooks/useComparativeStatusResultFormat';
import { CustomPRTable, CustomPRTableColumnProps } from '../../components/CustomPRTable';

export type Account = {
    codigo: string;
    nombre: string;
    categoria: string;
    total_creditos: string;
    total_debitos: string;
};

export type ComparativeAccount = {
    codigo: string;
    nombre: string;
    categoria: string;
    total_creditos: string;
    total_debitos: string;
};

type IncomeStatementData = {
    periodo: {
        desde: string;
        hasta: string;
    };
    resumen: {
        ingresos: number;
        costos: number;
        gastos: number;
        utilidad_bruta: number;
        utilidad_neta: number;
    };
    detalles: {
        categoria: string;
        total_creditos: string;
        total_debitos: string;
    }[];
    cuentas: Account[];
};

type ComparativeIncomeStatementData = {
    periodo: {
        desde: {
            current: string;
            previous: string;
            difference: number | null;
            percentage_change: number | null;
        };
        hasta: {
            current: string;
            previous: string;
            difference: number | null;
            percentage_change: number | null;
        };
    };
    resumen: {
        ingresos: {
            current: number;
            previous: number;
            difference: number;
            percentage_change: number | null;
        };
        costos: {
            current: number;
            previous: number;
            difference: number;
            percentage_change: number | null;
        };
        gastos: {
            current: number;
            previous: number;
            difference: number;
            percentage_change: number | null;
        };
        utilidad_bruta: {
            current: number;
            previous: number;
            difference: number;
            percentage_change: number | null;
        };
        utilidad_neta: {
            current: number;
            previous: number;
            difference: number;
            percentage_change: number | null;
        };
    };
    detalles: {
        current: {
            categoria: string;
            total_creditos: string;
            total_debitos: string;
        }[];
        previous: {
            categoria: string;
            total_creditos: string;
            total_debitos: string;
        }[];
        difference: number | null;
        percentage_change: number | null;
    };
    cuentas: {
        current: ComparativeAccount[];
        previous: ComparativeAccount[];
        difference: number | null;
        percentage_change: number | null;
    };
};

export const StatusResult: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("simple");

    const { dateRange, setDateRange, statusResult: incomeStatementData, fetchStatusResult } = useStatusResult();
    const { dateRangePeriodOne, setDateRangePeriodOne, dateRangePeriodTwo, setDateRangePeriodTwo, comparativeStatusResult: comparativeIncomeStatementData, fetchComparativeStatusResult } = useComparativeStatusResult();
    const { generateStatusResultFormat } = useStatusResultFormat();
    const { generateComparativeStatusResultFormat } = useComparativeStatusResultFormat();

    const formatCurrency = (value: number | string) => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numValue);
    };

    const formatPercentage = (value: number | null) => {
        if (value === null) return 'N/A';
        return new Intl.NumberFormat('es-DO', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    };

    const getPercentageColor = (value: number | null) => {
        if (value === null) return 'secondary';
        return value > 0 ? 'success' : value < 0 ? 'danger' : 'info';
    };

    const exportToPdfSimpleReport = () => {
        generateStatusResultFormat(
            incomeStatementData,
            'Impresion'
        );
    };

    const exportToPdfComparativeReport = () => {
        generateComparativeStatusResultFormat(comparativeIncomeStatementData, 'Impresion');
    };

    // Columnas para cuentas simples
    const simpleAccountColumns: CustomPRTableColumnProps[] = [
        {
            field: 'codigo',
            header: 'Código',
            sortable: true,
            width: '120px'
        },
        {
            field: 'nombre',
            header: 'Cuenta',
            sortable: true
        },
        {
            field: 'total_creditos',
            header: 'Créditos',
            body: (rowData: Account) => formatCurrency(rowData.total_creditos),
            sortable: true,
            style: { textAlign: 'right' }
        },
        {
            field: 'total_debitos',
            header: 'Débitos',
            body: (rowData: Account) => formatCurrency(rowData.total_debitos),
            sortable: true,
            style: { textAlign: 'right' }
        }
    ];

    // Columnas para cuentas comparativas
    const comparativeAccountColumns: CustomPRTableColumnProps[] = [
        {
            field: 'codigo',
            header: 'Código',
            sortable: true,
            width: '100px'
        },
        {
            field: 'nombre',
            header: 'Cuenta',
            sortable: true,
            width: '200px'
        },
        {
            field: 'total_creditos',
            header: 'Créditos',
            body: (rowData: ComparativeAccount) => formatCurrency(rowData.total_creditos),
            sortable: true,
            style: { textAlign: 'right' }
        },
        {
            field: 'total_debitos',
            header: 'Débitos',
            body: (rowData: ComparativeAccount) => formatCurrency(rowData.total_debitos),
            sortable: true,
            style: { textAlign: 'right' }
        }
    ];

    // Columnas para detalles por categoría
    const categoryColumns: CustomPRTableColumnProps[] = [
        {
            field: 'categoria',
            header: 'Categoría',
            sortable: true
        },
        {
            field: 'total_creditos',
            header: 'Total Créditos',
            body: (rowData: any) => formatCurrency(rowData.total_creditos),
            sortable: true,
            style: { textAlign: 'right' }
        },
        {
            field: 'total_debitos',
            header: 'Total Débitos',
            body: (rowData: any) => formatCurrency(rowData.total_debitos),
            sortable: true,
            style: { textAlign: 'right' }
        }
    ];

    // Columnas para resumen comparativo
    const comparativeSummaryColumns: CustomPRTableColumnProps[] = [
        {
            field: 'concepto',
            header: 'Concepto',
            sortable: true
        },
        {
            field: 'current',
            header: 'Periodo Actual',
            body: (rowData: any) => formatCurrency(rowData.current),
            sortable: true,
            style: { textAlign: 'right' }
        },
        {
            field: 'previous',
            header: 'Periodo Anterior',
            body: (rowData: any) => formatCurrency(rowData.previous),
            sortable: true,
            style: { textAlign: 'right' }
        },
        {
            field: 'difference',
            header: 'Diferencia',
            body: (rowData: any) => (
                <span className={`fw-bold ${rowData.difference > 0 ? 'text-success' :
                    rowData.difference < 0 ? 'text-danger' : 'text-muted'
                    }`}>
                    {formatCurrency(rowData.difference)}
                </span>
            ),
            sortable: true,
            style: { textAlign: 'right' }
        },
        {
            field: 'percentage_change',
            header: '% Cambio',
            body: (rowData: any) => (
                <Badge
                    value={formatPercentage(rowData.percentage_change)}
                    severity={getPercentageColor(rowData.percentage_change)}
                />
            ),
            style: { textAlign: 'center' }
        }
    ];

    const handleReload = () => {
        /* window.location.reload();*/
    };

    const handleExport = (type: 'excel' | 'pdf' | 'csv') => {
        console.log("Exportando a:", type);
    };

    const renderAccountTable = (accounts: Account[], title: string) => {
        return (
            <Panel header={title} toggleable className="mb-4">
                <CustomPRTable
                    columns={simpleAccountColumns}
                    data={accounts}
                    loading={false}
                    onReload={handleReload}
                    onExport={handleExport}
                    paginator={true}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    emptyMessage={`No se encontraron cuentas para ${title}`}
                    stripedRows={true}
                    showGridlines={true}
                    size="small"
                />
            </Panel>
        );
    };

    const renderComparativeAccountTable = (accounts: ComparativeAccount[], title: string, period: 'current' | 'previous') => {
        return (
            <Panel
                header={`${title} (${period === 'current' ? 'Periodo Actual' : 'Periodo Anterior'})`}
                toggleable
                className="mb-4"
            >
                <CustomPRTable
                    columns={comparativeAccountColumns}
                    data={accounts}
                    loading={false}
                    onReload={handleReload}
                    onExport={handleExport}
                    paginator={true}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    emptyMessage={`No se encontraron cuentas para ${title}`}
                    stripedRows={true}
                    showGridlines={true}
                    size="small"
                />
            </Panel>
        );
    };

    const renderSimpleReportFilters = () => (
        <Accordion className="mb-3">
            <AccordionTab header={
                <div className="d-flex align-items-center">
                    <i className="fas fa-filter me-2"></i>
                    Filtros - Estado de Resultados Simple
                </div>
            }>
                <div className="row g-3">
                    <div className="col-md-12">
                        <label className="form-label">Rango de Fechas</label>
                        <Calendar
                            value={dateRange}
                            onChange={(e) => setDateRange(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            className="w-100"
                            placeholder="Seleccione un rango de fechas"
                            showIcon
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button
                        label="Limpiar Filtros"
                        icon="pi pi-trash"
                        className="p-button-secondary"
                        onClick={() => setDateRange(null)}
                    />
                    <Button
                        label="Generar Reporte"
                        icon="pi pi-refresh"
                        className="p-button-primary"
                        onClick={fetchStatusResult}
                    />
                </div>
            </AccordionTab>
        </Accordion>
    );

    const renderComparativeReportFilters = () => (
        <Accordion className="mb-3">
            <AccordionTab header={
                <div className="d-flex align-items-center">
                    <i className="fas fa-filter me-2"></i>
                    Filtros - Análisis Comparativo
                </div>
            }>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Periodo Actual</label>
                        <Calendar
                            value={dateRangePeriodOne}
                            onChange={(e) => setDateRangePeriodOne(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            className="w-100"
                            placeholder="Seleccione rango de fechas"
                            showIcon
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Periodo Anterior</label>
                        <Calendar
                            value={dateRangePeriodTwo}
                            onChange={(e) => setDateRangePeriodTwo(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            className="w-100"
                            placeholder="Seleccione rango de fechas"
                            showIcon
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button
                        label="Limpiar Filtros"
                        icon="pi pi-trash"
                        className="p-button-secondary"
                        onClick={() => {
                            setDateRangePeriodOne(null);
                            setDateRangePeriodTwo(null);
                        }}
                    />
                    <Button
                        label="Comparar"
                        icon="pi pi-filter"
                        className="p-button-primary"
                        onClick={fetchComparativeStatusResult}
                    />
                </div>
            </AccordionTab>
        </Accordion>
    );

    const renderSimpleReport = () => {
        return (
            <div>
                <div className="d-flex justify-content-end mb-3">
                    <Button
                        icon={<i className='fas fa-file-pdf me-2'></i>}
                        label="Exportar a PDF"
                        className="p-button-primary"
                        onClick={exportToPdfSimpleReport}
                    />
                </div>

                {renderSimpleReportFilters()}

                <Card title="Estado de Resultados" className="mb-3">
                    {/* Resumen Ejecutivo */}
                    <Panel header="Resumen Ejecutivo" toggleable className="mb-4">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="card border-0 bg-light-success">
                                    <div className="card-body text-center">
                                        <i className="pi pi-arrow-up-right text-success mb-2" style={{ fontSize: '1.5rem' }}></i>
                                        <h5 className="text-success">{formatCurrency(incomeStatementData.resumen.ingresos)}</h5>
                                        <small className="text-muted">Ingresos Totales</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 bg-light-warning">
                                    <div className="card-body text-center">
                                        <i className="pi pi-chart-line text-warning mb-2" style={{ fontSize: '1.5rem' }}></i>
                                        <h5 className="text-warning">{formatCurrency(incomeStatementData.resumen.utilidad_bruta)}</h5>
                                        <small className="text-muted">Utilidad Bruta</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 bg-light-primary">
                                    <div className="card-body text-center">
                                        <i className="pi pi-dollar text-primary mb-2" style={{ fontSize: '1.5rem' }}></i>
                                        <h5 className="text-primary">{formatCurrency(incomeStatementData.resumen.utilidad_neta)}</h5>
                                        <small className="text-muted">Utilidad Neta</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <table className="table table-hover">
                            <tbody>
                                <tr>
                                    <td className="fw-semibold">Ingresos</td>
                                    <td className="text-end text-success fw-bold">{formatCurrency(incomeStatementData.resumen.ingresos)}</td>
                                </tr>
                                <tr>
                                    <td className="fw-semibold">Costos</td>
                                    <td className="text-end text-danger fw-bold">{formatCurrency(incomeStatementData.resumen.costos)}</td>
                                </tr>
                                <tr className="table-active">
                                    <td className="fw-bold">Utilidad Bruta</td>
                                    <td className="text-end fw-bold">{formatCurrency(incomeStatementData.resumen.utilidad_bruta)}</td>
                                </tr>
                                <tr>
                                    <td className="fw-semibold">Gastos</td>
                                    <td className="text-end text-warning fw-bold">{formatCurrency(incomeStatementData.resumen.gastos)}</td>
                                </tr>
                                <tr className="table-success">
                                    <td className="fw-bold">Utilidad Neta</td>
                                    <td className="text-end fw-bold">{formatCurrency(incomeStatementData.resumen.utilidad_neta)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Panel>

                    {/* Detalles por Categoría */}
                    <Panel header="Detalles por Categoría" toggleable className="mb-4">
                        <CustomPRTable
                            columns={categoryColumns}
                            data={incomeStatementData.detalles}
                            loading={false}
                            onReload={handleReload}
                            onExport={handleExport}
                            paginator={true}
                            rows={5}
                            emptyMessage="No se encontraron detalles por categoría"
                            stripedRows={true}
                            showGridlines={true}
                            size="small"
                        />
                    </Panel>

                    {renderAccountTable(incomeStatementData.cuentas, "Detalle de Cuentas")}
                </Card>
            </div>
        );
    };

    const renderComparativeReport = () => {
        const comparativeSummaryData = [
            { concepto: 'Ingresos', ...comparativeIncomeStatementData.resumen.ingresos },
            { concepto: 'Costos', ...comparativeIncomeStatementData.resumen.costos },
            { concepto: 'Utilidad Bruta', ...comparativeIncomeStatementData.resumen.utilidad_bruta },
            { concepto: 'Gastos', ...comparativeIncomeStatementData.resumen.gastos },
            { concepto: 'Utilidad Neta', ...comparativeIncomeStatementData.resumen.utilidad_neta }
        ];

        return (
            <div>
                <div className="d-flex justify-content-end mb-3">
                    <Button
                        icon={<i className='fas fa-file-pdf me-2'></i>}
                        label="Exportar a PDF"
                        className="p-button-primary"
                        onClick={exportToPdfComparativeReport}
                    />
                </div>

                {renderComparativeReportFilters()}

                <Card title="Estado de Resultados Comparativo" className="mb-3">
                    {/* Periodos */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card bg-primary text-white">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <i className="pi pi-calendar mr-3" style={{ fontSize: '2rem' }}></i>
                                        <div>
                                            <h6 className="mb-1 text-white font-medium">Periodo Actual</h6>
                                            <p className="mb-0 fw-bold">
                                                {comparativeIncomeStatementData.periodo.desde.current} al {comparativeIncomeStatementData.periodo.hasta.current}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card bg-secondary text-white">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <i className="pi pi-calendar-times mr-3" style={{ fontSize: '2rem' }}></i>
                                        <div>
                                            <h6 className="mb-1 text-white font-medium">Periodo Anterior</h6>
                                            <p className="mb-0 fw-bold">
                                                {comparativeIncomeStatementData.periodo.desde.previous} al {comparativeIncomeStatementData.periodo.hasta.previous}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen Comparativo */}
                    <Panel header="Resumen Comparativo" toggleable className="mb-4">
                        <CustomPRTable
                            columns={comparativeSummaryColumns}
                            data={comparativeSummaryData}
                            loading={false}
                            onReload={handleReload}
                            onExport={handleExport}
                            paginator={false}
                            emptyMessage="No se encontraron datos comparativos"
                            stripedRows={true}
                            showGridlines={true}
                            size="small"
                        />
                    </Panel>

                    {/* Detalles Comparativos */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <Panel header="Detalles - Periodo Actual" toggleable className="h-100">
                                <CustomPRTable
                                    columns={categoryColumns}
                                    data={comparativeIncomeStatementData.detalles.current}
                                    loading={false}
                                    onReload={handleReload}
                                    onExport={handleExport}
                                    paginator={true}
                                    rows={5}
                                    emptyMessage="No se encontraron detalles para el periodo actual"
                                    stripedRows={true}
                                    showGridlines={true}
                                    size="small"
                                />
                            </Panel>
                        </div>
                        <div className="col-md-6">
                            <Panel header="Detalles - Periodo Anterior" toggleable className="h-100">
                                <CustomPRTable
                                    columns={categoryColumns}
                                    data={comparativeIncomeStatementData.detalles.previous}
                                    loading={false}
                                    onReload={handleReload}
                                    onExport={handleExport}
                                    paginator={true}
                                    rows={5}
                                    emptyMessage="No se encontraron detalles para el periodo anterior"
                                    stripedRows={true}
                                    showGridlines={true}
                                    size="small"
                                />
                            </Panel>
                        </div>
                    </div>

                    {/* Cuentas Comparativas */}
                    {renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.current, "Detalle de Cuentas", 'current')}
                    {renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.previous, "Detalle de Cuentas", 'previous')}
                </Card>
            </div>
        );
    };

    const renderActiveComponent = () => {
        switch (activeTab) {
            case "simple":
                return renderSimpleReport();
            case "comparative":
                return renderComparativeReport();
            default:
                return renderSimpleReport();
        }
    };

    return (
        <main className="main" id="top">
            <div className="row g-3 justify-content-between align-items-start mb-4">
                <div className="col-12">
                    <div
                        className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                        style={{ minHeight: "400px" }}
                    >
                        <div className="card-body h-100 w-100 d-flex flex-column">
                            <div className="tabs-professional-container">
                                <div className="tabs-header">
                                    <button
                                        className={`tab-item ${activeTab === "simple" ? "active" : ""}`}
                                        onClick={() => setActiveTab("simple")}
                                    >
                                        <i className="fas fa-chart-bar"></i>
                                        Reporte Simple
                                    </button>
                                    <button
                                        className={`tab-item ${activeTab === "comparative" ? "active" : ""}`}
                                        onClick={() => setActiveTab("comparative")}
                                    >
                                        <i className="fas fa-chart-line"></i>
                                        Análisis Comparativo
                                    </button>
                                </div>

                                <div className="tabs-content">
                                    <div className={`tab-panel ${activeTab === "simple" ? "active" : ""}`}>
                                        {renderActiveComponent()}
                                    </div>
                                    <div className={`tab-panel ${activeTab === "comparative" ? "active" : ""}`}>
                                        {renderActiveComponent()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};