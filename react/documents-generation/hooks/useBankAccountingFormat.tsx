import React from "react";
import ReactDOMServer from "react-dom/server";
import { BalanceThirdPartyFormat } from "../formats/BalanceThirdPartyFormat";
import { useGeneratePDF } from "./useGeneratePDF";
import { ThirdPartyBalance } from "../../billing/reports/hooks/useBalanceThirdParty";
import { MetodoPago } from "../../accounting/types/bankTypes";
import { BankAccountingFormat } from "../formats/BankAccountingFormat";

export const useBankAccountingFormat = () => {
    const { generatePDF } = useGeneratePDF();

    function generateBankAccountingFormat(
        data: MetodoPago[],
        type: "Impresion" | "Descargar"
    ) {
        const namePDF = `Reporte-Balance-Tercero`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <BankAccountingFormat metodosPago={data} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type,
        });
    }

    return {
        generateBankAccountingFormat,
    };
};
