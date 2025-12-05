import React from "react";
import ReactDOMServer from "react-dom/server";
import { BalanceThirdPartyFormat } from "../formats/BalanceThirdPartyFormat.js";
import { useGeneratePDF } from "./useGeneratePDF.js";
export const useBalanceThirdPartyFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generarFormatoBalanceThirdParty(data, dateRange, type) {
    const namePDF = `Reporte-Balance-Tercero`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(BalanceThirdPartyFormat, {
      balanceData: data,
      dateRange: dateRange
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generarFormatoBalanceThirdParty
  };
};