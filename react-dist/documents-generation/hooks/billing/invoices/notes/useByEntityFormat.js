import React from "react";
import ReactDOMServer from "react-dom/server";
import { ByEntityFormat } from "../../../../formats/billing/invoices/notes/ByEntityFormat.js";
import { useGeneratePDF } from "../../../useGeneratePDF.js";
export const useByEntityFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatByEntity(note, type) {
    const namePDF = `nota-credito-entidad`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ByEntityFormat, {
      note: note
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape"
    });
  }
  return {
    generateFormatByEntity
  };
};