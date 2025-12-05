import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { CustomPRTable } from "../../../components/CustomPRTable.js";
import { formatDate } from "../../../../services/utilidades.js";
export const PatientsNursingNotesTable = ({
  onEditItem,
  nursingNotes = [],
  loading = false,
  onDeleteItem,
  onReload,
  onCreate,
  createLoading = false,
  updateLoading = false,
  deleteLoading = false
}) => {
  const toast = useRef(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [filtros, setFiltros] = useState({
    titulo: "",
    enfermera: ""
  });
  const syncFilteredData = () => {
    let result = [...nursingNotes];
    if (filtros.titulo) {
      result = result.filter(note => note.titulo.toLowerCase().includes(filtros.titulo.toLowerCase()));
    }
    if (filtros.enfermera) {
      result = result.filter(note => note.enfermera.toLowerCase().includes(filtros.enfermera.toLowerCase()));
    }
    setFilteredNotes(result);
  };
  React.useEffect(() => {
    syncFilteredData();
  }, [nursingNotes, filtros]);
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSearchChange = searchValue => {
    console.log("Search value:", searchValue);
  };
  const limpiarFiltros = () => {
    setFiltros({
      titulo: "",
      enfermera: ""
    });
  };
  const handleRefresh = async () => {
    limpiarFiltros();
    if (onReload) {
      await onReload();
    }
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const confirmDelete = note => {
    setNoteToDelete(note);
    setDeleteDialogVisible(true);
  };
  const deleteNote = async () => {
    if (noteToDelete && onDeleteItem) {
      await onDeleteItem(noteToDelete.id);
      showToast("success", "Éxito", `Nota "${noteToDelete.titulo}" eliminada`);
    }
    setDeleteDialogVisible(false);
    setNoteToDelete(null);
  };
  const deleteDialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-secondary",
    onClick: () => setDeleteDialogVisible(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times",
    style: {
      marginLeft: "10px"
    }
  }), " "), /*#__PURE__*/React.createElement(Button, {
    label: "Eliminar",
    className: "p-button-danger",
    onClick: deleteNote
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash",
    style: {
      marginLeft: "10px"
    }
  }), " "));
  const formatDateForTable = dateString => {
    return formatDate(dateString);
  };
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      onEdit(rowData.id);
    };
    const handleDelete = () => {
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
      onEdit: onEditItem,
      onDelete: confirmDelete
    }));
  };
  const columns = [{
    field: 'titulo',
    header: 'Título',
    sortable: true
  }, {
    field: 'nota',
    header: 'Contenido',
    body: rowData => /*#__PURE__*/React.createElement("span", {
      title: rowData.nota
    }, rowData.nota?.length > 50 ? `${rowData.nota.substring(0, 50)}...` : rowData.nota)
  }, {
    field: 'enfermera',
    header: 'Enfermera',
    sortable: true
  }, {
    field: 'fecha',
    header: 'Fecha y Hora',
    body: rowData => formatDateForTable(rowData.fecha),
    sortable: true
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => actionBodyTemplate(rowData),
    exportable: false,
    width: "120px"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: deleteDialogVisible,
    style: {
      width: "450px"
    },
    header: "Confirmar Eliminaci\xF3n",
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
  }), noteToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar la nota ", /*#__PURE__*/React.createElement("b", null, "\"", noteToDelete.titulo, "\""), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-50px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end pt-3 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: onCreate,
    disabled: createLoading || updateLoading || deleteLoading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), createLoading || updateLoading ? 'Procesando...' : 'Nueva Nota')), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: filteredNotes,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))));
};