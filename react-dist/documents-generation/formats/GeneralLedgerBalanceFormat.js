import React from "react";
export const GeneralLedgerBalanceFormat = ({
  accountGroups,
  showMovements = true,
  title = "Libro Mayor"
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
  const getAccountType = type => {
    switch (type) {
      case "asset":
        return "Activo";
      case "liability":
        return "Pasivo";
      case "income":
        return "Ingreso";
      case "expense":
        return "Gasto";
      default:
        return type;
    }
  };
  const renderMovimientosTable = (entries, accountName, accountCode) => {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '5px',
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered",
      style: {
        fontSize: '11px'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: '80px'
      }
    }, "Fecha"), /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px',
        textAlign: 'right'
      }
    }, "D\xE9bito"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px',
        textAlign: 'right'
      }
    }, "Cr\xE9dito"))), /*#__PURE__*/React.createElement("tbody", null, entries.map((entry, index) => /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", null, formatDate(entry.entry_date)), /*#__PURE__*/React.createElement("td", null, entry.description), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, entry.type === "debit" ? formatCurrency(parseFloat(entry.amount)) : "-"), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, entry.type === "credit" ? formatCurrency(parseFloat(entry.amount)) : "-"))))));
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, title), !showMovements ? /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: '100px'
    }
  }, "C\xF3digo"), /*#__PURE__*/React.createElement("th", null, "Nombre de Cuenta"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '120px'
    }
  }, "Tipo"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '120px',
      textAlign: 'right'
    }
  }, "Saldo"))), /*#__PURE__*/React.createElement("tbody", null, accountGroups.map(account => /*#__PURE__*/React.createElement("tr", {
    key: account.account_code
  }, /*#__PURE__*/React.createElement("td", null, account.account_code), /*#__PURE__*/React.createElement("td", null, account.account_name), /*#__PURE__*/React.createElement("td", null, getAccountType(account.account_type)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(account.balance))))))) : (/* Si se muestran movimientos, renderizar estructura jerárquica */
  accountGroups.map((account, index) => /*#__PURE__*/React.createElement("div", {
    key: account.account_code,
    style: {
      marginBottom: index < accountGroups.length - 1 ? '25px' : '0'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: '100px'
    }
  }, "C\xF3digo"), /*#__PURE__*/React.createElement("th", null, "Nombre de Cuenta"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '120px'
    }
  }, "Tipo"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '120px',
      textAlign: 'right'
    }
  }, "Saldo"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '100px',
      textAlign: 'center'
    }
  }, "N\xB0 Movimientos"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, account.account_code), /*#__PURE__*/React.createElement("td", null, account.account_name), /*#__PURE__*/React.createElement("td", null, getAccountType(account.account_type)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(account.balance)), /*#__PURE__*/React.createElement("td", {
    className: "text-center"
  }, account.entries.length)))), account.entries.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#f8f9fa',
      padding: '6px 12px',
      marginTop: '10px',
      border: '1px solid #dee2e6',
      fontWeight: 'bold',
      fontSize: '13px'
    }
  }, "Movimientos de la Cuenta: ", account.account_code, " - ", account.account_name), renderMovimientosTable(account.entries, account.account_name, account.account_code))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Totales"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Cuentas")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, totals.totalAccounts)), showMovements && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Movimientos")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, totals.totalMovements)), /*#__PURE__*/React.createElement("tr", {
    className: "table-secondary"
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Saldo Total General")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.totalBalance)))))), /*#__PURE__*/React.createElement("style", null, `
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