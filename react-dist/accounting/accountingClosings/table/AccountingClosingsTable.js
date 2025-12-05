import React from "react";
import { CustomPRTable } from "../../../components/CustomPRTable.js";
export const AccountingClosingsTable = ({
  data,
  columns,
  onReload,
  loading
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    data: data,
    columns: columns,
    loading: loading,
    onReload: onReload
  }))));
};