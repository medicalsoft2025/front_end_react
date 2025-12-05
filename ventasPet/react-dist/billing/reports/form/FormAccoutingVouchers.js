function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, InputText, Dropdown, Calendar, DataTable, Column, Toast, InputNumber, InputTextarea } from "primereact";
import { classNames } from "primereact/utils";

// Definición de tipos

export const FormAccoutingVouchers = () => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm();
  const toast = useRef(null);
  const [transactions, setTransactions] = useState([{
    id: generateId(),
    account: null,
    thirdParty: "",
    detail: "",
    description: "",
    costCenter: null,
    debit: null,
    credit: null
  }]);

  // Helper function to generate unique IDs
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Opciones del formulario
  const receiptTypeOptions = [{
    id: 1,
    code: "RC",
    name: "Recibo de Caja"
  }, {
    id: 2,
    code: "CE",
    name: "Comprobante de Egreso"
  }, {
    id: 3,
    code: "CI",
    name: "Comprobante de Ingreso"
  }, {
    id: 4,
    code: "DC",
    name: "Diario Contable"
  }];
  const accountOptions = [{
    id: 1,
    code: "1105",
    name: "Caja General"
  }, {
    id: 2,
    code: "1110",
    name: "Bancos"
  }, {
    id: 3,
    code: "1305",
    name: "Clientes Nacionales"
  }, {
    id: 4,
    code: "2205",
    name: "Proveedores Nacionales"
  }, {
    id: 5,
    code: "5105",
    name: "Ingresos por Ventas"
  }, {
    id: 6,
    code: "5205",
    name: "Devoluciones en Ventas"
  }];
  const costCenterOptions = [{
    id: 1,
    code: "ADM",
    name: "Administración"
  }, {
    id: 2,
    code: "VNT",
    name: "Ventas"
  }, {
    id: 3,
    code: "MKT",
    name: "Marketing"
  }, {
    id: 4,
    code: "LOG",
    name: "Logística"
  }, {
    id: 5,
    code: "TEC",
    name: "Tecnología"
  }];

  // Funciones de cálculo
  const calculateTotalDebit = () => {
    return transactions.reduce((total, transaction) => total + (transaction.debit || 0), 0);
  };
  const calculateTotalCredit = () => {
    return transactions.reduce((total, transaction) => total + (transaction.credit || 0), 0);
  };
  const isBalanced = () => {
    return calculateTotalDebit() === calculateTotalCredit();
  };

  // Funciones para manejar transacciones
  const addTransaction = () => {
    setTransactions([...transactions, {
      id: generateId(),
      account: null,
      thirdParty: "",
      detail: "",
      description: "",
      costCenter: null,
      debit: null,
      credit: null
    }]);
  };
  const removeTransaction = id => {
    if (transactions.length > 1) {
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe tener al menos una transacción',
        life: 3000
      });
    }
  };
  const handleTransactionChange = (id, field, value) => {
    setTransactions(transactions.map(transaction => transaction.id === id ? {
      ...transaction,
      [field]: value
    } : transaction));
  };

  // Función para guardar datos
  const save = formData => {
    if (!isBalanced()) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'El comprobante no está balanceado (Débitos ≠ Créditos)',
        life: 5000
      });
      return;
    }
    const voucherData = {
      receiptType: formData.receiptType,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      observations: formData.observations,
      transactions: transactions.map(transaction => ({
        account: transaction.account,
        thirdParty: transaction.thirdParty,
        detail: transaction.detail,
        description: transaction.description,
        costCenter: transaction.costCenter,
        debit: transaction.debit || 0,
        credit: transaction.credit || 0
      })),
      totalDebit: calculateTotalDebit(),
      totalCredit: calculateTotalCredit(),
      isBalanced: isBalanced(),
      currency: "DOP"
    };
    console.log("Datos del comprobante contable:", voucherData);
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Comprobante contable guardado correctamente',
      life: 3000
    });
  };
  const saveAndSend = formData => {
    save(formData);
    console.log("Enviando comprobante contable...");
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Comprobante contable guardado y enviado',
      life: 3000
    });
  };
  const cancel = () => {
    console.log("Cancelando creación de comprobante...");
  };

  // Columnas para la tabla de transacciones
  const transactionColumns = [{
    field: "account",
    header: "Cuenta",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.account,
      options: accountOptions,
      optionLabel: "name",
      placeholder: "Seleccione cuenta",
      className: "w-full",
      onChange: e => handleTransactionChange(rowData.id, 'account', e.value),
      filter: true,
      filterBy: "name,code",
      showClear: true
    })
  }, {
    field: "thirdParty",
    header: "Tercero",
    body: rowData => /*#__PURE__*/React.createElement(InputText, {
      value: rowData.thirdParty,
      placeholder: "Ingrese tercero",
      className: "w-full",
      onChange: e => handleTransactionChange(rowData.id, 'thirdParty', e.target.value)
    })
  }, {
    field: "detail",
    header: "Detalle contable",
    body: rowData => /*#__PURE__*/React.createElement(InputText, {
      value: rowData.detail,
      placeholder: "Ingrese detalle",
      className: "w-full",
      onChange: e => handleTransactionChange(rowData.id, 'detail', e.target.value)
    })
  }, {
    field: "description",
    header: "Descripción",
    body: rowData => /*#__PURE__*/React.createElement(InputText, {
      value: rowData.description,
      placeholder: "Ingrese descripci\xF3n",
      className: "w-full",
      onChange: e => handleTransactionChange(rowData.id, 'description', e.target.value)
    })
  }, {
    field: "costCenter",
    header: "Centro de costo",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.costCenter,
      options: costCenterOptions,
      optionLabel: "name",
      placeholder: "Seleccione centro",
      className: "w-full",
      onChange: e => handleTransactionChange(rowData.id, 'costCenter', e.value),
      filter: true,
      filterBy: "name,code",
      showClear: true
    })
  }, {
    field: "debit",
    header: "Débito",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.debit,
      placeholder: "0.00",
      className: "w-full",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      onValueChange: e => handleTransactionChange(rowData.id, 'debit', e.value)
    })
  }, {
    field: "credit",
    header: "Crédito",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.credit,
      placeholder: "0.00",
      className: "w-full",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      onValueChange: e => handleTransactionChange(rowData.id, 'credit', e.value)
    })
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-trash",
      className: "p-button-rounded p-button-danger p-button-text",
      onClick: () => removeTransaction(rowData.id),
      disabled: transactions.length <= 1,
      tooltip: "Eliminar transacci\xF3n",
      tooltipOptions: {
        position: 'top'
      }
    })
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "h3 mb-0 text-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-file-edit me-2"
  }), "Crear nuevo comprobante contable"))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(save)
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-info-circle me-2 text-primary"
  }), "Informaci\xF3n b\xE1sica")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de comprobante *"), /*#__PURE__*/React.createElement(Controller, {
    name: "receiptType",
    control: control,
    rules: {
      required: 'Campo obligatorio'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: receiptTypeOptions,
      optionLabel: "name",
      placeholder: "Seleccione tipo",
      className: classNames("w-100", {
        'p-invalid': fieldState.error
      }),
      filter: true,
      filterBy: "name,code",
      showClear: true
    })), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de comprobante *"), /*#__PURE__*/React.createElement(Controller, {
    name: "invoiceNumber",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      placeholder: "Generado autom\xE1ticamente",
      className: "w-100",
      readOnly: true
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha *"), /*#__PURE__*/React.createElement(Controller, {
    name: "date",
    control: control,
    rules: {
      required: 'Campo obligatorio'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: classNames("w-100", {
        'p-invalid': fieldState.error
      }),
      showIcon: true,
      dateFormat: "dd/mm/yy"
    })), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-credit-card me-2 text-primary"
  }), "Transacciones contables"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "Agregar transacci\xF3n",
    className: "btn btn-primary",
    onClick: addTransaction
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: transactions,
    responsiveLayout: "scroll",
    emptyMessage: "No hay transacciones agregadas",
    className: "p-datatable-sm",
    showGridlines: true,
    stripedRows: true
  }, transactionColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
    key: i,
    field: col.field,
    header: col.header,
    body: col.body,
    style: {
      minWidth: '150px'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info",
    style: {
      background: "rgb(194 194 194 / 85%)",
      border: "none",
      color: "black"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Total d\xE9bitos:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalDebit(),
    className: "ms-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info",
    style: {
      background: "rgb(194 194 194 / 85%)",
      border: "none",
      color: "black"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Total cr\xE9ditos:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalCredit(),
    className: "ms-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }), !isBalanced() && /*#__PURE__*/React.createElement("span", {
    className: "text-danger ms-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-exclamation-triangle"
  }), " El comprobante no est\xE1 balanceado")))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-comment me-2 text-primary"
  }), "Observaciones")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "observations",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({}, field, {
      rows: 5,
      className: "w-100",
      placeholder: "Ingrese observaciones relevantes"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-secondary",
    onClick: cancel
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "btn-info",
    type: "submit",
    disabled: !isBalanced()
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar y Enviar",
    icon: "pi pi-send",
    className: "btn-info",
    onClick: handleSubmit(saveAndSend),
    disabled: !isBalanced()
  }))))), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};