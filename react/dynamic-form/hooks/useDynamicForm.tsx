import { Ref, useEffect, useImperativeHandle } from "react";
import { useForm, UseFormReturn, FieldValues } from "react-hook-form";
import { DynamicFormContainerConfig } from "../interfaces/models";
import { DynamicFormRef } from "../DynamicForm";

interface UseDynamicFormProps {
    config: DynamicFormContainerConfig;
    onSubmit: (data: any) => void;
    ref: Ref<DynamicFormRef>;
    data?: any | null;
    onChange?: (data: any) => void;
    setFormInvalid?: (invalid: boolean) => void;
}

interface UseDynamicFormReturn<T extends FieldValues> {
    form: UseFormReturn<T>;
    emitSubmitData: () => void;
}

export function useDynamicForm<T extends FieldValues>({
    config,
    onSubmit,
    ref,
    data,
    onChange,
    setFormInvalid,
}: UseDynamicFormProps): UseDynamicFormReturn<T> {
    const form = useForm({
        mode: "onChange",
        defaultValues: data || {},
        shouldUnregister: false,
        reValidateMode: "onChange",
    });

    const emitSubmitData = () => {
        onSubmit(form.getValues());
    };

    useEffect(() => {
        const registerAllFields = (
            container: DynamicFormContainerConfig,
            parentPath: string = ""
        ) => {
            let currentPath = parentPath;
            if (container.type === "form" && container.name) {
                currentPath = parentPath
                    ? `${parentPath}.${container.name}`
                    : container.name;
            }

            container.fields?.forEach((field) => {
                const fieldPath = currentPath
                    ? `${currentPath}.${field.name}`
                    : field.name;

                // Solo registrar si no existe
                if (!form.getValues(fieldPath)) {
                    form.register(fieldPath);

                    // Establecer valor inicial si existe en la configuración
                    if (field.value !== undefined) {
                        form.setValue(fieldPath, field.value, {
                            shouldValidate: true,
                            shouldDirty: false,
                        });
                    }
                }
            });

            container.containers?.forEach((childContainer) => {
                registerAllFields(childContainer, currentPath);
            });
        };

        config.containers?.forEach((container) => {
            registerAllFields(container);
        });
    }, [config, form]);

    useEffect(() => {
        if (data && form) {
            form.reset(data, {
                keepValues: true,
            });
        }
    }, [data, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (onChange) {
                onChange(value);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, onChange]);

    useEffect(() => {
        if (form) {
            setFormInvalid?.(!form.formState.isValid);
        }
    }, [form.formState.isValid]);

    useImperativeHandle(ref, () => {
        return {
            handleSubmit: async () => {
                const isValid = await form.trigger();

                if (isValid) emitSubmitData();
            },
        };
    });

    return {
        form,
        emitSubmitData,
    };
}
