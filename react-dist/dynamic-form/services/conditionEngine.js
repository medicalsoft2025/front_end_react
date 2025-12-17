// services/conditionEngine.ts

export class ConditionEngine {
  constructor(formValues) {
    this.formValues = formValues;
  }
  evaluateCondition(condition) {
    if (condition.conditions) {
      // Evaluar condiciones anidadas
      const results = condition.conditions.map(c => this.evaluateCondition(c));
      return condition.logicalOperator === "AND" ? results.every(Boolean) : results.some(Boolean);
    }
    const fieldValue = this.getFieldValue(condition.field);
    switch (condition.operator) {
      case "equals":
        return fieldValue === condition.value;
      case "notEquals":
        return fieldValue !== condition.value;
      case "greaterThan":
        return fieldValue > condition.value;
      case "lessThan":
        return fieldValue < condition.value;
      case "contains":
        return Array.isArray(fieldValue) ? fieldValue.includes(condition.value) : String(fieldValue).includes(String(condition.value));
      case "isEmpty":
        return !fieldValue || Array.isArray(fieldValue) && fieldValue.length === 0 || typeof fieldValue === "string" && fieldValue.trim() === "";
      case "isNotEmpty":
        return !!fieldValue && (!Array.isArray(fieldValue) || fieldValue.length > 0) && (typeof fieldValue !== "string" || fieldValue.trim() !== "");
      default:
        return false;
    }
  }
  evaluateExpression(expression) {
    // Reemplazar variables como {{fieldName}}
    const interpolated = expression.replace(/\{\{([^}]+)\}\}/g, (match, fieldName) => {
      return this.getFieldValue(fieldName.trim()) || "";
    });
    try {
      // Evaluar expresión simple (con restricciones de seguridad)
      if (interpolated.includes("+") || interpolated.includes("-") || interpolated.includes("*") || interpolated.includes("/")) {
        // Solo permitir operaciones matemáticas básicas
        const safeExpression = interpolated.replace(/[^0-9+\-*/(). ]/g, "");
        return Function(`"use strict"; return (${safeExpression})`)();
      }
      return interpolated;
    } catch {
      return interpolated;
    }
  }
  getFieldValue(fieldPath) {
    return fieldPath.split(".").reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, this.formValues);
  }
}