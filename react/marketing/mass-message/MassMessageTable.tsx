import React, { useRef, useState } from "react";
import { massMessageMedicalService } from "../../../services/api";
import { SwalManager } from "../../../services/alertManagerImported";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { SplitButton } from "primereact/splitbutton";
import { formatDate } from "../../../services/utilidades.js";
import { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

interface MassMessageTableProps {
  massMessages: any[];
  onEditItem?: (id: string) => void;
  onDeleteItem?: () => void;
  loading?: boolean;
}

export const MassMessageTable: React.FC<MassMessageTableProps> = ({
  massMessages,
  onEditItem,
  onDeleteItem,
  loading,
}) => {
  const onDelete = async (id: string) => {
    await massMessageMedicalService.delete(id);
    SwalManager.success({
      title: "Registro Eliminado",
    });
    onDeleteItem?.();
  };

  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333",
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600,
    },
    tableCell: {
      padding: "0.75rem 1rem",
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block",
    },
  };

  const getEstadoSeverity = (status: any) => {
    switch (status) {
      case "scheduled":
      case "processing":
        return "info";
      case "completed":
        return "success";
      case "failed":
        return "danger";
    }
  };

  const getEstadoLabel = (status: any) => {
    switch (status) {
      case "scheduled":
        return "Programado";
      case "processing":
        return "Procesando";
      case "completed":
        return "Completado";
      case "failed":
        return "Fallido";
    }
  };

  const createActionTemplate = (
    icon: string,
    label: string,
    colorClass: string = ""
  ) => {
    return () => (
      <div
        className="flex align-items-center gap-2 p-2 point"
        style={{ cursor: "pointer" }} // Agrega el cursor pointer aquí
      >
        <i className={`fas fa-${icon} ${colorClass}`} />
        <span>{label}</span>
      </div>
    );
  };

  const TableMenu: React.FC<{
    rowData: any;
  }> = ({ rowData }) => {
    const menu = useRef<Menu>(null);

    const handleToEdit = () => {
      onEditItem && onEditItem(rowData.id);
    };

    const handleToDelete = () => {
      onDelete(rowData.id);
    };

    const menuItems = [
      {
        label: "Editar",
        icon: <i className="fas fa-pencil me-2"></i>,
        command: handleToEdit,
      },
      {
        label: "Eliminar",
        icon: <i className="fas fa-trash me-2"></i>,
        command: handleToDelete,
      },
    ];

    return (
      <div style={{ position: "relative" }}>
        <Button
          className="p-button-primary flex items-center gap-2"
          onClick={(e) => menu.current?.toggle(e)}
          aria-controls={`popup_menu_${rowData.id}`}
          aria-haspopup
        >
          Acciones
          <i className="fas fa-cog ml-2"></i>
        </Button>
        <Menu
          model={menuItems}
          popup
          ref={menu}
          id={`popup_menu_${rowData.id}`}
          appendTo={document.body}
          style={{ zIndex: 9999 }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <TableMenu rowData={rowData} />
      </div>
    );
  };

  return (
    <>
      <Card style={styles.card}>
        <DataTable
          value={massMessages || []}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron registros"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="message_description"
            header="Descripción"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="scheduled_at_formatted"
            header="Fecha"
            sortable
            body={(rowData) => rowData.scheduled_at_formatted}
            style={styles.tableCell}
          />
          <Column
            field="status"
            header="Estado"
            sortable
            body={(rowData) => (
              <Tag
                value={getEstadoLabel(rowData.status)}
                severity={getEstadoSeverity(rowData.estado)}
              />
            )}
            style={styles.tableCell}
          />
          <Column
            body={actionBodyTemplate}
            header="Acciones"
            style={{ width: "100px" }}
            exportable={false}
          />
        </DataTable>
      </Card>
    </>
  );
};
