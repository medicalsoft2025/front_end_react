import React from "react";
export const GeneralJournalFormat = ({
  generalJournal,
  dateRange
}) => {
  const formatCurrency = value => {
    if (!value) return '';
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(value));
  };
  const formatDate = dateString => {
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Libro Diario de Contabilidad | ", dateRange), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: '75px'
    }
  }, "Fecha"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '100px'
    }
  }, "N\xB0 Asiento"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '100px'
    }
  }, "Cuenta"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '100px',
      textAlign: 'right'
    }
  }, "Debe"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '100px',
      textAlign: 'right'
    }
  }, "Haber"), /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '150px'
    }
  }, "Tercero"))), /*#__PURE__*/React.createElement("tbody", null, generalJournal.map((row, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", null, formatDate(row.fecha)), /*#__PURE__*/React.createElement("td", null, row.numero_asiento), /*#__PURE__*/React.createElement("td", null, row.cuenta), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(row.debe)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(row.haber)), /*#__PURE__*/React.createElement("td", null, row.descripcion), /*#__PURE__*/React.createElement("td", null, row.tercero)))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Totales"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total D\xE9bito")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.totalDebe.toString()))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Cr\xE9dito")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.totalHaber.toString()))), /*#__PURE__*/React.createElement("tr", {
    className: "table-secondary"
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Diferencia")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(Math.abs(totals.totalDebe - totals.totalHaber).toString()), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: '8px',
      color: totals.totalDebe === totals.totalHaber ? '#27ae60' : '#e74c3c',
      fontWeight: 'bold'
    }
  }, "(", totals.totalDebe === totals.totalHaber ? 'CUADRADO' : 'DESCUADRADO', ")")))))), /*#__PURE__*/React.createElement("style", null, `
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