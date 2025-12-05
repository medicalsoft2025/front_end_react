import React from "react";
import { Calendar } from "primereact/calendar";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useBalanceThirdParty } from "./hooks/useBalanceThirdParty.js";
import { ThirdPartyDropdown } from "../../fields/dropdowns/ThirdPartyDropdown.js";
import { AccountingAccountsRange } from "../../fields/ranges/AccountingAccountsRange.js";
import { Button } from "primereact/button";
import { useBalanceThirdPartyFormat } from "../../documents-generation/hooks/useBalanceThirdPartyFormat.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { formatDateRange } from "../../../services/utilidades.js";
export const BalanceThirdParty = () => {
  const {
    dateRange,
    setDateRange,
    thirdPartyId,
    setThirdPartyId,
    balanceThirdParty,
    loading,
    startAccount,
    endAccount,
    setStartAccount,
    setEndAccount
  } = useBalanceThirdParty();
  const {
    generarFormatoBalanceThirdParty
  } = useBalanceThirdPartyFormat();
  const formatCurrency = value => {
    return `$${value.toFixed(2)}`;
  };

  // Columnas para la tabla CustomPRTable
  const columns = [{
    field: 'tercero_nombre',
    header: 'Tercero',
    body: rowData => rowData.tercero_nombre || 'Sin tercero',
    sortable: true
  }, {
    field: 'debe_total',
    header: 'Total Debe',
    body: rowData => formatCurrency(rowData.debe_total),
    style: {
      textAlign: 'right'
    },
    sortable: true
  }, {
    field: 'haber_total',
    header: 'Total Haber',
    body: rowData => formatCurrency(rowData.haber_total),
    style: {
      textAlign: 'right'
    },
    sortable: true
  }, {
    field: 'saldo_final',
    header: 'Saldo',
    body: rowData => /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        fontWeight: 'bold',
        color: rowData.saldo_final < 0 ? '#e74c3c' : rowData.saldo_final > 0 ? '#27ae60' : '#000000'
      }
    }, formatCurrency(Math.abs(rowData.saldo_final))),
    sortable: true
  }];
  const exportToPdf = () => {
    generarFormatoBalanceThirdParty(balanceThirdParty, formatDateRange(dateRange), 'Impresion');
  };
  const handleSearch = searchValue => {
    console.log("Buscando:", searchValue);
    // Implementar lógica de búsqueda si es necesario
  };
  const renderFiltersAccordion = () => /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros")
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "dateRange",
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "dateRange",
    selectionMode: "range",
    value: dateRange,
    onChange: e => setDateRange(e.value),
    className: "w-100",
    showIcon: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tercero"), /*#__PURE__*/React.createElement(ThirdPartyDropdown, {
    value: thirdPartyId,
    handleChange: e => setThirdPartyId(e.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement(AccountingAccountsRange, {
    startValue: startAccount,
    endValue: endAccount,
    handleStartChange: e => setStartAccount(e.value),
    handleEndChange: e => setEndAccount(e.value),
    optionValue: "account_code"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar Filtros",
    icon: "pi pi-trash",
    className: "p-button-secondary",
    onClick: () => {
      setDateRange(null);
      setThirdPartyId(null);
      setStartAccount(null);
      setEndAccount(null);
    }
  }))));
  return /*#__PURE__*/React.createElement("main", {
    className: "main",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3 justify-content-between align-items-start mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-professional-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: "tab-item active"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-balance-scale"
  }), "Balance por Tercero")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab-panel active"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mb-3"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-pdf me-2"
    }),
    label: "Exportar a PDF",
    className: "p-button-primary",
    onClick: exportToPdf
  })), renderFiltersAccordion(), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: balanceThirdParty,
    loading: loading,
    onSearch: handleSearch,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    emptyMessage: "No se encontraron movimientos",
    stripedRows: true,
    size: "normal"
  })))))))));
};