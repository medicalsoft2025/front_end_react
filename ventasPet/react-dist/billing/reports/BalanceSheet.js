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

export const BalanceSheet = () => {
  // Estado para los datos de la tabla
  const [cuentasContables, setCuentasContables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalGeneral, setTotalGeneral] = useState({
    saldoInicial: 0,
    debito: 0,
    credito: 0,
    saldoFinal: 0
  });

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    cuentaContable: '',
    incluyeDiferenciaFiscal: null,
    anioFiscal: null,
    mesInicial: null,
    mesFinal: null,
    incluyeCierre: false
  });

  // Opciones para los selects
  const opcionesSiNo = [{
    label: 'Sí',
    value: 'si'
  }, {
    label: 'No',
    value: 'no'
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
        nivel: '1',
        transaccional: false,
        codigo: '1101',
        nombre: 'Caja General',
        saldoInicial: 1000000,
        movimientoDebito: 500000,
        movimientoCredito: 200000,
        saldoFinal: 1300000,
        diferenciaFiscal: false
      }, {
        nivel: '2',
        transaccional: true,
        codigo: '110101',
        nombre: 'Caja Principal',
        saldoInicial: 800000,
        movimientoDebito: 300000,
        movimientoCredito: 100000,
        saldoFinal: 1000000,
        diferenciaFiscal: false
      }, {
        nivel: '1',
        transaccional: false,
        codigo: '1102',
        nombre: 'Cuentas Bancarias',
        saldoInicial: 5000000,
        movimientoDebito: 2000000,
        movimientoCredito: 1500000,
        saldoFinal: 5500000,
        diferenciaFiscal: true
      }, {
        nivel: '2',
        transaccional: true,
        codigo: '110201',
        nombre: 'Banco Popular',
        saldoInicial: 3000000,
        movimientoDebito: 1000000,
        movimientoCredito: 500000,
        saldoFinal: 3500000,
        diferenciaFiscal: true
      }, {
        nivel: '1',
        transaccional: false,
        codigo: '1201',
        nombre: 'Cuentas por Cobrar',
        saldoInicial: 3000000,
        movimientoDebito: 1000000,
        movimientoCredito: 500000,
        saldoFinal: 3500000,
        diferenciaFiscal: false
      }];
      setCuentasContables(datosMock);
      calcularTotales(datosMock);
      setLoading(false);
    }, 1000);
  }, []);

  // Calcular totales generales
  const calcularTotales = datos => {
    const totales = {
      saldoInicial: 0,
      debito: 0,
      credito: 0,
      saldoFinal: 0
    };
    datos.forEach(item => {
      totales.saldoInicial += item.saldoInicial;
      totales.debito += item.movimientoDebito;
      totales.credito += item.movimientoCredito;
      totales.saldoFinal += item.saldoFinal;
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
    // Aquí iría la lógica para filtrar los datos, normalmente una llamada a API
    setTimeout(() => {
      // Simulación de filtrado
      const datosFiltrados = cuentasContables.filter(cuenta => {
        // Filtro por cuenta contable
        if (filtros.cuentaContable && !cuenta.codigo.includes(filtros.cuentaContable) && !cuenta.nombre.toLowerCase().includes(filtros.cuentaContable.toLowerCase())) {
          return false;
        }

        // Filtro por diferencia fiscal
        if (filtros.incluyeDiferenciaFiscal === 'si' && !cuenta.diferenciaFiscal) {
          return false;
        }
        if (filtros.incluyeDiferenciaFiscal === 'no' && cuenta.diferenciaFiscal) {
          return false;
        }
        return true;
      });
      setCuentasContables(datosFiltrados);
      calcularTotales(datosFiltrados);
      setLoading(false);
    }, 500);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      cuentaContable: '',
      incluyeDiferenciaFiscal: null,
      anioFiscal: null,
      mesInicial: null,
      mesFinal: null,
      incluyeCierre: false
    });
    // Aquí podrías también resetear los datos a su estado original
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
  }, /*#__PURE__*/React.createElement("strong", null, "Saldo Inicial:"), " ", formatCurrency(totalGeneral.saldoInicial)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Total D\xE9bito:"), " ", formatCurrency(totalGeneral.debito)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Cr\xE9dito:"), " ", formatCurrency(totalGeneral.credito)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Saldo Final:"), " ", formatCurrency(totalGeneral.saldoFinal)));
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
  }, "Cuenta Contable"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.cuentaContable,
    onChange: e => handleFilterChange('cuentaContable', e.target.value),
    placeholder: "Buscar por c\xF3digo o nombre...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Incluye diferencia fiscal"), /*#__PURE__*/React.createElement(SelectButton, {
    value: filtros.incluyeDiferenciaFiscal,
    options: opcionesSiNo,
    onChange: e => handleFilterChange('incluyeDiferenciaFiscal', e.value),
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
    inputId: "incluyeCierre",
    checked: filtros.incluyeCierre,
    onChange: e => handleFilterChange('incluyeCierre', e.checked)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "incluyeCierre",
    className: "ml-2"
  }, "Incluir cierre contable"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Generar Reporte",
    className: "btn btn-primary",
    icon: "pi pi-filter",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Resultados del Reporte"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: cuentasContables,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    emptyMessage: "No se encontraron resultados",
    className: "p-datatable-striped p-datatable-gridlines",
    responsiveLayout: "scroll",
    footer: footerTotales
  }, /*#__PURE__*/React.createElement(Column, {
    field: "nivel",
    header: "Nivel",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "transaccional",
    header: "Transaccional",
    body: rowData => rowData.transaccional ? 'Sí' : 'No',
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "codigo",
    header: "C\xF3digo",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldoInicial",
    header: "Saldo Inicial",
    body: rowData => formatCurrency(rowData.saldoInicial),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "movimientoDebito",
    header: "D\xE9bito",
    body: rowData => formatCurrency(rowData.movimientoDebito),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "movimientoCredito",
    header: "Cr\xE9dito",
    body: rowData => formatCurrency(rowData.movimientoCredito),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldoFinal",
    header: "Saldo Final",
    body: rowData => formatCurrency(rowData.saldoFinal),
    sortable: true
  }))));
};