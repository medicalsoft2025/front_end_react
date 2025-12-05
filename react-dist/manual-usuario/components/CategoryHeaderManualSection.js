import React from "react";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { confirmDialog } from "primereact/confirmdialog";
export function CategoryHeaderManualSection({
  category,
  showToast
}) {
  const getCategoryIcon = categoryName => {
    const icons = {
      'Facturación': 'fas fa-file-invoice-dollar',
      'Pacientes': 'fas fa-user-injured',
      'Citas': 'fas fa-calendar-check',
      'Reportes': 'fas fa-chart-bar',
      'Configuración': 'fas fa-cogs',
      'Inventario': 'fas fa-warehouse',
      'Medicamentos': 'fas fa-pills',
      'Laboratorio': 'fas fa-microscope',
      'Historial': 'fas fa-history',
      'Usuarios': 'fas fa-user-md',
      'default': 'fas fa-folder'
    };
    return icons[categoryName] || icons.default;
  };
  const getCategoryColor = categoryName => {
    const colors = {
      'Facturación': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Pacientes': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Citas': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Reportes': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'Configuración': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'Inventario': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    return colors[categoryName] || colors.default;
  };
  const confirmDeleteCategory = category => {
    confirmDialog({
      message: `¿Estás seguro de que quieres eliminar la categoría "${category.name}" y todos sus videos?`,
      header: 'Confirmar eliminación',
      icon: 'fas fa-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDeleteCategory(category.id),
      reject: () => {}
    });
  };
  const handleDeleteCategory = async categoryId => {
    try {
      // await deleteCategory(categoryId);
      showToast("success", "Éxito", "Categoría eliminada correctamente");
    } catch {
      showToast("error", "Error", "No se pudo eliminar la categoría");
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "category-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "category-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "category-icon-wrapper me-3",
    style: {
      background: getCategoryColor(category.name)
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: getCategoryIcon(category.name)
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold mb-1"
  }, category.name), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, category.videos.length, " video", category.videos.length !== 1 ? 's' : '', " disponible", category.videos.length !== 1 ? 's' : ''))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "category-badge"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-video me-1"
  }), category.videos.length), /*#__PURE__*/React.createElement("div", {
    className: "action-buttons"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    target: `.edit-cat-${category.id}`,
    content: "Editar categor\xEDa"
  }), /*#__PURE__*/React.createElement(Button, {
    className: `p-button-rounded p-button-text p-button-sm edit-cat-${category.id}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit"
  })), /*#__PURE__*/React.createElement(Tooltip, {
    target: `.delete-cat-${category.id}`,
    content: "Eliminar categor\xEDa"
  }), /*#__PURE__*/React.createElement(Button, {
    className: `p-button-rounded p-button-text p-button-danger p-button-sm delete-cat-${category.id}`,
    onClick: e => {
      e.stopPropagation();
      confirmDeleteCategory(category);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash"
  })))));
}