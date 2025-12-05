import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";

// Import your services
import { appointmentService } from "../../services/api/index.js";
import { appointmentStatesByKeyTwo } from "../../services/commons.js";
export const Appointments = () => {
  // Set default date range (last 5 days)
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);

  // State for report data
  const [reportData, setReportData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments-tab"); // Tab preseleccionado
  const [globalFilter, setGlobalFilter] = useState("");
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load initial data
        await loadData();
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    initializeData();
  }, []);
  const createTreeData = data => {
    const grouped = {};

    // Agrupar por estado
    data.forEach(appointment => {
      if (!grouped[appointment.state]) {
        grouped[appointment.state] = {
          key: appointment.state,
          data: {
            state: appointment.state,
            patientName: "Total: " + data.filter(a => a.state === appointment.state).length,
            documentNumber: "",
            city: "",
            productId: ""
          },
          children: []
        };
      }
      grouped[appointment.state].children.push({
        key: `${appointment.state}-${appointment.id}`,
        data: {
          state: '',
          patientName: `${appointment.patient.first_name} ${appointment.patient.last_name}`,
          documentNumber: appointment.patient.document_number,
          city: appointment.patient.city_id,
          productId: appointment.product_id
        }
      });
    });
    return Object.values(grouped);
  };
  const loadData = async (filterParams = {}) => {
    try {
      const data = await appointmentService.appointmentsWithFilters(filterParams);
      const processedData = handlerDataAppointments(data);
      setReportData(processedData);
      const treeNodes = createTreeData(processedData);
      setTreeData(treeNodes);
    } catch (error) {
      console.error("Error loading report data:", error);
    }
  };
  const handleFilter = async () => {
    try {
      const filterParams = {
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        start_date: dateRange[0] ? formatDate(dateRange[0]) : ""
      };
      console.log("filters:", filterParams);
      await loadData(filterParams);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };
  const formatDate = date => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  function handlerDataAppointments(data) {
    const dataMapped = data.map(item => {
      const state = appointmentStatesByKeyTwo[item.appointment_state.name];
      return {
        ...item,
        state: (typeof state === "object" ? state.CONSULTATION : state) ?? 'Sin estado'
      };
    });
    console.log("dataMapped", dataMapped);
    return dataMapped;
  }
  const header = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    type: "search",
    onInput: e => setGlobalFilter(e.currentTarget.value),
    placeholder: "Buscar..."
  })));
  return /*#__PURE__*/React.createElement("main", {
    className: "main",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pb-9"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-4"
  }, "Citas"), /*#__PURE__*/React.createElement("div", {
    className: "row g-3 justify-content-between align-items-start mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card border border-light mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "fechasProcedimiento"
  }, "Fecha inicio - fin Procedimiento"), /*#__PURE__*/React.createElement(Calendar, {
    id: "fechasProcedimiento",
    value: dateRange,
    onChange: e => setDateRange(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "dd/mm/yyyy - dd/mm/yyyy",
    className: "w-100",
    appendTo: document.body
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end m-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Filtrar",
    icon: "pi pi-filter",
    onClick: handleFilter,
    className: "p-button-primary"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "row gy-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-xxl-12"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nav nav-underline fs-9",
    id: "myTab",
    role: "tablist"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "appointments-tab" ? "active" : ""}`,
    id: "appointments-tab",
    onClick: () => setActiveTab("appointments-tab"),
    role: "tab"
  }, "Citas por Estado"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-xxl-12 tab-content mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "appointments-tab" ? "show active" : ""}`,
    id: "tab-appointments",
    role: "tabpanel",
    "aria-labelledby": "appointments-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, treeData.length > 0 ? /*#__PURE__*/React.createElement(TreeTable, {
    value: treeData,
    globalFilter: globalFilter,
    header: header,
    emptyMessage: "No se encontraron citas",
    className: "p-treetable-striped"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "state",
    header: "Estado",
    expander: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "patientName",
    header: "Paciente"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "documentNumber",
    header: "Identificaci\xF3n"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "city",
    header: "Ciudad"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "productId",
    header: "Producto"
  })) : /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar")))))))));
};