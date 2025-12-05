import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
const NewDepreciationForm = ({
  formId,
  onSubmit,
  onCancel,
  records,
  loading = false,
  initialData
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: initialData || {
      assetId: "",
      date: new Date(),
      changeType: "depreciation",
      previousValue: 0,
      newValue: 0,
      notes: ""
    }
  });
  const assetId = watch("assetId");
  const changeType = watch("changeType");
  const previousValue = watch("previousValue");
  const newValue = watch("newValue");
  const onFormSubmit = data => onSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "text-danger"
    }, errors[name]?.message);
  };
  const assetOptions = records.map(record => ({
    label: `${record.assetName} (${record.internalCode})`,
    value: record.assetId,
    data: record
  }));
  const selectedAsset = assetOptions.find(asset => asset.value === assetId)?.data;

  // Calcular variación automáticamente
  const changeAmount = newValue - previousValue;
  const changePercentage = previousValue > 0 ? changeAmount / previousValue * 100 : 0;
  useEffect(() => {
    reset(initialData || {
      assetId: "",
      date: new Date(),
      changeType: "depreciation",
      previousValue: 0,
      newValue: 0,
      notes: ""
    });
  }, [initialData, reset]);

  // Cuando se selecciona un activo, cargar sus valores actuales
  useEffect(() => {
    if (selectedAsset) {
      setValue("previousValue", selectedAsset.newValue);
    }
  }, [selectedAsset, setValue]);
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onFormSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "assetId",
    className: "form-label"
  }, "Activo Fijo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "assetId",
    control: control,
    rules: {
      required: "El activo es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: "assetId",
      options: assetOptions,
      optionLabel: "label",
      placeholder: "Seleccione un activo",
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: document.body,
      disabled: loading
    }), getFormErrorMessage("assetId"))
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "changeType",
    className: "form-label"
  }, "Tipo de Ajuste *"), /*#__PURE__*/React.createElement(Controller, {
    name: "changeType",
    control: control,
    rules: {
      required: "El tipo de ajuste es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: "changeType",
      options: [{
        label: "Depreciación",
        value: "depreciation"
      }, {
        label: "Apreciación",
        value: "appreciation"
      }],
      optionLabel: "label",
      placeholder: "Seleccione tipo",
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: document.body,
      disabled: loading
    }), getFormErrorMessage("changeType"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
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
      appendTo: document.body,
      disabled: loading
    }), getFormErrorMessage("date"))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "previousValue",
    className: "form-label"
  }, "Valor Anterior *"), /*#__PURE__*/React.createElement(Controller, {
    name: "previousValue",
    control: control,
    rules: {
      required: "El valor anterior es requerido",
      min: {
        value: 0,
        message: "El valor no puede ser negativo"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
      id: "previousValue",
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      min: 0,
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      disabled: loading
    }), getFormErrorMessage("previousValue"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "newValue",
    className: "form-label"
  }, "Nuevo Valor *"), /*#__PURE__*/React.createElement(Controller, {
    name: "newValue",
    control: control,
    rules: {
      required: "El nuevo valor es requerido",
      min: {
        value: 0,
        message: "El valor no puede ser negativo"
      },
      validate: value => {
        if (changeType === "depreciation" && value > previousValue) {
          return "En depreciación, el nuevo valor debe ser menor al valor anterior";
        }
        if (changeType === "appreciation" && value < previousValue) {
          return "En apreciación, el nuevo valor debe ser mayor al valor anterior";
        }
        return true;
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
      id: "newValue",
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      min: 0,
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      disabled: loading
    }), getFormErrorMessage("newValue"))
  })))), (previousValue > 0 || newValue > 0) && /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold"
  }, "Resumen del Ajuste"), /*#__PURE__*/React.createElement("div", {
    className: "card border-0 bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-2 g-md-3 align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-sm-6 col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted small mb-1"
  }, "Variaci\xF3n Monetaria"), /*#__PURE__*/React.createElement("span", {
    className: classNames("fw-bold fs-6", {
      "text-success": changeAmount > 0,
      "text-danger": changeAmount < 0,
      "text-muted": changeAmount === 0
    })
  }, changeAmount >= 0 ? '+' : '', changeAmount.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-sm-6 col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted small mb-1"
  }, "Porcentaje"), /*#__PURE__*/React.createElement("span", {
    className: classNames("fw-bold fs-6", {
      "text-success": changePercentage > 0,
      "text-danger": changePercentage < 0,
      "text-muted": changePercentage === 0
    })
  }, changePercentage >= 0 ? '+' : '', changePercentage.toFixed(2), "%"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-sm-6 col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted small mb-1"
  }, "Tipo de Movimiento"), /*#__PURE__*/React.createElement("span", {
    className: classNames("fw-bold fs-6", {
      "text-danger": changeType === "depreciation",
      "text-success": changeType === "appreciation"
    })
  }, changeType === "depreciation" ? "📉 Depreciación" : "📈 Apreciación"))), selectedAsset && /*#__PURE__*/React.createElement("div", {
    className: "col-12 mt-2 pt-2 border-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted small"
  }, "Activo seleccionado:"), /*#__PURE__*/React.createElement("span", {
    className: "fw-medium text-dark mt-1 mt-sm-0"
  }, selectedAsset.assetName)))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-1"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Valor Anterior"), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Valor Nuevo")), /*#__PURE__*/React.createElement("div", {
    className: "progress",
    style: {
      height: "8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames("progress-bar", {
      "bg-success": changeAmount > 0,
      "bg-danger": changeAmount < 0,
      "bg-secondary": changeAmount === 0
    }),
    style: {
      width: `${Math.min(Math.abs(changePercentage), 100)}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between mt-1"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, previousValue.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP"
  })), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, newValue.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP"
  })))))))), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "notes",
    className: "form-label"
  }, "Notas y Observaciones"), /*#__PURE__*/React.createElement(Controller, {
    name: "notes",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputTextarea, {
      id: "notes",
      value: field.value,
      onChange: e => field.onChange(e.target.value),
      rows: 3,
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      }),
      placeholder: "Ingrese notas adicionales sobre el ajuste...",
      disabled: loading
    }), getFormErrorMessage("notes"))
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
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
      minWidth: "140px"
    },
    type: "submit"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check me-2"
  }), "Guardar Ajuste")));
};
export { NewDepreciationForm };