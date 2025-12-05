import React from "react";

interface ThirdParty {
  name: string;
  document_type: string;
  document_number: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface CashReceipt {
  id: number;
  type: "ingreso" | "egreso";
  status: string;
  subtotal: string;
  discount: string;
  iva: string;
  total_amount: string;
  observations: string | null;
  due_date: string;
  paid_amount: string;
  remaining_amount: string;
  created_at: string;
  third_party: ThirdParty;
  action: string;
}

interface PrintCashReceiptProps {
  receipt: CashReceipt;
}

export const ReceiptBoxFormat: React.FC<PrintCashReceiptProps> = ({
  receipt,
}) => {
  const formatCurrency = (value: string | number) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(numericValue);
    return formatted.replace("RD$", "$");
  };

  // Función para formatear fechas
  const formatDate = (
    date: Date | string,
    includeYear: boolean = false
  ): string => {
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
  const getReceiptType = (type: string) => {
    return type === "ingreso" ? "Ingreso" : "Egreso";
  };

  // Función para traducir el estado
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      completed: "Completado",
      pending: "Pendiente",
      cancelled: "Cancelado",
    };
    return statusMap[status] || status;
  };

  return (
    <div
      style={{
        marginBottom: "2rem",
        border: "1px solid #ddd",
        padding: "1rem",
        marginTop: "20px",
      }}
    >
      <style>
        {`
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
        `}
      </style>

      <div className="print-container">
        {/* Encabezado con estilo similar al primer componente */}
        <div className="user-header">
          <h2 style={{ margin: 0 }}>Recibo de Caja</h2>
        </div>

        {/* Número de recibo como subtítulo */}
        <div>
          <h3>Recibo #: {receipt.id}</h3>
        </div>

        {/* Tabla de resumen */}
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <table className="summary-table mr-3">
            <tbody>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Fecha de creación:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {formatDate(receipt.created_at, true)}
                </td>
                <td style={{ padding: "8px 0" }}>
                  <strong>Fecha de vencimiento:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {formatDate(receipt.due_date, true)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Tipo:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {getReceiptType(receipt.type)}
                </td>
                <td style={{ padding: "8px 0" }}>
                  <strong>Estado:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {getStatusText(receipt.status)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Cliente/Proveedor:</strong>
                </td>
                <td style={{ padding: "8px 0" }} colSpan={3}>
                  {receipt.third_party.name}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Documento:</strong>
                </td>
                <td style={{ padding: "8px 0" }} colSpan={3}>
                  {receipt.third_party.document_type}{" "}
                  {receipt.third_party.document_number}
                </td>
              </tr>
              {receipt.observations && (
                <tr>
                  <td style={{ padding: "8px 0" }}>
                    <strong>Observaciones:</strong>
                  </td>
                  <td style={{ padding: "8px 0" }} colSpan={3}>
                    {receipt.observations}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Información de pagos */}
        <div style={{ marginBottom: "20px" }}>
          <table>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  Concepto
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  Monto
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  Subtotal
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(receipt.subtotal)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  Descuento
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(receipt.discount)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  IVA/Impuestos
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(receipt.iva)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sección final con totales */}
        <div className="seccion-final">
          <div className="info-qr">
            {/* Espacio reservado para QR si es necesario */}
            {/* <div className="qr-image">[Código QR]</div> */}
          </div>

          <div className="totales-container">
            <div className="fila-total">
              <strong>Total a pagar:</strong>
              <span>{formatCurrency(receipt.total_amount)}</span>
            </div>
            <div className="fila-total">
              <strong>Monto pagado:</strong>
              <span>{formatCurrency(receipt.paid_amount)}</span>
            </div>
            <div className="fila-total">
              <strong>Saldo pendiente:</strong>
              <span>{formatCurrency(receipt.remaining_amount)}</span>
            </div>
            <div className="fila-total total-final">
              <strong>Estado:</strong>
              <span>
                {parseFloat(receipt.remaining_amount) === 0
                  ? "Pagado"
                  : "Pendiente"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
