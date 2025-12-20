import React, { useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { CustomPRTable } from "../../../components/CustomPRTable.js";
const DocumentTable = ({
  data,
  columns,
  loading,
  onReload,
  globalFilterFields,
  onSearch
}) => {
  const [filters, setFilters] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    }
  });
  const handleSearch = searchValue => {
    // Actualizar filtros locales
    setFilters({
      global: {
        value: searchValue,
        matchMode: FilterMatchMode.CONTAINS
      }
    });

    // Llamar callback externo si existe
    if (onSearch) {
      onSearch(searchValue);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-25px"
    }
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    data: data,
    columns: columns,
    loading: loading,
    onReload: onReload,
    onSearch: handleSearch,
    globalFilterFields: globalFilterFields,
    customFilters: filters,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    emptyMessage: "No se encontraron consentimientos",
    showGridlines: true,
    lazy: true,
    first: 0,
    totalRecords: data.length,
    disableSearch: false,
    stripedRows: false,
    size: "normal"
  })));
};
export default DocumentTable;