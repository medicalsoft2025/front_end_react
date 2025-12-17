import React, { forwardRef, useMemo } from "react";
import { DynamicFormContainer } from "./containers/DynamicFormContainer.js";
import { useDynamicForm } from "../hooks/useDynamicForm.js";
import { useFieldConditions } from "../hooks/useFieldConditions.js";
import { FormProvider } from "../providers/FormProvider.js";
export const DynamicForm = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    config,
    data,
    onSubmit,
    loading,
    className = "",
    onChange,
    setFormInvalid
  } = props;
  const {
    form,
    emitSubmitData
  } = useDynamicForm({
    config,
    data,
    onSubmit,
    onChange,
    setFormInvalid,
    ref
  });

  // Usar hook de condiciones
  const {
    fieldStates
  } = useFieldConditions({
    config,
    form
  });

  // Crear valor del contexto
  const formContextValue = useMemo(() => ({
    fieldStates,
    setFieldState: (fieldPath, state) => {
      // Implementar si se necesita modificar estados manualmente
    },
    form: form
  }), [fieldStates, form]);
  return /*#__PURE__*/React.createElement(FormProvider, {
    value: formContextValue
  }, /*#__PURE__*/React.createElement("form", {
    className: className
  }, config.containers?.map((container, index) => /*#__PURE__*/React.createElement(DynamicFormContainer, {
    key: container.name || `container-${index}`,
    config: container,
    loading: loading,
    onSubmit: emitSubmitData,
    form: form
  }))));
});