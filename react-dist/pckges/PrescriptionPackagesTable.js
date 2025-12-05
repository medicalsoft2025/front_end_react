import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { useClinicalPackages } from "../clinical-packages/hooks/useClinicalPackages.js";
import { SwalManager } from "../../services/alertManagerImported.js";
export const PrescriptionPackagesTable = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    onEdit,
    onDelete
  } = props;
  const {
    clinicalPackages,
    fetchClinicalPackages,
    loading: clinicalPackagesLoading
  } = useClinicalPackages();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const toast = useRef(null);
  useImperativeHandle(ref, () => ({
    fetchData: fetchClinicalPackages
  }));
  const confirmDelete = packageItem => {
    setPackageToDelete(packageItem);
    setDeleteDialogVisible(true);
  };
  const handleDelete = async () => {
    if (packageToDelete) {
      try {
        // Llamar a la función de eliminación pasada por props
        await onDelete(packageToDelete);
        SwalManager.success({
          title: "Paquete Eliminado"
        });

        // Refrescar los datos después de eliminar
        fetchClinicalPackages();
      } catch (error) {
        console.error("Error al eliminar paquete:", error);
        SwalManager.error({
          title: "Error",
          text: "No se pudo eliminar el paquete"
        });
      }
    }
    setDeleteDialogVisible(false);
    setPackageToDelete(null);
  };
  const deleteDialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-secondary",
    onClick: () => setDeleteDialogVisible(false)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Eliminar",
    icon: "pi pi-check",
    className: "p-button-danger",
    onClick: handleDelete
  }));
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando paquete con ID:", rowData.id);
      onEdit(rowData);
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar paquete con ID:", rowData.id);
      onDelete(rowData);
    };
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
      model: [{
        label: "Editar",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-edit me-2"
        }),
        command: handleEdit
      }, {
        label: "Eliminar",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-trash me-2"
        }),
        command: handleDelete
      }],
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
      rowData: rowData,
      onEdit: onEdit,
      onDelete: confirmDelete
    }));
  };
  const columns = [{
    field: 'label',
    header: 'Nombre',
    sortable: true
  }, {
    field: 'description',
    header: 'Descripción',
    sortable: true
  }, {
    field: 'actions',
    header: 'Acciones',
    body: actionBodyTemplate,
    exportable: false
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: deleteDialogVisible,
    style: {
      width: "450px"
    },
    header: "Confirmar",
    modal: true,
    footer: deleteDialogFooter,
    onHide: () => setDeleteDialogVisible(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center justify-content-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-triangle mr-3",
    style: {
      fontSize: "2rem",
      color: "#F8BB86"
    }
  }), packageToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar el paquete ", /*#__PURE__*/React.createElement("b", null, packageToDelete.label), "?"))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: clinicalPackages,
    onReload: fetchClinicalPackages,
    loading: clinicalPackagesLoading
  }));
});