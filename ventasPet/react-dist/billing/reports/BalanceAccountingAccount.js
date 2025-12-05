import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { Checkbox } from 'primereact/checkbox';

// Definición de tipos TypeScript

export const BalanceAccountingAccount = () => {
  // Estado para los datos de la tabla
  const [datosBalance, setDatosBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalGeneral, setTotalGeneral] = useState({
    saldoAnterior: 0,
    debito: 0,
    credito: 0,
    saldoActual: 0
  });

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    cuentaContable: '',
    incluyeSinMovimientos: false,
    anioFiscal: null,
    mesInicial: null,
    mesFinal: null,
    naturaleza: null
  });

  // Opciones para los selects
  const opcionesNaturaleza = [{
    label: 'Todas',
    value: null
  }, {
    label: 'Deudor',
    value: 'Deudor'
  }, {
    label: 'Acreedor',
    value: 'Acreedor'
  }];
  const meses = [{
    label: 'Enero',
    value: 1
  }, {
    label: 'Febrero',
    value: 2
  }, {
    label: 'Marzo',
    value: 3
  }, {
    label: 'Abril',
    value: 4
  }, {
    label: 'Mayo',
    value: 5
  }, {
    label: 'Junio',
    value: 6
  }, {
    label: 'Julio',
    value: 7
  }, {
    label: 'Agosto',
    value: 8
  }, {
    label: 'Septiembre',
    value: 9
  }, {
    label: 'Octubre',
    value: 10
  }, {
    label: 'Noviembre',
    value: 11
  }, {
    label: 'Diciembre',
    value: 12
  }];

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    // Simulación de llamada a API
    setTimeout(() => {
      const datosMock = [{
        codigo: '1101',
        nombre: 'Caja General',
        nivel: 1,
        saldoAnterior: 1500000,
        debito: 500000,
        credito: 200000,
        saldoActual: 1800000,
        naturaleza: 'Deudor',
        tieneMovimientos: true
      }, {
        codigo: '110101',
        nombre: 'Caja Principal',
        nivel: 2,
        saldoAnterior: 1000000,
        debito: 300000,
        credito: 100000,
        saldoActual: 1200000,
        naturaleza: 'Deudor',
        tieneMovimientos: true
      }, {
        codigo: '1102',
        nombre: 'Cuentas Bancarias',
        nivel: 1,
        saldoAnterior: 5000000,
        debito: 2000000,
        credito: 1500000,
        saldoActual: 5500000,
        naturaleza: 'Deudor',
        tieneMovimientos: true
      }, {
        codigo: '110201',
        nombre: 'Banco Popular',
        nivel: 2,
        saldoAnterior: 3000000,
        debito: 1000000,
        credito: 500000,
        saldoActual: 3500000,
        naturaleza: 'Deudor',
        tieneMovimientos: true
      }, {
        codigo: '1201',
        nombre: 'Cuentas por Cobrar',
        nivel: 1,
        saldoAnterior: 3000000,
        debito: 1000000,
        credito: 500000,
        saldoActual: 3500000,
        naturaleza: 'Deudor',
        tieneMovimientos: true
      }, {
        codigo: '2101',
        nombre: 'Proveedores Nacionales',
        nivel: 1,
        saldoAnterior: 2000000,
        debito: 500000,
        credito: 800000,
        saldoActual: 2300000,
        naturaleza: 'Acreedor',
        tieneMovimientos: true
      }, {
        codigo: '3101',
        nombre: 'Capital Social',
        nivel: 1,
        saldoAnterior: 10000000,
        debito: 0,
        credito: 0,
        saldoActual: 10000000,
        naturaleza: 'Acreedor',
        tieneMovimientos: false
      }, {
        codigo: '4101',
        nombre: 'Ventas Nacionales',
        nivel: 1,
        saldoAnterior: 0,
        debito: 0,
        credito: 15000000,
        saldoActual: 15000000,
        naturaleza: 'Acreedor',
        tieneMovimientos: true
      }, {
        codigo: '5101',
        nombre: 'Costos de Ventas',
        nivel: 1,
        saldoAnterior: 0,
        debito: 8000000,
        credito: 0,
        saldoActual: 8000000,
        naturaleza: 'Deudor',
        tieneMovimientos: true
      }];
      setDatosBalance(datosMock);
      calcularTotales(datosMock);
      setLoading(false);
    }, 1000);
  }, []);

  // Calcular totales generales
  const calcularTotales = datos => {
    const totales = {
      saldoAnterior: 0,
      debito: 0,
      credito: 0,
      saldoActual: 0
    };
    datos.forEach(item => {
      totales.saldoAnterior += item.saldoAnterior;
      totales.debito += item.debito;
      totales.credito += item.credito;
      totales.saldoActual += item.saldoActual;
    });
    setTotalGeneral(totales);
  };

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
    // Simulación de filtrado
    setTimeout(() => {
      let datosFiltrados = datosBalance.filter(cuenta => {
        // Filtro por cuenta contable
        if (filtros.cuentaContable && !cuenta.codigo.includes(filtros.cuentaContable) && !cuenta.nombre.toLowerCase().includes(filtros.cuentaContable.toLowerCase())) {
          return false;
        }

        // Filtro por naturaleza
        if (filtros.naturaleza && cuenta.naturaleza !== filtros.naturaleza) {
          return false;
        }

        // Filtro por cuentas sin movimientos
        if (!filtros.incluyeSinMovimientos && !cuenta.tieneMovimientos) {
          return false;
        }
        return true;
      });
      setDatosBalance(datosFiltrados);
      calcularTotales(datosFiltrados);
      setLoading(false);
    }, 500);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      cuentaContable: '',
      incluyeSinMovimientos: false,
      anioFiscal: null,
      mesInicial: null,
      mesFinal: null,
      naturaleza: null
    });
  };

  // Formatear número para saldos en pesos dominicanos (DOP)
  const formatCurrency = value => {
    return value.toLocaleString('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Footer para los totales generales
  const footerTotales = /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Anterior:"), " ", formatCurrency(totalGeneral.saldoAnterior)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Total D\xE9bitos:"), " ", formatCurrency(totalGeneral.debito)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Cr\xE9ditos:"), " ", formatCurrency(totalGeneral.credito)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Actual:"), " ", formatCurrency(totalGeneral.saldoActual)));

  // Estilo condicional para la naturaleza
  const naturalezaBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: `badge bg-${rowData.naturaleza === 'Deudor' ? 'info' : 'success'}`
    }, rowData.naturaleza);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      padding: '0 15px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Buscar Cuenta"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.cuentaContable,
    onChange: e => handleFilterChange('cuentaContable', e.target.value),
    placeholder: "Buscar por c\xF3digo o nombre...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Naturaleza"), /*#__PURE__*/React.createElement(SelectButton, {
    value: filtros.naturaleza,
    options: opcionesNaturaleza,
    onChange: e => handleFilterChange('naturaleza', e.value),
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "A\xF1o fiscal"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.anioFiscal,
    onChange: e => handleFilterChange('anioFiscal', e.value),
    view: "year",
    dateFormat: "yy",
    placeholder: "Seleccione a\xF1o",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Mes inicial"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.mesInicial,
    options: meses,
    onChange: e => handleFilterChange('mesInicial', e.value),
    optionLabel: "label",
    placeholder: "Seleccione mes inicial",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Mes final"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.mesFinal,
    options: meses,
    onChange: e => handleFilterChange('mesFinal', e.value),
    optionLabel: "label",
    placeholder: "Seleccione mes final",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "incluyeSinMovimientos",
    checked: filtros.incluyeSinMovimientos,
    onChange: e => handleFilterChange('incluyeSinMovimientos', e.checked)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "incluyeSinMovimientos",
    className: "ml-2"
  }, "Incluir cuentas sin movimientos"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Generar Balance",
    className: "btn btn-primary",
    icon: "pi pi-filter",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Resultados del Balance"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: datosBalance,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    emptyMessage: "No se encontraron resultados",
    className: "p-datatable-striped p-datatable-gridlines",
    responsiveLayout: "scroll",
    footer: footerTotales
  }, /*#__PURE__*/React.createElement(Column, {
    field: "codigo",
    header: "C\xF3digo",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nivel",
    header: "Nivel",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "naturaleza",
    header: "Naturaleza",
    body: naturalezaBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldoAnterior",
    header: "Saldo Anterior",
    body: rowData => formatCurrency(rowData.saldoAnterior),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "debito",
    header: "D\xE9bitos",
    body: rowData => formatCurrency(rowData.debito),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "credito",
    header: "Cr\xE9ditos",
    body: rowData => formatCurrency(rowData.credito),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldoActual",
    header: "Saldo Actual",
    body: rowData => formatCurrency(rowData.saldoActual),
    sortable: true
  }))));
};