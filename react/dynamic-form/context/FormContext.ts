// context/FormContext.tsx
import React, { createContext, useContext } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

export interface FormContextValue {
    fieldStates: Record<string, any>;
    setFieldState: (fieldPath: string, state: Partial<any>) => void;
    form: UseFormReturn<FieldValues>;
}

export const FormContext = createContext<FormContextValue | undefined>(
    undefined
);

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within FormProvider");
    }
    return context;
};
