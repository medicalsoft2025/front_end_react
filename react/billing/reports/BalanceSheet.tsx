import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { useBalanceGeneral } from './hooks/useBalanceGeneral';
import { useComparativeBalanceGeneral } from './hooks/useComparativeBalanceGeneral';
import { useBalanceGeneralFormat } from '../../documents-generation/hooks/useBalanceGeneralFormat';
import { useComparativeBalanceGeneralFormat } from '../../documents-generation/hooks/useComparativeBalanceGeneralFormat';
import { CustomPRTable, CustomPRTableColumnProps } from '../../components/CustomPRTable';

export type Account = {
    account_code: string;
    account_name: string;
    balance: number;
};

export type ComparativeAccount = {
    account_code: string;
    account_name: string;
    balance_period_1: number;
    balance_period_2: number;
    difference: number;
};

export const BalanceSheet: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("simple");

    const { dateRange: dateRangeBalanceGeneral, setDateRange: setDateRangeBalanceGeneral, fetchBalanceGeneral, balanceGeneral: balanceSheetData } = useBalanceGeneral();
    const { dateRangePeriodOne, dateRangePeriodTwo, setDateRangePeriodOne, setDateRangePeriodTwo, fetchComparativeBalanceGeneral, comparativeBalanceGeneral: comparativeBalanceSheetData } = useComparativeBalanceGeneral();
    const { generarFormatoBalanceGeneral } = useBalanceGeneralFormat();
    const { generateComparativeBalanceGeneralFormat } = useComparativeBalanceGeneralFormat();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const filterAccountsByType = <T extends { account_code: string }>(accounts: T[]): T[] => {
        return accounts.filter(account =>
            account.account_code.startsWith('1') ||
            account.account_code.startsWith('2') ||
            account.account_code.startsWith('3')
        );
    };

    const exportToPdfSimpleReport = () => {
        generarFormatoBalanceGeneral(
            balanceSheetData,
            dateRangeBalanceGeneral
                ?.filter((date) => !!date)
                .map((date) => date.toISOString().split("T")[0])
                .join(' - ') || '--',
            'Impresion'
        );
    };

    const exportToPdfComparativeReport = () => {
        generateComparativeBalanceGeneralFormat(comparativeBalanceSheetData, 'Impresion');
    };

    const renderBalanceStatus = (isBalanced: boolean) => {
        return (
            <div className={`alert ${isBalanced ? 'alert-success' : 'alert-danger'} mt-3`}>
                {isBalanced ? (
                    <span>El balance general está equilibrado</span>
                ) : (
                    <span>El balance general NO está equilibrado</span>
                )}
            </div>
        );
    };

    // Columnas para Balance General
    const simpleBalanceColumns: CustomPRTableColumnProps[] = [
        {
            field: 'account_code',
            header: 'Código',
            sortable: true,
            width: '120px'
        },
        {
            field: 'account_name',
            header: 'Cuenta',
            sortable: true
        },
        {
            field: 'balance',
            header: 'Balance',
            body: (rowData: Account) => formatCurrency(rowData.balance),
            sortable: true,
            style: { textAlign: 'right' }
        }
    ];

    // Columnas para Balance Comparativo
    const comparativeBalanceColumns: CustomPRTableColumnProps[] = [
        {
            field: 'account_code',
            header: 'Código',
            sortable: true,
            width: '100px'
        },
        {
            field: 'account_name',
            header: 'Cuenta',
            sortable: true,
            width: '200px'
        },
        {
            field: 'balance_period_1',
            header: 'Periodo 1',
            body: (rowData: ComparativeAccount) => formatCurrency(rowData.balance_period_1),
            sortable: true,
            style: { textAlign: 'right' }
        },
        {
            field: 'balance_period_2',
            header: 'Periodo 2',
            body: (rowData: ComparativeAccount) => formatCurrency(rowData.balance_period_2),
            sortable: true,
            style: { textAlign: 'right' }
        },
        {
            field: 'difference',
            header: 'Diferencia',
            body: (rowData: ComparativeAccount) => formatCurrency(rowData.difference),
            sortable: true,
            style: { textAlign: 'right' }
        }
    ];




    const handleExport = (type: 'excel' | 'pdf' | 'csv') => {
        console.log("Exportando a:", type);
        // Implementar lógica de exportación específica
    };

    const renderAccountTable = (accounts: Account[], title: string) => {
        const filteredAccounts = filterAccountsByType(accounts);
        return (
            <div className="mb-4">
                <h5 className="mb-3">{title}</h5>
                <CustomPRTable
                    columns={simpleBalanceColumns}
                    data={filteredAccounts}
                    loading={false}
                    onReload={fetchBalanceGeneral}
                    onExport={handleExport}
                    paginator={true}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    emptyMessage={`No se encontraron cuentas para ${title}`}
                    stripedRows={true}
                    showGridlines={true}
                    size="small"
                />
            </div>
        );
    };

    const renderComparativeAccountTable = (accounts: ComparativeAccount[], title: string) => {
        const filteredAccounts = filterAccountsByType(accounts);
        return (
            <div className="mb-4">
                <h5 className="mb-3">{title}</h5>
                <CustomPRTable
                    columns={comparativeBalanceColumns}
                    data={filteredAccounts}
                    loading={false}
                    onReload={fetchBalanceGeneral}
                    onExport={handleExport}
                    paginator={true}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    emptyMessage={`No se encontraron cuentas para ${title}`}
                    stripedRows={true}
                    showGridlines={true}
                    size="small"
                />
            </div>
        );
    };

    const renderSimpleReportFilters = () => (
        <Accordion className="mb-3">
            <AccordionTab header={
                <div className="d-flex align-items-center">
                    <i className="fas fa-filter me-2"></i>
                    Filtros - Balance General
                </div>
            }>
                <div className="row g-3">
                    <div className="col-md-12">
                        <label className="form-label">Rango de fechas</label>
                        <Calendar
                            value={dateRangeBalanceGeneral}
                            onChange={(e) => setDateRangeBalanceGeneral(e.value)}
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
                        onClick={() => setDateRangeBalanceGeneral(null)}
                    />
                    <Button
                        label="Aplicar Filtros"
                        icon="pi pi-filter"
                        className="p-button-primary"
                        onClick={() => fetchBalanceGeneral()}
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
                    Filtros - Balance Comparativo
                </div>
            }>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Periodo 1</label>
                        <Calendar
                            value={dateRangePeriodOne}
                            onChange={(e) => setDateRangePeriodOne(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            className="w-100"
                            placeholder="Seleccione un rango de fechas"
                            showIcon
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Periodo 2</label>
                        <Calendar
                            value={dateRangePeriodTwo}
                            onChange={(e) => setDateRangePeriodTwo(e.value)}
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
                        onClick={() => {
                            setDateRangePeriodOne(null);
                            setDateRangePeriodTwo(null);
                        }}
                    />
                    <Button
                        label="Comparar"
                        icon="pi pi-filter"
                        className="p-button-primary"
                        onClick={fetchComparativeBalanceGeneral}
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

                <Card title="Balance General" className="mb-3">
                    {renderAccountTable(balanceSheetData.categories.assets, "Activos")}
                    {renderAccountTable(balanceSheetData.categories.liabilities, "Pasivos")}
                    {renderAccountTable(balanceSheetData.categories.equity, "Patrimonio")}

                    <div className="mt-4">
                        <h5>Totales</h5>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td><strong>Total Activos</strong></td>
                                    <td className="text-end">{formatCurrency(balanceSheetData.totals.assets)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Pasivos</strong></td>
                                    <td className="text-end">{formatCurrency(balanceSheetData.totals.liabilities)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Patrimonio</strong></td>
                                    <td className="text-end">{formatCurrency(balanceSheetData.totals.equity)}</td>
                                </tr>
                                <tr className="table-secondary">
                                    <td><strong>Diferencia</strong></td>
                                    <td className="text-end">{formatCurrency(balanceSheetData.difference)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {renderBalanceStatus(balanceSheetData.is_balanced)}
                </Card>
            </div>
        );
    };

    const renderComparativeReport = () => {
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

                <Card title="Balance General Comparativo" className="mb-3">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="card bg-light">
                                <div className="card-body">
                                    <h6>Periodo 1</h6>
                                    <p className="mb-0">{comparativeBalanceSheetData.period_1}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card bg-light">
                                <div className="card-body">
                                    <h6>Periodo 2</h6>
                                    <p className="mb-0">{comparativeBalanceSheetData.period_2}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {renderComparativeAccountTable(comparativeBalanceSheetData.comparison.assets, "Activos")}
                    {renderComparativeAccountTable(comparativeBalanceSheetData.comparison.liabilities, "Pasivos")}
                    {renderComparativeAccountTable(comparativeBalanceSheetData.comparison.equity, "Patrimonio")}

                    <div className="mt-4">
                        <h5>Totales Comparativos</h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Cuenta</th>
                                    <th className="text-end">Periodo 1</th>
                                    <th className="text-end">Periodo 2</th>
                                    <th className="text-end">Diferencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Total Activos</strong></td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.total_period_1)}</td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.total_period_2)}</td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.difference)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Pasivos</strong></td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.total_period_1)}</td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.total_period_2)}</td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.difference)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Patrimonio</strong></td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.total_period_1)}</td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.total_period_2)}</td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.difference)}</td>
                                </tr>
                                <tr className="table-secondary">
                                    <td><strong>Resultado del Ejercicio</strong></td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.summary.result_comparison.period_1)}</td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.summary.result_comparison.period_2)}</td>
                                    <td className="text-end">{formatCurrency(comparativeBalanceSheetData.summary.result_comparison.difference)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {renderBalanceStatus(comparativeBalanceSheetData.summary.is_balanced)}
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
                                        <i className="fas fa-balance-scale"></i>
                                        Balance General
                                    </button>
                                    <button
                                        className={`tab-item ${activeTab === "comparative" ? "active" : ""}`}
                                        onClick={() => setActiveTab("comparative")}
                                    >
                                        <i className="fas fa-chart-line"></i>
                                        Balance Comparativo
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