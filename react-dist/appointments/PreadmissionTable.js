import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { usePreadmissions } from "./hooks/usePreadmission.js";
export const PreadmissionTable = () => {
  const {
    preadmissions,
    fetchPreadmissions
  } = usePreadmissions();
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

  // Estado para filtros
  const [filters, setFilters] = useState({
    weight: "",
    size: "",
    imc: "",
    glycemia: "",
    dateRange: null
  });
  const toast = useRef(null);
  useEffect(() => {
    loadData(1, rows);
  }, []);
  const loadData = async (page = 1, perPage = 10) => {
    setTableLoading(true);
    try {
      // Aquí deberías adaptar tu hook usePreadmissions para aceptar parámetros de paginación
      await fetchPreadmissions();
      // Si tu hook no soporta paginación, puedes simularla con slice
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      // setPreadmissions(paginatedData);
      setTotalRecords(preadmissions.length);
    } catch (error) {
      console.error("Error cargando preadmisiones:", error);
      showToast("error", "Error", "No se pudieron cargar las preadmisiones");
    } finally {
      setTableLoading(false);
    }
  };
  const onPageChange = event => {
    setFirst(event.first);
    setRows(event.rows);
    loadData(event.page + 1, event.rows);
  };
  const aplicarFiltros = async (page = 1, per_page = 10) => {
    setTableLoading(true);
    try {
      // Aplicar lógica de filtrado aquí
      await loadData(page, per_page);
    } catch (error) {
      console.error("Error aplicando filtros:", error);
      showToast("error", "Error", "No se pudieron aplicar los filtros");
    } finally {
      setTableLoading(false);
    }
  };
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const limpiarFiltros = () => {
    setFilters({
      weight: "",
      size: "",
      imc: "",
      glycemia: "",
      dateRange: null
    });
    loadData(1, rows);
  };
  const handleSearchChange = searchValue => {
    setGlobalFilter(searchValue);
    // Aquí puedes implementar búsqueda global si es necesario
  };
  const handleRefresh = async () => {
    limpiarFiltros();
    await loadData(1, rows);
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };

  // Mapear los datos para la tabla
  const tableItems = preadmissions.map(preadmission => ({
    id: preadmission.id || Math.random(),
    weight: preadmission.weight,
    size: preadmission.size,
    imc: preadmission.imc,
    glycemia: preadmission.glycemia,
    createdAt: preadmission.createdAt
  }));
  const columns = [{
    field: "weight",
    header: "Peso",
    sortable: true,
    body: rowData => `${rowData.weight} kg`
  }, {
    field: "size",
    header: "Tamaño",
    sortable: true,
    body: rowData => `${rowData.size} cm`
  }, {
    field: "imc",
    header: "IMC",
    sortable: true,
    body: rowData => rowData.imc
  }, {
    field: "glycemia",
    header: "Glucosa",
    sortable: true,
    body: rowData => `${rowData.glycemia} mg/dL`
  }, {
    field: "createdAt",
    header: "Fecha de creación",
    sortable: true,
    body: rowData => formatDate(rowData.createdAt)
  }];
  return /*#__PURE__*/React.createElement("main", {
    className: "main w-100 pt-3 mb-2",
    id: "top"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-30px"
    }
  }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros de B\xFAsqueda"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rango de Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: filters.dateRange,
    onChange: e => handleFilterChange("dateRange", e.value),
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
    icon: "pi pi-trash",
    className: "p-button-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: () => aplicarFiltros(),
    loading: tableLoading
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: tableLoading,
    onSearch: handleSearchChange,
    onReload: handleRefresh,
    paginator: true,
    rows: rows,
    first: first,
    onPage: onPageChange,
    totalRecords: totalRecords,
    rowsPerPageOptions: [5, 10, 25, 50],
    currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} preadmisiones",
    emptyMessage: "No se encontraron preadmisiones"
  }))));
};