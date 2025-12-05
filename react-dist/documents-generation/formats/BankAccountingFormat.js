import React from "react";
export const BankAccountingFormat = ({
  metodosPago,
  fechaInicio,
  fechaFin,
  title = "Reporte de Cuentas Bancarias"
}) => {
  const formatCurrency = value => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-DO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };
  const getAccountType = type => {
    const accountTypeMap = {
      asset: "Activo",
      liability: "Pasivo",
      equity: "Patrimonio",
      revenue: "Ingreso",
      expense: "Gasto",
      contra: "Cuenta Correctiva",
      cost: "Costo",
      memorandum: "Memorándum"
    };
    return accountTypeMap[type.toLowerCase()];
  };

  // Calcular totales para una cuenta específica
  const calcularTotalCuenta = cuenta => {
    const debitDetails = cuenta.movements.filter(mov => mov.type == "debit").flatMap(movement => movement.details);
    const creditDetails = cuenta.movements.filter(mov => mov.type == "credit").flatMap(movement => movement.details);
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
      neto: totalCreditos - totalDebitos
    };
  };

  // Renderizar tabla de movimientos para una cuenta
  const renderMovimientosTable = (movements, accountName, accountCode) => {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "5px",
        marginBottom: "20px"
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered",
      style: {
        fontSize: "10px"
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: "80px"
      }
    }, "Fecha"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: "70px"
      }
    }, "Tipo"), /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: "100px",
        textAlign: "right"
      }
    }, "Monto"))), /*#__PURE__*/React.createElement("tbody", null, movements.map((movement, index) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: movement.entry_id
    }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, formatDate(movement.entry_date)), /*#__PURE__*/React.createElement("td", null, movement.type === "debit" ? "Débito" : "Crédito"), /*#__PURE__*/React.createElement("td", null, movement.description), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(movement.details.reduce((sum, det) => sum + (parseFloat(det.amount) || 0), 0)))), movement.details.length > 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      colSpan: 4,
      style: {
        padding: "0",
        borderTop: "none"
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "table",
      style: {
        fontSize: "9px",
        margin: "0",
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: "120px"
      }
    }, "Tercero"), /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: "100px",
        textAlign: "right"
      }
    }, "Monto"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: "150px"
      }
    }, "Cuenta Contable"))), /*#__PURE__*/React.createElement("tbody", null, movement.details.map((detalle, detIndex) => /*#__PURE__*/React.createElement("tr", {
      key: detIndex
    }, /*#__PURE__*/React.createElement("td", null, detalle.third_party), /*#__PURE__*/React.createElement("td", null, detalle.description), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(parseFloat(detalle.amount) || 0)), /*#__PURE__*/React.createElement("td", null, detalle.accounting_account || "N/A"))))))))))));
  };

  // Calcular totales generales
  const calculateTotals = () => {
    const totals = metodosPago.reduce((acc, cuenta) => {
      const totalesCuenta = calcularTotalCuenta(cuenta);
      return {
        totalDebitos: acc.totalDebitos + totalesCuenta.debitos,
        totalCreditos: acc.totalCreditos + totalesCuenta.creditos,
        totalNeto: acc.totalNeto + totalesCuenta.neto,
        totalCuentas: acc.totalCuentas + 1,
        totalMovimientos: acc.totalMovimientos + cuenta.movements.length
      };
    }, {
      totalDebitos: 0,
      totalCreditos: 0,
      totalNeto: 0,
      totalCuentas: 0,
      totalMovimientos: 0
    });
    return totals;
  };
  const totals = calculateTotals();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }
  }, metodosPago.map((cuenta, index) => {
    const totalesCuenta = calcularTotalCuenta(cuenta);
    return /*#__PURE__*/React.createElement("div", {
      key: cuenta.account.id
      // style={{
      //     marginBottom:
      //         index < metodosPago.length - 1 ? "25px" : "0",
      //     pageBreakInside: "avoid",
      // }}
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: "75px"
      }
    }, "C\xF3digo"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: "100px"
      }
    }, "Nombre de Cuenta"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: "50px"
      }
    }, "Tipo"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: "100px",
        textAlign: "right"
      }
    }, "Total D\xE9bitos"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: "100px",
        textAlign: "right"
      }
    }, "Total Cr\xE9ditos"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: "100px",
        textAlign: "right"
      }
    }, "Neto"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: "100px",
        textAlign: "center"
      }
    }, "N\xB0 Movimientos"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, cuenta.account.account_code), /*#__PURE__*/React.createElement("td", null, cuenta.account.account_name), /*#__PURE__*/React.createElement("td", null, getAccountType(cuenta.account.account_type)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(totalesCuenta.debitos)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(totalesCuenta.creditos)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(totalesCuenta.neto)), /*#__PURE__*/React.createElement("td", {
      className: "text-center"
    }, cuenta.movements.length)))), cuenta.movements.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        backgroundColor: "#f8f9fa",
        padding: "6px 12px",
        marginTop: "10px",
        border: "1px solid #dee2e6",
        fontWeight: "bold",
        fontSize: "12px"
      }
    }, "Movimientos de la Cuenta:", " ", cuenta.account.account_code, " -", " ", cuenta.account.account_name), renderMovimientosTable(cuenta.movements, cuenta.account.account_name, cuenta.account.account_code)));
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-4",
    style: {
      pageBreakBefore: "avoid"
    }
  }, /*#__PURE__*/React.createElement("h5", null, "Totales Generales"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Cuentas Bancarias")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, totals.totalCuentas)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Movimientos")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, totals.totalMovimientos)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total D\xE9bitos")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.totalDebitos))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Cr\xE9ditos")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.totalCreditos))), /*#__PURE__*/React.createElement("tr", {
    className: "table-secondary"
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Neto General")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.totalNeto)))))), /*#__PURE__*/React.createElement("style", null, `
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
            `));
};