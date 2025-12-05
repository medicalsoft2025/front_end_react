import React from "react";
import ReactDOMServer from "react-dom/server";
import { BalanceThirdPartyFormat } from "../formats/BalanceThirdPartyFormat";
import { useGeneratePDF } from "./useGeneratePDF";
import { ThirdPartyBalance } from "../../billing/reports/hooks/useBalanceThirdParty";

export const useBalanceThirdPartyFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generarFormatoBalanceThirdParty(data: ThirdPartyBalance[], dateRange: string, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-Balance-Tercero`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <BalanceThirdPartyFormat balanceData={data} dateRange={dateRange} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generarFormatoBalanceThirdParty
    }
}