import React from "react";
export const AuxiliaryMovementFormat = ({
  cuentasContables,
  dateRange,
  startAccount,
  endAccount
}) => {
  const formatCurrency = value => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  const formatDate = dateString => {
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
  const renderMovimientosTable = movimientos => {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '5px'
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered",
      style: {
        fontSize: '11px'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: '75px'
      }
    }, "Fecha"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '80px'
      }
    }, "Asiento"), /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", null, "Tercero"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px',
        textAlign: 'right'
      }
    }, "D\xE9bito"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px',
        textAlign: 'right'
      }
    }, "Cr\xE9dito"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px',
        textAlign: 'right'
      }
    }, "Saldo"))), /*#__PURE__*/React.createElement("tbody", null, movimientos.map((movimiento, index) => /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", null, formatDate(movimiento.fecha)), /*#__PURE__*/React.createElement("td", null, movimiento.asiento), /*#__PURE__*/React.createElement("td", null, movimiento.descripcion), /*#__PURE__*/React.createElement("td", null, movimiento.tercero), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(parseFloat(movimiento.debit))), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(movimiento.credit)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(movimiento.saldo)))))));
  };
  const getFilterInfo = () => {
    const filters = [];
    if (startAccount && endAccount) filters.push(`Rango de cuentas: ${startAccount} - ${endAccount}`);
    return filters.join(' | ');
  };
  const filterInfo = getFilterInfo();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Movimiento Auxiliar x Cuenta Contable | ", dateRange), filterInfo && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Filtros aplicados:"), " ", filterInfo), cuentasContables.map((cuenta, index) => /*#__PURE__*/React.createElement("div", {
    key: cuenta.cuenta,
    style: {
      marginBottom: index < cuentasContables.length - 1 ? '25px' : '0'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: '100px'
    }
  }, "C\xF3digo Cuenta"), /*#__PURE__*/React.createElement("th", null, "Nombre Cuenta"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '120px',
      textAlign: 'right'
    }
  }, "Saldo Inicial"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '120px',
      textAlign: 'right'
    }
  }, "Saldo Final"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '100px',
      textAlign: 'center'
    }
  }, "N\xB0 Movimientos"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, cuenta.cuenta), /*#__PURE__*/React.createElement("td", null, cuenta.nombre), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(parseFloat(cuenta.saldo_inicial))), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(cuenta.saldo_final)), /*#__PURE__*/React.createElement("td", {
    className: "text-center"
  }, cuenta.movimientos.length)))), cuenta.movimientos.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8f9fa',
      padding: '6px 12px',
      marginTop: '10px',
      border: '1px solid #dee2e6',
      fontWeight: 'bold',
      fontSize: '13px'
    }
  }, "Movimientos de la Cuenta: ", cuenta.cuenta, " - ", cuenta.nombre), renderMovimientosTable(cuenta.movimientos)))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Totales"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Movimientos")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, totals.totalRegistros)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Inicial")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.totalSaldoInicial))), /*#__PURE__*/React.createElement("tr", {
    className: "table-secondary"
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Final")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.totalSaldoFinal)))))), /*#__PURE__*/React.createElement("style", null, `
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
        `));
};