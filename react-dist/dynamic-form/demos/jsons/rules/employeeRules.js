export const employeeTypeRules = [{
  condition: {
    field: "empleo.tipoEmpleo",
    operator: "equals",
    value: "employee"
  },
  actions: [{
    type: "show",
    target: "empleo.empresa"
  }]
}, {
  condition: {
    field: "empleo.tipoEmpleo",
    operator: "equals",
    value: "self_employed"
  },
  actions: [{
    type: "show",
    target: "empleo.ingresosAnuales"
  }, {
    type: "hide",
    target: "empleo.empresa"
  }]
}, {
  condition: {
    field: "empleo.tipoEmpleo",
    operator: "isEmpty"
  },
  actions: [{
    type: "hide",
    target: "empleo.empresa"
  }]
}];