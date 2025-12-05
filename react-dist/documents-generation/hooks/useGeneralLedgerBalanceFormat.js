import React from "react";
import ReactDOMServer from "react-dom/server";
import { GeneralLedgerBalanceFormat } from "../formats/GeneralLedgerBalanceFormat.js";
import { useGeneratePDF } from "./useGeneratePDF.js";
export const useGeneralLedgerBalanceFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generarFormatoGeneralLedgerBalance(params) {
    const {
      data,
      showMovements,
      title,
      type
    } = params;
    const namePDF = `Reporte-Libro-Mayor-Balance`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(GeneralLedgerBalanceFormat, {
      accountGroups: data,
      showMovements: showMovements,
      title: title
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generarFormatoGeneralLedgerBalance
  };
};