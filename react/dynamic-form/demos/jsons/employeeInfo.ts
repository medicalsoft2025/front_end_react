import { DynamicFormContainerConfig } from "../../interfaces/models";
import { employeeTypeRules } from "./rules/employeeRules";

export const employeeInfo: DynamicFormContainerConfig = {
    type: "form",
    name: "empleo",
    containers: [
        {
            fields: [
                {
                    name: "tipoEmpleo",
                    type: "select",
                    label: "Tipo de Empleo",
                    showClear: true,
                    options: [
                        {
                            label: "Empleado",
                            value: "employee",
                        },
                        {
                            label: "Autónomo",
                            value: "self_employed",
                        },
                        {
                            label: "Desempleado",
                            value: "unemployed",
                        },
                    ],
                    rules: employeeTypeRules,
                },
                {
                    name: "empresa",
                    type: "text",
                    label: "Empresa",
                    rules: [
                        {
                            condition: {
                                field: "empleo.tipoEmpleo",
                                operator: "notEquals",
                                value: "employee",
                            },
                            actions: [
                                {
                                    type: "hide",
                                    target: "empleo.empresa",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "salarioActual",
                    type: "number",
                    label: "Salario Actual",
                    rules: [
                        {
                            condition: {
                                field: "empleo.salarioActual",
                                operator: "greaterThan",
                                value: 0,
                            },
                            actions: [
                                {
                                    type: "setValue",
                                    target: "empleo.salarioDeseado",
                                    expression:
                                        "{{empleo.salarioActual}} * 1.2",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "salarioDeseado",
                    type: "number",
                    label: "Salario Deseado",
                    required: true,
                    validation: {
                        validate: {
                            greaterThanCurrent: (value, formValues) =>
                                value > formValues.empleo.salarioActual ||
                                "Debe ser mayor al salario actual",
                        },
                    },
                },
            ],
        },
    ],
};
