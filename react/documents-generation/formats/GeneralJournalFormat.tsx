import React from "react";

export const GeneralJournalFormat: React.FC<{
    generalJournal: any[],
    dateRange: string
}> = ({ generalJournal, dateRange }) => {

    const formatCurrency = (value: string) => {
        if (!value) return '';
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(parseFloat(value));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-DO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const calculateTotals = () => {
        const totals = generalJournal.reduce((acc, row) => ({
            totalDebe: acc.totalDebe + (parseFloat(row.debe) || 0),
            totalHaber: acc.totalHaber + (parseFloat(row.haber) || 0)
        }), {
            totalDebe: 0,
            totalHaber: 0
        });

        return totals;
    };

    const totals = calculateTotals();

    return <>
        <h3>Libro Diario de Contabilidad | {dateRange}</h3>

        <div className="mb-4">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th style={{ width: '75px' }}>Fecha</th>
                        <th style={{ width: '100px' }}>N° Asiento</th>
                        <th style={{ width: '100px' }}>Cuenta</th>
                        <th style={{ width: '100px', textAlign: 'right' }}>Debe</th>
                        <th style={{ width: '100px', textAlign: 'right' }}>Haber</th>
                        <th>Descripción</th>
                        <th style={{ width: '150px' }}>Tercero</th>
                    </tr>
                </thead>
                <tbody>
                    {generalJournal.map((row, index) => (
                        <tr key={index}>
                            <td>{formatDate(row.fecha)}</td>
                            <td>{row.numero_asiento}</td>
                            <td>{row.cuenta}</td>
                            <td className="text-end">{formatCurrency(row.debe)}</td>
                            <td className="text-end">{formatCurrency(row.haber)}</td>
                            <td>{row.descripcion}</td>
                            <td>{row.tercero}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="mt-4">
            <h5>Totales</h5>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Total Débito</strong></td>
                        <td className="text-end">{formatCurrency(totals.totalDebe.toString())}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Crédito</strong></td>
                        <td className="text-end">{formatCurrency(totals.totalHaber.toString())}</td>
                    </tr>
                    <tr className="table-secondary">
                        <td><strong>Diferencia</strong></td>
                        <td className="text-end">
                            {formatCurrency(Math.abs(totals.totalDebe - totals.totalHaber).toString())}
                            <span style={{
                                marginLeft: '8px',
                                color: totals.totalDebe === totals.totalHaber ? '#27ae60' : '#e74c3c',
                                fontWeight: 'bold'
                            }}>
                                ({totals.totalDebe === totals.totalHaber ? 'CUADRADO' : 'DESCUADRADO'})
                            </span>
                        </td>
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