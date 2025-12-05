import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { accountingAccountsService } from "../../../services/api/index.js";
export const AccountingVouchers = () => {
  // Estado para los datos
  const [vouchers, setVouchers] = useState([]);
  const [dates, setDates] = useState(null);

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    fechaInicio: null,
    fechaFin: null,
    numeroComprobante: "",
    codigoContable: ""
  });

  // Estado para el modal
  const [tipoComprobante, setTipoComprobante] = useState(null);

  // Opciones para el dropdown de nuevo comprobante
  const opcionesNuevoComprobante = [{
    label: "Recibo de Caja",
    value: "recibo_caja",
    icon: "pi-money-bill"
  }, {
    label: "Recibo de Pago",
    value: "recibo_pago",
    icon: "pi-credit-card"
  }];
  const loadData = async () => {
    const response = await accountingAccountsService.getAccountingVouchers();
    const filteredData = applyFilters(response.data);
    setVouchers(filteredData);
  };
  const applyFilters = data => {
    let filteredData = [...data];

    // Filtro por rango de fechas
    if (filtros.fechaInicio && filtros.fechaFin) {
      filteredData = filteredData.filter(voucher => {
        const voucherDate = new Date(voucher.seat_date);
        const startDate = new Date(filtros.fechaInicio);
        const endDate = new Date(filtros.fechaFin);

        // Ajustamos las fechas para comparar solo día, mes y año
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        voucherDate.setHours(0, 0, 0, 0);
        return voucherDate >= startDate && voucherDate <= endDate;
      });
    }

    // Filtro por número de comprobante (búsqueda parcial)
    if (filtros.numeroComprobante) {
      const searchTerm = filtros.numeroComprobante.toLowerCase();
      filteredData = filteredData.filter(voucher => voucher.seat_number.toLowerCase().includes(searchTerm));
    }
    return filteredData;
  };
  const handleSearch = () => {
    loadData();
  };
  useEffect(() => {
    if (dates && Array.isArray(dates)) {
      setFiltros({
        ...filtros,
        fechaInicio: dates[0],
        fechaFin: dates[1]
      });
    }
  }, [dates]);
  useEffect(() => {
    loadData();
  }, [filtros.fechaInicio, filtros.fechaFin, filtros.numeroComprobante]);

  // Formatear fecha
  const formatDate = dateString => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Formatear moneda
  const formatCurrency = value => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const formatTypeMovement = value => {
    switch (value) {
      case "credit":
        return "Cedito";
      case "debit":
        return "Debito";
    }
  };

  // Template para el encabezado del acordeón
  const voucherTemplate = voucher => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-between align-items-center w-full"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, voucher.seat_number), " -", /*#__PURE__*/React.createElement("span", {
      className: "mx-2"
    }, formatDate(voucher.seat_date)), "-", /*#__PURE__*/React.createElement("span", null, " ", voucher.description)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, "Total: ", formatCurrency(voucher.total_is))));
  };

  // Handler para selección de tipo de comprobante
  const handleSeleccionTipo = value => {
    setTipoComprobante(value);
  };

  // Template para opciones del dropdown
  const itemTemplate = option => /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: `pi ${option.icon} mr-2`
  }), /*#__PURE__*/React.createElement("span", null, option.label));
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Movimientos Contables"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Comprobante",
    icon: "pi pi-file-edit",
    className: "btn btn-primary",
    onClick: () => window.location.href = "CrearComprobantesContable"
  }), /*#__PURE__*/React.createElement(Dropdown, {
    value: tipoComprobante,
    options: opcionesNuevoComprobante,
    onChange: e => handleSeleccionTipo(e.value),
    optionLabel: "label",
    itemTemplate: itemTemplate,
    placeholder: "Seleccione tipo",
    dropdownIcon: "pi pi-chevron-down",
    appendTo: "self",
    className: "w-full md:w-14rem"
  }))), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dates,
    onChange: e => setDates(e.value),
    appendTo: document.body,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione fecha",
    className: "w-100",
    showIcon: true,
    selectionMode: "range",
    readOnlyInput: true,
    hideOnRangeSelection: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xB0 Comprobante"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroComprobante,
    onChange: e => setFiltros({
      ...filtros,
      numeroComprobante: e.target.value
    }),
    placeholder: "Buscar por n\xFAmero",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "C\xF3digo Contable"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.codigoContable,
    onChange: e => setFiltros({
      ...filtros,
      codigoContable: e.target.value
    }),
    placeholder: "Buscar por c\xF3digo",
    className: "w-100"
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Comprobantes Contables"
  }, /*#__PURE__*/React.createElement(Accordion, {
    multiple: true
  }, vouchers.map(voucher => /*#__PURE__*/React.createElement(AccordionTab, {
    key: voucher.id,
    header: voucherTemplate(voucher)
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: voucher.details,
    className: "p-datatable-gridlines custom-datatable",
    stripedRows: true,
    size: "small"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "description",
    header: "Descripcion",
    style: {
      width: "130px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "type",
    header: "Tipo",
    body: rowData => formatTypeMovement(rowData.type),
    style: {
      width: "120px"
    },
    bodyClassName: "text-right"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "amount",
    header: "Monto",
    style: {
      width: "120px"
    }
  })))))));
};