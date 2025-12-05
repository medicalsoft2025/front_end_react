import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { useAuxiliaryMovementReport } from "./hooks/useAuxiliaryMovementReport";
import { CuentaContable, Movimiento } from "../../accounting/types/bankTypes";
import { AccountingAccountsRange } from "../../fields/ranges/AccountingAccountsRange";
import { Button } from "primereact/button";
import { useAuxiliaryMovementFormat } from "../../documents-generation/hooks/useAuxiliaryMovementFormat";
import { formatDateRange } from "../../../services/utilidades";

export const AuxiliaryMovement: React.FC = () => {
    // Estado para los datos de la tabla
    const {
        cuentasContables,
        dateRange,
        setDateRange,
        startAccount,
        endAccount,
        setStartAccount,
        setEndAccount,
        loading,
    } = useAuxiliaryMovementReport();
    const { generarFormatoAuxiliaryMovement } = useAuxiliaryMovementFormat();
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalSaldoFinal, setTotalSaldoFinal] = useState(0);
    const [expandedRows, setExpandedRows] = useState<any>(null);

    useEffect(() => {
        calcularTotales(cuentasContables);
    }, [cuentasContables]);

    const calcularTotales = (datos: CuentaContable[]) => {
        let totalReg = 0;
        let totalSaldo = 0;

        datos.forEach((cuenta) => {
            totalReg += cuenta.movimientos.length;
            totalSaldo += cuenta.saldo_final;
        });

        setTotalRegistros(totalReg);
        setTotalSaldoFinal(totalSaldo);
    };

    // Formatear número para saldos monetarios
    const formatCurrency = (value: number) => {
        return value.toLocaleString("es-DO", {
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

    // Template para expandir/contraer filas
    const rowExpansionTemplate = (data: CuentaContable) => {
        return (
            <div className="p-3">
                <h5>
                    Movimientos de la cuenta {data.cuenta} - {data.nombre}
                </h5>
                <DataTable
                    value={data.movimientos}
                    size="small"
                    responsiveLayout="scroll"
                >
                    <Column
                        field="fecha"
                        header="Fecha"
                        body={(rowData: Movimiento) =>
                            formatDate(rowData.fecha)
                        }
                    />
                    <Column field="asiento" header="Asiento" />
                    <Column field="descripcion" header="Descripción" />
                    <Column field="tercero" header="Tercero" />
                    <Column
                        field="debit"
                        header="Débito"
                        body={(rowData: Movimiento) =>
                            formatCurrency(parseFloat(rowData.debit))
                        }
                        style={{ textAlign: "right" }}
                    />
                    <Column
                        field="credit"
                        header="Crédito"
                        body={(rowData: Movimiento) =>
                            formatCurrency(rowData.credit)
                        }
                        style={{ textAlign: "right" }}
                    />
                    <Column
                        field="saldo"
                        header="Saldo"
                        body={(rowData: Movimiento) =>
                            formatCurrency(rowData.saldo)
                        }
                        style={{ textAlign: "right" }}
                    />
                </DataTable>
            </div>
        );
    };

    // Footer para los totales
    const footerTotales = (
        <div className="grid">
            <div className="col-12 md:col-6">
                <strong>Total Movimientos:</strong> {totalRegistros}
            </div>
            <div className="col-12 md:col-6">
                <strong>Total Saldo Final:</strong>
                <span className="text-primary cursor-pointer ml-2">
                    {formatCurrency(totalSaldoFinal)}
                </span>
            </div>
        </div>
    );

    const handleExportPDF = () => {
        generarFormatoAuxiliaryMovement(
            cuentasContables,
            formatDateRange(dateRange),
            "Impresion"
        );
    };

    return (
        <div className="container-fluid mt-4" style={{ padding: "0 15px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Movimiento Auxiliar x Cuenta Contable</h2>
            </div>

            {/* Tabla de resultados */}
            <Card>
                <div className="d-flex justify-content-between align-items-end gap-3 mb-3">
                    <div className="d-flex gap-3 align-items-center">
                        <div>
                            <label htmlFor="dateRange" className="form-label">
                                Rango de fechas
                            </label>
                            <Calendar
                                id="dateRange"
                                selectionMode="range"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.value)}
                                className="w-100"
                                showIcon
                                dateFormat="dd/mm/yy"
                                placeholder="Seleccione un rango"
                                appendTo={document.body}
                            />
                        </div>
                        <AccountingAccountsRange
                            startValue={startAccount}
                            endValue={endAccount}
                            handleStartChange={(e: any) =>
                                setStartAccount(e.value)
                            }
                            handleEndChange={(e: any) => setEndAccount(e.value)}
                            optionValue="account_code"
                        />
                    </div>
                    <div>
                        <Button
                            icon={<i className="fas fa-file-pdf"></i>}
                            label="Exportar a PDF"
                            className="mr-2"
                            onClick={handleExportPDF}
                        />
                    </div>
                </div>
                <DataTable
                    value={cuentasContables}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    emptyMessage="No se encontraron cuentas contables"
                    className="p-datatable-striped p-datatable-gridlines"
                    responsiveLayout="scroll"
                    footer={footerTotales}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="cuenta"
                >
                    <Column expander style={{ width: "3em" }} />
                    <Column field="cuenta" header="Código Cuenta" sortable />
                    <Column field="nombre" header="Nombre Cuenta" sortable />
                    <Column
                        field="saldo_inicial"
                        header="Saldo Inicial"
                        body={(rowData: CuentaContable) =>
                            formatCurrency(parseFloat(rowData.saldo_inicial))
                        }
                        style={{ textAlign: "right" }}
                        sortable
                    />
                    <Column
                        field="saldo_final"
                        header="Saldo Final"
                        body={(rowData: CuentaContable) =>
                            formatCurrency(rowData.saldo_final)
                        }
                        style={{ textAlign: "right" }}
                        sortable
                    />
                    <Column
                        field="movimientos"
                        header="N° Movimientos"
                        body={(rowData: CuentaContable) =>
                            rowData.movimientos.length
                        }
                        style={{ textAlign: "center" }}
                        sortable
                    />
                </DataTable>
            </Card>
        </div>
    );
};
