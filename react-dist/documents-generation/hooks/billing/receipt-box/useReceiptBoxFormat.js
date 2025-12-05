import React from "react";
import ReactDOMServer from "react-dom/server";
import { ReceiptBoxFormat } from "../../../formats/billing/receipt-box/ReceiptBoxFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useReceiptBoxFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatReceiptBox(mainData, type) {
    const namePDF = `Reporte-Factura-Venta`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ReceiptBoxFormat, {
      receipt: mainData
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      dimensions: [842, 595]
    });
  }
  return {
    generateFormatReceiptBox
  };
};