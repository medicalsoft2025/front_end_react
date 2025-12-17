import { Dropdown } from "primereact/dropdown";
import React from "react";
import {
    Controller,
    FieldPath,
    FieldValues,
    RegisterOptions,
} from "react-hook-form";
import { DynamicFieldConfig } from "../../interfaces/models";
import { UseFormReturn } from "react-hook-form";

interface DynamicControlledFieldProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    parentPath?: string;
    className?: string;
}

export const DynamicControlledField = <T extends FieldValues>(
    props: DynamicControlledFieldProps<T>
) => {
    const { field, form, parentPath = "", className = "" } = props;
    const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name;
    const { control } = form;

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
        className: `field-input ${className}`,
        disabled: field.disabled,
        placeholder: field.placeholder,
    };

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={defaultValue}
            render={({ field: controllerField }) => (
                <Dropdown
                    {...commonProps}
                    value={controllerField.value}
                    options={field.options || []}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(e) => controllerField.onChange(e.value)}
                    onBlur={controllerField.onBlur}
                />
            )}
        />
    );
};
