// ValueMovementHistory.jsx
import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useAssetValueMovementHistory } from "../hooks/useAssetValueMovementHistory.js"; // Interfaces corregidas
const ValueMovementHistory = () => {
  const {
    data: assets,
    loading,
    refreshValueMovements,
    dateRange,
    setDateRange,
    type,
    setType,
    handleSearchChange,
    first,
    totalRecords,
    handlePageChange,
    perPage
  } = useAssetValueMovementHistory();
  const [mappedAssets, setMappedAssets] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const toast = useRef(null);
  useEffect(() => {
    if (assets) {
      const mappedData = assets.map(asset => ({
        id: asset.id,
        assetName: asset.description,
        internalCode: asset.internal_code,
        currentValue: asset.current_unit_price,
        status: asset.status,
        valueMovements: asset.value_movements.map(movement => {
          const isDepreciation = movement.type === "depreciation";

          // Para depreciación restamos el amount, para apreciación lo sumamos
          const amountAdjustment = isDepreciation ? -movement.amount : movement.amount;
          const previousValue = movement.previous_asset_unit_price ? parseFloat(movement.previous_asset_unit_price) : 0;
          const newValue = movement.previous_asset_unit_price ? previousValue + amountAdjustment : asset.current_unit_price;
          const changePercentage = movement.previous_asset_unit_price ? amountAdjustment / previousValue * 100 : 0;
          return {
            id: movement.id,
            date: new Date(movement.created_at),
            previousValue: previousValue,
            newValue: newValue,
            changeAmount: Math.abs(movement.amount),
            changeType: movement.type,
            changePercentage: changePercentage,
            notes: movement.description,
            description: movement.description
          };
        })
      }));
      setMappedAssets(mappedData);
    }
  }, [assets]);
  const changeTypeOptions = [{
    label: "Depreciación",
    value: "depreciation"
  }, {
    label: "Apreciación",
    value: "appreciation"
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
  const getChangeTypeSeverity = type => {
    return type === "depreciation" ? "danger" : "success";
  };
  const getChangeTypeLabel = type => {
    return type === "depreciation" ? "Depreciación" : "Apreciación";
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
  const calculatePercentageVariation = (previousValue, newValue, decimals = 2) => {
    if (previousValue === 0 || isNaN(previousValue) || isNaN(newValue)) {
      return "0.00%";
    }
    const variation = (newValue - previousValue) / previousValue * 100;
    const sign = variation > 0 ? "+" : "";
    const formattedVariation = variation.toFixed(decimals);
    return `${sign}${formattedVariation}%`;
  };

  // Template para la expansión de filas (movimientos de valor)
  const rowExpansionTemplate = asset => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3 bg-gray-50"
    }, /*#__PURE__*/React.createElement("h5", null, "Movimientos de Valor - ", asset.assetName), /*#__PURE__*/React.createElement(DataTable, {
      value: asset.valueMovements,
      size: "small"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "date",
      header: "Fecha",
      body: rowData => formatDate(rowData.date),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "previousValue",
      header: "Valor Anterior",
      body: rowData => formatCurrency(rowData.previousValue),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "newValue",
      header: "Nuevo Valor",
      body: rowData => formatCurrency(rowData.newValue),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "changeType",
      header: "Tipo",
      body: rowData => /*#__PURE__*/React.createElement(Tag, {
        value: getChangeTypeLabel(rowData.changeType),
        severity: getChangeTypeSeverity(rowData.changeType),
        icon: rowData.changeType === "depreciation" ? "pi pi-arrow-down" : "pi pi-arrow-up"
      }),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "changeAmount",
      header: "Monto Cambio",
      body: rowData => formatCurrency(rowData.changeAmount),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "changePercentage",
      header: "Variaci\xF3n %",
      body: rowData => {
        const isDepreciation = rowData.changeType === "depreciation";
        const color = isDepreciation ? "text-red-500" : "text-green-500";
        return /*#__PURE__*/React.createElement("span", {
          className: color
        }, calculatePercentageVariation(rowData.previousValue, rowData.newValue, 2));
      },
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "description",
      header: "Descripci\xF3n"
    })));
  };
  const clearFilters = () => {
    setDateRange(null);
    setType(null);
  };
  const applyFilters = () => {
    refreshValueMovements();
  };
  const handleReload = () => {
    refreshValueMovements();
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros - Historial de Activos")
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
  }, "Tipo de Cambio"), /*#__PURE__*/React.createElement(Dropdown, {
    value: type,
    options: changeTypeOptions,
    onChange: e => {
      setType(e.value);
    },
    optionLabel: "label",
    placeholder: "Todos los tipos de cambio",
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
    title: "Historial Detallado de Movimientos de Valor",
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
    field: "valueMovements",
    header: "Movimientos",
    body: asset => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center"
    }, /*#__PURE__*/React.createElement(Tag, {
      value: asset.valueMovements.length,
      severity: "info"
    }))),
    sortable: true
  }))));
};
export default ValueMovementHistory;