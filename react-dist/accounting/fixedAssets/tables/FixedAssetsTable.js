import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import { CustomPRTable } from "../../../components/CustomPRTable.js";
import FixedAssetsModal from "../modal/FixedAssetsModal.js";
import DepreciationAppreciationModal from "../modal/DepreciationAppreciationModal.js";
import MaintenanceModal from "../modal/MaintenanceModal.js";
import { useAssets } from "../hooks/useAssets.js";
import { useUpdateAssetStatus } from "../hooks/useUpdateAssetStatus.js";
import { useDataPagination } from "../../../hooks/useDataPagination.js";
import { useAssetCategories } from "../hooks/useAssetCategories.js";
import { useUsersForSelect } from "../../../users/hooks/useUsersForSelect.js";
import { getLocalTodayISODateTime } from "../../../../services/utilidades.js";
import { useSaveAdjustment } from "../hooks/useSaveAdjustment.js";
export const FixedAssetsTable = () => {
  const {
    assets,
    fetchAssets
  } = useAssets();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [selectedAssetForMaintenance, setSelectedAssetForMaintenance] = useState(null);
  const [depreciationModalVisible, setDepreciationModalVisible] = useState(false);
  const [selectedAssetForAdjustment, setSelectedAssetForAdjustment] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const {
    updateAssetStatus
  } = useUpdateAssetStatus();
  const {
    saveAdjustment
  } = useSaveAdjustment();
  const [filters, setFilters] = useState({
    category: null,
    status: null,
    date_range: null
  });
  const {
    data: assetsData,
    loading: loadingPaginator,
    first: paginatorFirst,
    perPage,
    totalRecords: paginatorTotalRecords,
    handlePageChange,
    handleSearchChange,
    refresh
  } = useDataPagination({
    fetchFunction: fetchAssets,
    defaultPerPage: 10,
    getCustomFilters: () => filters
  });
  useEffect(() => {
    fetchAssets(filters);
  }, []);
  const {
    categories: assetCategories
  } = useAssetCategories();
  const {
    users: userOptions
  } = useUsersForSelect();
  const maintenanceTypeOptions = [{
    label: "Preventivo",
    value: "preventive"
  }, {
    label: "Correctivo",
    value: "corrective"
  }, {
    label: "Predictivo",
    value: "predictive"
  }, {
    label: "Calibración",
    value: "calibration"
  }];
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
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = async () => {
    setTableLoading(true);
    try {
      await refresh(filters);
    } catch (error) {
      console.error("Error aplicando filtros:", error);
      showToast("error", "Error", "No se pudieron aplicar los filtros");
    } finally {
      setTableLoading(false);
    }
  };
  const handleMaintenanceClick = asset => {
    setSelectedAssetForMaintenance(asset);
    setMaintenanceModalVisible(true);
  };
  const clearFilters = () => {
    setFilters({
      category: null,
      status: null,
      date_range: null
    });
    refresh({
      category: null,
      status: null,
      date_range: null
    });
  };
  const formatCurrency = value => {
    if (value === null || value === undefined || isNaN(value)) {
      return "RD$ 0.00";
    }
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  const formatDate = value => {
    return value?.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }) || "";
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
        return "secondary";
    }
  };
  const getStatusLabel = status => {
    const option = statusOptions.find(opt => opt.value === status);
    return (option ? option.label : status) || "Sin Estado";
  };
  const getCategoryLabel = category => {
    const option = assetCategories.find(opt => opt.value === category);
    return option ? option.label : category;
  };
  const calculateDepreciation = (purchaseValue, currentValue) => {
    if (!purchaseValue || purchaseValue === 0) return 0;
    return (purchaseValue - currentValue) / purchaseValue * 100;
  };
  const changeStatus = asset => {
    setSelectedAssetForAdjustment(asset);
    setDepreciationModalVisible(true);
  };
  const TableMenu = ({
    rowData
  }) => {
    const menu = useRef(null);
    const handleMaintenance = () => {
      handleMaintenanceClick(rowData);
    };
    const handleDepreciation = () => {
      changeStatus(rowData);
    };
    const menuItems = [{
      label: "Mantenimiento/Estado",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-book-open me-2"
      }),
      command: handleMaintenance
    }, {
      label: "Depreciación/Apreciación",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-exchange-alt me-2"
      }),
      command: handleDepreciation
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
        zIndex: 9999,
        minWidth: "300px",
        maxWidth: "300px"
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
  const depreciationBodyTemplate = rowData => {
    const depreciation = calculateDepreciation(rowData.purchaseValue, rowData.currentValue);
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-column gap-1"
    }, /*#__PURE__*/React.createElement("span", null, depreciation.toFixed(2), "%"), /*#__PURE__*/React.createElement(ProgressBar, {
      value: depreciation,
      showValue: false,
      style: {
        height: "6px",
        borderRadius: "3px"
      },
      className: classNames({
        "p-progressbar-determinate": true,
        "p-progressbar-danger": depreciation > 50,
        "p-progressbar-warning": depreciation > 30 && depreciation <= 50,
        "p-progressbar-success": depreciation <= 30
      })
    }));
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const handleSearchChangeCustom = searchValue => {
    setGlobalFilter(searchValue);
    handleSearchChange(searchValue);
  };
  const handleRefresh = async () => {
    clearFilters();
    await refresh();
  };

  // Mapear los datos para la tabla
  const tableItems = assetsData.map(asset => ({
    id: asset.id,
    internal_code: asset.internal_code,
    description: asset.description,
    category: asset.category?.name || "",
    brand: asset.brand,
    model: asset.model,
    status: asset.status,
    purchaseValue: asset.unit_price || 0,
    currentValue: asset.current_unit_price || 0,
    actions: asset
  }));
  const columns = [{
    field: "internal_code",
    header: "Código",
    sortable: true
  }, {
    field: "description",
    header: "Nombre/Descripción",
    sortable: true
  },
  // {
  //     field: "category",
  //     header: "Categoría",
  //     sortable: true,
  //     body: (rowData: any) => getCategoryLabel(rowData.category),
  // },
  // {
  //     field: "brand",
  //     header: "Marca",
  //     sortable: true,
  // },
  // {
  //     field: "model",
  //     header: "Modelo",
  //     sortable: true,
  // },
  {
    field: "status",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: getStatusLabel(rowData.status),
      severity: getStatusSeverity(rowData.status)
    })
  }, {
    field: "depreciation",
    header: "Depreciación",
    sortable: true,
    body: depreciationBodyTemplate
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => actionBodyTemplate(rowData.actions),
    exportable: false,
    width: "120px"
  }];
  return /*#__PURE__*/React.createElement("main", {
    className: "main w-100",
    id: "top"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), loading ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-center align-items-center",
    style: {
      height: "50vh",
      marginLeft: "900px",
      marginTop: "300px"
    }
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-30px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end pt-3 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: () => setModalVisible(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nuevo Activo Fijo")), /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros de B\xFAsqueda"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filters.category,
    options: assetCategories,
    onChange: e => handleFilterChange("category", e.value),
    optionLabel: "label",
    placeholder: "Seleccione categor\xEDa",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filters.status,
    options: statusOptions,
    onChange: e => handleFilterChange("status", e.value),
    optionLabel: "label",
    placeholder: "Seleccione estado",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha de Adquisici\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    value: filters.date_range,
    onChange: e => handleFilterChange("date_range", e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash"
    }),
    className: "p-button-secondary",
    onClick: clearFilters
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter"
    }),
    className: "p-button-primary",
    onClick: () => aplicarFiltros()
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: tableLoading || loadingPaginator,
    onSearch: handleSearchChangeCustom,
    onReload: handleRefresh,
    rows: rows,
    first: paginatorFirst,
    onPage: handlePageChange,
    totalRecords: paginatorTotalRecords,
    lazy: true
  }))), /*#__PURE__*/React.createElement(FixedAssetsModal, {
    isVisible: modalVisible,
    onClose: () => {
      setModalVisible(false);
      setSelectedAsset(null);
    },
    onSave: assetData => {
      setModalVisible(false);
      setSelectedAsset(null);
      refresh();
      showToast("success", "Éxito", "Activo fijo creado correctamente");
    }
  }), selectedAssetForAdjustment && /*#__PURE__*/React.createElement(DepreciationAppreciationModal, {
    isVisible: depreciationModalVisible,
    onClose: () => {
      setDepreciationModalVisible(false);
      setSelectedAssetForAdjustment(null);
    },
    onSave: async adjustmentData => {
      try {
        setDepreciationModalVisible(false);
        setSelectedAssetForAdjustment(null);
        console.log("selectedAssetForAdjustment", adjustmentData);
        let requestData;
        if (adjustmentData.type === "depreciation") {
          requestData = {
            asset_id: selectedAssetForAdjustment.id,
            type: adjustmentData.type,
            amount: adjustmentData.amount,
            movement_date: adjustmentData.date,
            percentage: adjustmentData.percentage,
            frequency: adjustmentData.frequency,
            method: "xxx"
          };
        } else {
          requestData = {
            asset_id: selectedAssetForAdjustment.id,
            description: adjustmentData.reasons,
            amount: adjustmentData.amount
          };
        }
        await saveAdjustment(requestData);
        await refresh();
        showToast("success", "Ajuste registrado", `El ajuste de valor para ${selectedAssetForAdjustment.description} ha sido registrado correctamente.`);
      } catch (error) {
        console.error("Error al guardar ajuste:", error);
        showToast("error", "Error", "No se pudo registrar el ajuste de valor");
      }
    },
    asset: selectedAssetForAdjustment,
    key: selectedAssetForAdjustment.id
  }), selectedAssetForMaintenance && /*#__PURE__*/React.createElement(MaintenanceModal, {
    isVisible: maintenanceModalVisible,
    onSave: async maintenanceData => {
      const body = {
        status: maintenanceData.assetStatus,
        status_type: maintenanceData.maintenanceType,
        status_changed_at: getLocalTodayISODateTime(),
        maintenance_cost: maintenanceData.cost || 0,
        status_comment: maintenanceData.comments || null
      };
      await updateAssetStatus(selectedAssetForMaintenance.id, body);
      await refresh();
      setMaintenanceModalVisible(false);
      setSelectedAssetForMaintenance(null);
      showToast("success", "Mantenimiento registrado", `El estado de ${selectedAssetForMaintenance?.description} ha sido actualizado.`);
    },
    onClose: () => {
      setMaintenanceModalVisible(false);
      setSelectedAssetForMaintenance(null);
    },
    asset: selectedAssetForMaintenance,
    statusOptions: statusOptions,
    maintenanceTypeOptions: maintenanceTypeOptions,
    userOptions: userOptions
  }));
};
export default FixedAssetsTable;