import React from "react";

export const SalesInvoicesFormat: React.FC<{
    data: any[];
    columns: any[];
    title: string;
    filters?: any;
}> = ({ data, columns, title, filters }) => {
    return (
        <>
            <h3>
                {title} | {filters.dateRange}
            </h3>

            {filters && (
                <div className="mb-3">
                    <strong>Filtros aplicados:</strong>
                </div>
            )}

            <table className="table table-bordered">
                <thead>
                    {columns.map((column) => (
                        <th key={column.field}>{column.header}</th>
                    ))}
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            {columns.map((column) => (
                                <td key={column.field}>
                                    {column.body
                                        ? column.body(row)
                                        : row[column.field]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
            body {
                margin: 0;
                padding: 0;
                color: #000;
                background: #fff;
            }

            .no-print {
                display: none !important;
            }

            .table {
                width: 100%;
                font-size: 12px;
                border-collapse: collapse;
            }

            .table td, .table th {
                border: 1px solid #ccc !important;
                padding: 4px 8px !important;
            }

            .table-secondary {
                background-color: #eaeaea !important;
            }

            .text-end {
                text-align: right !important;
            }

            .text-center {
                text-align: center !important;
            }
        `}</style>
        </>
    );
};
