import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF.js";
import { SalesInvoicesFormat } from "../formats/SalesInvoicesFormat.js";
export const useSalesInvoicesFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateSalesInvoicesFormat(params) {
    const {
      data,
      columns,
      title,
      namePDF,
      type,
      filters
    } = params;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(SalesInvoicesFormat, {
      data: data,
      columns: columns,
      title: title,
      filters: filters
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateSalesInvoicesFormat
  };
};