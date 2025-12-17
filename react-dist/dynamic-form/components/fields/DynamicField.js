function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useContext } from "react";
import { Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { RadioButton } from "primereact/radiobutton";
import { ColorPicker } from "primereact/colorpicker";
import { Editor } from "primereact/editor";
import { getValueByPath } from "../../../../services/utilidades.js";
import { FormContext } from "../../context/FormContext.js";
export const DynamicField = ({
  field,
  form,
  parentPath = "",
  className = ""
}) => {
  const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name;
  const {
    control,
    formState: {
      errors
    }
  } = form;

  // Usar contexto para obtener estado condicional
  const {
    fieldStates
  } = useContext(FormContext);
  const fieldState = fieldStates[fieldName] || {
    visible: true,
    disabled: false
  };

  // Si el campo no es visible, no renderizar
  if (fieldState.visible === false) {
    return null;
  }

  // Usar opciones dinámicas si existen
  const fieldOptions = fieldState.options || field.options || [];

  // Configurar validación
  const validationRules = {
    required: field.required ? "Este campo es requerido" : false,
    ...field.validation
  };

  // Valor por defecto
  const defaultValue = field.value !== undefined ? field.value : field.type === "checkbox" ? false : field.type === "number" ? 0 : field.type === "multiselect" ? [] : "";
  const commonProps = {
    id: fieldName,
    disabled: field.disabled,
    placeholder: field.placeholder
  };
  const renderController = () => {
    switch (field.type) {
      case "select":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, commonProps, {
            className: "w-100",
            value: controllerField.value,
            options: field.options || [],
            optionLabel: "label",
            optionValue: "value",
            onChange: e => controllerField.onChange(e.value),
            onBlur: controllerField.onBlur,
            showClear: field.showClear
          }))
        });
      case "multiselect":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement(MultiSelect, _extends({}, commonProps, {
            value: controllerField.value || [],
            options: field.options || [],
            className: "w-100",
            optionLabel: "label",
            optionValue: "value",
            onChange: e => controllerField.onChange(e.value),
            onBlur: controllerField.onBlur,
            display: "chip"
          }))
        });
      case "date":
      case "datetime":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, commonProps, {
            value: controllerField.value,
            showIcon: true,
            className: "w-100",
            dateFormat: field.format || "dd/mm/yy",
            showTime: field.type === "datetime",
            hourFormat: "12",
            onChange: e => controllerField.onChange(e.value),
            onBlur: controllerField.onBlur
          }))
        });
      case "checkbox":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
            className: "d-flex align-items-center"
          }, /*#__PURE__*/React.createElement(Checkbox, _extends({}, commonProps, {
            inputId: fieldName,
            checked: controllerField.value || false,
            onChange: e => controllerField.onChange(e.checked),
            onBlur: controllerField.onBlur
          })), /*#__PURE__*/React.createElement("label", {
            htmlFor: fieldName,
            className: "form-label"
          }, field.label, field.required && /*#__PURE__*/React.createElement("span", {
            className: "required"
          }, "*"))))
        });
      case "radio":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement("div", {
            className: "d-flex flex-column gap-2"
          }, field.options?.map((option, index) => /*#__PURE__*/React.createElement("div", {
            key: index,
            className: "d-flex align-items-center gap-2"
          }, /*#__PURE__*/React.createElement(RadioButton, _extends({}, commonProps, {
            inputId: `${fieldName}-${index}`,
            name: fieldName,
            value: option.value,
            checked: controllerField.value === option.value,
            onChange: e => {
              controllerField.onChange(e.checked ? option.value : null);
            },
            onBlur: controllerField.onBlur
          })), /*#__PURE__*/React.createElement("label", {
            htmlFor: `${fieldName}-${index}`,
            className: "ml-2"
          }, option.label))))
        });
      case "number":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement(InputNumber, _extends({}, commonProps, {
            className: "w-100",
            value: controllerField.value,
            mode: "decimal",
            showButtons: true,
            minFractionDigits: 2,
            onValueChange: e => controllerField.onChange(e.value),
            onChange: e => controllerField.onChange(e.value),
            onBlur: controllerField.onBlur
          }))
        });
      case "textarea":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({}, commonProps, {
            className: "w-100",
            value: controllerField.value,
            rows: field.rows || 4,
            onChange: e => controllerField.onChange(e.target.value),
            onBlur: controllerField.onBlur
          }))
        });
      case "colorpicker":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement("div", {
            className: "d-flex align-items-center gap-2"
          }, /*#__PURE__*/React.createElement(ColorPicker, _extends({}, commonProps, {
            value: controllerField.value,
            onChange: e => controllerField.onChange(e.value),
            onBlur: controllerField.onBlur
          })), /*#__PURE__*/React.createElement(InputText, _extends({}, commonProps, {
            className: "w-100",
            value: controllerField.value,
            onChange: e => controllerField.onChange(e.target.value),
            onBlur: controllerField.onBlur
          })))
        });
      case "editor":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement(Editor, _extends({}, commonProps, {
            value: controllerField.value,
            onTextChange: e => controllerField.onChange(e.htmlValue),
            style: {
              height: "200px"
            }
          }))
        });
      case "password":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement(InputText, _extends({}, commonProps, {
            className: "w-100"
          }, controllerField, {
            type: "password"
          }))
        });
      case "email":
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: {
            ...validationRules,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido"
            }
          },
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement(InputText, _extends({}, commonProps, {
            className: "w-100"
          }, controllerField, {
            type: "email"
          }))
        });
      default:
        return /*#__PURE__*/React.createElement(Controller, {
          name: fieldName,
          control: control,
          rules: validationRules,
          defaultValue: defaultValue,
          render: ({
            field: controllerField
          }) => /*#__PURE__*/React.createElement(InputText, _extends({}, commonProps, {
            className: "w-100"
          }, controllerField, {
            type: field.type || "text"
          }))
        });
    }
  };
  const getFormErrorMessage = name => {
    const fieldErrors = getValueByPath(errors, name);
    return fieldErrors && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldErrors.message?.toString());
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `dynamic-field ${className}`
  }, field.label && !["checkbox", "radio"].includes(field.type || "") && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldName,
    className: "form-label"
  }, field.label, field.required && /*#__PURE__*/React.createElement("span", {
    className: "required"
  }, "*")), renderController(), getFormErrorMessage(fieldName));
};