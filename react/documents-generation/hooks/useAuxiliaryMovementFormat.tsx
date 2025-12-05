import React from "react";
import ReactDOMServer from "react-dom/server";
import { AuxiliaryMovementFormat } from "../formats/AuxiliaryMovementFormat";
import { useGeneratePDF } from "./useGeneratePDF";
import { CuentaContable } from "../../accounting/types/bankTypes";

export const useAuxiliaryMovementFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generarFormatoAuxiliaryMovement(data: CuentaContable[], dateRange: string, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-Movimiento-Auxiliar-Cuenta-Contable`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <AuxiliaryMovementFormat cuentasContables={data} dateRange={dateRange} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generarFormatoAuxiliaryMovement
    }
}