// hooks/useFieldConditions-optimized.ts
import { useEffect, useState, useCallback, useRef } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { ConditionEngine } from "../services/conditionEngine";
import {
    DynamicFieldConfig,
    DynamicFormContainerConfig,
    DynamicRule,
} from "../interfaces/models";

interface FieldState {
    visible: boolean;
    disabled: boolean;
    options?: any[];
    loading?: boolean;
}

interface UseFieldConditionsProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    executeOnInit?: boolean;
}

export function useFieldConditions<T extends FieldValues>({
    config,
    form,
    executeOnInit = true,
}: UseFieldConditionsProps<T>) {
    const { watch, setValue, getValues } = form;
    const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(
        {}
    );
    const timeoutRef = useRef<number | null>(null);
    const fieldConfigs = useRef<Map<string, DynamicFieldConfig>>(new Map());
    const isInitialized = useRef(false);

    // Recopilar campos
    const collectFields = useCallback(
        (
            container: DynamicFormContainerConfig,
            parentPath: string = ""
        ): void => {
            let currentPath = parentPath;

            if (container.type === "form" && container.name) {
                currentPath = parentPath
                    ? `${parentPath}.${container.name}`
                    : container.name;
            }

            // Registrar campos
            container.fields?.forEach((field) => {
                const fieldPath = currentPath
                    ? `${currentPath}.${field.name}`
                    : field.name;

                if (field.rules && field.rules.length > 0) {
                    fieldConfigs.current.set(fieldPath, field);
                }
            });

            // Procesar contenedores hijos
            container.containers?.forEach((childContainer) => {
                collectFields(childContainer, currentPath);
            });
        },
        []
    );

    // Función para extraer campos de una condición
    const extractFieldsFromCondition = useCallback(
        (condition: any): string[] => {
            const fields = new Set<string>();

            const extract = (cond: any) => {
                if (cond.conditions) {
                    cond.conditions.forEach(extract);
                } else {
                    fields.add(cond.field);

                    // Extraer campos de expresiones en value
                    if (cond.value && typeof cond.value === "string") {
                        const matches =
                            cond.value.match(/\{\{([^}]+)\}\}/g) || [];
                        matches.forEach((match: string) => {
                            fields.add(match.replace(/\{\{|\}\}/g, "").trim());
                        });
                    }
                }
            };

            extract(condition);
            return Array.from(fields);
        },
        []
    );

    // Función principal mejorada
    const executeRulesForField = useCallback(
        (changedFieldPath: string) => {
            console.log(`Ejecutando reglas para: ${changedFieldPath}`);

            const values = getValues();
            const engine = new ConditionEngine(values);
            const updates: Record<string, Partial<FieldState>> = {};

            fieldConfigs.current.forEach((fieldConfig, fieldPath) => {
                if (fieldConfig.rules) {
                    // Filtrar reglas que dependen del campo cambiado
                    const relevantRules = fieldConfig.rules.filter((rule) => {
                        // 1. Verificar en condiciones
                        const conditionFields = extractFieldsFromCondition(
                            Array.isArray(rule.condition)
                                ? { conditions: rule.condition }
                                : rule.condition
                        );

                        if (conditionFields.includes(changedFieldPath)) {
                            return true;
                        }

                        // 2. Verificar en expresiones de acciones
                        const actions = Array.isArray(rule.actions)
                            ? rule.actions
                            : [rule.actions];
                        return actions.some(
                            (action) =>
                                action.expression &&
                                action.expression.includes(
                                    `{{${changedFieldPath}}}`
                                )
                        );
                    });

                    // Procesar solo reglas relevantes
                    relevantRules.forEach((rule) => {
                        const conditionResult = Array.isArray(rule.condition)
                            ? rule.condition.every((c) =>
                                  engine.evaluateCondition(c)
                              )
                            : engine.evaluateCondition(rule.condition);

                        const actions = Array.isArray(rule.actions)
                            ? rule.actions
                            : [rule.actions];

                        actions.forEach((action) => {
                            switch (action.type) {
                                case "show":
                                case "hide":
                                    updates[action.target] = {
                                        ...updates[action.target],
                                        visible:
                                            action.type === "show"
                                                ? conditionResult
                                                : !conditionResult,
                                    };
                                    break;

                                case "enable":
                                case "disable":
                                    updates[action.target] = {
                                        ...updates[action.target],
                                        disabled:
                                            action.type === "disable"
                                                ? conditionResult
                                                : !conditionResult,
                                    };
                                    break;

                                case "setValue":
                                    if (conditionResult && action.target) {
                                        const newValue = action.expression
                                            ? engine.evaluateExpression(
                                                  action.expression
                                              )
                                            : action.value;

                                        setValue(
                                            action.target as any,
                                            newValue,
                                            {
                                                shouldValidate: true,
                                                shouldDirty: false,
                                                shouldTouch: false,
                                            }
                                        );
                                    }
                                    break;
                            }
                        });
                    });
                }
            });

            if (Object.keys(updates).length > 0) {
                setFieldStates((prev) => {
                    const newState = { ...prev };
                    Object.entries(updates).forEach(([fieldPath, state]) => {
                        newState[fieldPath] = { ...prev[fieldPath], ...state };
                    });
                    return newState;
                });
            }
        },
        [getValues, setValue, extractFieldsFromCondition]
    );

    // Inicialización y efectos (igual que antes)
    useEffect(() => {
        collectFields(config);
        isInitialized.current = false;

        if (executeOnInit) {
            console.log("Ejecutando reglas iniciales");
            const allFields = Array.from(fieldConfigs.current.keys());
            allFields.forEach((fieldPath) => {
                executeRulesForField(fieldPath);
            });
        }

        isInitialized.current = true;

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [config, collectFields, executeOnInit, executeRulesForField]);

    useEffect(() => {
        if (!isInitialized.current) return;

        const debouncedHandler = (fieldName: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                if (fieldName) executeRulesForField(fieldName);
            }, 150);
        };

        const subscription = watch((value, { name }) => {
            if (name) debouncedHandler(name);
        });

        return () => {
            subscription.unsubscribe();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [watch, executeRulesForField]);

    return { fieldStates };
}
