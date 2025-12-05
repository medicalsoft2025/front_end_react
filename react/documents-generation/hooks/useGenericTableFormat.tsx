import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF";
import { GenericTableFormat } from "../formats/GenericTableFormat";

export const useGenericTableFormat = () => {
    const { generatePDF } = useGeneratePDF();

    function generateGenericTableFormat(params: {
        data: any;
        columns: any[];
        title: string;
        namePDF: string;
        type: "Impresion" | "Descargar";
    }) {
        const { data, columns, title, namePDF, type } = params;

        const html = ReactDOMServer.renderToStaticMarkup(
            <GenericTableFormat data={data} columns={columns} title={title} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type,
        });
    }

    return {
        generateGenericTableFormat,
    };
};
