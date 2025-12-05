import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { useStatusResult } from "./hooks/useStatusResult.js";
import { useComparativeStatusResult } from "./hooks/useComparativeStatusResult.js";
import { useStatusResultFormat } from "../../documents-generation/hooks/useStatusResultFormat.js";
import { useComparativeStatusResultFormat } from "../../documents-generation/hooks/useComparativeStatusResultFormat.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
export const StatusResult = () => {
  const [activeTab, setActiveTab] = useState("simple");
  const {
    dateRange,
    setDateRange,
    statusResult: incomeStatementData,
    fetchStatusResult
  } = useStatusResult();
  const {
    dateRangePeriodOne,
    setDateRangePeriodOne,
    dateRangePeriodTwo,
    setDateRangePeriodTwo,
    comparativeStatusResult: comparativeIncomeStatementData,
    fetchComparativeStatusResult
  } = useComparativeStatusResult();
  const {
    generateStatusResultFormat
  } = useStatusResultFormat();
  const {
    generateComparativeStatusResultFormat
  } = useComparativeStatusResultFormat();
  const formatCurrency = value => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };
  const formatPercentage = value => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('es-DO', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  const getPercentageColor = value => {
    if (value === null) return 'secondary';
    return value > 0 ? 'success' : value < 0 ? 'danger' : 'info';
  };
  const exportToPdfSimpleReport = () => {
    generateStatusResultFormat(incomeStatementData, 'Impresion');
  };
  const exportToPdfComparativeReport = () => {
    generateComparativeStatusResultFormat(comparativeIncomeStatementData, 'Impresion');
  };

  // Columnas para cuentas simples
  const simpleAccountColumns = [{
    field: 'codigo',
    header: 'Código',
    sortable: true,
    width: '120px'
  }, {
    field: 'nombre',
    header: 'Cuenta',
    sortable: true
  }, {
    field: 'total_creditos',
    header: 'Créditos',
    body: rowData => formatCurrency(rowData.total_creditos),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'total_debitos',
    header: 'Débitos',
    body: rowData => formatCurrency(rowData.total_debitos),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }];

  // Columnas para cuentas comparativas
  const comparativeAccountColumns = [{
    field: 'codigo',
    header: 'Código',
    sortable: true,
    width: '100px'
  }, {
    field: 'nombre',
    header: 'Cuenta',
    sortable: true,
    width: '200px'
  }, {
    field: 'total_creditos',
    header: 'Créditos',
    body: rowData => formatCurrency(rowData.total_creditos),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'total_debitos',
    header: 'Débitos',
    body: rowData => formatCurrency(rowData.total_debitos),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }];

  // Columnas para detalles por categoría
  const categoryColumns = [{
    field: 'categoria',
    header: 'Categoría',
    sortable: true
  }, {
    field: 'total_creditos',
    header: 'Total Créditos',
    body: rowData => formatCurrency(rowData.total_creditos),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'total_debitos',
    header: 'Total Débitos',
    body: rowData => formatCurrency(rowData.total_debitos),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }];

  // Columnas para resumen comparativo
  const comparativeSummaryColumns = [{
    field: 'concepto',
    header: 'Concepto',
    sortable: true
  }, {
    field: 'current',
    header: 'Periodo Actual',
    body: rowData => formatCurrency(rowData.current),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'previous',
    header: 'Periodo Anterior',
    body: rowData => formatCurrency(rowData.previous),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'difference',
    header: 'Diferencia',
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `fw-bold ${rowData.difference > 0 ? 'text-success' : rowData.difference < 0 ? 'text-danger' : 'text-muted'}`
    }, formatCurrency(rowData.difference)),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'percentage_change',
    header: '% Cambio',
    body: rowData => /*#__PURE__*/React.createElement(Badge, {
      value: formatPercentage(rowData.percentage_change),
      severity: getPercentageColor(rowData.percentage_change)
    }),
    style: {
      textAlign: 'center'
    }
  }];
  const handleReload = () => {
    /* window.location.reload();*/
  };
  const handleExport = type => {
    console.log("Exportando a:", type);
  };
  const renderAccountTable = (accounts, title) => {
    return /*#__PURE__*/React.createElement(Panel, {
      header: title,
      toggleable: true,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement(CustomPRTable, {
      columns: simpleAccountColumns,
      data: accounts,
      loading: false,
      onReload: handleReload,
      onExport: handleExport,
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [5, 10, 25, 50],
      emptyMessage: `No se encontraron cuentas para ${title}`,
      stripedRows: true,
      showGridlines: true,
      size: "small"
    }));
  };
  const renderComparativeAccountTable = (accounts, title, period) => {
    return /*#__PURE__*/React.createElement(Panel, {
      header: `${title} (${period === 'current' ? 'Periodo Actual' : 'Periodo Anterior'})`,
      toggleable: true,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement(CustomPRTable, {
      columns: comparativeAccountColumns,
      data: accounts,
      loading: false,
      onReload: handleReload,
      onExport: handleExport,
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [5, 10, 25, 50],
      emptyMessage: `No se encontraron cuentas para ${title}`,
      stripedRows: true,
      showGridlines: true,
      size: "small"
    }));
  };
  const renderSimpleReportFilters = () => /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros - Estado de Resultados Simple")
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rango de Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dateRange,
    onChange: e => setDateRange(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    className: "w-100",
    placeholder: "Seleccione un rango de fechas",
    showIcon: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar Filtros",
    icon: "pi pi-trash",
    className: "p-button-secondary",
    onClick: () => setDateRange(null)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Generar Reporte",
    icon: "pi pi-refresh",
    className: "p-button-primary",
    onClick: fetchStatusResult
  }))));
  const renderComparativeReportFilters = () => /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros - An\xE1lisis Comparativo")
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Periodo Actual"), /*#__PURE__*/React.createElement(Calendar, {
    value: dateRangePeriodOne,
    onChange: e => setDateRangePeriodOne(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    className: "w-100",
    placeholder: "Seleccione rango de fechas",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Periodo Anterior"), /*#__PURE__*/React.createElement(Calendar, {
    value: dateRangePeriodTwo,
    onChange: e => setDateRangePeriodTwo(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    className: "w-100",
    placeholder: "Seleccione rango de fechas",
    showIcon: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar Filtros",
    icon: "pi pi-trash",
    className: "p-button-secondary",
    onClick: () => {
      setDateRangePeriodOne(null);
      setDateRangePeriodTwo(null);
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Comparar",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: fetchComparativeStatusResult
  }))));
  const renderSimpleReport = () => {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end mb-3"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-pdf me-2"
      }),
      label: "Exportar a PDF",
      className: "p-button-primary",
      onClick: exportToPdfSimpleReport
    })), renderSimpleReportFilters(), /*#__PURE__*/React.createElement(Card, {
      title: "Estado de Resultados",
      className: "mb-3"
    }, /*#__PURE__*/React.createElement(Panel, {
      header: "Resumen Ejecutivo",
      toggleable: true,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row g-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card border-0 bg-light-success"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body text-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-arrow-up-right text-success mb-2",
      style: {
        fontSize: '1.5rem'
      }
    }), /*#__PURE__*/React.createElement("h5", {
      className: "text-success"
    }, formatCurrency(incomeStatementData.resumen.ingresos)), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Ingresos Totales")))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card border-0 bg-light-warning"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body text-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-chart-line text-warning mb-2",
      style: {
        fontSize: '1.5rem'
      }
    }), /*#__PURE__*/React.createElement("h5", {
      className: "text-warning"
    }, formatCurrency(incomeStatementData.resumen.utilidad_bruta)), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Utilidad Bruta")))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card border-0 bg-light-primary"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body text-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-dollar text-primary mb-2",
      style: {
        fontSize: '1.5rem'
      }
    }), /*#__PURE__*/React.createElement("h5", {
      className: "text-primary"
    }, formatCurrency(incomeStatementData.resumen.utilidad_neta)), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Utilidad Neta"))))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("table", {
      className: "table table-hover"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      className: "fw-semibold"
    }, "Ingresos"), /*#__PURE__*/React.createElement("td", {
      className: "text-end text-success fw-bold"
    }, formatCurrency(incomeStatementData.resumen.ingresos))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      className: "fw-semibold"
    }, "Costos"), /*#__PURE__*/React.createElement("td", {
      className: "text-end text-danger fw-bold"
    }, formatCurrency(incomeStatementData.resumen.costos))), /*#__PURE__*/React.createElement("tr", {
      className: "table-active"
    }, /*#__PURE__*/React.createElement("td", {
      className: "fw-bold"
    }, "Utilidad Bruta"), /*#__PURE__*/React.createElement("td", {
      className: "text-end fw-bold"
    }, formatCurrency(incomeStatementData.resumen.utilidad_bruta))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      className: "fw-semibold"
    }, "Gastos"), /*#__PURE__*/React.createElement("td", {
      className: "text-end text-warning fw-bold"
    }, formatCurrency(incomeStatementData.resumen.gastos))), /*#__PURE__*/React.createElement("tr", {
      className: "table-success"
    }, /*#__PURE__*/React.createElement("td", {
      className: "fw-bold"
    }, "Utilidad Neta"), /*#__PURE__*/React.createElement("td", {
      className: "text-end fw-bold"
    }, formatCurrency(incomeStatementData.resumen.utilidad_neta)))))), /*#__PURE__*/React.createElement(Panel, {
      header: "Detalles por Categor\xEDa",
      toggleable: true,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement(CustomPRTable, {
      columns: categoryColumns,
      data: incomeStatementData.detalles,
      loading: false,
      onReload: handleReload,
      onExport: handleExport,
      paginator: true,
      rows: 5,
      emptyMessage: "No se encontraron detalles por categor\xEDa",
      stripedRows: true,
      showGridlines: true,
      size: "small"
    })), renderAccountTable(incomeStatementData.cuentas, "Detalle de Cuentas")));
  };
  const renderComparativeReport = () => {
    const comparativeSummaryData = [{
      concepto: 'Ingresos',
      ...comparativeIncomeStatementData.resumen.ingresos
    }, {
      concepto: 'Costos',
      ...comparativeIncomeStatementData.resumen.costos
    }, {
      concepto: 'Utilidad Bruta',
      ...comparativeIncomeStatementData.resumen.utilidad_bruta
    }, {
      concepto: 'Gastos',
      ...comparativeIncomeStatementData.resumen.gastos
    }, {
      concepto: 'Utilidad Neta',
      ...comparativeIncomeStatementData.resumen.utilidad_neta
    }];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end mb-3"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-pdf me-2"
      }),
      label: "Exportar a PDF",
      className: "p-button-primary",
      onClick: exportToPdfComparativeReport
    })), renderComparativeReportFilters(), /*#__PURE__*/React.createElement(Card, {
      title: "Estado de Resultados Comparativo",
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card bg-primary text-white"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-calendar mr-3",
      style: {
        fontSize: '2rem'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h6", {
      className: "mb-1 text-white font-medium"
    }, "Periodo Actual"), /*#__PURE__*/React.createElement("p", {
      className: "mb-0 fw-bold"
    }, comparativeIncomeStatementData.periodo.desde.current, " al ", comparativeIncomeStatementData.periodo.hasta.current)))))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card bg-secondary text-white"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-calendar-times mr-3",
      style: {
        fontSize: '2rem'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h6", {
      className: "mb-1 text-white font-medium"
    }, "Periodo Anterior"), /*#__PURE__*/React.createElement("p", {
      className: "mb-0 fw-bold"
    }, comparativeIncomeStatementData.periodo.desde.previous, " al ", comparativeIncomeStatementData.periodo.hasta.previous))))))), /*#__PURE__*/React.createElement(Panel, {
      header: "Resumen Comparativo",
      toggleable: true,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement(CustomPRTable, {
      columns: comparativeSummaryColumns,
      data: comparativeSummaryData,
      loading: false,
      onReload: handleReload,
      onExport: handleExport,
      paginator: false,
      emptyMessage: "No se encontraron datos comparativos",
      stripedRows: true,
      showGridlines: true,
      size: "small"
    })), /*#__PURE__*/React.createElement("div", {
      className: "row mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement(Panel, {
      header: "Detalles - Periodo Actual",
      toggleable: true,
      className: "h-100"
    }, /*#__PURE__*/React.createElement(CustomPRTable, {
      columns: categoryColumns,
      data: comparativeIncomeStatementData.detalles.current,
      loading: false,
      onReload: handleReload,
      onExport: handleExport,
      paginator: true,
      rows: 5,
      emptyMessage: "No se encontraron detalles para el periodo actual",
      stripedRows: true,
      showGridlines: true,
      size: "small"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement(Panel, {
      header: "Detalles - Periodo Anterior",
      toggleable: true,
      className: "h-100"
    }, /*#__PURE__*/React.createElement(CustomPRTable, {
      columns: categoryColumns,
      data: comparativeIncomeStatementData.detalles.previous,
      loading: false,
      onReload: handleReload,
      onExport: handleExport,
      paginator: true,
      rows: 5,
      emptyMessage: "No se encontraron detalles para el periodo anterior",
      stripedRows: true,
      showGridlines: true,
      size: "small"
    })))), renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.current, "Detalle de Cuentas", 'current'), renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.previous, "Detalle de Cuentas", 'previous')));
  };
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "simple":
        return renderSimpleReport();
      case "comparative":
        return renderComparativeReport();
      default:
        return renderSimpleReport();
    }
  };
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
    className: `tab-item ${activeTab === "simple" ? "active" : ""}`,
    onClick: () => setActiveTab("simple")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-bar"
  }), "Reporte Simple"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "comparative" ? "active" : ""}`,
    onClick: () => setActiveTab("comparative")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-line"
  }), "An\xE1lisis Comparativo")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "simple" ? "active" : ""}`
  }, renderActiveComponent()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "comparative" ? "active" : ""}`
  }, renderActiveComponent()))))))));
};