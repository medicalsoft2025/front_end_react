function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from "react";
import { invoiceService } from "../../../services/api/index.js";
import { cleanJsonObject } from "../../../services/utilidades.js";
import { useForm, Controller } from "react-hook-form";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { Tag } from "primereact/tag";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useBillingByType } from "../../billing/hooks/useBillingByType.js";
export const ToDenyForm = ({
  dataToInvoice,
  onSuccess
}) => {
  const {
    control,
    handleSubmit
  } = useForm({
    defaultValues: {
      invoices: [],
      reason: "",
      tax_receipt: "",
      invoice_number: ""
    }
  });
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const {
    fetchBillingByType
  } = useBillingByType();
  const [billing, setBilling] = useState(null);
  useEffect(() => {
    loadInvoices();
    loadBillingType();
  }, []);
  async function loadInvoices() {
    const filters = {
      per_page: 100,
      page: 1,
      entityInvoiceId: dataToInvoice.id,
      sort: "-id"
    };
    const invoices = await invoiceService.filterInvoice(cleanJsonObject(filters));
    const invoicesMapped = invoices.data.map(invoice => {
      return {
        ...invoice,
        value_to_deny: 0
      };
    });
    setInvoices(invoicesMapped);
  }
  async function loadBillingType() {
    const billing = await fetchBillingByType("debit_note");
    setBilling(billing.data);
  }
  function handleInvoicesToDeny(selectedItems) {
    setSelectedInvoices(selectedItems);
  }
  const getEstadoSeverity = estado => {
    switch (estado) {
      case "paid":
        return "success";
      case "pending":
      case "partially_pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "expired":
        return "danger";
      default:
        return null;
    }
  };
  const getEstadoLabel = estado => {
    switch (estado) {
      case "paid":
        return "Pagada";
      case "pending":
        return "Pendiente";
      case "partially_pending":
        return "Parcialmente Pagada";
      case "cancelled":
        return "Anulada";
      case "expired":
        return "Vencida";
      default:
        return "";
    }
  };
  const itemTemplate = option => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center"
    }, /*#__PURE__*/React.createElement("div", null, option.invoice_code || option.id));
  };
  const footerGroup = /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Column, {
    footer: `Total glosado: $${selectedInvoices.reduce((sum, invoice) => {
      return sum + (Number(invoice?.value_to_deny) || 0);
    }, 0).toFixed(2)}`,
    colSpan: 4,
    footerStyle: {
      textAlign: "right",
      fontWeight: "bold",
      color: "red"
    }
  })));
  const isPositiveNumber = val => {
    if (val === null || val === undefined) return false;
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  };
  const onCellEditComplete = e => {
    let {
      rowData,
      newValue,
      field,
      originalEvent: event
    } = e;
    if (field === "glossed_amount") {
      if (isPositiveNumber(newValue)) {
        if (!rowData) {
          rowData = {};
        }
        rowData.value_to_deny = Number(newValue).toFixed(2);
        const updatedInvoices = [...selectedInvoices];
        const index = updatedInvoices.findIndex(invoice => invoice.id === rowData.id);
        if (index !== -1) {
          updatedInvoices[index] = {
            ...rowData
          };
          setSelectedInvoices(updatedInvoices);
        }
      } else {
        event.preventDefault();
      }
    }
  };
  const amountEditor = options => {
    return /*#__PURE__*/React.createElement(InputNumber, {
      value: options.value,
      onValueChange: e => options.editorCallback(e.value),
      mode: "currency",
      currency: "USD",
      locale: "en-US",
      onKeyDown: e => e.stopPropagation(),
      className: "w-100",
      max: Number(options.rowData.admission.entity_authorized_amount)
    });
  };
  const amountBodyTemplate = rowData => {
    const amount = rowData?.admission?.entity_authorized_amount || 0;
    return `$${Number(amount).toFixed(2)}`;
  };
  const onSubmit = async data => {
    console.log("data:", data);
    const amountToDeny = selectedInvoices.reduce((sum, invoice) => {
      return Number(sum) + Number(invoice?.value_to_deny);
    }, 0).toFixed(2);
    const submitData = {
      reason: data.reason,
      to_deny_invoices: selectedInvoices.map(item => {
        return {
          id: item.id,
          value_to_deny: item.value_to_deny,
          entity_invoice_id: item.entity_invoice_id,
          paid_amount: item.admission.entity_authorized_amount - item.value_to_deny,
          admission: {
            entity_authorized_amount: Number(item.admission.entity_authorized_amount).toFixed(2),
            id: item.admission.id
          }
        };
      }),
      credit_note: {
        invoice_id: dataToInvoice.id,
        amount: Number(amountToDeny),
        reason: data.reason,
        fiscal_receipt: data.tax_receipt,
        invoice_number: data.invoice_number,
        billing: billing,
        payments: [{
          payment_method_id: 9,
          payment_date: "2025-12-11T15:02:27.895Z",
          amount: 4800
        }]
      }
    };
    console.log("Datos a enviar:", submitData);
    const response = await invoiceService.createGlossToInvoiceByEntity(submitData);
    onSuccess(response);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-2"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Facturas *"), /*#__PURE__*/React.createElement(Controller, {
    name: "invoices",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(MultiSelect, _extends({}, field, {
      options: invoices,
      optionLabel: "invoice_code",
      itemTemplate: itemTemplate,
      placeholder: "Seleccione una o m\xE1s facturas",
      className: "w-100",
      filter: true,
      virtualScrollerOptions: {
        itemSize: 38
      },
      value: field.value,
      onChange: e => {
        field.onChange(e.value);
        handleInvoicesToDeny(e.value);
      },
      appendTo: document.body,
      display: "chip"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Razon"), /*#__PURE__*/React.createElement(Controller, {
    name: "reason",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({}, field, {
      placeholder: "Raz\xF3n",
      className: "w-100",
      rows: 3
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Comprobante fiscal *"), /*#__PURE__*/React.createElement(Controller, {
    name: "tax_receipt",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      className: "w-100 form-control"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de la factura *"), /*#__PURE__*/React.createElement(Controller, {
    name: "invoice_number",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      className: "w-100 form-control"
    }))
  })))), selectedInvoices.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card p-2"
  }, /*#__PURE__*/React.createElement("h5", null, "Facturas seleccionadas"), /*#__PURE__*/React.createElement(DataTable, {
    value: selectedInvoices,
    className: "p-datatable-sm",
    footerColumnGroup: footerGroup,
    editMode: "cell"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "ID",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "status",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: getEstadoLabel(rowData.status),
      severity: getEstadoSeverity(rowData.status)
    })
  }), /*#__PURE__*/React.createElement(Column, {
    field: "third_party",
    header: "Tercero",
    sortable: true,
    body: rowData => rowData?.third_party?.name ?? " -- "
  }), /*#__PURE__*/React.createElement(Column, {
    field: "admission",
    header: "Monto autorizado",
    sortable: true,
    body: amountBodyTemplate,
    style: {
      width: "25%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "glossed_amount",
    header: "Monto a glosar",
    sortable: true,
    body: rowData => {
      return rowData.value_to_deny;
    },
    editor: options => amountEditor(options),
    onCellEditComplete: onCellEditComplete,
    style: {
      width: "25%"
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "p-button-primary",
    type: "submit",
    disabled: selectedInvoices.length === 0
  }))))));
};