import React, { memo, useContext } from "react";
import {
    UseFormReturn,
    FieldValues,
    FieldPath,
    Controller,
    RegisterOptions,
} from "react-hook-form";
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
import { DynamicFieldConfig } from "../../interfaces/models";
import { getValueByPath } from "../../../../services/utilidades";
import { FormContext, FormContextValue } from "../../context/FormContext";

interface DynamicFieldProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    parentPath?: string;
    className?: string;
}

export const DynamicField = <T extends FieldValues>({
    field,
    form,
    parentPath = "",
    className = "",
}: DynamicFieldProps<T>) => {
    const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name;
    const {
        control,
        formState: { errors },
    } = form;

    // Usar contexto para obtener estado condicional
    const { fieldStates } = useContext(FormContext) as FormContextValue;
    const fieldState = fieldStates[fieldName] || {
        visible: true,
        disabled: false,
    };

    // Si el campo no es visible, no renderizar
    if (fieldState.visible === false) {
        return null;
    }

    // Usar opciones dinámicas si existen
    const fieldOptions = fieldState.options || field.options || [];

    // Configurar validación
    const validationRules:
        | Omit<
              RegisterOptions<any, any>,
              "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate"
          >
        | undefined = {
        required: field.required ? "Este campo es requerido" : false,
        ...field.validation,
    };

    // Valor por defecto
    const defaultValue =
        field.value !== undefined
            ? field.value
            : field.type === "checkbox"
            ? false
            : field.type === "number"
            ? 0
            : field.type === "multiselect"
            ? []
            : "";

    const commonProps = {
        id: fieldName,
        disabled: field.disabled,
        placeholder: field.placeholder,
    };

    const renderController = () => {
        switch (field.type) {
            case "select":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <Dropdown
                                {...commonProps}
                                className="w-100"
                                value={controllerField.value}
                                options={field.options || []}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) =>
                                    controllerField.onChange(e.value)
                                }
                                onBlur={controllerField.onBlur}
                                showClear={field.showClear}
                            />
                        )}
                    />
                );

            case "multiselect":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <MultiSelect
                                {...commonProps}
                                value={controllerField.value || []}
                                options={field.options || []}
                                className="w-100"
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) =>
                                    controllerField.onChange(e.value)
                                }
                                onBlur={controllerField.onBlur}
                                display="chip"
                            />
                        )}
                    />
                );

            case "date":
            case "datetime":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <Calendar
                                {...commonProps}
                                value={controllerField.value}
                                showIcon
                                className="w-100"
                                dateFormat={field.format || "dd/mm/yy"}
                                showTime={field.type === "datetime"}
                                hourFormat="12"
                                onChange={(e) =>
                                    controllerField.onChange(e.value)
                                }
                                onBlur={controllerField.onBlur}
                            />
                        )}
                    />
                );

            case "checkbox":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <>
                                <div className="d-flex align-items-center">
                                    <Checkbox
                                        {...commonProps}
                                        inputId={fieldName}
                                        checked={controllerField.value || false}
                                        onChange={(e) =>
                                            controllerField.onChange(e.checked)
                                        }
                                        onBlur={controllerField.onBlur}
                                    />
                                    <label
                                        htmlFor={fieldName}
                                        className="form-label"
                                    >
                                        {field.label}
                                        {field.required && (
                                            <span className="required">*</span>
                                        )}
                                    </label>
                                </div>
                            </>
                        )}
                    />
                );

            case "radio":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <div className="d-flex flex-column gap-2">
                                {field.options?.map((option, index) => (
                                    <div
                                        key={index}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        <RadioButton
                                            {...commonProps}
                                            inputId={`${fieldName}-${index}`}
                                            name={fieldName}
                                            value={option.value}
                                            checked={
                                                controllerField.value ===
                                                option.value
                                            }
                                            onChange={(e) => {
                                                controllerField.onChange(
                                                    e.checked
                                                        ? option.value
                                                        : null
                                                );
                                            }}
                                            onBlur={controllerField.onBlur}
                                        />
                                        <label
                                            htmlFor={`${fieldName}-${index}`}
                                            className="ml-2"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                );

            case "number":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <InputNumber
                                {...commonProps}
                                className="w-100"
                                value={controllerField.value}
                                mode="decimal"
                                showButtons
                                minFractionDigits={2}
                                onValueChange={(e) =>
                                    controllerField.onChange(e.value)
                                }
                                onChange={(e) =>
                                    controllerField.onChange(e.value)
                                }
                                onBlur={controllerField.onBlur}
                            />
                        )}
                    />
                );

            case "textarea":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <InputTextarea
                                {...commonProps}
                                className="w-100"
                                value={controllerField.value}
                                rows={field.rows || 4}
                                onChange={(e) =>
                                    controllerField.onChange(e.target.value)
                                }
                                onBlur={controllerField.onBlur}
                            />
                        )}
                    />
                );

            case "colorpicker":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <div className="d-flex align-items-center gap-2">
                                <ColorPicker
                                    {...commonProps}
                                    value={controllerField.value}
                                    onChange={(e) =>
                                        controllerField.onChange(e.value)
                                    }
                                    onBlur={controllerField.onBlur}
                                />
                                <InputText
                                    {...commonProps}
                                    className="w-100"
                                    value={controllerField.value}
                                    onChange={(e) =>
                                        controllerField.onChange(e.target.value)
                                    }
                                    onBlur={controllerField.onBlur}
                                />
                            </div>
                        )}
                    />
                );

            case "editor":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <Editor
                                {...commonProps}
                                value={controllerField.value}
                                onTextChange={(e) =>
                                    controllerField.onChange(e.htmlValue)
                                }
                                style={{ height: "200px" }}
                            />
                        )}
                    />
                );

            case "password":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <InputText
                                {...commonProps}
                                className="w-100"
                                {...controllerField}
                                type="password"
                            />
                        )}
                    />
                );

            case "email":
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={
                            {
                                ...validationRules,
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido",
                                },
                            } as RegisterOptions<T, FieldPath<T>>
                        }
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <InputText
                                {...commonProps}
                                className="w-100"
                                {...controllerField}
                                type="email"
                            />
                        )}
                    />
                );

            default:
                return (
                    <Controller
                        name={fieldName as FieldPath<T>}
                        control={control}
                        rules={validationRules}
                        defaultValue={defaultValue}
                        render={({ field: controllerField }) => (
                            <InputText
                                {...commonProps}
                                className="w-100"
                                {...controllerField}
                                type={field.type || "text"}
                            />
                        )}
                    />
                );
        }
    };

    const getFormErrorMessage = (name: string) => {
        const fieldErrors = getValueByPath(errors, name);
        return (
            fieldErrors && (
                <small className="p-error">
                    {fieldErrors.message?.toString()}
                </small>
            )
        );
    };

    return (
        <div className={`dynamic-field ${className}`}>
            {field.label &&
                !["checkbox", "radio"].includes(field.type || "") && (
                    <label htmlFor={fieldName} className="form-label">
                        {field.label}
                        {field.required && <span className="required">*</span>}
                    </label>
                )}

            {renderController()}

            {getFormErrorMessage(fieldName)}
        </div>
    );
};
