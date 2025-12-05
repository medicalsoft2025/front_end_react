import React from "react";
import ReactDOMServer from "react-dom/server";
import { ReceiptBoxFormat } from "../../../formats/billing/receipt-box/ReceiptBoxFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useReceiptBoxFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatReceiptBox(
    mainData: any,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Factura-Venta`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <ReceiptBoxFormat receipt={mainData} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      dimensions: [842, 595]
    });
  }

  return {
    generateFormatReceiptBox,
  };
};
