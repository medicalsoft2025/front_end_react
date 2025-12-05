import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { useAccountingEntries } from "./hooks/useAccountingEntries.js";
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { formatPrice } from "../../../services/utilidades.js";
import { useGeneralLedgerBalanceFormat } from "../../documents-generation/hooks/useGeneralLedgerBalanceFormat.js";
export const GeneralLedgerBalance = () => {
  const [activeTab, setActiveTab] = useState("ledger");
  const [expandedRows, setExpandedRows] = useState(null);
  const [accountGroups, setAccountGroups] = useState([]);
  const toast = useRef(null);
  const {
    accountingEntries: data
  } = useAccountingEntries();
  const {
    generarFormatoGeneralLedgerBalance
  } = useGeneralLedgerBalanceFormat();

  // Procesar datos iniciales
  useEffect(() => {
    if (data && data.data.length > 0) {
      processAccountData(data.data);
    }
  }, [data]);

  // Procesar datos y agrupar por cuenta contable
  const processAccountData = entries => {
    const accountsMap = new Map();
    entries.forEach(entry => {
      const account = entry.accounting_account;
      if (!accountsMap.has(account.account_code)) {
        accountsMap.set(account.account_code, {
          account_code: account.account_code,
          account_name: account.account_name,
          account_type: account.account_type,
          balance: parseFloat(account.balance),
          entries: []
        });
      }
      accountsMap.get(account.account_code)?.entries.push(entry);
    });
    setAccountGroups(Array.from(accountsMap.values()));
  };

  // Plantilla de expansión de fila
  const rowExpansionTemplate = account => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("h5", null, "Movimientos de ", account.account_name), /*#__PURE__*/React.createElement(DataTable, {
      value: account.entries,
      size: "small"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "entry_date",
      header: "Fecha",
      body: rowData => new Date(rowData.entry_date).toLocaleDateString()
    }), /*#__PURE__*/React.createElement(Column, {
      field: "description",
      header: "Descripci\xF3n"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "D\xE9bito",
      body: rowData => rowData.type === "debit" ? formatPrice(rowData.amount) : "-"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Cr\xE9dito",
      body: rowData => rowData.type === "credit" ? formatPrice(rowData.amount) : "-"
    })));
  };

  // Determinar si una fila puede expandirse
  const allowExpansion = rowData => {
    return rowData.entries.length > 0;
  };
  const handleReload = () => {
    window.location.reload();
  };
  const renderFiltersAccordion = () => /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros - Libro Mayor y Balance")
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-0"
  }, "Los datos se cargan autom\xE1ticamente. Use los filtros de b\xFAsqueda en la tabla para refinar los resultados."))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar Filtros",
    icon: "pi pi-trash",
    className: "p-button-secondary",
    onClick: handleReload
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Recargar Datos",
    icon: "pi pi-refresh",
    className: "p-button-primary",
    onClick: handleReload
  }))));
  const renderLedgerTab = () => {
    return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between mb-3"
    }, /*#__PURE__*/React.createElement("h5", null, "Libro Mayor"), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-pdf me-2"
      }),
      label: "Exportar a PDF",
      onClick: () => generarFormatoGeneralLedgerBalance({
        data: accountGroups,
        showMovements: true,
        title: "Libro Mayor",
        type: "Impresion"
      })
    })), /*#__PURE__*/React.createElement(DataTable, {
      value: accountGroups,
      expandedRows: expandedRows,
      onRowToggle: e => setExpandedRows(e.data),
      rowExpansionTemplate: rowExpansionTemplate,
      dataKey: "account_code",
      tableStyle: {
        minWidth: '60rem'
      }
    }, /*#__PURE__*/React.createElement(Column, {
      expander: allowExpansion,
      style: {
        width: '3rem'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "account_code",
      header: "C\xF3digo",
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "account_name",
      header: "Nombre de Cuenta",
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Tipo",
      body: rowData => {
        switch (rowData.account_type) {
          case "asset":
            return "Activo";
          case "liability":
            return "Pasivo";
          case "income":
            return "Ingreso";
          case "expense":
            return "Gasto";
          default:
            return rowData.account_type;
        }
      },
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Saldo",
      body: rowData => formatPrice(rowData.balance),
      sortable: true
    })));
  };
  const renderBalanceTab = () => {
    return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between mb-3"
    }, /*#__PURE__*/React.createElement("h5", null, "Balance"), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-pdf me-2"
      }),
      label: "Exportar a PDF",
      onClick: () => generarFormatoGeneralLedgerBalance({
        data: accountGroups,
        showMovements: false,
        title: "Balance",
        type: "Impresion"
      })
    })), /*#__PURE__*/React.createElement(DataTable, {
      value: accountGroups,
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [5, 10, 25, 50],
      className: "p-datatable-striped",
      emptyMessage: "No se encontraron cuentas",
      tableStyle: {
        minWidth: "50rem"
      }
    }, /*#__PURE__*/React.createElement(Column, {
      field: "account_code",
      header: "C\xF3digo"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "account_name",
      header: "Nombre de Cuenta"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Tipo",
      body: rowData => {
        switch (rowData.account_type) {
          case "asset":
            return "Activo";
          case "liability":
            return "Pasivo";
          case "income":
            return "Ingreso";
          case "expense":
            return "Gasto";
          default:
            return rowData.account_type;
        }
      }
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Saldo",
      body: rowData => formatPrice(rowData.balance)
    })));
  };
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "ledger":
        return renderLedgerTab();
      case "balance":
        return renderBalanceTab();
      default:
        return renderLedgerTab();
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
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "tabs-professional-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "ledger" ? "active" : ""}`,
    onClick: () => setActiveTab("ledger")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-book"
  }), "Libro Mayor"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "balance" ? "active" : ""}`,
    onClick: () => setActiveTab("balance")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-balance-scale"
  }), "Balance")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "ledger" ? "active" : ""}`
  }, renderFiltersAccordion(), renderActiveComponent()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "balance" ? "active" : ""}`
  }, renderFiltersAccordion(), renderActiveComponent()))))))));
};