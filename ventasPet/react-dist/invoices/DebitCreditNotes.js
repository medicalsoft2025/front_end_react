import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

// Define types for your data

export const DebitCreditNotes = () => {
  // Estado para los datos de la tabla
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    numeroNota: "",
    cliente: "",
    identificacion: "",
    fechaInicio: null,
    fechaFin: null,
    tipoNota: null,
    montoMinimo: null,
    montoMaximo: null
  });

  // Opciones para los selects
  const tiposNota = [{
    label: "Débito",
    value: "Débito"
  }, {
    label: "Crédito",
    value: "Crédito"
  }];

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    // Simulación de llamada a API
    setTimeout(() => {
      const datosMock = [{
        id: "1",
        numeroNota: "ND-001-0000001",
        tipoNota: "Débito",
        cliente: "Distribuidora Pérez S.A.",
        identificacion: "131246375",
        fechaNota: new Date(2023, 0, 15),
        valorNota: 12500,
        motivo: "Ajuste por diferencia de precio"
      }, {
        id: "2",
        numeroNota: "NC-001-0000001",
        tipoNota: "Crédito",
        cliente: "Supermercado Nacional",
        identificacion: "101584796",
        fechaNota: new Date(2023, 0, 16),
        valorNota: 8750,
        motivo: "Devolución de mercancía"
      }
      // ... rest of your mock data
      ];
      setNotas(datosMock);
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
      numeroNota: "",
      cliente: "",
      identificacion: "",
      fechaInicio: null,
      fechaFin: null,
      tipoNota: null,
      montoMinimo: null,
      montoMaximo: null
    });
  };

  // Rest of your component remains the same...
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

  // Estilo para los tags de tipo de nota
  const getTipoNotaSeverity = tipo => {
    switch (tipo) {
      case "Débito":
        return "danger";
      case "Crédito":
        return "success";
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
    label: "Nueva Nota D\xE9bito/Cr\xE9dito",
    icon: "pi pi-file-edit",
    className: "btn btn-primary",
    onClick: () => window.location.href = "NotasDebitoCredito"
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "N\xFAmero de nota"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroNota,
    onChange: e => handleFilterChange("numeroNota", e.target.value),
    placeholder: "ND-001-0000001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Cliente"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.cliente,
    onChange: e => handleFilterChange("cliente", e.target.value),
    placeholder: "Nombre del cliente",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Identificaci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.identificacion,
    onChange: e => handleFilterChange("identificacion", e.target.value),
    placeholder: "RNC/C\xE9dula del cliente",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Tipo de nota"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.tipoNota,
    options: tiposNota,
    onChange: e => handleFilterChange("tipoNota", e.value),
    optionLabel: "label",
    placeholder: "Seleccione tipo",
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
    title: "Notas de D\xE9bito/Cr\xE9dito",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: notas,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron notas",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "numeroNota",
    header: "No. Nota",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tipoNota",
    header: "Tipo nota",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: rowData.tipoNota,
      severity: getTipoNotaSeverity(rowData.tipoNota)
    }),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "cliente",
    header: "Cliente",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "identificacion",
    header: "Identificaci\xF3n",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fechaNota",
    header: "Fecha nota",
    sortable: true,
    body: rowData => formatDate(rowData.fechaNota),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "valorNota",
    header: "Valor nota",
    sortable: true,
    body: rowData => formatCurrency(rowData.valorNota),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "motivo",
    header: "Motivo",
    sortable: true,
    style: styles.tableCell
  }))));
};