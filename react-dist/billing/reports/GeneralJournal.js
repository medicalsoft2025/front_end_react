import React from "react";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { useGeneralJournal } from "./hooks/useGeneralJournal.js";
import { useGeneralJournalFormat } from "../../documents-generation/hooks/useGeneralJournalFormat.js";
import { formatDateRange } from "../../../services/utilidades.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
export const GeneralJournal = ({
  fetchData
}) => {
  const {
    dateRange,
    setDateRange,
    generalJournal,
    fetchGeneralJournal,
    loading
  } = useGeneralJournal();
  const {
    generarFormatoGeneralJournal
  } = useGeneralJournalFormat();
  const formatCurrency = value => {
    return value ? `$${parseFloat(value).toFixed(2)}` : '';
  };

  // Columnas para la CustomPRTable
  const columns = [{
    field: 'fecha',
    header: 'Fecha',
    body: rowData => new Date(rowData.fecha).toLocaleDateString(),
    sortable: true
  }, {
    field: 'numero_asiento',
    header: 'N° Asiento',
    sortable: true
  }, {
    field: 'cuenta',
    header: 'Cuenta',
    sortable: true
  }, {
    field: 'debe',
    header: 'Debe',
    body: rowData => formatCurrency(rowData.debe),
    style: {
      textAlign: 'right'
    },
    sortable: true
  }, {
    field: 'haber',
    header: 'Haber',
    body: rowData => formatCurrency(rowData.haber),
    style: {
      textAlign: 'right'
    },
    sortable: true
  }, {
    field: 'descripcion',
    header: 'Descripción',
    sortable: true
  }, {
    field: 'tercero',
    header: 'Tercero',
    sortable: true
  }];
  const handleExportPDF = () => {
    generarFormatoGeneralJournal(generalJournal, formatDateRange(dateRange), 'Impresion');
  };
  const handleExport = type => {
    console.log("Exportando a:", type);
    if (type === 'pdf') {
      handleExportPDF();
    }
  };
  const renderFiltersAccordion = () => /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros - Libro Diario")
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
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar Filtros",
    icon: "pi pi-trash",
    className: "p-button-secondary",
    onClick: () => setDateRange(null)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: fetchGeneralJournal,
    disabled: !dateRange || dateRange.length !== 2
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
    className: "fas fa-book"
  }), "Libro Diario")), /*#__PURE__*/React.createElement("div", {
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
    onClick: handleExportPDF
  })), renderFiltersAccordion(), /*#__PURE__*/React.createElement(Card, {
    title: "Asientos Contables",
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: generalJournal,
    loading: loading,
    onReload: fetchGeneralJournal,
    onExport: handleExport,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    emptyMessage: "No se encontraron asientos contables",
    stripedRows: true,
    showGridlines: true,
    size: "normal"
  }))))))))));
};