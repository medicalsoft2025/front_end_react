import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
export const DynamicAccordion = props => {
  const {
    config,
    form,
    loading,
    onSubmit,
    actualFormGroup
  } = props;
  const activeIndex = config.defaultActiveChildren ? Number(config.defaultActiveChildren) : 0;
  return /*#__PURE__*/React.createElement(Accordion, {
    activeIndex: activeIndex
  }, config.containers?.map((tab, index) => /*#__PURE__*/React.createElement(AccordionTab, {
    key: index,
    header: tab.name
  }, /*#__PURE__*/React.createElement("div", {
    className: tab.contentStyleClass
  }, /*#__PURE__*/React.createElement(DynamicFormContainer, {
    config: tab,
    form: form,
    loading: loading,
    onSubmit: onSubmit,
    parentPath: actualFormGroup,
    className: tab.styleClass
  })))));
};