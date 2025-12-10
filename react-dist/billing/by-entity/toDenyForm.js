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
export const ToDenyForm = ({
  dataToInvoice,
  onSuccess
}) => {
  console.log("dataToInvoice: ", dataToInvoice);
  const {
    control,
    handleSubmit,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      invoices: [],
      reason: ""
    }
  });
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]); // Estado para las facturas seleccionadas

  useEffect(() => {
    loadInvoices();
  }, []);
  async function loadInvoices() {
    const filters = {
      per_page: 100,
      page: 1,
      entityInvoiceId: dataToInvoice.id,
      sort: "-id"
    };
    const invoices = await invoiceService.filterInvoice(cleanJsonObject(filters));
    setInvoices(invoices.data);
  }
  function handleInvoicesToDeny(selectedItems) {
    console.log("selected invoices: ", selectedItems);
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
      return sum + (Number(invoice?.admission?.entity_authorized_amount) || 0);
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
    console.log("rowData: ", rowData);
    console.log("field: ", field);
    console.log("newValue: ", newValue);
    if (field === "admission") {
      console.log("rowData: ", rowData);
      console.log("field: ", field);
      console.log("newValue: ", newValue);
      if (isPositiveNumber(newValue)) {
        if (!rowData.admission) {
          rowData.admission = {};
        }
        rowData.admission.entity_authorized_amount = Number(newValue);
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
      className: "w-100"
    });
  };
  const amountBodyTemplate = rowData => {
    const amount = rowData?.admission?.entity_authorized_amount || 0;
    return `$${Number(amount).toFixed(2)}`;
  };
  const onSubmit = data => {
    const submitData = {
      reason: data.reason,
      toDenyInvoices: selectedInvoices
    };
    console.log("Datos a enviar:", submitData);

    // if (onSuccess) {
    //   onSuccess();
    // }
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