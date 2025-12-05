import React from "react";
import { CustomPRTableMenu } from "../../../components/CustomPRTableMenu.js";
export const getColumns = ({
  editConsentimiento,
  deleteConsentimiento
}) => [
// { field: "tenant_id", header: "ID del Tenant" },
{
  field: "title",
  header: "Título"
},
//{ field: "data", header: "Datos" },
{
  field: "description",
  header: "Descripción"
}, {
  field: "actions",
  header: "Acciones",
  body: rowData => {
    console.log("rowData", rowData);
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center"
    }, /*#__PURE__*/React.createElement(CustomPRTableMenu, {
      menuItems: [{
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-pencil-alt me-2"
        }),
        label: "Editar",
        command: () => editConsentimiento(rowData.id ?? '')
      }, {
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-trash me-2"
        }),
        label: "Eliminar",
        command: () => deleteConsentimiento(rowData.id ?? '')
      }],
      rowData: rowData
    }));
  }
}];