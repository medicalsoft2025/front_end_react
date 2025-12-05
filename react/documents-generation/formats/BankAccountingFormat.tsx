import React from "react";
import { MetodoPago, MovimientoPago } from "../../accounting/types/bankTypes";

export const BankAccountingFormat: React.FC<{
    metodosPago: MetodoPago[];
    fechaInicio?: string;
    fechaFin?: string;
    title?: string;
}> = ({
    metodosPago,
    fechaInicio,
    fechaFin,
    title = "Reporte de Cuentas Bancarias",
}) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-DO", {
            style: "currency",
            currency: "DOP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-DO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const getAccountType = (type: string) => {
        const accountTypeMap: { [key: string]: string } = {
            asset: "Activo",
            liability: "Pasivo",
            equity: "Patrimonio",
            revenue: "Ingreso",
            expense: "Gasto",
            contra: "Cuenta Correctiva",
            cost: "Costo",
            memorandum: "Memorándum",
        };
        return accountTypeMap[type.toLowerCase()];
    };

    // Calcular totales para una cuenta específica
    const calcularTotalCuenta = (cuenta: MetodoPago) => {
        const debitDetails = cuenta.movements
            .filter((mov) => mov.type == "debit")
            .flatMap((movement) => movement.details);
        const creditDetails = cuenta.movements
            .filter((mov) => mov.type == "credit")
            .flatMap((movement) => movement.details);

        const totalDebitos = debitDetails.reduce((sum, det) => {
            const debitValue = parseFloat(det.amount) || 0;
            return sum + debitValue;
        }, 0);

        const totalCreditos = creditDetails.reduce((sum, det) => {
            const creditValue = parseFloat(det.amount) || 0;
            return sum + creditValue;
        }, 0);

        return {
            debitos: totalDebitos,
            creditos: totalCreditos,
            neto: totalCreditos - totalDebitos,
        };
    };

    // Renderizar tabla de movimientos para una cuenta
    const renderMovimientosTable = (
        movements: MovimientoPago[],
        accountName: string,
        accountCode: string
    ) => {
        return (
            <div style={{ marginTop: "5px", marginBottom: "20px" }}>
                <table
                    className="table table-bordered"
                    style={{ fontSize: "10px" }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: "80px" }}>Fecha</th>
                            <th style={{ width: "70px" }}>Tipo</th>
                            <th>Descripción</th>
                            <th style={{ width: "100px", textAlign: "right" }}>
                                Monto
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.map((movement, index) => (
                            <React.Fragment key={movement.entry_id}>
                                <tr>
                                    <td>{formatDate(movement.entry_date)}</td>
                                    <td>
                                        {movement.type === "debit"
                                            ? "Débito"
                                            : "Crédito"}
                                    </td>
                                    <td>{movement.description}</td>
                                    <td className="text-end">
                                        {formatCurrency(
                                            movement.details.reduce(
                                                (sum, det) =>
                                                    sum +
                                                    (parseFloat(det.amount) ||
                                                        0),
                                                0
                                            )
                                        )}
                                    </td>
                                </tr>
                                {/* Detalles del movimiento */}
                                {movement.details.length > 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            style={{
                                                padding: "0",
                                                borderTop: "none",
                                            }}
                                        >
                                            <table
                                                className="table"
                                                style={{
                                                    fontSize: "9px",
                                                    margin: "0",
                                                    width: "100%",
                                                }}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th
                                                            style={{
                                                                width: "120px",
                                                            }}
                                                        >
                                                            Tercero
                                                        </th>
                                                        <th>Descripción</th>
                                                        <th
                                                            style={{
                                                                width: "100px",
                                                                textAlign:
                                                                    "right",
                                                            }}
                                                        >
                                                            Monto
                                                        </th>
                                                        <th
                                                            style={{
                                                                width: "150px",
                                                            }}
                                                        >
                                                            Cuenta Contable
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {movement.details.map(
                                                        (detalle, detIndex) => (
                                                            <tr key={detIndex}>
                                                                <td>
                                                                    {
                                                                        detalle.third_party
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        detalle.description
                                                                    }
                                                                </td>
                                                                <td className="text-end">
                                                                    {formatCurrency(
                                                                        parseFloat(
                                                                            detalle.amount
                                                                        ) || 0
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {detalle.accounting_account ||
                                                                        "N/A"}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Calcular totales generales
    const calculateTotals = () => {
        const totals = metodosPago.reduce(
            (acc, cuenta) => {
                const totalesCuenta = calcularTotalCuenta(cuenta);
                return {
                    totalDebitos: acc.totalDebitos + totalesCuenta.debitos,
                    totalCreditos: acc.totalCreditos + totalesCuenta.creditos,
                    totalNeto: acc.totalNeto + totalesCuenta.neto,
                    totalCuentas: acc.totalCuentas + 1,
                    totalMovimientos:
                        acc.totalMovimientos + cuenta.movements.length,
                };
            },
            {
                totalDebitos: 0,
                totalCreditos: 0,
                totalNeto: 0,
                totalCuentas: 0,
                totalMovimientos: 0,
            }
        );

        return totals;
    };

    const totals = calculateTotals();

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            {/* Cuentas Bancarias */}
            {metodosPago.map((cuenta, index) => {
                const totalesCuenta = calcularTotalCuenta(cuenta);

                return (
                    <div
                        key={cuenta.account.id}
                        // style={{
                        //     marginBottom:
                        //         index < metodosPago.length - 1 ? "25px" : "0",
                        //     pageBreakInside: "avoid",
                        // }}
                    >
                        {/* Información de la cuenta */}
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th style={{ width: "75px" }}>Código</th>
                                    <th style={{ width: "100px" }}>
                                        Nombre de Cuenta
                                    </th>
                                    <th style={{ width: "50px" }}>Tipo</th>
                                    <th
                                        style={{
                                            width: "100px",
                                            textAlign: "right",
                                        }}
                                    >
                                        Total Débitos
                                    </th>
                                    <th
                                        style={{
                                            width: "100px",
                                            textAlign: "right",
                                        }}
                                    >
                                        Total Créditos
                                    </th>
                                    <th
                                        style={{
                                            width: "100px",
                                            textAlign: "right",
                                        }}
                                    >
                                        Neto
                                    </th>
                                    <th
                                        style={{
                                            width: "100px",
                                            textAlign: "center",
                                        }}
                                    >
                                        N° Movimientos
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{cuenta.account.account_code}</td>
                                    <td>{cuenta.account.account_name}</td>
                                    <td>
                                        {getAccountType(
                                            cuenta.account.account_type
                                        )}
                                    </td>
                                    <td className="text-end">
                                        {formatCurrency(totalesCuenta.debitos)}
                                    </td>
                                    <td className="text-end">
                                        {formatCurrency(totalesCuenta.creditos)}
                                    </td>
                                    <td className="text-end">
                                        {formatCurrency(totalesCuenta.neto)}
                                    </td>
                                    <td className="text-center">
                                        {cuenta.movements.length}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Movimientos de la cuenta */}
                        {cuenta.movements.length > 0 && (
                            <>
                                <div
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        padding: "6px 12px",
                                        marginTop: "10px",
                                        border: "1px solid #dee2e6",
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                    }}
                                >
                                    Movimientos de la Cuenta:{" "}
                                    {cuenta.account.account_code} -{" "}
                                    {cuenta.account.account_name}
                                </div>
                                {renderMovimientosTable(
                                    cuenta.movements,
                                    cuenta.account.account_name,
                                    cuenta.account.account_code
                                )}
                            </>
                        )}
                    </div>
                );
            })}

            {/* Totales generales */}
            <div className="mt-4" style={{ pageBreakBefore: "avoid" }}>
                <h5>Totales Generales</h5>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <td>
                                <strong>Total Cuentas Bancarias</strong>
                            </td>
                            <td className="text-end">{totals.totalCuentas}</td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Total Movimientos</strong>
                            </td>
                            <td className="text-end">
                                {totals.totalMovimientos}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Total Débitos</strong>
                            </td>
                            <td className="text-end">
                                {formatCurrency(totals.totalDebitos)}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Total Créditos</strong>
                            </td>
                            <td className="text-end">
                                {formatCurrency(totals.totalCreditos)}
                            </td>
                        </tr>
                        <tr className="table-secondary">
                            <td>
                                <strong>Neto General</strong>
                            </td>
                            <td className="text-end">
                                {formatCurrency(totals.totalNeto)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <style>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        color: #000;
                        background: #fff;
                        font-size: 12px;
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

                    h2, h3, h4, h5 {
                        color: #000 !important;
                        margin: 10px 0 !important;
                    }

                    /* Evitar que las tablas se dividan entre páginas */
                    table {
                        page-break-inside: avoid;
                    }

                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                }

                @media screen {
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
                }
            `}</style>
        </div>
    );
};
