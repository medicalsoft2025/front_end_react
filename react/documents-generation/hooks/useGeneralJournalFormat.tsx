import React from "react";
import ReactDOMServer from "react-dom/server";
import { GeneralJournalFormat } from "../formats/GeneralJournalFormat";
import { useGeneratePDF } from "./useGeneratePDF";

export const useGeneralJournalFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generarFormatoGeneralJournal(data: any[], dateRange: string, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-Libro-Diario-Contable`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <GeneralJournalFormat generalJournal={data} dateRange={dateRange} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generarFormatoGeneralJournal
    }
}