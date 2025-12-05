import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";

// Definición de tipos

export const BillingEntity = () => {
  // Estado para los datos de la tabla
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para el modal de pago
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [montoPago, setMontoPago] = useState(0);

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    facturador: "",
    numeroFactura: "",
    entidad: null,
    fechaInicio: null,
    fechaFin: null,
    montoMinimo: null,
    montoMaximo: null
  });

  // Opciones para los selects
  const entidades = [{
    label: "ARS Palic",
    value: "ARS Palic"
  }, {
    label: "ARS Humano",
    value: "ARS Humano"
  }, {
    label: "ARS Universal",
    value: "ARS Universal"
  }, {
    label: "ARS Monumental",
    value: "ARS Monumental"
  }, {
    label: "ARS Renacer",
    value: "ARS Renacer"
  }];
  const estadosFactura = [{
    label: "Pendiente",
    value: "Pendiente"
  }, {
    label: "Pagada",
    value: "Pagada"
  }, {
    label: "Rechazada",
    value: "Rechazada"
  }, {
    label: "En proceso",
    value: "En proceso"
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
        facturador: "Dr. Juan Pérez",
        numeroFactura: "B0100010001",
        montoPagado: 12500,
        montoTotal: 12500,
        fechaElaboracion: new Date(2023, 4, 1),
        fechaVencimiento: new Date(2023, 5, 15),
        estado: "Pagada",
        entidad: "ARS Palic"
      }, {
        id: "2",
        facturador: "Dra. Ana Martínez",
        numeroFactura: "B0100010002",
        montoPagado: 5000,
        montoTotal: 8500,
        fechaElaboracion: new Date(2023, 4, 5),
        fechaVencimiento: new Date(2023, 5, 20),
        estado: "Pendiente",
        entidad: "ARS Humano"
      }, {
        id: "3",
        facturador: "Dr. Luis García",
        numeroFactura: "B0100010003",
        montoPagado: 15600,
        montoTotal: 15600,
        fechaElaboracion: new Date(2023, 4, 10),
        fechaVencimiento: new Date(2023, 5, 25),
        estado: "Pagada",
        entidad: "ARS Universal"
      }, {
        id: "4",
        facturador: "Dra. Sofía Ramírez",
        numeroFactura: "B0100010004",
        montoPagado: 0,
        montoTotal: 9200,
        fechaElaboracion: new Date(2023, 4, 15),
        fechaVencimiento: new Date(2023, 6, 5),
        estado: "Rechazada",
        entidad: "ARS Monumental"
      }, {
        id: "5",
        facturador: "Dr. Miguel Díaz",
        numeroFactura: "B0100010005",
        montoPagado: 7000,
        montoTotal: 13400,
        fechaElaboracion: new Date(2023, 4, 20),
        fechaVencimiento: new Date(2023, 6, 10),
        estado: "En proceso",
        entidad: "ARS Renacer"
      }, {
        id: "6",
        facturador: "Dra. Carmen Fernández",
        numeroFactura: "B0100010006",
        montoPagado: 0,
        montoTotal: 7800,
        fechaElaboracion: new Date(2023, 4, 25),
        fechaVencimiento: new Date(2023, 6, 15),
        estado: "Vencida",
        entidad: "ARS Palic"
      }, {
        id: "7",
        facturador: "Dr. Roberto Vargas",
        numeroFactura: "B0100010007",
        montoPagado: 16500,
        montoTotal: 16500,
        fechaElaboracion: new Date(2023, 4, 30),
        fechaVencimiento: new Date(2023, 6, 20),
        estado: "Pagada",
        entidad: "ARS Humano"
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
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      facturador: "",
      numeroFactura: "",
      entidad: null,
      fechaInicio: null,
      fechaFin: null,
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
      case "En proceso":
        return "info";
      case "Rechazada":
      case "Vencida":
        return "danger";
      default:
        return null;
    }
  };

  // Acciones para la tabla
  const accionesBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'row',
        gap: '0.5rem',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-sm p-button-success",
      tooltip: "Agregar pago",
      tooltipOptions: {
        position: 'top'
      },
      onClick: () => abrirModalPago(rowData),
      disabled: rowData.estado === "Pagada" || rowData.estado === "Rechazada"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-cart-shopping"
    })), /*#__PURE__*/React.createElement(Button, {
      className: "p-button-sm p-button-help",
      tooltip: "Generar recibo de caja",
      tooltipOptions: {
        position: 'top'
      },
      onClick: () => generarReciboCaja(rowData),
      disabled: rowData.montoPagado <= 0
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-receipt"
    })));
  };
  const abrirModalPago = factura => {
    setFacturaSeleccionada(factura);
    setMontoPago(factura.montoTotal - factura.montoPagado);
    setShowPagoModal(true);
  };
  const cerrarModalPago = () => {
    setShowPagoModal(false);
    setFacturaSeleccionada(null);
    setMontoPago(0);
  };
  const handlePagarFactura = () => {
    if (!facturaSeleccionada) return;
    setLoading(true);
    // Simular llamada a API para registrar el pago
    setTimeout(() => {
      const facturasActualizadas = facturas.map(f => {
        if (f.id === facturaSeleccionada.id) {
          const nuevoMontoPagado = f.montoPagado + montoPago;
          const nuevoEstado = nuevoMontoPagado >= f.montoTotal ? "Pagada" : "En proceso";
          return {
            ...f,
            montoPagado: nuevoMontoPagado,
            estado: nuevoEstado
          };
        }
        return f;
      });
      setFacturas(facturasActualizadas);
      setLoading(false);
      cerrarModalPago();
    }, 1000);
  };
  const generarReciboCaja = factura => {
    // Simular generación de recibo
    alert(`Generando recibo de caja para factura ${factura.numeroFactura}\nMonto: ${formatCurrency(factura.montoPagado)}`);
  };

  // Footer del modal de pago
  const pagoModalFooter = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    onClick: cerrarModalPago,
    className: "p-button-text"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Registrar Pago",
    icon: "pi pi-check",
    onClick: handlePagarFactura,
    autoFocus: true
  }));

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
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Facturador"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.facturador,
    onChange: e => handleFilterChange("facturador", e.target.value),
    placeholder: "Nombre del facturador",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "N\xFAmero Factura"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroFactura,
    onChange: e => handleFilterChange("numeroFactura", e.target.value),
    placeholder: "B0100010001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Entidad"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.entidad,
    options: entidades,
    onChange: e => handleFilterChange("entidad", e.value),
    optionLabel: "label",
    placeholder: "Seleccione entidad",
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
    title: "Facturaci\xF3n por Entidad",
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
    field: "facturador",
    header: "Facturador",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "numeroFactura",
    header: "N\xB0 Factura",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "entidad",
    header: "Entidad",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "montoTotal",
    header: "Monto Total",
    sortable: true,
    body: rowData => formatCurrency(rowData.montoTotal),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "montoPagado",
    header: "Monto Pagado",
    sortable: true,
    body: rowData => formatCurrency(rowData.montoPagado),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fechaElaboracion",
    header: "Fecha Elaboraci\xF3n",
    sortable: true,
    body: rowData => formatDate(rowData.fechaElaboracion),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fechaVencimiento",
    header: "Fecha Vencimiento",
    sortable: true,
    body: rowData => formatDate(rowData.fechaVencimiento),
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
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: accionesBodyTemplate,
    style: {
      ...styles.tableCell,
      width: '120px'
    }
  }))), /*#__PURE__*/React.createElement(Dialog, {
    visible: showPagoModal,
    style: {
      width: '450px'
    },
    header: `Registrar Pago - Factura ${facturaSeleccionada?.numeroFactura}`,
    modal: true,
    footer: pagoModalFooter,
    onHide: cerrarModalPago
  }, facturaSeleccionada && /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block mb-2"
  }, "Monto Total:"), /*#__PURE__*/React.createElement(InputText, {
    value: formatCurrency(facturaSeleccionada.montoTotal),
    readOnly: true,
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block mb-2"
  }, "Monto Pagado:"), /*#__PURE__*/React.createElement(InputText, {
    value: formatCurrency(facturaSeleccionada.montoPagado),
    readOnly: true,
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block mb-2"
  }, "Saldo Pendiente:"), /*#__PURE__*/React.createElement(InputText, {
    value: formatCurrency(facturaSeleccionada.montoTotal - facturaSeleccionada.montoPagado),
    readOnly: true,
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block mb-2"
  }, "Monto a Pagar:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: montoPago,
    onValueChange: e => setMontoPago(e.value || 0),
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    min: 0,
    max: facturaSeleccionada.montoTotal - facturaSeleccionada.montoPagado,
    className: "w-full"
  })))));
};