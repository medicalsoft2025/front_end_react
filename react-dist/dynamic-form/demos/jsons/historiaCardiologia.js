export const historiaCardiologia = {
  containers: [{
    type: "tabs",
    containers: [{
      name: "Información de la Consulta",
      contentStyleClass: "row g-3",
      containers: [{
        type: "card",
        styleClass: "col-12",
        name: "Motivo de la consulta",
        containers: [{
          fields: [{
            name: "motivoConsulta",
            type: "editor",
            styleClass: "col-12",
            rows: 4
          }]
        }]
      }, {
        type: "card",
        styleClass: "col-md-6",
        name: "Contexto de los sintomas/Enfermedad actual",
        containers: [{
          fields: [{
            name: "contextoSintoma",
            type: "editor",
            rows: 4
          }]
        }]
      }, {
        type: "card",
        styleClass: "col-md-6",
        name: "¿Qué ha tomado?",
        containers: [{
          fields: [{
            name: "haTomado",
            type: "editor",
            rows: 4
          }]
        }]
      }]
    }, {
      name: "Signos vitales",
      contentStyleClass: "row g-3",
      containers: [{
        type: "card",
        styleClass: "col-md-6",
        containers: [{
          fields: [{
            name: "peso",
            type: "number",
            label: "Peso Corporal [Lbs]"
          }, {
            name: "altura",
            type: "number",
            label: "Altura [cm]"
          }, {
            name: "imc",
            type: "number",
            label: "Índice de Masa Corporal (IMC)",
            disabled: true,
            rules: [{
              condition: {
                field: "peso",
                operator: "isNotEmpty",
                logicalOperator: "AND",
                conditions: [{
                  field: "altura",
                  operator: "isNotEmpty"
                }]
              },
              actions: {
                type: "setValue",
                target: "imc",
                expression: "{{peso}} / (({{altura}}/100) * ({{altura}}/100))"
              }
            }],
            dependencies: ["peso", "altura"]
          }, {
            name: "porcentajeGrasaCorporal",
            type: "number",
            label: "Porcentaje de Grasa Corporal [%]"
          }]
        }]
      }, {
        type: "card",
        styleClass: "col-md-6",
        containers: [{
          fields: [{
            name: "presionArterialDiastolica",
            type: "number",
            label: "Presión Arterial Diastólica [mmHg]"
          }, {
            name: "presionArterialSistolica",
            type: "number",
            label: "Presión Arterial Sistólica [mmHg]"
          }, {
            name: "tensionArterialMedia",
            type: "number",
            label: "Tensión Arterial Media [mmHg]",
            disabled: true,
            rules: [{
              condition: {
                field: "presionArterialDiastolica",
                operator: "isNotEmpty",
                logicalOperator: "AND",
                conditions: [{
                  field: "presionArterialSistolica",
                  operator: "isNotEmpty"
                }]
              },
              actions: {
                type: "setValue",
                target: "tensionArterialMedia",
                expression: "{{presionArterialDiastolica}} + (({{presionArterialSistolica}} - {{presionArterialDiastolica}})/3)"
              }
            }],
            dependencies: ["presionArterialDiastolica", "presionArterialSistolica"]
          }, {
            name: "saturacion",
            type: "number",
            label: "Saturación de Oxígeno [%]"
          }]
        }]
      }, {
        type: "card",
        styleClass: "col-md-6",
        containers: [{
          fields: [{
            name: "circunferenciaAbdominal",
            type: "number",
            label: "Circunferencia Abdominal [cm]"
          }, {
            name: "circunferenciaCintura",
            type: "number",
            label: "Circunferencia de Cintura [cm]"
          }, {
            name: "perimetroCefalico",
            type: "number",
            label: "Perímetro Cefálico [cm]"
          }]
        }]
      }, {
        type: "card",
        styleClass: "col-md-6",
        containers: [{
          fields: [{
            name: "frecuenciaRespiratoria",
            type: "number",
            label: "Frecuencia Respiratoria [rpm]"
          }, {
            name: "frecuenciaCardiaca",
            type: "number",
            label: "Frecuencia Cardíaca [lpm]"
          }, {
            name: "temperatura",
            type: "number",
            label: "Temperatura Corporal [°C]"
          }]
        }]
      }]
    }, {
      name: "Exámen general",
      containers: [{
        type: "card",
        containers: [{
          fields: [{
            name: "sonidosCardiacos",
            type: "textarea",
            label: "Sonidos Cardiacos",
            rows: 3
          }]
        }]
      }, {
        type: "card",
        containers: [{
          fields: [{
            name: "revisionTorax",
            type: "textarea",
            label: "Revisión tórax",
            rows: 3
          }]
        }]
      }, {
        type: "card",
        styleClass: "col-12",
        containers: [{
          fields: [{
            name: "observaciones",
            type: "textarea",
            label: "Observaciones",
            rows: 4
          }]
        }]
      }]
    }],
    hasSubmitButton: true,
    submitButtonLabel: "Guardar Historia Clínica"
  }]
};