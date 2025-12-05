import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Accordion, AccordionTab } from "primereact/accordion";
import { CSSProperties } from "react";
import { ThirdPartyBalance, useBalanceThirdParty } from "./hooks/useBalanceThirdParty";
import { ThirdPartyDropdown } from "../../fields/dropdowns/ThirdPartyDropdown";
import { AccountingAccountsRange } from "../../fields/ranges/AccountingAccountsRange";
import { Button } from "primereact/button";
import { useBalanceThirdPartyFormat } from "../../documents-generation/hooks/useBalanceThirdPartyFormat";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { formatDateRange } from "../../../services/utilidades";

interface TrialBalanceByThirdPartyProps {
    fetchData: (startDate: string, endDate: string) => Promise<any[]>;
}

export const BalanceThirdParty: React.FC<TrialBalanceByThirdPartyProps> = () => {
    const {
        dateRange,
        setDateRange,
        thirdPartyId,
        setThirdPartyId,
        balanceThirdParty,
        loading,
        startAccount,
        endAccount,
        setStartAccount,
        setEndAccount
    } = useBalanceThirdParty();

    const { generarFormatoBalanceThirdParty } = useBalanceThirdPartyFormat();

    const formatCurrency = (value: number) => {
        return `$${value.toFixed(2)}`;
    };

    // Columnas para la tabla CustomPRTable
    const columns: CustomPRTableColumnProps[] = [
        {
            field: 'tercero_nombre',
            header: 'Tercero',
            body: (rowData: ThirdPartyBalance) => rowData.tercero_nombre || 'Sin tercero',
            sortable: true
        },
        {
            field: 'debe_total',
            header: 'Total Debe',
            body: (rowData: ThirdPartyBalance) => formatCurrency(rowData.debe_total),
            style: { textAlign: 'right' } as CSSProperties,
            sortable: true
        },
        {
            field: 'haber_total',
            header: 'Total Haber',
            body: (rowData: ThirdPartyBalance) => formatCurrency(rowData.haber_total),
            style: { textAlign: 'right' } as CSSProperties,
            sortable: true
        },
        {
            field: 'saldo_final',
            header: 'Saldo',
            body: (rowData: ThirdPartyBalance) => (
                <span style={{
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: rowData.saldo_final < 0 ? '#e74c3c' : rowData.saldo_final > 0 ? '#27ae60' : '#000000'
                }}>
                    {formatCurrency(Math.abs(rowData.saldo_final))}
                </span>
            ),
            sortable: true
        }
    ];

    const exportToPdf = () => {
        generarFormatoBalanceThirdParty(balanceThirdParty, formatDateRange(dateRange), 'Impresion');
    };

    const handleSearch = (searchValue: string) => {
        console.log("Buscando:", searchValue);
        // Implementar lógica de búsqueda si es necesario
    };


    const renderFiltersAccordion = () => (
        <Accordion className="mb-3">
            <AccordionTab header={
                <div className="d-flex align-items-center">
                    <i className="fas fa-filter me-2"></i>
                    Filtros
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
                        <label className="form-label">Tercero</label>
                        <ThirdPartyDropdown
                            value={thirdPartyId}
                            handleChange={(e: any) => setThirdPartyId(e.value)}
                        />
                    </div>
                    <div className="col-md-12">
                        <AccountingAccountsRange
                            startValue={startAccount}
                            endValue={endAccount}
                            handleStartChange={(e: any) => setStartAccount(e.value)}
                            handleEndChange={(e: any) => setEndAccount(e.value)}
                            optionValue='account_code'
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button
                        label="Limpiar Filtros"
                        icon="pi pi-trash"
                        className="p-button-secondary"
                        onClick={() => {
                            setDateRange(null);
                            setThirdPartyId(null);
                            setStartAccount(null);
                            setEndAccount(null);
                        }}
                    />
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
                                        Balance por Tercero
                                    </button>
                                </div>

                                <div className="tabs-content">
                                    <div className="tab-panel active">
                                        <div className="d-flex justify-content-end mb-3">
                                            <Button
                                                icon={<i className='fas fa-file-pdf me-2'></i>}
                                                label="Exportar a PDF"
                                                className="p-button-primary"
                                                onClick={exportToPdf}
                                            />
                                        </div>

                                        {renderFiltersAccordion()}

                                        <CustomPRTable
                                            columns={columns}
                                            data={balanceThirdParty}
                                            loading={loading}
                                            onSearch={handleSearch}
                                            paginator={true}
                                            rows={10}
                                            rowsPerPageOptions={[5, 10, 25, 50]}
                                            emptyMessage="No se encontraron movimientos"
                                            stripedRows={true}
                                            size="normal"
                                        />
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