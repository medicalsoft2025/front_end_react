import React, { useState, CSSProperties } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { BalanceCuentaContable, useBalanceAccountingAccount } from './hooks/useBalanceAccountingAccount';
import { formatDateRange, formatPrice } from '../../../services/utilidades';
import { useBalanceAccountingAccountFormat } from '../../documents-generation/hooks/useBalanceAccountingAccountFormat';
import { AccountingAccountsRange } from '../../fields/ranges/AccountingAccountsRange';
import { CustomPRTable, CustomPRTableColumnProps } from '../../components/CustomPRTable';

export const BalanceAccountingAccount: React.FC = () => {
    const { dateRange, setDateRange, startAccount, endAccount, setStartAccount, setEndAccount, balanceAccountingAccount, fetchBalanceAccountingAccount, loading } = useBalanceAccountingAccount();
    const { generarFormatoBalanceAccountingAccount } = useBalanceAccountingAccountFormat();

    // Columnas para la CustomPRTable
    const columns: CustomPRTableColumnProps[] = [
        {
            field: 'cuenta_codigo',
            header: 'Código',
            body: (rowData: BalanceCuentaContable) => rowData.cuenta_codigo || 'Sin código',
            sortable: true
        },
        {
            field: 'cuenta_nombre',
            header: 'Nombre de Cuenta',
            body: (rowData: BalanceCuentaContable) => rowData.cuenta_nombre || 'Sin nombre',
            sortable: true
        },
        {
            field: 'saldo_inicial',
            header: 'Saldo Inicial',
            body: (rowData: BalanceCuentaContable) => formatPrice(rowData.saldo_inicial),
            sortable: true,
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'debe_total',
            header: 'Total Débito',
            body: (rowData: BalanceCuentaContable) => formatPrice(rowData.debe_total),
            sortable: true,
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'haber_total',
            header: 'Total Crédito',
            body: (rowData: BalanceCuentaContable) => formatPrice(rowData.haber_total),
            sortable: true,
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'saldo_final',
            header: 'Saldo Final',
            body: (rowData: BalanceCuentaContable) => (
                <span style={{
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: rowData.saldo_final < 0 ? '#e74c3c' : rowData.saldo_final > 0 ? '#27ae60' : '#000000'
                }}>
                    {formatPrice(rowData.saldo_final)}
                </span>
            ),
            sortable: true
        }
    ];

    const exportToPdfComparativeReport = () => {
        generarFormatoBalanceAccountingAccount(balanceAccountingAccount, formatDateRange(dateRange), 'Impresion');
    };



    const handleExport = (type: 'excel' | 'pdf' | 'csv') => {
        console.log("Exportando a:", type);
    };

    const renderFiltersAccordion = () => (
        <Accordion className="mb-3">
            <AccordionTab header={
                <div className="d-flex align-items-center">
                    <i className="fas fa-filter me-2"></i>
                    Filtros - Balance de Cuentas Contables
                </div>
            }>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="dateRange" className="form-label">Rango de fechas</label>
                        <Calendar
                            id="dateRange"
                            selectionMode="range"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.value)}
                            className="w-100"
                            showIcon
                            dateFormat="dd/mm/yy"
                            placeholder="Seleccione un rango"
                        />
                    </div>

                    <div className="col-md-6">
                        <AccountingAccountsRange
                            startValue={startAccount}
                            endValue={endAccount}
                            handleStartChange={(e: any) => setStartAccount(e.value)}
                            handleEndChange={(e: any) => setEndAccount(e.value)}
                            optionValue='account_code'
                        />
                    </div>
                </div>
            </AccordionTab>
        </Accordion>
    );

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
                                    <button className="tab-item active">
                                        <i className="fas fa-balance-scale"></i>
                                        Balance de Cuentas Contables
                                    </button>
                                </div>

                                <div className="tabs-content">
                                    <div className="tab-panel active">
                                        <div className="d-flex justify-content-end mb-3">
                                            <Button
                                                icon={<i className='fas fa-file-pdf me-2'></i>}
                                                label="Exportar a PDF"
                                                className="p-button-primary"
                                                onClick={exportToPdfComparativeReport}
                                            />
                                        </div>

                                        {renderFiltersAccordion()}

                                        <CustomPRTable
                                            columns={columns}
                                            data={balanceAccountingAccount}
                                            loading={loading}
                                            onReload={fetchBalanceAccountingAccount}
                                            onExport={handleExport}
                                            paginator={true}
                                            rows={10}
                                            rowsPerPageOptions={[5, 10, 25, 50]}
                                            emptyMessage="No se encontraron movimientos"
                                            stripedRows={true}
                                            showGridlines={true}
                                            size="normal"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{` div[data-pc-section="panel"]{
                    top: 300px !important;
                }
                .p-accordion .p-accordion-tab .p-accordion-content{
                overflow: auto !important;
                    }`}</style>
        </main>
    );
};