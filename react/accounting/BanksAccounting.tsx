import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { useBankAccountingReport } from "./hooks/useBankAccountingReport";
import {
    MetodoPago,
    MovimientoPago,
    DetalleMovimientoPago,
} from "./types/bankTypes";
import { AccountingAccountsDropdown } from "../fields/dropdowns/AccountingAccountsDropdown";
import { useBankAccountingFormat } from "../documents-generation/hooks/useBankAccountingFormat";

export const BanksAccounting: React.FC = () => {
    // Estado para los datos de la tabla
    const { metodosPago, fetchBankAccountingReport, loading } =
        useBankAccountingReport();
    const { generateBankAccountingFormat } = useBankAccountingFormat();
    const [expandedRows, setExpandedRows] = useState<any>(null);

    // Estado para el filtro de fecha
    const [rangoFechas, setRangoFechas] = useState<Nullable<(Date | null)[]>>([
        new Date(),
        new Date(),
    ]);
    const [accountingAccountId, setAccountingAccountId] = useState<
        string | null
    >(null);

    useEffect(() => {
        aplicarFiltros();
    }, [rangoFechas]);

    const aplicarFiltros = () => {
        fetchBankAccountingReport({
            from: rangoFechas?.[0]?.toISOString(),
            to: rangoFechas?.[1]?.toISOString(),
            accounting_account_id: accountingAccountId,
        });
    };

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setRangoFechas(null);
    };

    // Formatear número para montos monetarios
    const formatCurrency = (value: number) => {
        return value?.toLocaleString("es-DO", {
            style: "currency",
            currency: "DOP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-DO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // Calcular total de débitos y créditos para una cuenta
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

    const handlePrint = () => {
        generateBankAccountingFormat(metodosPago, "Impresion");
    };

    // Template para expandir/contraer filas de nivel 1 (Cuentas -> Movimientos)
    const rowExpansionTemplateLevel1 = (data: MetodoPago) => {
        return (
            <div className="p-3">
                <h5>Movimientos de la Cuenta: {data.account.account_name}</h5>
                <DataTable
                    value={data.movements}
                    size="small"
                    responsiveLayout="scroll"
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplateLevel2}
                    dataKey="entry_id"
                >
                    <Column expander style={{ width: "3em" }} />
                    <Column
                        field="entry_date"
                        header="Fecha"
                        body={(rowData: MovimientoPago) =>
                            formatDate(rowData.entry_date)
                        }
                        sortable
                    />
                    <Column
                        field="type"
                        header="Tipo"
                        sortable
                        body={(rowData: MovimientoPago) => {
                            const typeMap: { [key: string]: string } = {
                                credit: "Crédito",
                                debit: "Débito",
                            };
                            return typeMap[rowData.type.toLowerCase()];
                        }}
                    />
                    <Column field="description" header="Descripción" />
                    <Column
                        header="Monto"
                        body={(rowData: MovimientoPago) => {
                            return formatCurrency(
                                rowData.details.reduce((sum, det) => {
                                    const amount = parseFloat(det.amount) || 0;
                                    return sum + amount;
                                }, 0)
                            );
                        }}
                        style={{ textAlign: "right" }}
                        sortable
                    />
                </DataTable>
            </div>
        );
    };

    // Template para expandir/contraer filas de nivel 2 (Movimientos -> Detalles)
    const rowExpansionTemplateLevel2 = (data: MovimientoPago) => {
        return (
            <div className="p-3 bg-light">
                <h6>Detalles del Movimiento</h6>
                <DataTable
                    value={data.details}
                    size="small"
                    responsiveLayout="scroll"
                >
                    <Column field="third_party" header="Tercero" />
                    <Column field="description" header="Descripción" />
                    <Column
                        field="amount"
                        header="Monto"
                        body={(rowData: DetalleMovimientoPago) =>
                            formatCurrency(parseFloat(rowData.amount) || 0)
                        }
                        style={{ textAlign: "right" }}
                    />
                    <Column
                        field="account"
                        header="Cuenta Contable"
                        body={(rowData: DetalleMovimientoPago) =>
                            rowData.accounting_account || "N/A"
                        }
                    />
                </DataTable>
            </div>
        );
    };

    return (
        <div className="container-fluid mt-4" style={{ padding: "0 15px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Reporte de Cuentas Bancarias</h2>
                <Button
                    label="Exportar Reporte"
                    icon={<i className="fa fa-download me-1" />}
                    className="p-button-primary"
                    onClick={handlePrint}
                />
            </div>

            <Card title="Filtros de Búsqueda" className="mb-4">
                <div className="d-flex align-items-end justify-content-between gap-3">
                    {/* Filtro: Rango de fechas */}
                    <div className="d-flex align-items-end justifty-content-end gap-3">
                        <div className="d-flex flex-column">
                            <label className="form-label">
                                Rango de Fechas
                            </label>
                            <Calendar
                                value={rangoFechas}
                                onChange={(e) => setRangoFechas(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                dateFormat="dd/mm/yy"
                                placeholder="Seleccione rango de fechas"
                                className="w-100"
                                showIcon
                            />
                        </div>
                        <AccountingAccountsDropdown
                            value={accountingAccountId}
                            handleChange={(e: any) => {
                                console.log(e);
                                setAccountingAccountId(e.value);
                            }}
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="d-flex align-items-end gap-2">
                        <Button
                            label="Limpiar"
                            icon={<i className="fas fa-trash me-1" />}
                            className="p-button-secondary"
                            onClick={limpiarFiltros}
                        />
                        <Button
                            label="Buscar"
                            className="p-button-primary"
                            icon={<i className="fas fa-search me-1" />}
                            onClick={aplicarFiltros}
                        />
                    </div>
                </div>
            </Card>

            {/* Tabla de resultados */}
            <Card title="Cuentas Bancarias y Movimientos">
                <DataTable
                    value={metodosPago}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    emptyMessage="No se encontraron cuentas bancarias"
                    className="p-datatable-striped p-datatable-gridlines"
                    responsiveLayout="scroll"
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplateLevel1}
                    dataKey="account.id"
                >
                    <Column expander style={{ width: "3em" }} />
                    <Column
                        field="account.account_code"
                        header="Código Cuenta"
                        sortable
                    />
                    <Column
                        field="account.account_name"
                        header="Nombre Cuenta"
                        sortable
                    />
                    <Column
                        field="account.account_type"
                        header="Tipo Cuenta"
                        sortable
                        body={(rowData: MetodoPago) => {
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
                            return accountTypeMap[
                                rowData.account.account_type.toLowerCase()
                            ];
                        }}
                    />
                    <Column
                        header="Total Débitos"
                        body={(rowData: MetodoPago) => {
                            const totales = calcularTotalCuenta(rowData);
                            return formatCurrency(totales.debitos);
                        }}
                        style={{ textAlign: "right" }}
                        sortable
                    />
                    <Column
                        header="Total Créditos"
                        body={(rowData: MetodoPago) => {
                            const totales = calcularTotalCuenta(rowData);
                            return formatCurrency(totales.creditos);
                        }}
                        style={{ textAlign: "right" }}
                        sortable
                    />
                    <Column
                        header="Neto"
                        body={(rowData: MetodoPago) => {
                            const totales = calcularTotalCuenta(rowData);
                            return formatCurrency(totales.neto);
                        }}
                        style={{ textAlign: "right" }}
                        sortable
                    />
                    <Column
                        header="N° Movimientos"
                        body={(rowData: MetodoPago) => rowData.movements.length}
                        style={{ textAlign: "center" }}
                        sortable
                    />
                </DataTable>
            </Card>
        </div>
    );
};
