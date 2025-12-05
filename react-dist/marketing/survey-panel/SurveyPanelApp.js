import React, { useState } from "react";
import { Tree } from "primereact/tree";
import { Card } from "primereact/card";
import { SurveysList } from "./SurveysList.js";
import { AppointmentsWithoutSurveys } from "./AppointmentsWithoutSurveys.js";
import { SurveyStastics } from "./SurveyStastics.js";
import { SurveysForm } from "./configuration/SurveysForm.js";
export const SurveyPanelApp = () => {
  const [selectedKey, setSelectedKey] = useState("");
  const nodes = [{
    key: "0",
    label: "Citas sin encuestas",
    data: /*#__PURE__*/React.createElement(AppointmentsWithoutSurveys, null)
  }, {
    key: "1",
    label: "Encuestas",
    data: /*#__PURE__*/React.createElement(SurveysList, null)
  }, {
    key: "2",
    label: "Estadisticas",
    data: /*#__PURE__*/React.createElement(SurveyStastics, null)
  }, {
    key: "3",
    label: "Configuración",
    children: [{
      key: "3-0",
      label: "Mensajes",
      children: [{
        key: "3-0-0",
        label: "Envio",
        data: /*#__PURE__*/React.createElement(SurveysList, null)
      }, {
        key: "3-0-1",
        label: "Encuesta completada",
        data: /*#__PURE__*/React.createElement(SurveysList, null)
      }]
    }, {
      key: "3-1",
      label: "Encuestas",
      data: /*#__PURE__*/React.createElement(SurveysForm, null)
    }]
  }];
  const getSelectedNodeContent = () => {
    const findNode = (nodeList, key) => {
      for (let node of nodeList) {
        if (node.key === key) {
          return node;
        }
        if (node.children) {
          const found = findNode(node.children, key);
          if (found) return found;
        }
      }
      return null;
    };
    const selectedNode = findNode(nodes, selectedKey);
    return selectedNode ? selectedNode.data : /*#__PURE__*/React.createElement("div", null, "Selecciona una opci\xF3n del \xE1rbol");
  };
  const nodeTemplate = node => {
    let iconClass = "";
    switch (node.key) {
      case "0":
        iconClass = "fas fa-calendar mr-2";
        break;
      case "1":
        iconClass = "fas fa-clipboard-list mr-2";
        break;
      case "2":
        iconClass = "fas fa-chart-bar mr-2";
        break;
      case "3":
        iconClass = "fas fa-cog mr-2";
        break;
      case "3-0":
        iconClass = "fas fa-envelope mr-2";
        break;
      case "3-1":
        iconClass = "fas fa-clipboard mr-2";
        break;
      case "3-0-0":
        iconClass = "fas fa-paper-plane mr-2";
        break;
      case "3-0-1":
        iconClass = "fas fa-check-circle mr-2";
        break;
      default:
        iconClass = "fas fa-file mr-2";
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: iconClass
    }), /*#__PURE__*/React.createElement("span", null, node.label));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-3 px-0"
  }, /*#__PURE__*/React.createElement(Tree, {
    value: nodes,
    selectionMode: "single",
    selectionKeys: selectedKey,
    onSelectionChange: e => setSelectedKey(e.value),
    className: "w-full",
    nodeTemplate: nodeTemplate
  })), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, getSelectedNodeContent()))), /*#__PURE__*/React.createElement("style", null, `
        .p-tree .p-component .p-tree-selectable {
        padding-left: 0;
        }
        .p-tree-container {
        padding-left: 0;
        }
            `));
};