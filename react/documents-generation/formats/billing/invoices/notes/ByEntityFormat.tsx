import React from "react";
import { statusInvoices } from "../../../../../../services/commons";

interface PrintNoteProps {
  note: any;
}

export const ByEntityFormat: React.FC<PrintNoteProps> = ({ note }) => {
  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(value);
    return formatted.replace("RD$", "$");
  };

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

  return (
    <div
      style={{
        marginBottom: "2rem",
        border: "1px solid #ddd",
        padding: "1rem",
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

          .invoice-number {
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
          <h2 style={{ margin: 0 }}>Nota credito</h2>
        </div>

        {/* Número de factura como subtítulo */}
        <div>
          <h3>No. Nota: {note.resolution_number || " -- "}</h3>
        </div>

        {/* Tabla de resumen */}
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <table className="summary-table mr-3">
            <tbody>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Fecha:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {formatDate(note.invoice.created_at, true)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Cliente:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>{note?.invoice?.third_party?.name}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Estado:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {statusInvoices[note.invoice.status]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabla de detalles con gridlines como el primer componente */}
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
                Factura
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
                Paciente
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
                Entidad
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
                Monto original
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
                Monto actual
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
                Monto pagado
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
                Fecha de cambio
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
                Razón
              </th>
            </tr>
          </thead>
          <tbody>
            {note.invoice.history_invoices_by_entity.map((detail: any, index: any) => (
              <tr key={index}>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {detail.invoice.invoice_code || "--"}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {`${detail.admission.patient.first_name ?? " "} ${
                    detail.admission.patient.middle_name ?? " "
                  } ${detail.admission.patient.last_name ?? " "} ${
                    detail.admission.patient.second_last_name ?? " "
                  }`}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {detail.admission.entity.name || "--"}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(Number(detail.original_admission_amount) || 0)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(Number(detail.amount) || 0)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(Number(detail.paid_amount) || 0)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {detail.created_at_formatted || "--"}
                </td>
                 <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {detail.reason || "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sección final */}
        <div className="seccion-final">
          {/* <div className="info-qr">
            <div className="qr-image">[Código QR]</div>
          </div> */}

          <div className="total-container">
            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
              <table className="summary-table mr-3">
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 0" }}>
                      <strong>Subtotal:</strong>{" "}
                      {formatCurrency(note.invoice.subtotal)}
                    </td>
                    <td style={{ padding: "8px 0" }}>
                      <strong>Descuentos:</strong>{" "}
                      {formatCurrency(note.invoice.discuount || 0)}
                    </td>
                    <td style={{ padding: "8px 0" }}>
                      <strong>Impuestos:</strong> {formatCurrency(note.invoice.iva)}
                    </td>
                    <td style={{ padding: "8px 0" }}>
                      <strong>Retenciones:</strong>{" "}
                      {formatCurrency(note.invoice.withholdings)}
                    </td>
                    <td style={{ padding: "8px 0" }}>
                      <strong>Total:</strong> {formatCurrency(note.invoice.total_amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
