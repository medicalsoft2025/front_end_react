import React from "react";
export const ReceiptBoxFormat = ({
  receipt
}) => {
  const formatCurrency = value => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2
    }).format(numericValue);
    return formatted.replace("RD$", "$");
  };

  // Función para formatear fechas
  const formatDate = (date, includeYear = false) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    if (includeYear) {
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return `${day}/${month}`;
  };

  // Función para traducir el tipo de recibo
  const getReceiptType = type => {
    return type === "ingreso" ? "Ingreso" : "Egreso";
  };

  // Función para traducir el estado
  const getStatusText = status => {
    const statusMap = {
      completed: "Completado",
      pending: "Pendiente",
      cancelled: "Cancelado"
    };
    return statusMap[status] || status;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "2rem",
      border: "1px solid #ddd",
      padding: "1rem",
      marginTop: "20px"
    }
  }, /*#__PURE__*/React.createElement("style", null, `
          @media print {
            body * {
              visibility: hidden;
            }
            .print-container, .print-container * {
              visibility: visible;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .user-table-container {
              page-break-inside: avoid;
            }
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 25px;
            font-size: 12px;
          }
          th { 
            color: white; 
            padding: 10px; 
            text-align: left;
            border: 1px solid #dee2e6;
            font-weight: bold;
          }
          td { 
            padding: 10px 8px; 
            border: 1px solid #dee2e6;
          }
          
          .summary-table {
            width: 100%; 
            border-collapse: collapse; 
            font-size: 13px;
            margin-bottom: 20px;
          }
          
          .summary-table td {
            padding: 8px 0;
            border-bottom: none;
          }
          
          .currency {
            text-align: right;
          }
          
          .user-header {
            text-align: center; 
            margin-bottom: 1rem; 
            background-color: #424a51; 
            color: white; 
            padding: 10px;
            border-radius: 4px;
          }

          .receipt-number {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
            padding: 8px 0;
            border-bottom: 2px solid #e9ecef;
          }

          .seccion-final {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            align-items: flex-start;
          }

          .info-qr {
            width: 40%;
          }

          .qr-image {
            width: 120px;
            height: 120px;
            background-color: #f0f0f0;
            border: 1px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
          }

          .totales-container {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            width: 55%;
          }

          .fila-total {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 4px 0;
          }

          .etiqueta-total {
            font-weight: 500;
            color: #495057;
          }

          .valor-total {
            font-weight: 500;
            text-align: right;
            min-width: 120px;
          }

          .total-final {
            border-top: 2px solid #dee2e6;
            margin-top: 8px;
            padding-top: 8px;
            font-weight: 700;
            font-size: 14px;
            color: #2c3e50;
          }
        `), /*#__PURE__*/React.createElement("div", {
    className: "print-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-header"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0
    }
  }, "Recibo de Caja")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Recibo #: ", receipt.id)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "20px",
      marginTop: "20px"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "summary-table mr-3"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Fecha de creaci\xF3n:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, formatDate(receipt.created_at, true)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Fecha de vencimiento:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, formatDate(receipt.due_date, true))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Tipo:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, getReceiptType(receipt.type)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Estado:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, getStatusText(receipt.status))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Cliente/Proveedor:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    },
    colSpan: 3
  }, receipt.third_party.name)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Documento:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    },
    colSpan: 3
  }, receipt.third_party.document_type, " ", receipt.third_party.document_number)), receipt.observations && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Observaciones:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    },
    colSpan: 3
  }, receipt.observations))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Concepto"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Monto"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, "Subtotal"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, formatCurrency(receipt.subtotal))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, "Descuento"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, formatCurrency(receipt.discount))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, "IVA/Impuestos"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, formatCurrency(receipt.iva)))))), /*#__PURE__*/React.createElement("div", {
    className: "seccion-final"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-qr"
  }), /*#__PURE__*/React.createElement("div", {
    className: "totales-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fila-total"
  }, /*#__PURE__*/React.createElement("strong", null, "Total a pagar:"), /*#__PURE__*/React.createElement("span", null, formatCurrency(receipt.total_amount))), /*#__PURE__*/React.createElement("div", {
    className: "fila-total"
  }, /*#__PURE__*/React.createElement("strong", null, "Monto pagado:"), /*#__PURE__*/React.createElement("span", null, formatCurrency(receipt.paid_amount))), /*#__PURE__*/React.createElement("div", {
    className: "fila-total"
  }, /*#__PURE__*/React.createElement("strong", null, "Saldo pendiente:"), /*#__PURE__*/React.createElement("span", null, formatCurrency(receipt.remaining_amount))), /*#__PURE__*/React.createElement("div", {
    className: "fila-total total-final"
  }, /*#__PURE__*/React.createElement("strong", null, "Estado:"), /*#__PURE__*/React.createElement("span", null, parseFloat(receipt.remaining_amount) === 0 ? "Pagado" : "Pendiente"))))));
};