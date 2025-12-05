import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF.js";
import { BankAccountingFormat } from "../formats/BankAccountingFormat.js";
export const useBankAccountingFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateBankAccountingFormat(data, type) {
    const namePDF = `Reporte-Balance-Tercero`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(BankAccountingFormat, {
      metodosPago: data
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateBankAccountingFormat
  };
};