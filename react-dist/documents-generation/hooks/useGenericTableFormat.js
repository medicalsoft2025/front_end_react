import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF.js";
import { GenericTableFormat } from "../formats/GenericTableFormat.js";
export const useGenericTableFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateGenericTableFormat(params) {
    const {
      data,
      columns,
      title,
      namePDF,
      type
    } = params;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(GenericTableFormat, {
      data: data,
      columns: columns,
      title: title
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateGenericTableFormat
  };
};