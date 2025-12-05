import React from "react";
import { ThirdPartyBalance } from "../../billing/reports/hooks/useBalanceThirdParty";

export const BalanceThirdPartyFormat: React.FC<{
    balanceData: ThirdPartyBalance[],
    dateRange: string,
    thirdPartyName?: string,
    startAccount?: string,
    endAccount?: string
}> = ({ balanceData, dateRange, thirdPartyName, startAccount, endAccount }) => {

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const renderBalanceTable = () => {
        return (
            <div className="mb-4">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Tercero</th>
                            <th style={{ width: '150px', textAlign: 'right' }}>Total Debe</th>
                            <th style={{ width: '150px', textAlign: 'right' }}>Total Haber</th>
                            <th style={{ width: '150px', textAlign: 'right' }}>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balanceData.map(thirdParty => (
                            <tr key={thirdParty.tercero_id}>
                                <td>{thirdParty.tercero_nombre || 'Sin tercero'}</td>
                                <td className="text-end">{formatCurrency(thirdParty.debe_total)}</td>
                                <td className="text-end">{formatCurrency(thirdParty.haber_total)}</td>
                                <td className="text-end" style={{
                                    fontWeight: 'bold',
                                    color: thirdParty.saldo_final < 0 ? '#e74c3c' : thirdParty.saldo_final > 0 ? '#27ae60' : '#000000'
                                }}>
                                    {formatCurrency(thirdParty.saldo_final)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const calculateTotals = () => {
        const totals = balanceData.reduce((acc, thirdParty) => ({
            debeTotal: acc.debeTotal + thirdParty.debe_total,
            haberTotal: acc.haberTotal + thirdParty.haber_total,
            saldoFinal: acc.saldoFinal + thirdParty.saldo_final
        }), {
            debeTotal: 0,
            haberTotal: 0,
            saldoFinal: 0
        });

        return totals;
    };

    const totals = calculateTotals();

    const getFilterInfo = () => {
        const filters = [];
        if (thirdPartyName) filters.push(`Tercero: ${thirdPartyName}`);
        if (startAccount && endAccount) filters.push(`Rango de cuentas: ${startAccount} - ${endAccount}`);
        return filters.join(' | ');
    };

    const filterInfo = getFilterInfo();

    return <>
        <h3>Balance de Prueba por Tercero | {dateRange}</h3>

        {filterInfo && (
            <div className="mb-3">
                <strong>Filtros aplicados:</strong> {filterInfo}
            </div>
        )}

        {renderBalanceTable()}

        <div className="mt-4">
            <h5>Totales</h5>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Total Débito</strong></td>
                        <td className="text-end">{formatCurrency(totals.debeTotal)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Crédito</strong></td>
                        <td className="text-end">{formatCurrency(totals.haberTotal)}</td>
                    </tr>
                    <tr className="table-secondary">
                        <td><strong>Total Saldo Final</strong></td>
                        <td className="text-end">{formatCurrency(totals.saldoFinal)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <style>{`
            body {
                margin: 0;
                padding: 0;
                color: #000;
                background: #fff;
            }

            .no-print {
                display: none !important;
            }

            .table {
                width: 100%;
                font-size: 12px;
                border-collapse: collapse;
            }

            .table td, .table th {
                border: 1px solid #ccc !important;
                padding: 4px 8px !important;
            }

            .table-secondary {
                background-color: #eaeaea !important;
            }

            .text-end {
                text-align: right !important;
            }
        `}</style>
    </>
};