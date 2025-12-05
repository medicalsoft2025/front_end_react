import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { useAuxiliaryMovementReport } from "./hooks/useAuxiliaryMovementReport.js";
import { AccountingAccountsRange } from "../../fields/ranges/AccountingAccountsRange.js";
import { Button } from "primereact/button";
import { useAuxiliaryMovementFormat } from "../../documents-generation/hooks/useAuxiliaryMovementFormat.js";
import { formatDateRange } from "../../../services/utilidades.js";
export const AuxiliaryMovement = () => {
  // Estado para los datos de la tabla
  const {
    cuentasContables,
    dateRange,
    setDateRange,
    startAccount,
    endAccount,
    setStartAccount,
    setEndAccount,
    loading
  } = useAuxiliaryMovementReport();
  const {
    generarFormatoAuxiliaryMovement
  } = useAuxiliaryMovementFormat();
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalSaldoFinal, setTotalSaldoFinal] = useState(0);
  const [expandedRows, setExpandedRows] = useState(null);
  useEffect(() => {
    calcularTotales(cuentasContables);
  }, [cuentasContables]);
  const calcularTotales = datos => {
    let totalReg = 0;
    let totalSaldo = 0;
    datos.forEach(cuenta => {
      totalReg += cuenta.movimientos.length;
      totalSaldo += cuenta.saldo_final;
    });
    setTotalRegistros(totalReg);
    setTotalSaldoFinal(totalSaldo);
  };

  // Formatear número para saldos monetarios
  const formatCurrency = value => {
    return value.toLocaleString("es-DO", {
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

  // Template para expandir/contraer filas
  const rowExpansionTemplate = data => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("h5", null, "Movimientos de la cuenta ", data.cuenta, " - ", data.nombre), /*#__PURE__*/React.createElement(DataTable, {
      value: data.movimientos,
      size: "small",
      responsiveLayout: "scroll"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "fecha",
      header: "Fecha",
      body: rowData => formatDate(rowData.fecha)
    }), /*#__PURE__*/React.createElement(Column, {
      field: "asiento",
      header: "Asiento"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "descripcion",
      header: "Descripci\xF3n"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "tercero",
      header: "Tercero"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "debit",
      header: "D\xE9bito",
      body: rowData => formatCurrency(parseFloat(rowData.debit)),
      style: {
        textAlign: "right"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "credit",
      header: "Cr\xE9dito",
      body: rowData => formatCurrency(rowData.credit),
      style: {
        textAlign: "right"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "saldo",
      header: "Saldo",
      body: rowData => formatCurrency(rowData.saldo),
      style: {
        textAlign: "right"
      }
    })));
  };

  // Footer para los totales
  const footerTotales = /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Movimientos:"), " ", totalRegistros), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Final:"), /*#__PURE__*/React.createElement("span", {
    className: "text-primary cursor-pointer ml-2"
  }, formatCurrency(totalSaldoFinal))));
  const handleExportPDF = () => {
    generarFormatoAuxiliaryMovement(cuentasContables, formatDateRange(dateRange), "Impresion");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Movimiento Auxiliar x Cuenta Contable")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-end gap-3 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-3 align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
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
    placeholder: "Seleccione un rango",
    appendTo: document.body
  })), /*#__PURE__*/React.createElement(AccountingAccountsRange, {
    startValue: startAccount,
    endValue: endAccount,
    handleStartChange: e => setStartAccount(e.value),
    handleEndChange: e => setEndAccount(e.value),
    optionValue: "account_code"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-pdf"
    }),
    label: "Exportar a PDF",
    className: "mr-2",
    onClick: handleExportPDF
  }))), /*#__PURE__*/React.createElement(DataTable, {
    value: cuentasContables,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    emptyMessage: "No se encontraron cuentas contables",
    className: "p-datatable-striped p-datatable-gridlines",
    responsiveLayout: "scroll",
    footer: footerTotales,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "cuenta"
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: "3em"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "cuenta",
    header: "C\xF3digo Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldo_inicial",
    header: "Saldo Inicial",
    body: rowData => formatCurrency(parseFloat(rowData.saldo_inicial)),
    style: {
      textAlign: "right"
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldo_final",
    header: "Saldo Final",
    body: rowData => formatCurrency(rowData.saldo_final),
    style: {
      textAlign: "right"
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "movimientos",
    header: "N\xB0 Movimientos",
    body: rowData => rowData.movimientos.length,
    style: {
      textAlign: "center"
    },
    sortable: true
  }))));
};