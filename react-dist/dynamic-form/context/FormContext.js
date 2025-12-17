// context/FormContext.tsx
import { createContext, useContext } from "react";
export const FormContext = /*#__PURE__*/createContext(undefined);
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within FormProvider");
  }
  return context;
};