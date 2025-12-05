import React from "react";

interface AccountingEntry {
    entry_date: string;
    description: string;
    type: "debit" | "credit";
    amount: string;
    accounting_account: {
        account_code: string;
        account_name: string;
        account_type: string;
        balance: string;
    };
}

interface AccountGroup {
    account_code: string;
    account_name: string;
    account_type: string;
    balance: number;
    entries: AccountingEntry[];
}

export const GeneralLedgerBalanceFormat: React.FC<{
    accountGroups: AccountGroup[];
    showMovements?: boolean;
    title?: string;
}> = ({ accountGroups, showMovements = true, title = "Libro Mayor" }) => {

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

    const getAccountType = (type: string) => {
        switch (type) {
            case "asset": return "Activo";
            case "liability": return "Pasivo";
            case "income": return "Ingreso";
            case "expense": return "Gasto";
            default: return type;
        }
    };

    const renderMovimientosTable = (entries: AccountingEntry[], accountName: string, accountCode: string) => {
        return (
            <div style={{ marginTop: '5px', marginBottom: '20px' }}>
                <table className="table table-bordered" style={{ fontSize: '11px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Fecha</th>
                            <th>Descripción</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Débito</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Crédito</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <tr key={index}>
                                <td>{formatDate(entry.entry_date)}</td>
                                <td>{entry.description}</td>
                                <td className="text-end">
                                    {entry.type === "debit" ? formatCurrency(parseFloat(entry.amount)) : "-"}
                                </td>
                                <td className="text-end">
                                    {entry.type === "credit" ? formatCurrency(parseFloat(entry.amount)) : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const calculateTotals = () => {
        const totals = accountGroups.reduce((acc, account) => ({
            totalBalance: acc.totalBalance + account.balance,
            totalAccounts: acc.totalAccounts + 1,
            totalMovements: acc.totalMovements + account.entries.length
        }), {
            totalBalance: 0,
            totalAccounts: 0,
            totalMovements: 0
        });

        return totals;
    };

    const totals = calculateTotals();

    return <>
        <h3>{title}</h3>

        {/* Si no se muestran movimientos, renderizar tabla simple */}
        {!showMovements ? (
            <div className="mb-4">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: '100px' }}>Código</th>
                            <th>Nombre de Cuenta</th>
                            <th style={{ width: '120px' }}>Tipo</th>
                            <th style={{ width: '120px', textAlign: 'right' }}>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountGroups.map((account) => (
                            <tr key={account.account_code}>
                                <td>{account.account_code}</td>
                                <td>{account.account_name}</td>
                                <td>{getAccountType(account.account_type)}</td>
                                <td className="text-end">{formatCurrency(account.balance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            /* Si se muestran movimientos, renderizar estructura jerárquica */
            accountGroups.map((account, index) => (
                <div key={account.account_code} style={{ marginBottom: index < accountGroups.length - 1 ? '25px' : '0' }}>
                    {/* Tabla padre - Información de la cuenta */}
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: '100px' }}>Código</th>
                                <th>Nombre de Cuenta</th>
                                <th style={{ width: '120px' }}>Tipo</th>
                                <th style={{ width: '120px', textAlign: 'right' }}>Saldo</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>N° Movimientos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{account.account_code}</td>
                                <td>{account.account_name}</td>
                                <td>{getAccountType(account.account_type)}</td>
                                <td className="text-end">{formatCurrency(account.balance)}</td>
                                <td className="text-center">{account.entries.length}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Tabla hija - Movimientos (solo si tiene movimientos y showMovements es true) */}
                    {account.entries.length > 0 && (
                        <>
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '6px 12px',
                                marginTop: '10px',
                                border: '1px solid #dee2e6',
                                fontWeight: 'bold',
                                fontSize: '13px'
                            }}>
                                Movimientos de la Cuenta: {account.account_code} - {account.account_name}
                            </div>
                            {renderMovimientosTable(account.entries, account.account_name, account.account_code)}
                        </>
                    )}
                </div>
            ))
        )}

        <div className="mt-4">
            <h5>Totales</h5>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Total Cuentas</strong></td>
                        <td className="text-end">{totals.totalAccounts}</td>
                    </tr>
                    {showMovements && (
                        <tr>
                            <td><strong>Total Movimientos</strong></td>
                            <td className="text-end">{totals.totalMovements}</td>
                        </tr>
                    )}
                    <tr className="table-secondary">
                        <td><strong>Saldo Total General</strong></td>
                        <td className="text-end">{formatCurrency(totals.totalBalance)}</td>
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