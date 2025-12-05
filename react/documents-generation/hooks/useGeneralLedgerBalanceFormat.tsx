import React from "react";
import ReactDOMServer from "react-dom/server";
import { GeneralLedgerBalanceFormat } from "../formats/GeneralLedgerBalanceFormat";
import { useGeneratePDF } from "./useGeneratePDF";

export const useGeneralLedgerBalanceFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generarFormatoGeneralLedgerBalance(params: { data: any[], showMovements: boolean, title: string, type: 'Impresion' | 'Descargar' }) {

        const { data, showMovements, title, type } = params;
        const namePDF = `Reporte-Libro-Mayor-Balance`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <GeneralLedgerBalanceFormat accountGroups={data} showMovements={showMovements} title={title} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generarFormatoGeneralLedgerBalance
    }
}