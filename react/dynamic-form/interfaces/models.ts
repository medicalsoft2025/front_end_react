import { FieldPath, RegisterOptions } from "react-hook-form";

export interface DynamicCondition {
    field: string; // Campo que se evalúa
    operator:
        | "equals"
        | "notEquals"
        | "greaterThan"
        | "lessThan"
        | "contains"
        | "isEmpty"
        | "isNotEmpty";
    value?: any; // Valor a comparar
    logicalOperator?: "AND" | "OR"; // Para múltiples condiciones
    conditions?: DynamicCondition[]; // Condiciones anidadas
}

export interface DynamicAction {
    type: "show" | "hide" | "enable" | "disable" | "setValue" | "setOptions";
    target: string; // Campo objetivo
    value?: any; // Valor a establecer
    expression?: string; // Expresión a evaluar (ej: "{{field1}} + {{field2}}")
    optionsUrl?: string; // URL para opciones asíncronas
    optionsTransform?: { label: string; value: string }; // Transformar datos de API
}

export interface DynamicRule {
    condition: DynamicCondition | DynamicCondition[];
    actions: DynamicAction | DynamicAction[];
}

export interface DynamicFieldConfig {
    name: string;
    type:
        | "text"
        | "textarea"
        | "number"
        | "select"
        | "checkbox"
        | "radio"
        | "colorpicker"
        | "date"
        | "datetime"
        | "editor"
        | "multiselect"
        | "password"
        | "email"
        | "file";
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    value?: any;
    divider?: boolean;
    styleClass?: string;
    format?: string;
    showClear?: boolean;
    options?: Array<{ label: string; value: any }>;
    validation?: RegisterOptions<any, FieldPath<any>>;
    rows?: number;
    rules?: DynamicRule[];
    dependencies?: string[];
}

export interface DynamicFormContainerConfig {
    type?: "card" | "form" | "tabs" | "tab" | "accordion" | "stepper";
    defaultActiveChildren?: string;
    name?: string;
    fields?: DynamicFieldConfig[];
    containers?: DynamicFormContainerConfig[];
    divider?: boolean;
    linear?: boolean;
    hasSubmitButton?: boolean;
    submitButtonIconPos?: "left" | "right";
    submitButtonIcon?: string;
    submitButtonLabel?: string;
    styleClass?: string;
    contentStyleClass?: string;
    rules?: DynamicRule[];
}
