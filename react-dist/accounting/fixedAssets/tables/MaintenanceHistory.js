// MaintenanceHistory.jsx
import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useAssetMaintenanceHistory } from "../hooks/useAssetMaintenanceHistory.js";
const MaintenanceHistory = () => {
  const {
    data: assets,
    loading,
    refreshMaintenanceHistory,
    dateRange,
    setDateRange,
    maintenanceType,
    setMaintenanceType,
    first,
    totalRecords,
    handlePageChange,
    perPage
  } = useAssetMaintenanceHistory();
  const [mappedAssets, setMappedAssets] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  useEffect(() => {
    if (assets) {
      const mappedData = assets.map(asset => ({
        id: asset.id,
        assetName: asset.description,
        internalCode: asset.internal_code,
        currentValue: asset.current_unit_price,
        status: asset.status,
        maintenances: asset.maintenances.map(maintenance => ({
          id: maintenance.id,
          date: new Date(maintenance.created_at),
          maintenanceType: maintenance.type,
          cost: parseFloat(maintenance.cost.toString()),
          description: maintenance.description
        }))
      }));
      setMappedAssets(mappedData);
    }
  }, [assets]);
  const maintenanceTypeOptions = [{
    label: "Preventivo",
    value: "preventive"
  }, {
    label: "Correctivo",
    value: "corrective"
  }, {
    label: "Calibración",
    value: "calibration"
  }, {
    label: "Predictivo",
    value: "predictive"
  }];
  const formatCurrency = value => {
    try {
      return new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency: "DOP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    } catch (error) {
      return `DOP $${value.toFixed(2)}`;
    }
  };
  const formatDate = value => {
    if (!value) return "N/A";
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const getMaintenanceTypeLabel = type => {
    switch (type) {
      case "preventive":
        return "Preventivo";
      case "corrective":
        return "Correctivo";
      case "predictive":
        return "Predictivo";
      case "calibration":
        return "Calibración";
      default:
        return type;
    }
  };
  const getMaintenanceTypeSeverity = type => {
    switch (type) {
      case "preventive":
        return "info";
      case "corrective":
        return "warning";
      case "predictive":
        return "success";
      case "calibration":
        return "secondary";
      default:
        return null;
    }
  };
  const getStatusSeverity = status => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "maintenance":
        return "info";
      case "disposed":
        return "danger";
      default:
        return null;
    }
  };
  const getStatusLabel = status => {
    const statusOptions = [{
      label: "Activo",
      value: "active"
    }, {
      label: "Inactivo",
      value: "inactive"
    }, {
      label: "En Mantenimiento",
      value: "maintenance"
    }, {
      label: "Dado de Baja",
      value: "disposed"
    }];
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  // Template para la expansión de filas (mantenimientos)
  const rowExpansionTemplate = asset => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3 bg-gray-50"
    }, /*#__PURE__*/React.createElement("h5", null, "Historial de Mantenimientos - ", asset.assetName), /*#__PURE__*/React.createElement(DataTable, {
      value: asset.maintenances,
      size: "small"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "date",
      header: "Fecha",
      body: rowData => formatDate(rowData.date),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "maintenanceType",
      header: "Tipo",
      body: rowData => /*#__PURE__*/React.createElement(Tag, {
        value: getMaintenanceTypeLabel(rowData.maintenanceType),
        severity: getMaintenanceTypeSeverity(rowData.maintenanceType)
      }),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "cost",
      header: "Costo",
      body: rowData => formatCurrency(rowData.cost),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "description",
      header: "Descripci\xF3n",
      body: rowData => /*#__PURE__*/React.createElement("div", {
        className: "max-w-300"
      }, rowData.description || "Sin descripción")
    })));
  };
  const clearFilters = () => {
    setDateRange(null);
    setMaintenanceType(null);
  };
  const applyFilters = () => {
    refreshMaintenanceHistory();
  };
  const handleReload = () => {
    refreshMaintenanceHistory();
  };
  const expandAll = () => {
    const expandedRowsArray = {};
    mappedAssets.forEach(asset => {
      expandedRowsArray[asset.id] = true;
    });
    setExpandedRows(expandedRowsArray);
  };
  const collapseAll = () => {
    setExpandedRows(null);
  };
  const header = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    className: "p-button-primary me-2",
    onClick: handleReload
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-sync"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus me-1"
    }),
    label: "Expandir Todos",
    onClick: expandAll
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-minus me-1"
    }),
    label: "Colapsar Todos",
    onClick: collapseAll
  })));
  const statusBodyTemplate = asset => {
    return /*#__PURE__*/React.createElement(Tag, {
      value: getStatusLabel(asset.status),
      severity: getStatusSeverity(asset.status)
    });
  };
  const valueBodyTemplate = asset => {
    return formatCurrency(asset.currentValue);
  };
  const totalMaintenanceCostBodyTemplate = asset => {
    const totalCost = asset.maintenances.reduce((sum, maintenance) => sum + maintenance.cost, 0);
    return formatCurrency(totalCost);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros - Historial de Mantenimientos")
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rango de Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dateRange,
    onChange: e => {
      setDateRange(e.value);
    },
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de Mantenimiento"), /*#__PURE__*/React.createElement(Dropdown, {
    value: maintenanceType,
    options: maintenanceTypeOptions,
    onChange: e => {
      setMaintenanceType(e.value);
    },
    optionLabel: "label",
    placeholder: "Todos los tipos de mantenimiento",
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar Filtros",
    icon: "pi pi-trash",
    className: "p-button-secondary",
    onClick: clearFilters
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: applyFilters
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Historial de Mantenimientos",
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: mappedAssets,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "id",
    header: header,
    loading: loading,
    paginator: true,
    rows: perPage,
    totalRecords: totalRecords,
    first: first,
    onPage: handlePageChange,
    tableStyle: {
      minWidth: "60rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: "3rem"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "internalCode",
    header: "C\xF3digo Interno",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "assetName",
    header: "Activo",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "currentValue",
    header: "Valor Actual",
    body: valueBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "status",
    header: "Estado",
    body: statusBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "maintenances",
    header: "Total Mantenimientos",
    body: asset => /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center"
    }, /*#__PURE__*/React.createElement(Tag, {
      value: asset.maintenances.length,
      severity: "info"
    })),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Costo Total",
    body: totalMaintenanceCostBodyTemplate,
    sortable: true
  }))));
};
export default MaintenanceHistory;