function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "primereact/divider";
const typeOptions = [{
  label: "Depreciación",
  value: "depreciation"
}, {
  label: "Apreciación",
  value: "appreciation"
}];
const frequencyOptions = [{
  label: "Anual",
  value: "annual"
}, {
  label: "Semestral",
  value: "semiannual"
}, {
  label: "Trimestral",
  value: "quarterly"
}, {
  label: "Mensual",
  value: "monthly"
}];
const DepreciationAppreciationForm = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false,
  currentValue
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: initialData || {
      type: "depreciation",
      amount: 0,
      date: new Date(),
      percentage: 0
    }
  });
  const type = watch("type");
  const onFormSubmit = data => onSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "text-danger"
    }, errors[name]?.message);
  };
  useEffect(() => {
    reset(initialData || {
      type: "depreciation",
      amount: 0,
      date: new Date(),
      percentage: 0
    });
  }, [initialData, reset]);
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onFormSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "type",
    className: "form-label"
  }, "Tipo de ajuste *"), /*#__PURE__*/React.createElement(Controller, {
    name: "type",
    control: control,
    rules: {
      required: "El tipo de ajuste es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: "type",
      options: typeOptions,
      optionLabel: "label",
      placeholder: "Seleccione tipo",
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    }), getFormErrorMessage("type"))
  })), /*#__PURE__*/React.createElement(Divider, null), type === "depreciation" && /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "frequency",
    className: "form-label"
  }, "Frecuencia de Depreciaci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "frequency",
    control: control,
    rules: {
      required: "La frecuencia es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: "frequency",
      options: frequencyOptions,
      optionLabel: "label",
      placeholder: "Seleccione frecuencia",
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    }), getFormErrorMessage("frequency"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "percentage",
    className: "form-label"
  }, "Porcentaje de Depreciaci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "percentage",
    control: control,
    rules: {
      required: "El porcentaje es requerido",
      min: {
        value: 0.01,
        message: "Mínimo 0.01%"
      },
      max: {
        value: 100,
        message: "Máximo 100%"
      }
    },
    render: ({
      field,
      fieldState
    }) => {
      return /*#__PURE__*/React.createElement(InputNumber, {
        id: "percentage",
        value: field.value || 0,
        onValueChange: e => field.onChange(e.value),
        mode: "decimal",
        min: 0.01,
        max: 100,
        minFractionDigits: 2,
        maxFractionDigits: 2,
        className: classNames("w-100", {
          "p-invalid": fieldState.error
        }),
        placeholder: "0.00",
        suffix: "%"
      });
    }
  }), getFormErrorMessage("percentage")))), type === "appreciation" && /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "reasons",
    className: "form-label"
  }, "Motivos de la Apreciaci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "reasons",
    control: control,
    rules: {
      required: "Los motivos son requeridos"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, _extends({
      id: "reasons",
      className: classNames("form-control", {
        "is-invalid": fieldState.error
      }),
      placeholder: "Describa los motivos del incremento de valor"
    }, field)), getFormErrorMessage("reasons"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "amount",
    className: "form-label"
  }, "Monto del Ajuste *"), /*#__PURE__*/React.createElement(Controller, {
    name: "amount",
    control: control,
    rules: {
      required: "El monto es requerido",
      min: {
        value: 0.01,
        message: "Mínimo RD$0.01"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
      id: "amount",
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      min: 0.01,
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      })
    }), getFormErrorMessage("amount"))
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Valor actual:", " ", currentValue ? currentValue.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP"
  }) : "RD$0.00")))), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, type === "depreciation" && /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "date",
    className: "form-label"
  }, "Fecha del Ajuste *"), /*#__PURE__*/React.createElement(Controller, {
    name: "date",
    control: control,
    rules: {
      required: "La fecha es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, {
      id: "date",
      value: field.value,
      onChange: e => field.onChange(e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      }),
      appendTo: document.body
    }), getFormErrorMessage("date"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Informaci\xF3n del Activo"), /*#__PURE__*/React.createElement("div", {
    className: "card border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-muted"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between mb-2"
  }, /*#__PURE__*/React.createElement("span", null, "Valor actual:"), /*#__PURE__*/React.createElement("span", {
    className: "fw-medium"
  }, currentValue ? currentValue.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP"
  }) : "RD$0.00")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("span", null, "Tipo seleccionado:"), /*#__PURE__*/React.createElement("span", {
    className: "fw-medium"
  }, type === "depreciation" ? "Depreciación" : "Apreciación")))))))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center gap-3"
  }, onCancel && /*#__PURE__*/React.createElement(Button, {
    className: "p-button-secondary d-flex justify-content-center align-items-center",
    onClick: onCancel,
    disabled: loading,
    style: {
      minWidth: "120px"
    },
    type: "button"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times me-2"
  }), "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary d-flex justify-content-center align-items-center",
    loading: loading,
    disabled: loading,
    style: {
      minWidth: "120px"
    },
    type: "submit"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check me-2"
  }), "Guardar Ajuste")));
};
export default DepreciationAppreciationForm;