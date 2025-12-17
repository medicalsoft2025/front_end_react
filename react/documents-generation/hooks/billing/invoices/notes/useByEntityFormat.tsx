import React from "react";
import ReactDOMServer from "react-dom/server";
import { ByEntityFormat } from "../../../../formats/billing/invoices/notes/ByEntityFormat";
import { useGeneratePDF } from "../../../useGeneratePDF";

export const useByEntityFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatByEntity(
    note: any,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `nota-credito-entidad`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <ByEntityFormat note={note} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatByEntity,
  };
};
