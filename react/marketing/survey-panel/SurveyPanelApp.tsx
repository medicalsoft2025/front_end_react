import React, { useState } from "react";
import { Tree } from "primereact/tree";
import { Card } from "primereact/card";
import { SurveysList } from "./SurveysList";
import { AppointmentsWithoutSurveys } from "./AppointmentsWithoutSurveys";
import { SurveyStastics } from "./SurveyStastics";
import { SurveysForm } from "./configuration/SurveysForm"

export const SurveyPanelApp = () => {
  const [selectedKey, setSelectedKey] = useState("");

  const nodes = [
    {
      key: "0",
      label: "Citas sin encuestas",
      data: <AppointmentsWithoutSurveys />,
    },
    {
      key: "1",
      label: "Encuestas",
      data: <SurveysList />,
    },
    {
      key: "2",
      label: "Estadisticas",
      data: <SurveyStastics />,
    },
    {
      key: "3",
      label: "Configuración",
      children: [
        {
          key: "3-0",
          label: "Mensajes",
          children: [
            {
              key: "3-0-0",
              label: "Envio",
              data: <SurveysList />,
            },
            {
              key: "3-0-1",
              label: "Encuesta completada",
              data: <SurveysList />,
            },
          ],
        },
        {
          key: "3-1",
          label: "Encuestas",
          data: <SurveysForm />,
        },
      ],
    },
  ];

  const getSelectedNodeContent = () => {
    const findNode: any = (nodeList: any, key: any) => {
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
    return selectedNode ? (
      selectedNode.data
    ) : (
      <div>Selecciona una opción del árbol</div>
    );
  };

  const nodeTemplate = (node: any) => {
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

    return (
      <div className="d-flex align-items-center gap-2">
        <i className={iconClass}></i>
        <span>{node.label}</span>
      </div>
    );
  };

  return (
    <>
      <Card>
        <div className="row">
          <div className="col-3 px-0">
            <Tree
              value={nodes}
              selectionMode="single"
              selectionKeys={selectedKey}
              onSelectionChange={(e: any) => setSelectedKey(e.value)}
              className="w-full"
              nodeTemplate={nodeTemplate}
            />
          </div>
          <div className="col">{getSelectedNodeContent()}</div>
        </div>
      </Card>
      <style>
        {`
        .p-tree .p-component .p-tree-selectable {
        padding-left: 0;
        }
        .p-tree-container {
        padding-left: 0;
        }
            `}
      </style>
    </>
  );
};
