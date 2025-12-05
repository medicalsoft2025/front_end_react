import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF";
import { SalesInvoicesFormat } from "../formats/SalesInvoicesFormat";

export const useSalesInvoicesFormat = () => {
    const { generatePDF } = useGeneratePDF();

    function generateSalesInvoicesFormat(params: {
        data: any;
        columns: any[];
        title: string;
        namePDF: string;
        type: "Impresion" | "Descargar";
        filters?: any;
    }) {
        const { data, columns, title, namePDF, type, filters } = params;

        const html = ReactDOMServer.renderToStaticMarkup(
            <SalesInvoicesFormat
                data={data}
                columns={columns}
                title={title}
                filters={filters}
            />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type,
        });
    }

    return {
        generateSalesInvoicesFormat,
    };
};
