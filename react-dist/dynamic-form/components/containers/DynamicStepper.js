import React, { useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
import { useDynamicStepper } from "../../hooks/useDynamicStepper.js";
export const DynamicStepper = props => {
  const {
    config,
    form,
    loading,
    onSubmit,
    actualFormGroup
  } = props;
  const {
    stepActiveIndex,
    setStepActiveIndex,
    validStep
  } = useDynamicStepper({
    config,
    form,
    parentPath: actualFormGroup
  });
  const stepperRef = useRef(null);
  const handleNext = () => {
    if (validStep()) {
      stepperRef.current?.nextCallback();
    }
  };
  const handlePrev = () => {
    stepperRef.current?.prevCallback();
  };
  const handleSubmit = () => {
    if (validStep() && onSubmit) {
      onSubmit();
    }
  };

  // Actualizar el índice activo cuando cambia el paso en el stepper
  const handleStepChange = event => {
    setStepActiveIndex(event.index);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card d-flex justify-content-center"
  }, /*#__PURE__*/React.createElement(Stepper, {
    ref: stepperRef,
    linear: config.linear,
    activeStep: stepActiveIndex,
    onChangeStep: handleStepChange,
    style: {
      flexBasis: "50rem"
    }
  }, config.containers?.map((tab, index) => /*#__PURE__*/React.createElement(StepperPanel, {
    key: index,
    header: tab.name || `Paso ${index + 1}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement(DynamicFormContainer, {
    config: tab,
    form: form,
    loading: loading,
    onSubmit: onSubmit,
    parentPath: actualFormGroup,
    className: tab.styleClass
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-between"
  }, index > 0 && /*#__PURE__*/React.createElement(Button, {
    label: "Anterior",
    severity: "secondary",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-left me-2"
    }),
    onClick: handlePrev,
    type: "button"
  }), index < (config.containers?.length || 0) - 1 ? /*#__PURE__*/React.createElement(Button, {
    label: "Siguiente",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-right me-2"
    }),
    onClick: handleNext,
    type: "button",
    disabled: config.linear && !validStep(),
    className: index === 0 ? "ml-auto" : ""
  }) : config.hasSubmitButton && /*#__PURE__*/React.createElement(Button, {
    label: config.submitButtonLabel || "Enviar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: `${config.submitButtonIcon || "fa fa-save"} me-2`
    }),
    loadingIcon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-spinner fa-spin"
    }),
    loading: loading,
    onClick: handleSubmit,
    type: "button",
    disabled: config.linear && !validStep(),
    className: index === 0 ? "ml-auto" : ""
  }))))));
};