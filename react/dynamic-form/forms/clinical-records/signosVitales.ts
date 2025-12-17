import { DynamicFormContainerConfig } from "../../interfaces/models";

export const signosVitales: DynamicFormContainerConfig[] = [
    {
        type: "card",
        styleClass: "col-md-6",
        containers: [
            {
                fields: [
                    {
                        name: "peso",
                        type: "number",
                        label: "Peso Corporal [Lbs]",
                    },
                    {
                        name: "altura",
                        type: "number",
                        label: "Altura [cm]",
                    },
                    {
                        name: "imc",
                        type: "number",
                        label: "Índice de Masa Corporal (IMC)",
                        disabled: true,
                        rules: [
                            {
                                condition: {
                                    field: "peso",
                                    operator: "isNotEmpty",
                                    logicalOperator: "AND",
                                    conditions: [
                                        {
                                            field: "altura",
                                            operator: "isNotEmpty",
                                        },
                                    ],
                                },
                                actions: {
                                    type: "setValue",
                                    target: "imc",
                                    expression:
                                        "({{peso}}* 0.453592) / (({{altura}}/100) * ({{altura}}/100))",
                                },
                            },
                        ],
                        dependencies: ["peso", "altura"],
                    },
                    {
                        name: "porcentajeGrasaCorporal",
                        type: "number",
                        label: "Porcentaje de Grasa Corporal [%]",
                    },
                ],
            },
        ],
    },
    {
        type: "card",
        styleClass: "col-md-6",
        containers: [
            {
                fields: [
                    {
                        name: "presionArterialDiastolica",
                        type: "number",
                        label: "Presión Arterial Diastólica [mmHg]",
                    },
                    {
                        name: "presionArterialSistolica",
                        type: "number",
                        label: "Presión Arterial Sistólica [mmHg]",
                    },
                    {
                        name: "tensionArterialMedia",
                        type: "number",
                        label: "Tensión Arterial Media [mmHg]",
                        disabled: true,
                        rules: [
                            {
                                condition: {
                                    field: "presionArterialDiastolica",
                                    operator: "isNotEmpty",
                                    logicalOperator: "AND",
                                    conditions: [
                                        {
                                            field: "presionArterialSistolica",
                                            operator: "isNotEmpty",
                                        },
                                    ],
                                },
                                actions: {
                                    type: "setValue",
                                    target: "tensionArterialMedia",
                                    expression:
                                        "{{presionArterialDiastolica}} + (({{presionArterialSistolica}} - {{presionArterialDiastolica}})/3)",
                                },
                            },
                        ],
                        dependencies: [
                            "presionArterialDiastolica",
                            "presionArterialSistolica",
                        ],
                    },
                    {
                        name: "saturacion",
                        type: "number",
                        label: "Saturación de Oxígeno [%]",
                    },
                ],
            },
        ],
    },
    {
        type: "card",
        styleClass: "col-md-6",
        containers: [
            {
                fields: [
                    {
                        name: "circunferenciaAbdominal",
                        type: "number",
                        label: "Circunferencia Abdominal [cm]",
                    },
                    {
                        name: "circunferenciaCintura",
                        type: "number",
                        label: "Circunferencia de Cintura [cm]",
                    },
                    {
                        name: "perimetroCefalico",
                        type: "number",
                        label: "Perímetro Cefálico [cm]",
                    },
                ],
            },
        ],
    },
    {
        type: "card",
        styleClass: "col-md-6",
        containers: [
            {
                fields: [
                    {
                        name: "frecuenciaRespiratoria",
                        type: "number",
                        label: "Frecuencia Respiratoria [rpm]",
                    },
                    {
                        name: "frecuenciaCardiaca",
                        type: "number",
                        label: "Frecuencia Cardíaca [lpm]",
                    },
                    {
                        name: "temperatura",
                        type: "number",
                        label: "Temperatura Corporal [°C]",
                    },
                ],
            },
        ],
    },
];
