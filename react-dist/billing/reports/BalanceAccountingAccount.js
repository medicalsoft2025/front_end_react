import React from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useBalanceAccountingAccount } from "./hooks/useBalanceAccountingAccount.js";
import { formatDateRange, formatPrice } from "../../../services/utilidades.js";
import { useBalanceAccountingAccountFormat } from "../../documents-generation/hooks/useBalanceAccountingAccountFormat.js";
import { AccountingAccountsRange } from "../../fields/ranges/AccountingAccountsRange.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
export const BalanceAccountingAccount = () => {
  const {
    dateRange,
    setDateRange,
    startAccount,
    endAccount,
    setStartAccount,
    setEndAccount,
    balanceAccountingAccount,
    fetchBalanceAccountingAccount,
    loading
  } = useBalanceAccountingAccount();
  const {
    generarFormatoBalanceAccountingAccount
  } = useBalanceAccountingAccountFormat();

  // Columnas para la CustomPRTable
  const columns = [{
    field: 'cuenta_codigo',
    header: 'Código',
    body: rowData => rowData.cuenta_codigo || 'Sin código',
    sortable: true
  }, {
    field: 'cuenta_nombre',
    header: 'Nombre de Cuenta',
    body: rowData => rowData.cuenta_nombre || 'Sin nombre',
    sortable: true
  }, {
    field: 'saldo_inicial',
    header: 'Saldo Inicial',
    body: rowData => formatPrice(rowData.saldo_inicial),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'debe_total',
    header: 'Total Débito',
    body: rowData => formatPrice(rowData.debe_total),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'haber_total',
    header: 'Total Crédito',
    body: rowData => formatPrice(rowData.haber_total),
    sortable: true,
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'saldo_final',
    header: 'Saldo Final',
    body: rowData => /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        fontWeight: 'bold',
        color: rowData.saldo_final < 0 ? '#e74c3c' : rowData.saldo_final > 0 ? '#27ae60' : '#000000'
      }
    }, formatPrice(rowData.saldo_final)),
    sortable: true
  }];
  const exportToPdfComparativeReport = () => {
    generarFormatoBalanceAccountingAccount(balanceAccountingAccount, formatDateRange(dateRange), 'Impresion');
  };
  const handleExport = type => {
    console.log("Exportando a:", type);
  };
  const renderFiltersAccordion = () => /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros - Balance de Cuentas Contables")
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
  }, /*#__PURE__*/React.createElement(AccountingAccountsRange, {
    startValue: startAccount,
    endValue: endAccount,
    handleStartChange: e => setStartAccount(e.value),
    handleEndChange: e => setEndAccount(e.value),
    optionValue: "account_code"
  })))));
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
  }), "Balance de Cuentas Contables")), /*#__PURE__*/React.createElement("div", {
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
    onClick: exportToPdfComparativeReport
  })), renderFiltersAccordion(), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: balanceAccountingAccount,
    loading: loading,
    onReload: fetchBalanceAccountingAccount,
    onExport: handleExport,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    emptyMessage: "No se encontraron movimientos",
    stripedRows: true,
    showGridlines: true,
    size: "normal"
  })))))))), /*#__PURE__*/React.createElement("style", null, ` div[data-pc-section="panel"]{
                    top: 300px !important;
                }
                .p-accordion .p-accordion-tab .p-accordion-content{
                overflow: auto !important;
                    }`));
};