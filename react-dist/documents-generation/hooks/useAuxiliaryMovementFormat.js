import React from "react";
import ReactDOMServer from "react-dom/server";
import { AuxiliaryMovementFormat } from "../formats/AuxiliaryMovementFormat.js";
import { useGeneratePDF } from "./useGeneratePDF.js";
export const useAuxiliaryMovementFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generarFormatoAuxiliaryMovement(data, dateRange, type) {
    const namePDF = `Reporte-Movimiento-Auxiliar-Cuenta-Contable`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(AuxiliaryMovementFormat, {
      cuentasContables: data,
      dateRange: dateRange
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generarFormatoAuxiliaryMovement
  };
};