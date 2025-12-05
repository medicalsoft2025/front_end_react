import React from "react";
import ReactDOMServer from "react-dom/server";
import { GeneralJournalFormat } from "../formats/GeneralJournalFormat.js";
import { useGeneratePDF } from "./useGeneratePDF.js";
export const useGeneralJournalFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generarFormatoGeneralJournal(data, dateRange, type) {
    const namePDF = `Reporte-Libro-Diario-Contable`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(GeneralJournalFormat, {
      generalJournal: data,
      dateRange: dateRange
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generarFormatoGeneralJournal
  };
};