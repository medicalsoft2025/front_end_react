import React from "react";
import { CuentaContable, Movimiento } from '../../accounting/types/bankTypes';

export const AuxiliaryMovementFormat: React.FC<{
    cuentasContables: CuentaContable[],
    dateRange: string,
    startAccount?: string,
    endAccount?: string
}> = ({ cuentasContables, dateRange, startAccount, endAccount }) => {

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-DO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const calcularTotales = () => {
        const totals = cuentasContables.reduce((acc, cuenta) => ({
            totalRegistros: acc.totalRegistros + cuenta.movimientos.length,
            totalSaldoFinal: acc.totalSaldoFinal + cuenta.saldo_final,
            totalSaldoInicial: acc.totalSaldoInicial + parseFloat(cuenta.saldo_inicial)
        }), {
            totalRegistros: 0,
            totalSaldoFinal: 0,
            totalSaldoInicial: 0
        });

        return totals;
    };

    const totals = calcularTotales();

    const renderMovimientosTable = (movimientos: Movimiento[]) => {
        return (
            <div style={{ marginTop: '5px' }}>
                <table className="table table-bordered" style={{ fontSize: '11px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '75px' }}>Fecha</th>
                            <th style={{ width: '80px' }}>Asiento</th>
                            <th>Descripción</th>
                            <th>Tercero</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Débito</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Crédito</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimientos.map((movimiento, index) => (
                            <tr key={index}>
                                <td>{formatDate(movimiento.fecha)}</td>
                                <td>{movimiento.asiento}</td>
                                <td>{movimiento.descripcion}</td>
                                <td>{movimiento.tercero}</td>
                                <td className="text-end">{formatCurrency(parseFloat(movimiento.debit))}</td>
                                <td className="text-end">{formatCurrency(movimiento.credit)}</td>
                                <td className="text-end">{formatCurrency(movimiento.saldo)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const getFilterInfo = () => {
        const filters = [];
        if (startAccount && endAccount) filters.push(`Rango de cuentas: ${startAccount} - ${endAccount}`);
        return filters.join(' | ');
    };

    const filterInfo = getFilterInfo();

    return <>
        <h3>Movimiento Auxiliar x Cuenta Contable | {dateRange}</h3>

        {filterInfo && (
            <div className="mb-3">
                <strong>Filtros aplicados:</strong> {filterInfo}
            </div>
        )}

        {/* Cada cuenta contable como una sección separada */}
        {cuentasContables.map((cuenta, index) => (
            <div key={cuenta.cuenta} style={{ marginBottom: index < cuentasContables.length - 1 ? '25px' : '0' }}>
                {/* Tabla padre - Información de la cuenta */}
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: '100px' }}>Código Cuenta</th>
                            <th>Nombre Cuenta</th>
                            <th style={{ width: '120px', textAlign: 'right' }}>Saldo Inicial</th>
                            <th style={{ width: '120px', textAlign: 'right' }}>Saldo Final</th>
                            <th style={{ width: '100px', textAlign: 'center' }}>N° Movimientos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{cuenta.cuenta}</td>
                            <td>{cuenta.nombre}</td>
                            <td className="text-end">{formatCurrency(parseFloat(cuenta.saldo_inicial))}</td>
                            <td className="text-end">{formatCurrency(cuenta.saldo_final)}</td>
                            <td className="text-center">{cuenta.movimientos.length}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Tabla hija - Movimientos (con espacio pequeño después del padre) */}
                {cuenta.movimientos.length > 0 && (
                    <>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '6px 12px',
                            marginTop: '10px',
                            border: '1px solid #dee2e6',
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }}>
                            Movimientos de la Cuenta: {cuenta.cuenta} - {cuenta.nombre}
                        </div>
                        {renderMovimientosTable(cuenta.movimientos)}
                    </>
                )}
            </div>
        ))}

        <div className="mt-4">
            <h5>Totales</h5>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Total Movimientos</strong></td>
                        <td className="text-end">{totals.totalRegistros}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Saldo Inicial</strong></td>
                        <td className="text-end">{formatCurrency(totals.totalSaldoInicial)}</td>
                    </tr>
                    <tr className="table-secondary">
                        <td><strong>Total Saldo Final</strong></td>
                        <td className="text-end">{formatCurrency(totals.totalSaldoFinal)}</td>
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

            .text-center {
                text-align: center !important;
            }
        `}</style>
    </>
};