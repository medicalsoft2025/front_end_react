import React from "react";
import ReactDOMServer from "react-dom/server";
import { AdvancesReportFormat } from "../formats/AdvancesReportFormat.js";
import { useGeneratePDF } from "./useGeneratePDF.js";
export const useAdvancesReportFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generarFormatoAdvancesReport(data, dateRange, type) {
    const namePDF = `Reporte-Movimiento-Auxiliar-Cuenta-Contable`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(AdvancesReportFormat, {
      advancesReport: data,
      dateRange: dateRange
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generarFormatoAdvancesReport
  };
};