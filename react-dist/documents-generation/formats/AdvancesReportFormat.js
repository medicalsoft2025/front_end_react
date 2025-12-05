import React from "react";
export const AdvancesReportFormat = ({
  advancesReport,
  dateRange,
  thirdPartyName
}) => {
  const formatCurrency = value => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-DO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };
  const formatMovementType = type => {
    return type === "income" ? "Ingreso" : "Egreso";
  };
  const formatMovementStatus = status => {
    const statusMap = {
      pending: "Pendiente",
      approved: "Aprobado",
      applied: "Aplicado",
      cancelled: "Cancelado"
    };
    return statusMap[status] || status;
  };
  const calculateTotals = () => {
    const totals = advancesReport.reduce((acc, advance) => ({
      totalAmount: acc.totalAmount + advance.amount,
      totalRecords: acc.totalRecords + 1
    }), {
      totalAmount: 0,
      totalRecords: 0
    });
    return totals;
  };
  const totals = calculateTotals();
  const getFilterInfo = () => {
    const filters = [];
    if (thirdPartyName) filters.push(`Tercero: ${thirdPartyName}`);
    return filters.join(" | ");
  };
  const filterInfo = getFilterInfo();
  return /*#__PURE__*/React.createElement(React.Fragment, null, filterInfo && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Filtros aplicados:"), " ", filterInfo), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: "100px"
    }
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: "100px"
    }
  }, "Documento"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: "100px",
      textAlign: "right"
    }
  }, "Monto"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: "80px"
    }
  }, "Tipo"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: "80px"
    }
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: "100px"
    }
  }, "Referencia"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: "100px"
    }
  }, "Fecha Creaci\xF3n"))), /*#__PURE__*/React.createElement("tbody", null, advancesReport.map((advance, index) => /*#__PURE__*/React.createElement("tr", {
    key: advance.id
  }, /*#__PURE__*/React.createElement("td", null, advance.third_party?.name || "Sin nombre"), /*#__PURE__*/React.createElement("td", null, advance.third_party?.document_number || "Sin documento"), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(advance.amount)), /*#__PURE__*/React.createElement("td", null, formatMovementType(advance.type)), /*#__PURE__*/React.createElement("td", null, formatMovementStatus(advance.status)), /*#__PURE__*/React.createElement("td", null, advance.reference), /*#__PURE__*/React.createElement("td", null, formatDate(advance.created_at)))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Totales Generales"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Registros")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, totals.totalRecords)), /*#__PURE__*/React.createElement("tr", {
    className: "table-secondary"
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Monto Anticipos")), /*#__PURE__*/React.createElement("td", {
    className: "text-end",
    style: {
      fontWeight: "bold",
      color: totals.totalAmount < 0 ? "#e74c3c" : totals.totalAmount > 0 ? "#27ae60" : "#000000"
    }
  }, formatCurrency(totals.totalAmount)))))), /*#__PURE__*/React.createElement("style", null, `
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
        `));
};