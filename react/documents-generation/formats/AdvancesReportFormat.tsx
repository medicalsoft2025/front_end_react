import React from "react";
import { ThirdPartyAdvance } from "../../billing/reports/hooks/useAdvancesReport";

export const AdvancesReportFormat: React.FC<{
    advancesReport: ThirdPartyAdvance[];
    dateRange: string;
    thirdPartyName?: string;
}> = ({ advancesReport, dateRange, thirdPartyName }) => {
    const formatCurrency = (value: string | number) => {
        const numericValue =
            typeof value === "string" ? parseFloat(value) : value;
        return new Intl.NumberFormat("es-DO", {
            style: "currency",
            currency: "DOP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-DO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const formatMovementType = (type: string) => {
        return type === "income" ? "Ingreso" : "Egreso";
    };

    const formatMovementStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            pending: "Pendiente",
            approved: "Aprobado",
            applied: "Aplicado",
            cancelled: "Cancelado",
        };
        return statusMap[status] || status;
    };

    const calculateTotals = () => {
        const totals = advancesReport.reduce(
            (acc, advance) => ({
                totalAmount: acc.totalAmount + advance.amount,
                totalRecords: acc.totalRecords + 1,
            }),
            {
                totalAmount: 0,
                totalRecords: 0,
            }
        );

        return totals;
    };

    const totals = calculateTotals();

    const getFilterInfo = () => {
        const filters = [];
        if (thirdPartyName) filters.push(`Tercero: ${thirdPartyName}`);
        return filters.join(" | ");
    };

    const filterInfo = getFilterInfo();

    return (
        <>
            {filterInfo && (
                <div className="mb-3">
                    <strong>Filtros aplicados:</strong> {filterInfo}
                </div>
            )}

            {/* Tabla principal con todos los anticipos */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th style={{ width: "100px" }}>Nombre</th>
                        <th style={{ width: "100px" }}>Documento</th>
                        <th style={{ width: "100px", textAlign: "right" }}>
                            Monto
                        </th>
                        <th style={{ width: "80px" }}>Tipo</th>
                        <th style={{ width: "80px" }}>Estado</th>
                        <th style={{ width: "100px" }}>Referencia</th>
                        <th style={{ width: "100px" }}>Fecha Creación</th>
                    </tr>
                </thead>
                <tbody>
                    {advancesReport.map((advance, index) => (
                        <tr key={advance.id}>
                            <td>{advance.third_party?.name || "Sin nombre"}</td>
                            <td>
                                {advance.third_party?.document_number ||
                                    "Sin documento"}
                            </td>
                            <td className="text-end">
                                {formatCurrency(advance.amount)}
                            </td>
                            <td>{formatMovementType(advance.type)}</td>
                            <td>{formatMovementStatus(advance.status)}</td>
                            <td>{advance.reference}</td>
                            <td>{formatDate(advance.created_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totales generales */}
            <div className="mt-4">
                <h5>Totales Generales</h5>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <td>
                                <strong>Total Registros</strong>
                            </td>
                            <td className="text-end">{totals.totalRecords}</td>
                        </tr>
                        <tr className="table-secondary">
                            <td>
                                <strong>Total Monto Anticipos</strong>
                            </td>
                            <td
                                className="text-end"
                                style={{
                                    fontWeight: "bold",
                                    color:
                                        totals.totalAmount < 0
                                            ? "#e74c3c"
                                            : totals.totalAmount > 0
                                            ? "#27ae60"
                                            : "#000000",
                                }}
                            >
                                {formatCurrency(totals.totalAmount)}
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
                font-size: 11px;
                border-collapse: collapse;
            }

            .table td, .table th {
                border: 1px solid #ccc !important;
                padding: 4px 6px !important;
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

            h3 {
                font-size: 16px;
                margin-bottom: 10px;
                text-align: center;
            }

            h5 {
                font-size: 14px;
                margin-bottom: 8px;
            }
        `}</style>
        </>
    );
};
