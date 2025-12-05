import { ConsentimientoData } from "./ConsentimientoData";
import { ConsentimientoTableColumn } from "./table-types";
import React from "react";
import { Button } from 'primereact/button';
import { CustomPRTableMenu } from "../../../components/CustomPRTableMenu";

interface ColumnActionsProps {
  editConsentimiento: (id: string) => void;
  deleteConsentimiento: (id: string) => void;
}

export const getColumns = ({ editConsentimiento, deleteConsentimiento }: ColumnActionsProps): ConsentimientoTableColumn[] => [
  // { field: "tenant_id", header: "ID del Tenant" },
  { field: "title", header: "Título", },
  //{ field: "data", header: "Datos" },
  { field: "description", header: "Descripción" },
  {
    field: "actions",
    header: "Acciones",
    body: (rowData: ConsentimientoData) => {
      console.log("rowData", rowData);
      return (
        <div className="d-flex justify-content-center">
          <CustomPRTableMenu
            menuItems={[
              {
                icon: <i className="fas fa-pencil-alt me-2"></i>,
                label: "Editar",
                command: () => editConsentimiento(rowData.id ?? ''),
              },
              {
                icon: <i className="fa-solid fa-trash me-2"></i>,
                label: "Eliminar",
                command: () => deleteConsentimiento(rowData.id ?? ''),
              },
            ]}
            rowData={rowData}
          />
        </div>
      );
    },
  }
];
