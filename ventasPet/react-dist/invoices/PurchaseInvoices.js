import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
export const PurchaseInvoices = () => {
  // Estado para los datos de la tabla
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    numeroFactura: "",
    proveedor: "",
    identificacion: "",
    fechaInicio: null,
    fechaFin: null,
    tipoFactura: null,
    estado: null,
    montoMinimo: null,
    montoMaximo: null
  });

  // Opciones para los selects
  const tiposFactura = [{
    label: "Contado",
    value: "Contado"
  }, {
    label: "Crédito",
    value: "Crédito"
  }];
  const estadosFactura = [{
    label: "Pendiente",
    value: "Pendiente"
  }, {
    label: "Pagada",
    value: "Pagada"
  }, {
    label: "Anulada",
    value: "Anulada"
  }, {
    label: "Vencida",
    value: "Vencida"
  }];

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    // Simulación de llamada a API
    setTimeout(() => {
      const datosMock = [{
        id: "1",
        numeroFactura: "FAC-001-0000001",
        fecha: new Date(2023, 0, 15),
        proveedor: "Distribuidora Comercial S.A.",
        identificacion: "131246375-1",
        monto: 125000,
        tipoFactura: "Crédito",
        estado: "Pagada",
        formaPago: "Transferencia"
      }, {
        id: "2",
        numeroFactura: "FAC-001-0000002",
        fecha: new Date(2023, 0, 16),
        proveedor: "Suministros Industriales Nacionales",
        identificacion: "101584796-2",
        monto: 87500,
        tipoFactura: "Contado",
        estado: "Pagada"
      }, {
        id: "3",
        numeroFactura: "FAC-001-0000003",
        fecha: new Date(2023, 0, 18),
        proveedor: "Insumos Médicos Caribe",
        identificacion: "130456892-3",
        monto: 45600,
        tipoFactura: "Crédito",
        estado: "Pendiente",
        formaPago: "30 días"
      }, {
        id: "4",
        numeroFactura: "FAC-001-0000004",
        fecha: new Date(2023, 1, 2),
        proveedor: "Materiales de Construcción RD",
        identificacion: "101234567-4",
        monto: 210000,
        tipoFactura: "Crédito",
        estado: "Vencida"
      }, {
        id: "5",
        numeroFactura: "FAC-001-0000005",
        fecha: new Date(2023, 1, 5),
        proveedor: "Equipos Tecnológicos Modernos",
        identificacion: "131987654-5",
        monto: 68900,
        tipoFactura: "Contado",
        estado: "Pagada"
      }, {
        id: "6",
        numeroFactura: "FAC-001-0000006",
        fecha: new Date(2023, 1, 10),
        proveedor: "Productos Agrícolas del Valle",
        identificacion: "101112131-6",
        monto: 315000,
        tipoFactura: "Crédito",
        estado: "Pagada"
      }, {
        id: "7",
        numeroFactura: "FAC-001-0000007",
        fecha: new Date(2023, 1, 15),
        proveedor: "Insumos para Restaurantes S.A.",
        identificacion: "130987654-7",
        monto: 78500,
        tipoFactura: "Crédito",
        estado: "Anulada"
      }];
      setFacturas(datosMock);
      setLoading(false);
    }, 1000);
  }, []);

  // Manejadores de cambio de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para aplicar filtros
  const aplicarFiltros = () => {
    setLoading(true);
    // Aquí iría la lógica para filtrar los datos, normalmente una llamada a API
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      numeroFactura: "",
      proveedor: "",
      identificacion: "",
      fechaInicio: null,
      fechaFin: null,
      tipoFactura: null,
      estado: null,
      montoMinimo: null,
      montoMaximo: null
    });
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = value => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Formatear fecha
  const formatDate = value => {
    return value.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Estilo para los tags de estado
  const getEstadoSeverity = estado => {
    switch (estado) {
      case "Pagada":
        return "success";
      case "Pendiente":
        return "warning";
      case "Anulada":
        return "danger";
      case "Vencida":
        return "danger";
      default:
        return null;
    }
  };

  // Estilos integrados
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
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: "100%",
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '10px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Facturaci\xF3n Compra",
    icon: "pi pi-file-edit",
    className: "btn btn-primary",
    onClick: () => window.location.href = "Facturacion_Compras"
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "N\xFAmero de factura"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroFactura,
    onChange: e => handleFilterChange("numeroFactura", e.target.value),
    placeholder: "FAC-001-0000001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Proveedor"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.proveedor,
    onChange: e => handleFilterChange("proveedor", e.target.value),
    placeholder: "Nombre del proveedor",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Identificaci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.identificacion,
    onChange: e => handleFilterChange("identificacion", e.target.value),
    placeholder: "RNC/C\xE9dula del proveedor",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Fecha desde"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaInicio,
    onChange: e => handleFilterChange("fechaInicio", e.value),
    dateFormat: "dd/mm/yy",
    placeholder: "dd/mm/aaaa",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Fecha hasta"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaFin,
    onChange: e => handleFilterChange("fechaFin", e.value),
    dateFormat: "dd/mm/yy",
    placeholder: "dd/mm/aaaa",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Tipo de factura"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.tipoFactura,
    options: tiposFactura,
    onChange: e => handleFilterChange("tipoFactura", e.value),
    optionLabel: "label",
    placeholder: "Seleccione tipo",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.estado,
    options: estadosFactura,
    onChange: e => handleFilterChange("estado", e.value),
    optionLabel: "label",
    placeholder: "Seleccione estado",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "btn btn-primary",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Facturas de Compra",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: facturas,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron facturas",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "numeroFactura",
    header: "Factura",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fecha",
    header: "Fecha",
    sortable: true,
    body: rowData => formatDate(rowData.fecha),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "identificacion",
    header: "Identificaci\xF3n",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "proveedor",
    header: "Proveedor",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "monto",
    header: "Valor",
    sortable: true,
    body: rowData => formatCurrency(rowData.monto),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tipoFactura",
    header: "Tipo",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "estado",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: rowData.estado,
      severity: getEstadoSeverity(rowData.estado)
    }),
    style: styles.tableCell
  }))));
};