import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import { SplitButton } from "primereact/splitbutton";
import { Toast } from "primereact/toast";
import { MenuItem } from "primereact/menuitem";
import FixedAssetsModal from "./modal/FixedAssetsModal";
import { Filters, FixedAsset } from "./interfaces/FixedAssetsTableTypes";

export const FixedAssetsTable = () => {
  const [assets, setAssets] = useState<FixedAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<FixedAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const toast = useRef<Toast>(null);

  const [filters, setFilters] = useState<Filters>({
    assetName: "",
    assetCategory: null,
    brand: "",
    internalCode: "",
    status: null,
    dateRange: null,
  });

  const assetCategories = [
    { label: "Computador", value: "computer" },
    { label: "Vehículo", value: "vehicle" },
    { label: "Mobiliario", value: "furniture" },
    { label: "Maquinaria", value: "machinery" },
    { label: "Equipo Electrónico", value: "electronic" },
    { label: "Otro", value: "other" },
  ];

  const statusOptions = [
    { label: "Activo", value: "active" },
    { label: "Inactivo", value: "inactive" },
    { label: "En Mantenimiento", value: "maintenance" },
    { label: "Dado de Baja", value: "disposed" },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData: FixedAsset[] = [
        {
          id: "1",
          assetName: "Laptop Ejecutiva",
          assetCategory: "computer",
          brand: "Dell",
          model: "Latitude 5420",
          serialNumber: "DL5420X12345",
          internalCode: "ACT-IT-001",
          acquisitionDate: new Date(2022, 0, 15),
          purchaseValue: 125000,
          currentValue: 87500,
          status: "active",
          location: "Oficina Principal",
          assignedTo: "Juan Pérez",
        },
        {
          id: "2",
          assetName: "Camioneta de Reparto",
          assetCategory: "vehicle",
          brand: "Toyota",
          model: "Hilux 4x4",
          serialNumber: "VIN123456789",
          internalCode: "ACT-VH-001",
          acquisitionDate: new Date(2021, 5, 20),
          purchaseValue: 1850000,
          currentValue: 1450000,
          status: "active",
          location: "Almacén Central",
          assignedTo: "Logística",
        },
        {
          id: "3",
          assetName: "Mesa de Conferencia",
          assetCategory: "furniture",
          brand: "Herman Miller",
          model: "Conference Table",
          serialNumber: "",
          internalCode: "ACT-MB-001",
          acquisitionDate: new Date(2023, 2, 10),
          purchaseValue: 75000,
          currentValue: 70000,
          status: "active",
          location: "Sala de Juntas",
          assignedTo: "",
        },
        {
          id: "4",
          assetName: "Impresora Multifuncional",
          assetCategory: "electronic",
          brand: "HP",
          model: "LaserJet Pro MFP",
          serialNumber: "HP12345678",
          internalCode: "ACT-IT-002",
          acquisitionDate: new Date(2021, 11, 5),
          purchaseValue: 45000,
          currentValue: 15000,
          status: "maintenance",
          location: "Área de Administración",
          assignedTo: "Departamento Contable",
        },
      ];
      setAssets(mockData);
      setFilteredAssets(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    setLoading(true);

    let results = [...assets];

    // Filter by asset name
    if (filters.assetName) {
      results = results.filter((asset) =>
        asset.assetName.toLowerCase().includes(filters.assetName.toLowerCase())
      );
    }

    // Filter by category
    if (filters.assetCategory) {
      results = results.filter(
        (asset) => asset.assetCategory === filters.assetCategory
      );
    }

    // Filter by brand
    if (filters.brand) {
      results = results.filter((asset) =>
        asset.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    // Filter by internal code
    if (filters.internalCode) {
      results = results.filter((asset) =>
        asset.internalCode
          .toLowerCase()
          .includes(filters.internalCode.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status) {
      results = results.filter((asset) => asset.status === filters.status);
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      results = results.filter((asset) => {
        const assetDate = new Date(asset.acquisitionDate);
        return assetDate >= start && assetDate <= end;
      });
    }

    setTimeout(() => {
      setFilteredAssets(results);
      setLoading(false);
    }, 300);
  };

  const clearFilters = () => {
    setFilters({
      assetName: "",
      assetCategory: null,
      brand: "",
      internalCode: "",
      status: null,
      dateRange: null,
    });
    setFilteredAssets(assets);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (value: Date) => {
    return value.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusSeverity = (status: string) => {
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

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  const getCategoryLabel = (category: string) => {
    const option = assetCategories.find((opt) => opt.value === category);
    return option ? option.label : category;
  };

  const calculateDepreciation = (
    purchaseValue: number,
    currentValue: number
  ) => {
    return ((purchaseValue - currentValue) / purchaseValue) * 100;
  };

  const changeStatus = (asset: FixedAsset) => {
    console.log("Cambiando estado de:", asset.internalCode);
    showToast(
      "success",
      "Estado",
      `Cambiando estado de ${asset.assetName} (${asset.internalCode})`
    );
  };

  const createActionTemplate = (
    icon: string,
    label: string,
    colorClass: string = ""
  ) => {
    return () => (
      <div
        className="flex align-items-center gap-2 p-2 point"
        style={{ cursor: "pointer" }}
      >
        <i className={`fas fa-${icon} ${colorClass}`} />
        <span>{label}</span>
      </div>
    );
  };

  // Acciones para cada fila
  const actionBodyTemplate = (rowData: FixedAsset) => {
    const items: MenuItem[] = [
      {
        label: "depreciacion o  apreciacion",
        template: createActionTemplate(
          "exchange-alt",
          "Cambiar Estado",
          "text-purple-500"
        ),
        command: () => changeStatus(rowData),
      },
    ];

    return (
      <SplitButton
        label="Acciones"
        icon="pi pi-cog"
        model={items}
        severity="contrast"
        className="p-button-sm point"
        buttonClassName="p-button-sm"
        menuButtonClassName="p-button-sm point"
        menuStyle={{ minWidth: "220px", cursor: "pointer" }}
      />
    );
  };

  const showToast = (severity: string, summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
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
    rangeCalendar: {
      width: "100%",
    },
    depreciationBar: {
      height: "6px",
      borderRadius: "3px",
    },
  };

  return (
    <div
      className="container-fluid mt-4"
      style={{ width: "100%", padding: "0 15px" }}
    >
      <Toast ref={toast} />
      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <Button
          label="Nuevo Activo Fijo"
          icon="pi pi-plus"
          className="btn btn-primary"
          onClick={() => setModalVisible(true)}
        />
      </div>

      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          {/* Filtro: Nombre del Activo */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Nombre/Descripción</label>
            <InputText
              value={filters.assetName}
              onChange={(e) => handleFilterChange("assetName", e.target.value)}
              placeholder="Nombre del activo"
              className="w-100"
            />
          </div>

          {/* Filtro: Categoría */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Categoría</label>
            <Dropdown
              value={filters.assetCategory}
              options={assetCategories}
              onChange={(e) => handleFilterChange("assetCategory", e.value)}
              optionLabel="label"
              placeholder="Seleccione categoría"
              className="w-100"
              appendTo={"self"}
            />
          </div>

          {/* Filtro: Código Interno */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Código Interno</label>
            <InputText
              value={filters.internalCode}
              onChange={(e) =>
                handleFilterChange("internalCode", e.target.value)
              }
              placeholder="Código del activo"
              className="w-100"
            />
          </div>

          {/* Filtro: Estado */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Estado</label>
            <Dropdown
              value={filters.status}
              options={statusOptions}
              onChange={(e) => handleFilterChange("status", e.value)}
              optionLabel="label"
              placeholder="Seleccione estado"
              className="w-100"
            />
          </div>

          {/* Filtro: Rango de fechas */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Fecha de Adquisición</label>
            <Calendar
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.value)}
              selectionMode="range"
              readOnlyInput
              dateFormat="dd/mm/yy"
              placeholder="Seleccione rango"
              className="w-100"
              showIcon
            />
          </div>

          {/* Botones de acción */}
          <div className="col-12 d-flex justify-content-end gap-2">
            <Button
              label="Limpiar"
              icon="pi pi-trash"
              className="btn btn-phoenix-secondary"
              onClick={clearFilters}
            />
            <Button
              label="Aplicar Filtros"
              icon="pi pi-filter"
              className="btn btn-primary"
              onClick={applyFilters}
              loading={loading}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de resultados */}
      <Card title="Activos Fijos" style={styles.card}>
        <DataTable
          value={filteredAssets}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron activos"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="internalCode"
            header="Código"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="assetName"
            header="Nombre/Descripción"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="assetCategory"
            header="Categoría"
            sortable
            body={(rowData) => getCategoryLabel(rowData.assetCategory)}
            style={styles.tableCell}
          />
          <Column
            field="brand"
            header="Marca"
            sortable
            style={styles.tableCell}
          />
          <Column field="model" header="Modelo" style={styles.tableCell} />
          <Column
            field="acquisitionDate"
            header="Fecha Adquisición"
            sortable
            body={(rowData) => formatDate(rowData.acquisitionDate)}
            style={styles.tableCell}
          />
          <Column
            field="purchaseValue"
            header="Valor Compra"
            sortable
            body={(rowData) => formatCurrency(rowData.purchaseValue)}
            style={styles.tableCell}
          />
          <Column
            field="currentValue"
            header="Valor Actual"
            sortable
            body={(rowData) => formatCurrency(rowData.currentValue)}
            style={styles.tableCell}
          />
          <Column
            field="status"
            header="Estado"
            sortable
            body={(rowData) => (
              <Tag
                value={getStatusLabel(rowData.status)}
                severity={getStatusSeverity(rowData.status)}
              />
            )}
            style={styles.tableCell}
          />
          <Column
            header="Depreciación"
            body={(rowData) => (
              <div className="flex flex-column gap-1">
                <span>
                  {calculateDepreciation(
                    rowData.purchaseValue,
                    rowData.currentValue
                  ).toFixed(2)}
                  %
                </span>
                <ProgressBar
                  value={calculateDepreciation(
                    rowData.purchaseValue,
                    rowData.currentValue
                  )}
                  showValue={false}
                  style={styles.depreciationBar}
                  className={classNames({
                    "p-progressbar-determinate": true,
                    "p-progressbar-danger":
                      calculateDepreciation(
                        rowData.purchaseValue,
                        rowData.currentValue
                      ) > 50,
                    "p-progressbar-warning":
                      calculateDepreciation(
                        rowData.purchaseValue,
                        rowData.currentValue
                      ) > 30 &&
                      calculateDepreciation(
                        rowData.purchaseValue,
                        rowData.currentValue
                      ) <= 50,
                    "p-progressbar-success":
                      calculateDepreciation(
                        rowData.purchaseValue,
                        rowData.currentValue
                      ) <= 30,
                  })}
                />
              </div>
            )}
            style={styles.tableCell}
          />
          <Column
            header="Acciones"
            body={actionBodyTemplate}
            style={{ ...styles.tableCell, width: "150px" }}
          />
        </DataTable>
      </Card>

      {/* Modal para crear/editar activos */}
      <FixedAssetsModal
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedAsset(null);
        }}
        onSave={(assetData) => {
          setFilteredAssets([...assets]);
          setModalVisible(false);
          setSelectedAsset(null);
        }}
      />
    </div>
  );
};

export default FixedAssetsTable;
