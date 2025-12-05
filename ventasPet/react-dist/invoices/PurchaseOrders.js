import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
export const PurchaseOrders = () => {
  // Estado para los datos de la tabla
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    numeroOrden: "",
    numeroComprobante: "",
    producto: "",
    identificacion: "",
    sucursal: null,
    fechaInicio: null,
    fechaFin: null,
    valorMinimo: null,
    valorMaximo: null
  });

  // Opciones para los selects
  const sucursales = [{
    label: "Sucursal Principal",
    value: "Principal"
  }, {
    label: "Sucursal Norte",
    value: "Norte"
  }, {
    label: "Sucursal Sur",
    value: "Sur"
  }, {
    label: "Sucursal Este",
    value: "Este"
  }, {
    label: "Sucursal Oeste",
    value: "Oeste"
  }];
  const estadosOrden = [{
    label: "Pendiente",
    value: "Pendiente"
  }, {
    label: "Aprobada",
    value: "Aprobada"
  }, {
    label: "Rechazada",
    value: "Rechazada"
  }, {
    label: "En proceso",
    value: "En proceso"
  }, {
    label: "Completada",
    value: "Completada"
  }];

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    // Simulación de llamada a API
    setTimeout(() => {
      const datosMock = [{
        id: "1",
        numeroOrden: "OC-001-0000001",
        numeroComprobante: "CP-001-0000001",
        producto: "Laptop HP EliteBook",
        identificacion: "131246375",
        proveedor: "TecnoSuministros S.A.",
        sucursal: "Principal",
        fechaOrden: new Date(2023, 0, 15),
        valorTotal: 125000,
        estado: "Aprobada"
      }, {
        id: "2",
        numeroOrden: "OC-001-0000002",
        numeroComprobante: "CP-001-0000002",
        producto: "Impresora LaserJet",
        identificacion: "101584796",
        proveedor: "Equipos Office RD",
        sucursal: "Norte",
        fechaOrden: new Date(2023, 0, 16),
        valorTotal: 87500,
        estado: "Completada"
      }, {
        id: "3",
        numeroOrden: "OC-001-0000003",
        numeroComprobante: "CP-001-0000003",
        producto: "Router WiFi 6",
        identificacion: "130456892",
        proveedor: "Tecnología Avanzada",
        sucursal: "Sur",
        fechaOrden: new Date(2023, 0, 18),
        valorTotal: 45600,
        estado: "En proceso"
      }, {
        id: "4",
        numeroOrden: "OC-001-0000004",
        numeroComprobante: "CP-001-0000004",
        producto: "Monitor 24\" Full HD",
        identificacion: "101234567",
        proveedor: "Distribuidora Tecno",
        sucursal: "Este",
        fechaOrden: new Date(2023, 1, 2),
        valorTotal: 210000,
        estado: "Pendiente"
      }, {
        id: "5",
        numeroOrden: "OC-001-0000005",
        numeroComprobante: "CP-001-0000005",
        producto: "Teclado mecánico",
        identificacion: "131987654",
        proveedor: "Periféricos Premium",
        sucursal: "Oeste",
        fechaOrden: new Date(2023, 1, 5),
        valorTotal: 6890,
        estado: "Rechazada"
      }, {
        id: "6",
        numeroOrden: "OC-001-0000006",
        numeroComprobante: "CP-001-0000006",
        producto: "Mouse inalámbrico",
        identificacion: "101112131",
        proveedor: "Accesorios Digitales",
        sucursal: "Principal",
        fechaOrden: new Date(2023, 1, 10),
        valorTotal: 3150,
        estado: "Completada"
      }, {
        id: "7",
        numeroOrden: "OC-001-0000007",
        numeroComprobante: "CP-001-0000007",
        producto: "Disco Duro SSD 1TB",
        identificacion: "130987654",
        proveedor: "Almacenamiento RD",
        sucursal: "Norte",
        fechaOrden: new Date(2023, 1, 15),
        valorTotal: 78500,
        estado: "Aprobada"
      }];
      setOrdenes(datosMock);
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

  // Función para limpiar filtros  const limpiarFiltros = () => {
  const limpiarFiltros = () => {
    setFiltros({
      numeroOrden: "",
      numeroComprobante: "",
      producto: "",
      identificacion: "",
      sucursal: null,
      fechaInicio: null,
      fechaFin: null,
      valorMinimo: null,
      valorMaximo: null
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
      case "Aprobada":
      case "Completada":
        return "success";
      case "Pendiente":
        return "warning";
      case "En proceso":
        return "info";
      case "Rechazada":
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
    label: "Nueva Orden de Compra",
    icon: "pi pi-file-edit",
    className: "btn btn-primary",
    onClick: () => window.location.href = "OrdenesCompra"
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "No. Orden"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroOrden,
    onChange: e => handleFilterChange("numeroOrden", e.target.value),
    placeholder: "OC-001-0000001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "No. Comprobante"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroComprobante,
    onChange: e => handleFilterChange("numeroComprobante", e.target.value),
    placeholder: "CP-001-0000001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Producto"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.producto,
    onChange: e => handleFilterChange("producto", e.target.value),
    placeholder: "Nombre del producto",
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
  }, "Sucursal"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.sucursal,
    options: sucursales,
    onChange: e => handleFilterChange("sucursal", e.value),
    optionLabel: "label",
    placeholder: "Seleccione sucursal",
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
    title: "\xD3rdenes de Compra",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: ordenes,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron \xF3rdenes",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "numeroOrden",
    header: "No. Orden",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "numeroComprobante",
    header: "No. Comprobante",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "producto",
    header: "Producto",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "identificacion",
    header: "Identificaci\xF3n",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "sucursal",
    header: "Sucursal",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "proveedor",
    header: "Proveedor",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fechaOrden",
    header: "Fecha",
    sortable: true,
    body: rowData => formatDate(rowData.fechaOrden),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "valorTotal",
    header: "Valor Total",
    sortable: true,
    body: rowData => formatCurrency(rowData.valorTotal),
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