import React, { forwardRef, Ref, useMemo } from "react";
import { DynamicFormContainerConfig } from "../interfaces/models";
import { DynamicFormContainer } from "./containers/DynamicFormContainer";
import { useDynamicForm } from "../hooks/useDynamicForm";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { useFieldConditions } from "../hooks/useFieldConditions";
import { FormContextValue } from "../context/FormContext";
import { FormProvider } from "../providers/FormProvider";

interface DynamicFormProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    onSubmit: (data: T) => void;
    data?: T | null;
    loading?: boolean;
    className?: string;
    onChange?: (data: T) => void;
    setFormInvalid?: (invalid: boolean) => void;
}

export interface DynamicFormRef {
    handleSubmit: () => Promise<void>;
}

export const DynamicForm = forwardRef(
    <T extends FieldValues>(
        props: DynamicFormProps<T>,
        ref: Ref<DynamicFormRef>
    ) => {
        const {
            config,
            data,
            onSubmit,
            loading,
            className = "",
            onChange,
            setFormInvalid,
        } = props;

        const { form, emitSubmitData } = useDynamicForm<T>({
            config,
            data,
            onSubmit,
            onChange,
            setFormInvalid,
            ref,
        });

        // Usar hook de condiciones
        const { fieldStates } = useFieldConditions({ config, form });

        // Crear valor del contexto
        const formContextValue = useMemo(
            () =>
                ({
                    fieldStates,
                    setFieldState: (fieldPath: string, state: Partial<any>) => {
                        // Implementar si se necesita modificar estados manualmente
                    },
                    form: form as UseFormReturn<FieldValues>,
                } as FormContextValue),
            [fieldStates, form]
        );

        return (
            <FormProvider value={formContextValue}>
                <form className={className}>
                    {config.containers?.map((container, index) => (
                        <DynamicFormContainer
                            key={container.name || `container-${index}`}
                            config={container}
                            loading={loading}
                            onSubmit={emitSubmitData}
                            form={form}
                        />
                    ))}
                </form>
            </FormProvider>
        );
    }
);
