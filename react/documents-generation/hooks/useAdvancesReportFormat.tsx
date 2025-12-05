import React from "react";
import ReactDOMServer from "react-dom/server";
import { AdvancesReportFormat } from "../formats/AdvancesReportFormat";
import { useGeneratePDF } from "./useGeneratePDF";
import { ThirdPartyAdvance } from "../../billing/reports/hooks/useAdvancesReport";

export const useAdvancesReportFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generarFormatoAdvancesReport(data: ThirdPartyAdvance[], dateRange: string, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-Movimiento-Auxiliar-Cuenta-Contable`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <AdvancesReportFormat advancesReport={data} dateRange={dateRange} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generarFormatoAdvancesReport
    }
}