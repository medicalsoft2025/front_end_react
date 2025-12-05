import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
const FiltrosNotas = ({
  filtros,
  onFiltrosChange,
  enfermeras
}) => {
  const [filtrosLocales, setFiltrosLocales] = useState(filtros);
  const handleEnfermeraChange = e => {
    setFiltrosLocales(prev => ({
      ...prev,
      enfermera: e.value
    }));
  };
  const handleFechaChange = e => {
    setFiltrosLocales(prev => ({
      ...prev,
      fecha: e.value
    }));
  };
  const handleAplicarFiltros = () => {
    onFiltrosChange(filtrosLocales);
  };
  const handleLimpiar = () => {
    const filtrosLimpiados = {
      enfermera: '',
      fecha: ''
    };
    setFiltrosLocales(filtrosLimpiados);
    onFiltrosChange(filtrosLimpiados);
  };
  const opcionesEnfermeras = [{
    label: 'Todas las enfermeras',
    value: ''
  }, ...enfermeras.map(enfermera => ({
    label: enfermera.nombre || `Enfermera ${enfermera.id}`,
    value: enfermera.id.toString()
  }))];
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "filtroEnfermera",
    className: "block text-sm font-medium mb-2"
  }, "Enfermera"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "filtroEnfermera",
    value: filtrosLocales.enfermera,
    options: opcionesEnfermeras,
    onChange: handleEnfermeraChange,
    placeholder: "Seleccione enfermera",
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "filtroFecha",
    className: "block text-sm font-medium mb-2"
  }, "Fecha"), /*#__PURE__*/React.createElement(Calendar, {
    id: "filtroFecha",
    value: filtrosLocales.fecha ? new Date(filtrosLocales.fecha) : null,
    onChange: handleFechaChange,
    dateFormat: "dd/mm/yy",
    placeholder: "dd/mm/yyyy",
    className: "w-full",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4 flex align-items-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Buscar Nota",
    icon: "pi pi-search",
    onClick: handleAplicarFiltros,
    className: "p-button-primary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-filter-slash",
    onClick: handleLimpiar,
    className: "p-button-secondary",
    outlined: true
  }))))));
};
export default FiltrosNotas;