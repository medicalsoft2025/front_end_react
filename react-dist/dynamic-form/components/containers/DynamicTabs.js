import React from "react";
import { TabPanel, TabView } from "primereact/tabview";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
export const DynamicTabs = props => {
  const {
    config,
    form,
    loading,
    onSubmit,
    actualFormGroup
  } = props;
  const activeTab = config.defaultActiveChildren ? Number(config.defaultActiveChildren) : 0;
  return /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeTab,
    renderActiveOnly: false
  }, config.containers?.map((tab, index) => /*#__PURE__*/React.createElement(TabPanel, {
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