import React from "react";
import { Card } from "primereact/card";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
export const DynamicCard = props => {
  const {
    config,
    form,
    loading,
    onSubmit,
    actualFormGroup
  } = props;
  if (!config.containers || config.containers.length === 0) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: config.styleClass
  }, /*#__PURE__*/React.createElement(Card, {
    header: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", {
      className: "px-3 pt-3"
    }, config.name)),
    pt: {
      content: {
        style: {
          padding: "0"
        }
      },
      body: {
        style: {
          padding: "0"
        }
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `p-3 ${config.contentStyleClass}`
  }, config.containers.map((childConfig, index) => {
    return /*#__PURE__*/React.createElement(DynamicFormContainer, {
      key: childConfig.name || `container-${index}`,
      config: childConfig,
      form: form,
      loading: loading,
      onSubmit: onSubmit,
      parentPath: actualFormGroup,
      className: childConfig.styleClass
    });
  })))));
};