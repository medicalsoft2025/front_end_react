import { useState, useEffect } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { DynamicFormContainerConfig } from "../interfaces/models";
import { getValueByPath } from "../../../services/utilidades";

interface UseDynamicStepperProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    parentPath?: string;
}

interface UseDynamicStepperReturn {
    stepActiveIndex: number;
    setStepActiveIndex: (index: number) => void;
    validStep: () => boolean;
}

export function useDynamicStepper<T extends FieldValues>({
    config,
    form,
    parentPath = "",
}: UseDynamicStepperProps<T>): UseDynamicStepperReturn {
    const [stepActiveIndex, setStepActiveIndex] = useState(
        config.defaultActiveChildren ? Number(config.defaultActiveChildren) : 0
    );

    const getActualFormGroupPath = (): string => {
        if (config.type === "form" && config.name) {
            return parentPath ? `${parentPath}.${config.name}` : config.name;
        }
        return parentPath;
    };

    // Validar si el paso actual es válido (para steppers)
    const validStep = () => {
        if (config.type !== "stepper") {
            return true;
        }

        const step = config.containers?.[stepActiveIndex];
        if (!step) {
            return true;
        }

        // Función recursiva para validar campos requeridos
        const validateContainer = (
            container: DynamicFormContainerConfig,
            currentPath: string = getActualFormGroupPath()
        ): boolean => {
            let containerValid = true;

            // Actualizar path si es un form anidado
            let newPath = currentPath;
            if (container.type === "form" && container.name) {
                newPath = currentPath
                    ? `${currentPath}.${container.name}`
                    : container.name;
            }

            // Validar campos requeridos
            container.fields?.forEach((field) => {
                if (field.required || field.validation?.required) {
                    const fieldPath = newPath
                        ? `${newPath}.${field.name}`
                        : field.name;
                    const fieldError = getValueByPath(
                        form.formState.errors,
                        fieldPath
                    );

                    const isValid = !fieldError;

                    containerValid = containerValid && isValid;
                }
            });

            // Validar contenedores hijos
            container.containers?.forEach((childContainer) => {
                containerValid =
                    containerValid &&
                    validateContainer(childContainer, newPath);
            });

            return containerValid;
        };

        // Validar todos los contenedores del paso
        let allFieldsValid = true;
        step.containers?.forEach((container) => {
            allFieldsValid = allFieldsValid && validateContainer(container);
        });

        return allFieldsValid;
    };

    return {
        stepActiveIndex,
        setStepActiveIndex,
        validStep,
    };
}
