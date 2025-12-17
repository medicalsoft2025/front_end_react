export const formOne = {
  containers: [{
    type: "form",
    name: "formOne",
    containers: [{
      type: "card",
      containers: [{
        fields: [{
          name: "additionalInfo",
          type: "textarea",
          label: "Información Adicional",
          placeholder: "Ingresa información adicional",
          styleClass: "w-100"
        }, {
          name: "preferences",
          type: "checkbox",
          label: "Deseo recibir actualizaciones",
          styleClass: "mt-2",
          validation: {
            required: "Este campo es requerido",
            validate: value => value === true || "Este campo es requerido"
          }
        }]
      }]
    }]
  }]
};