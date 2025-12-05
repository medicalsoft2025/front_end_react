import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { useBalanceGeneral } from "./hooks/useBalanceGeneral.js";
import { useComparativeBalanceGeneral } from "./hooks/useComparativeBalanceGeneral.js";
import { useBalanceGeneralFormat } from "../../documents-generation/hooks/useBalanceGeneralFormat.js";
import { useComparativeBalanceGeneralFormat } from "../../documents-generation/hooks/useComparativeBalanceGeneralFormat.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
export const BalanceSheet = () => {
  const [activeTab, setActiveTab] = useState("simple");
  const {
    dateRange: dateRangeBalanceGeneral,
    setDateRange: setDateRangeBalanceGeneral,
    fetchBalanceGeneral,
    balanceGeneral: balanceSheetData
  } = useBalanceGeneral();
  const {
    dateRangePeriodOne,
    dateRangePeriodTwo,
    setDateRangePeriodOne,
    setDateRangePeriodTwo,
    fetchComparativeBalanceGeneral,
    comparativeBalanceGeneral: comparativeBalanceSheetData
  } = useComparativeBalanceGeneral();
  const {
    generarFormatoBalanceGeneral
  } = useBalanceGeneralFormat();
  const {
    generateComparativeBalanceGeneralFormat
  } = useComparativeBalanceGeneralFormat();
  const formatCurrency = value => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  const filterAccountsByType = accounts => {
    return accounts.filter(account => account.account_code.startsWith('1') || account.account_code.startsWith('2') || account.account_code.startsWith('3'));
  };
  const exportToPdfSimpleReport = () => {
    generarFormatoBalanceGeneral(balanceSheetData, dateRangeBalanceGeneral?.filter(date => !!date).map(date => date.toISOString().split("T")[0]).join(' - ') || '--', 'Impresion');
  };
  const exportToPdfComparativeReport = () => {
    generateComparativeBalanceGeneralFormat(comparativeBalanceSheetData, 'Impresion');
  };
  const renderBalanceStatus = isBalanced => {
    return /*#__PURE__*/React.createElement("div", {
      className: `alert ${isBalanced ? 'alert-success' : 'alert-danger'} mt-3`
    }, isBalanced ? /*#__PURE__*/React.createElement("span", null, "El balance general est\xE1 equilibrado") : /*#__PURE__*/React.createElement("span", null, "El balance general NO est\xE1 equilibrado"));
  };

  // Columnas para Balance General
  const simpleBalanceColumns = [{
    field: 'account_code',
    header: 'Código',
    sortable: true,
    width: '120px'
  }, {
    field: 'account_name',
    header: 'Cuenta',
    sortable: true
  }, {
    field: 'balance',
    header: 'Balance',
    body: rowData => formatCurrency(rowData.balance),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }];

  // Columnas para Balance Comparativo
  const comparativeBalanceColumns = [{
    field: 'account_code',
    header: 'Código',
    sortable: true,
    width: '100px'
  }, {
    field: 'account_name',
    header: 'Cuenta',
    sortable: true,
    width: '200px'
  }, {
    field: 'balance_period_1',
    header: 'Periodo 1',
    body: rowData => formatCurrency(rowData.balance_period_1),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'balance_period_2',
    header: 'Periodo 2',
    body: rowData => formatCurrency(rowData.balance_period_2),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'difference',
    header: 'Diferencia',
    body: rowData => formatCurrency(rowData.difference),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }];
  const handleExport = type => {
    console.log("Exportando a:", type);
    // Implementar lógica de exportación específica
  };
  const renderAccountTable = (accounts, title) => {
    const filteredAccounts = filterAccountsByType(accounts);
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, title), /*#__PURE__*/React.createElement(CustomPRTable, {
      columns: simpleBalanceColumns,
      data: filteredAccounts,
      loading: false,
      onReload: fetchBalanceGeneral,
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
  const renderComparativeAccountTable = (accounts, title) => {
    const filteredAccounts = filterAccountsByType(accounts);
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, title), /*#__PURE__*/React.createElement(CustomPRTable, {
      columns: comparativeBalanceColumns,
      data: filteredAccounts,
      loading: false,
      onReload: fetchBalanceGeneral,
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
    }), "Filtros - Balance General")
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dateRangeBalanceGeneral,
    onChange: e => setDateRangeBalanceGeneral(e.value),
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
    onClick: () => setDateRangeBalanceGeneral(null)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: () => fetchBalanceGeneral()
  }))));
  const renderComparativeReportFilters = () => /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros - Balance Comparativo")
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Periodo 1"), /*#__PURE__*/React.createElement(Calendar, {
    value: dateRangePeriodOne,
    onChange: e => setDateRangePeriodOne(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    className: "w-100",
    placeholder: "Seleccione un rango de fechas",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Periodo 2"), /*#__PURE__*/React.createElement(Calendar, {
    value: dateRangePeriodTwo,
    onChange: e => setDateRangePeriodTwo(e.value),
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
    onClick: () => {
      setDateRangePeriodOne(null);
      setDateRangePeriodTwo(null);
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Comparar",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: fetchComparativeBalanceGeneral
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
      title: "Balance General",
      className: "mb-3"
    }, renderAccountTable(balanceSheetData.categories.assets, "Activos"), renderAccountTable(balanceSheetData.categories.liabilities, "Pasivos"), renderAccountTable(balanceSheetData.categories.equity, "Patrimonio"), /*#__PURE__*/React.createElement("div", {
      className: "mt-4"
    }, /*#__PURE__*/React.createElement("h5", null, "Totales"), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Activos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(balanceSheetData.totals.assets))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Pasivos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(balanceSheetData.totals.liabilities))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Patrimonio")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(balanceSheetData.totals.equity))), /*#__PURE__*/React.createElement("tr", {
      className: "table-secondary"
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Diferencia")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(balanceSheetData.difference)))))), renderBalanceStatus(balanceSheetData.is_balanced)));
  };
  const renderComparativeReport = () => {
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
      title: "Balance General Comparativo",
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card bg-light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("h6", null, "Periodo 1"), /*#__PURE__*/React.createElement("p", {
      className: "mb-0"
    }, comparativeBalanceSheetData.period_1)))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card bg-light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("h6", null, "Periodo 2"), /*#__PURE__*/React.createElement("p", {
      className: "mb-0"
    }, comparativeBalanceSheetData.period_2))))), renderComparativeAccountTable(comparativeBalanceSheetData.comparison.assets, "Activos"), renderComparativeAccountTable(comparativeBalanceSheetData.comparison.liabilities, "Pasivos"), renderComparativeAccountTable(comparativeBalanceSheetData.comparison.equity, "Patrimonio"), /*#__PURE__*/React.createElement("div", {
      className: "mt-4"
    }, /*#__PURE__*/React.createElement("h5", null, "Totales Comparativos"), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Cuenta"), /*#__PURE__*/React.createElement("th", {
      className: "text-end"
    }, "Periodo 1"), /*#__PURE__*/React.createElement("th", {
      className: "text-end"
    }, "Periodo 2"), /*#__PURE__*/React.createElement("th", {
      className: "text-end"
    }, "Diferencia"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Activos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.total_period_1)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.total_period_2)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.difference))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Pasivos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.total_period_1)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.total_period_2)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.difference))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Patrimonio")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.total_period_1)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.total_period_2)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.difference))), /*#__PURE__*/React.createElement("tr", {
      className: "table-secondary"
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Resultado del Ejercicio")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.summary.result_comparison.period_1)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.summary.result_comparison.period_2)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeBalanceSheetData.summary.result_comparison.difference)))))), renderBalanceStatus(comparativeBalanceSheetData.summary.is_balanced)));
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
    className: "fas fa-balance-scale"
  }), "Balance General"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "comparative" ? "active" : ""}`,
    onClick: () => setActiveTab("comparative")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-line"
  }), "Balance Comparativo")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "simple" ? "active" : ""}`
  }, renderActiveComponent()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "comparative" ? "active" : ""}`
  }, renderActiveComponent()))))))));
};