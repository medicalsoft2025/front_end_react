import React from "react";
import { useDynamicFormContainer } from "../../hooks/useDynamicFormContainer.js";
import { DynamicField } from "../fields/DynamicField.js";
import { DynamicCard } from "./DynamicCard.js";
import { DynamicTabs } from "./DynamicTabs.js";
import { DynamicAccordion } from "./DynamicAccordion.js";
import { DynamicStepper } from "./DynamicStepper.js";
import { Divider } from "primereact/divider";
export const DynamicFormContainer = ({
  config,
  form,
  loading,
  onSubmit,
  parentPath = "",
  className = ""
}) => {
  const {
    actualFormGroup,
    containerType,
    hasFields,
    hasContainers,
    shouldRenderFields,
    shouldRenderDivider
  } = useDynamicFormContainer({
    config,
    form,
    parentPath
  });
  const renderByType = () => {
    switch (containerType) {
      case "card":
        return /*#__PURE__*/React.createElement(DynamicCard, {
          config: config,
          form: form,
          actualFormGroup: actualFormGroup
        });
      case "tabs":
        return /*#__PURE__*/React.createElement(DynamicTabs, {
          config: config,
          form: form,
          actualFormGroup: actualFormGroup
        });
      case "accordion":
        return /*#__PURE__*/React.createElement(DynamicAccordion, {
          config: config,
          form: form,
          actualFormGroup: actualFormGroup
        });
      case "stepper":
        return /*#__PURE__*/React.createElement(DynamicStepper, {
          config: config,
          form: form,
          loading: loading,
          onSubmit: onSubmit,
          actualFormGroup: actualFormGroup
        });
      default:
        return /*#__PURE__*/React.createElement(React.Fragment, null, shouldRenderFields && hasFields && /*#__PURE__*/React.createElement(React.Fragment, null, config.fields.map(field => /*#__PURE__*/React.createElement(DynamicField, {
          key: field.name,
          field: field,
          form: form,
          parentPath: actualFormGroup,
          className: field.styleClass
        }))), hasContainers && config.containers.map((childConfig, index) => {
          return /*#__PURE__*/React.createElement(DynamicFormContainer, {
            key: childConfig.name || `container-${index}`,
            config: childConfig,
            form: form,
            loading: loading,
            onSubmit: onSubmit,
            parentPath: actualFormGroup,
            className: childConfig.styleClass
          });
        }));
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, renderByType(), shouldRenderDivider && /*#__PURE__*/React.createElement(Divider, {
    className: className
  }));
};