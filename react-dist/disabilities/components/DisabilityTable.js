import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { useDebounce } from 'primereact/hooks';
import { CustomPRTable } from "../../components/CustomPRTable.js";
const DisabilityTable = ({
  data,
  columns,
  lazy = false,
  first = 0,
  rows = 5,
  totalRecords = 0,
  sortField,
  sortOrder,
  selectionActive,
  globalFilterFields,
  customFilters,
  disableSearch,
  onSelectedRow,
  onReload,
  onExport,
  onSearch,
  loading,
  onSort,
  onPage,
  paginator = true,
  rowsPerPageOptions = [5, 10, 25, 50],
  emptyMessage = "No se encontraron registros",
  stripedRows = false,
  showGridlines = true,
  size = "normal"
}) => {
  const [filters, setFilters] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    ...customFilters
  });
  const [globalFilterValue, debounceGlobalFilterValue, setGlobalFilterValue] = useDebounce('', 500);
  const [selectedItem, setSelectedItem] = useState(null);
  const onGlobalFilterChange = e => {
    const value = e.target.value;
    let _filters = {
      ...filters
    };

    // @ts-ignore
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const handleOnSelectionChange = e => {
    if (!selectionActive) return;
    setSelectedItem(e.value);
    onSelectedRow && onSelectedRow(e.value);
  };
  const handleExportClick = type => {
    onExport && onExport(type);
  };
  const renderHeader = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center flex-wrap gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, onReload && /*#__PURE__*/React.createElement(Button, {
      type: "button",
      icon: "pi pi-refresh",
      className: "p-button-outlined p-button-secondary",
      onClick: onReload,
      tooltip: "Recargar",
      tooltipOptions: {
        position: 'top'
      }
    }), onExport && /*#__PURE__*/React.createElement("div", {
      className: "p-buttonset"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-file-excel",
      className: "p-button-success",
      onClick: () => handleExportClick('excel'),
      tooltip: "Exportar a Excel",
      tooltipOptions: {
        position: 'top'
      }
    }), /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-file-pdf",
      className: "p-button-danger",
      onClick: () => handleExportClick('pdf'),
      tooltip: "Exportar a PDF",
      tooltipOptions: {
        position: 'top'
      }
    }), /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-download",
      className: "p-button-info",
      onClick: () => handleExportClick('csv'),
      tooltip: "Exportar a CSV",
      tooltipOptions: {
        position: 'top'
      }
    }))), !disableSearch && /*#__PURE__*/React.createElement("span", {
      className: "p-input-icon-left"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-search"
    }), /*#__PURE__*/React.createElement(InputText, {
      value: globalFilterValue,
      onChange: onGlobalFilterChange,
      placeholder: "Buscar...",
      className: "p-inputtext-sm"
    })));
  };
  useEffect(() => {
    onSearch && onSearch(debounceGlobalFilterValue);
  }, [debounceGlobalFilterValue]);
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    data: data,
    columns: columns,
    lazy: lazy,
    first: first,
    rows: rows,
    totalRecords: totalRecords,
    sortField: sortField,
    sortOrder: sortOrder,
    selectionActive: selectionActive,
    globalFilterFields: globalFilterFields,
    customFilters: customFilters,
    disableSearch: disableSearch,
    onSelectedRow: onSelectedRow,
    onReload: onReload,
    onExport: onExport,
    onSearch: onSearch,
    loading: loading,
    onSort: onSort,
    onPage: onPage,
    paginator: paginator,
    rowsPerPageOptions: rowsPerPageOptions,
    emptyMessage: emptyMessage,
    stripedRows: stripedRows,
    showGridlines: showGridlines,
    size: size,
    header: renderHeader,
    filters: filters,
    selection: selectedItem,
    onSelectionChange: handleOnSelectionChange,
    globalFilterValue: globalFilterValue,
    onGlobalFilterChange: onGlobalFilterChange
  }));
};
export default DisabilityTable;