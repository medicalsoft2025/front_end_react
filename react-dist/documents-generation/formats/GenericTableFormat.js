import React from "react";
export const GenericTableFormat = ({
  data,
  columns,
  title
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, columns.map(column => /*#__PURE__*/React.createElement("th", {
    key: column.field
  }, column.header))), /*#__PURE__*/React.createElement("tbody", null, data.map(row => /*#__PURE__*/React.createElement("tr", {
    key: row.id
  }, columns.map(column => /*#__PURE__*/React.createElement("td", {
    key: column.field
  }, column.body ? column.body(row) : row[column.field])))))), /*#__PURE__*/React.createElement("style", null, `
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
        `));
};