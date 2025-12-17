import React from "react";
import { FormContext } from "../context/FormContext.js";
export const FormProvider = ({
  children,
  value
}) => {
  return /*#__PURE__*/React.createElement(FormContext.Provider, {
    value: value
  }, children);
};