import { DynamicFormContainerConfig } from "../../interfaces/models";
import { signosVitales } from "./signosVitales";

export const historiaCardiologia: DynamicFormContainerConfig = {
    containers: [
        {
            type: "tabs",
            containers: [
                {
                    name: "Información de la Consulta",
                    contentStyleClass: "row g-3",
                    containers: [
                        {
                            type: "card",
                            styleClass: "col-12",
                            name: "Motivo de la consulta",
                            containers: [
                                {
                                    fields: [
                                        {
                                            name: "motivoConsulta",
                                            type: "editor",
                                            styleClass: "col-12",
                                            rows: 4,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: "card",
                            styleClass: "col-md-6",
                            name: "Contexto de los sintomas/Enfermedad actual",
                            containers: [
                                {
                                    fields: [
                                        {
                                            name: "contextoSintoma",
                                            type: "editor",
                                            rows: 4,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: "card",
                            styleClass: "col-md-6",
                            name: "¿Qué ha tomado?",
                            containers: [
                                {
                                    fields: [
                                        {
                                            name: "haTomado",
                                            type: "editor",
                                            rows: 4,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "Signos vitales",
                    contentStyleClass: "row g-3",
                    containers: signosVitales,
                },
                {
                    name: "Exámen general",
                    contentStyleClass: "row g-3",
                    containers: [
                        {
                            type: "card",
                            name: "Sonidos Cardiacos",
                            styleClass: "col-md-6",
                            containers: [
                                {
                                    fields: [
                                        {
                                            name: "sonidosCardiacos",
                                            type: "editor",
                                            rows: 3,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: "card",
                            name: "Revisión tórax",
                            styleClass: "col-md-6",
                            containers: [
                                {
                                    fields: [
                                        {
                                            name: "revisionTorax",
                                            type: "editor",
                                            rows: 3,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: "card",
                            name: "Observaciones",
                            styleClass: "col-12",
                            containers: [
                                {
                                    fields: [
                                        {
                                            name: "observaciones",
                                            type: "editor",
                                            rows: 4,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            hasSubmitButton: true,
            submitButtonLabel: "Guardar Historia Clínica",
        },
    ],
};
