import React from "react";
import { FormContext, FormContextValue } from "../context/FormContext";

export const FormProvider: React.FC<{
    children: React.ReactNode;
    value: FormContextValue;
}> = ({ children, value }) => {
    return (
        <FormContext.Provider value={value}>{children}</FormContext.Provider>
    );
};
