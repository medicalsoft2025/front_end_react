import React from "react";
export const BalanceThirdPartyFormat = ({
  balanceData,
  dateRange,
  thirdPartyName,
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
  const renderBalanceTable = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Tercero"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '150px',
        textAlign: 'right'
      }
    }, "Total Debe"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '150px',
        textAlign: 'right'
      }
    }, "Total Haber"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '150px',
        textAlign: 'right'
      }
    }, "Saldo"))), /*#__PURE__*/React.createElement("tbody", null, balanceData.map(thirdParty => /*#__PURE__*/React.createElement("tr", {
      key: thirdParty.tercero_id
    }, /*#__PURE__*/React.createElement("td", null, thirdParty.tercero_nombre || 'Sin tercero'), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(thirdParty.debe_total)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(thirdParty.haber_total)), /*#__PURE__*/React.createElement("td", {
      className: "text-end",
      style: {
        fontWeight: 'bold',
        color: thirdParty.saldo_final < 0 ? '#e74c3c' : thirdParty.saldo_final > 0 ? '#27ae60' : '#000000'
      }
    }, formatCurrency(thirdParty.saldo_final)))))));
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Balance de Prueba por Tercero | ", dateRange), filterInfo && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Filtros aplicados:"), " ", filterInfo), renderBalanceTable(), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Totales"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total D\xE9bito")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.debeTotal))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Cr\xE9dito")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.haberTotal))), /*#__PURE__*/React.createElement("tr", {
    className: "table-secondary"
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Final")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.saldoFinal)))))), /*#__PURE__*/React.createElement("style", null, `
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
        `));
};