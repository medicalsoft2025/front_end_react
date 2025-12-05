import React, { useRef } from "react";
import { massMessageMedicalService } from "../../../services/api/index.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
export const MassMessageTable = ({
  massMessages,
  onEditItem,
  onDeleteItem,
  loading
}) => {
  const onDelete = async id => {
    await massMessageMedicalService.delete(id);
    SwalManager.success({
      title: "Registro Eliminado"
    });
    onDeleteItem?.();
  };
  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px"
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333"
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600
    },
    tableCell: {
      padding: "0.75rem 1rem"
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block"
    }
  };
  const getEstadoSeverity = status => {
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
  const getEstadoLabel = status => {
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
  const createActionTemplate = (icon, label, colorClass = "") => {
    return () => /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2 p-2 point",
      style: {
        cursor: "pointer"
      } // Agrega el cursor pointer aquí
    }, /*#__PURE__*/React.createElement("i", {
      className: `fas fa-${icon} ${colorClass}`
    }), /*#__PURE__*/React.createElement("span", null, label));
  };
  const TableMenu = ({
    rowData
  }) => {
    const menu = useRef(null);
    const handleToEdit = () => {
      onEditItem && onEditItem(rowData.id);
    };
    const handleToDelete = () => {
      onDelete(rowData.id);
    };
    const menuItems = [{
      label: "Editar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-pencil me-2"
      }),
      command: handleToEdit
    }, {
      label: "Eliminar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash me-2"
      }),
      command: handleToDelete
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-primary flex items-center gap-2",
      onClick: e => menu.current?.toggle(e),
      "aria-controls": `popup_menu_${rowData.id}`,
      "aria-haspopup": true
    }, "Acciones", /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cog ml-2"
    })), /*#__PURE__*/React.createElement(Menu, {
      model: menuItems,
      popup: true,
      ref: menu,
      id: `popup_menu_${rowData.id}`,
      appendTo: document.body,
      style: {
        zIndex: 9999
      }
    }));
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(TableMenu, {
      rowData: rowData
    }));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: massMessages || [],
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron registros",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "message_description",
    header: "Descripci\xF3n",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "scheduled_at_formatted",
    header: "Fecha",
    sortable: true,
    body: rowData => rowData.scheduled_at_formatted,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "status",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: getEstadoLabel(rowData.status),
      severity: getEstadoSeverity(rowData.estado)
    }),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    header: "Acciones",
    style: {
      width: "100px"
    },
    exportable: false
  }))));
};