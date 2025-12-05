import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { useBankAccountingReport } from "./hooks/useBankAccountingReport.js";
import { AccountingAccountsDropdown } from "../fields/dropdowns/AccountingAccountsDropdown.js";
import { useBankAccountingFormat } from "../documents-generation/hooks/useBankAccountingFormat.js";
export const BanksAccounting = () => {
  // Estado para los datos de la tabla
  const {
    metodosPago,
    fetchBankAccountingReport,
    loading
  } = useBankAccountingReport();
  const {
    generateBankAccountingFormat
  } = useBankAccountingFormat();
  const [expandedRows, setExpandedRows] = useState(null);

  // Estado para el filtro de fecha
  const [rangoFechas, setRangoFechas] = useState([new Date(), new Date()]);
  const [accountingAccountId, setAccountingAccountId] = useState(null);
  useEffect(() => {
    aplicarFiltros();
  }, [rangoFechas]);
  const aplicarFiltros = () => {
    fetchBankAccountingReport({
      from: rangoFechas?.[0]?.toISOString(),
      to: rangoFechas?.[1]?.toISOString(),
      accounting_account_id: accountingAccountId
    });
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setRangoFechas(null);
  };

  // Formatear número para montos monetarios
  const formatCurrency = value => {
    return value?.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Formatear fecha
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-DO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  // Calcular total de débitos y créditos para una cuenta
  const calcularTotalCuenta = cuenta => {
    const debitDetails = cuenta.movements.filter(mov => mov.type == "debit").flatMap(movement => movement.details);
    const creditDetails = cuenta.movements.filter(mov => mov.type == "credit").flatMap(movement => movement.details);
    const totalDebitos = debitDetails.reduce((sum, det) => {
      const debitValue = parseFloat(det.amount) || 0;
      return sum + debitValue;
    }, 0);
    const totalCreditos = creditDetails.reduce((sum, det) => {
      const creditValue = parseFloat(det.amount) || 0;
      return sum + creditValue;
    }, 0);
    return {
      debitos: totalDebitos,
      creditos: totalCreditos,
      neto: totalCreditos - totalDebitos
    };
  };
  const handlePrint = () => {
    generateBankAccountingFormat(metodosPago, "Impresion");
  };

  // Template para expandir/contraer filas de nivel 1 (Cuentas -> Movimientos)
  const rowExpansionTemplateLevel1 = data => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("h5", null, "Movimientos de la Cuenta: ", data.account.account_name), /*#__PURE__*/React.createElement(DataTable, {
      value: data.movements,
      size: "small",
      responsiveLayout: "scroll",
      expandedRows: expandedRows,
      onRowToggle: e => setExpandedRows(e.data),
      rowExpansionTemplate: rowExpansionTemplateLevel2,
      dataKey: "entry_id"
    }, /*#__PURE__*/React.createElement(Column, {
      expander: true,
      style: {
        width: "3em"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "entry_date",
      header: "Fecha",
      body: rowData => formatDate(rowData.entry_date),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "type",
      header: "Tipo",
      sortable: true,
      body: rowData => {
        const typeMap = {
          credit: "Crédito",
          debit: "Débito"
        };
        return typeMap[rowData.type.toLowerCase()];
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "description",
      header: "Descripci\xF3n"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Monto",
      body: rowData => {
        return formatCurrency(rowData.details.reduce((sum, det) => {
          const amount = parseFloat(det.amount) || 0;
          return sum + amount;
        }, 0));
      },
      style: {
        textAlign: "right"
      },
      sortable: true
    })));
  };

  // Template para expandir/contraer filas de nivel 2 (Movimientos -> Detalles)
  const rowExpansionTemplateLevel2 = data => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3 bg-light"
    }, /*#__PURE__*/React.createElement("h6", null, "Detalles del Movimiento"), /*#__PURE__*/React.createElement(DataTable, {
      value: data.details,
      size: "small",
      responsiveLayout: "scroll"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "third_party",
      header: "Tercero"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "description",
      header: "Descripci\xF3n"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "amount",
      header: "Monto",
      body: rowData => formatCurrency(parseFloat(rowData.amount) || 0),
      style: {
        textAlign: "right"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "account",
      header: "Cuenta Contable",
      body: rowData => rowData.accounting_account || "N/A"
    })));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Reporte de Cuentas Bancarias"), /*#__PURE__*/React.createElement(Button, {
    label: "Exportar Reporte",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-download me-1"
    }),
    className: "p-button-primary",
    onClick: handlePrint
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-end justify-content-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-end justifty-content-end gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rango de Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: rangoFechas,
    onChange: e => setRangoFechas(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango de fechas",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement(AccountingAccountsDropdown, {
    value: accountingAccountId,
    handleChange: e => {
      console.log(e);
      setAccountingAccountId(e.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash me-1"
    }),
    className: "p-button-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Buscar",
    className: "p-button-primary",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-search me-1"
    }),
    onClick: aplicarFiltros
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Cuentas Bancarias y Movimientos"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: metodosPago,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    emptyMessage: "No se encontraron cuentas bancarias",
    className: "p-datatable-striped p-datatable-gridlines",
    responsiveLayout: "scroll",
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplateLevel1,
    dataKey: "account.id"
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: "3em"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "account.account_code",
    header: "C\xF3digo Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "account.account_name",
    header: "Nombre Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "account.account_type",
    header: "Tipo Cuenta",
    sortable: true,
    body: rowData => {
      const accountTypeMap = {
        asset: "Activo",
        liability: "Pasivo",
        equity: "Patrimonio",
        revenue: "Ingreso",
        expense: "Gasto",
        contra: "Cuenta Correctiva",
        cost: "Costo",
        memorandum: "Memorándum"
      };
      return accountTypeMap[rowData.account.account_type.toLowerCase()];
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Total D\xE9bitos",
    body: rowData => {
      const totales = calcularTotalCuenta(rowData);
      return formatCurrency(totales.debitos);
    },
    style: {
      textAlign: "right"
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Total Cr\xE9ditos",
    body: rowData => {
      const totales = calcularTotalCuenta(rowData);
      return formatCurrency(totales.creditos);
    },
    style: {
      textAlign: "right"
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Neto",
    body: rowData => {
      const totales = calcularTotalCuenta(rowData);
      return formatCurrency(totales.neto);
    },
    style: {
      textAlign: "right"
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    header: "N\xB0 Movimientos",
    body: rowData => rowData.movements.length,
    style: {
      textAlign: "center"
    },
    sortable: true
  }))));
};