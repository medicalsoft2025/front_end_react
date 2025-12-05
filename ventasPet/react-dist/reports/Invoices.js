import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

// Import your services (make sure these are properly exported from your API module)
import { productService, userService, patientService, billingService, entityService } from "../../services/api/index.js";
export const InvoicesReport = () => {
  // Set default date range (last 5 days)
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);
  // State for filters
  const [procedures, setProcedures] = useState([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);

  // State for report data
  const [reportData, setReportData] = useState([]);
  const [activeTab, setActiveTab] = useState("procedures-tab");
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load initial data
        await loadData();
        await loadProcedures();
        await loadSpecialists();
        await loadPatients();
        await loadEntities();
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    initializeData();
  }, []);
  const loadData = async (filterParams = {}) => {
    try {
      const data = await billingService.getBillingReport(filterParams);
      setReportData(data);
    } catch (error) {
      console.error("Error loading report data:", error);
    }
  };
  const loadProcedures = async () => {
    try {
      const response = await productService.getAllProducts();
      setProcedures(response.data.map(item => ({
        label: item.attributes.name,
        value: item.id
      })));
    } catch (error) {
      console.error("Error loading procedures:", error);
    }
  };
  const loadSpecialists = async () => {
    try {
      const response = await userService.getAllUsers();
      setSpecialists(response.map(user => ({
        label: `${user.first_name} ${user.last_name} - ${user.specialty?.name || ""}`,
        value: user.id
      })));
    } catch (error) {
      console.error("Error loading specialists:", error);
    }
  };
  const loadPatients = async () => {
    try {
      const response = await patientService.getAll();
      setPatients(response.map(patient => ({
        label: `${patient.first_name} ${patient.last_name}`,
        value: patient.id
      })));
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };
  const loadEntities = async () => {
    try {
      const response = await entityService.getAll();
      setEntities([{
        label: "Seleccione",
        value: null
      }, ...response.data.map(entity => ({
        label: entity.name,
        value: entity.id
      }))]);
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };
  const handleFilter = async () => {
    try {
      const filterParams = {
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        patient_ids: selectedPatients,
        product_ids: selectedProcedures,
        user_ids: selectedSpecialists,
        entity_id: selectedEntity
      };
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
  const generateProceduresTable = () => {
    if (!reportData || reportData.length === 0) return null;
    const users = [...new Set(reportData.map(item => item.billing_user))];
    const procedures = [...new Set(reportData.flatMap(item => item.billed_procedure?.map(p => p.product.name) || []))];
    const rows = procedures.map(proc => {
      const row = {
        procedimiento: proc
      };
      users.forEach(user => {
        row[user] = reportData.filter(item => item.billing_user === user).flatMap(item => item.billed_procedure).filter(p => p?.product.name === proc).reduce((sum, p) => sum + parseFloat(p.amount), 0);
      });
      return row;
    });

    // Add totals row
    const totalsRow = {
      procedimiento: "Total"
    };
    users.forEach(user => {
      totalsRow[user] = rows.reduce((sum, row) => sum + (row[user] || 0), 0);
    });
    rows.push(totalsRow);
    return /*#__PURE__*/React.createElement("div", {
      className: "border-top border-translucent"
    }, /*#__PURE__*/React.createElement("div", {
      id: "purchasersSellersTable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "table-responsive scrollbar mx-n1 px-1"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm fs-9 leads-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      className: "text-start"
    }, "Procedimiento"), users.map((user, index) => /*#__PURE__*/React.createElement("th", {
      key: index
    }, user)))), /*#__PURE__*/React.createElement("tbody", {
      id: "list-billing"
    }, rows.map((row, rowIndex) => /*#__PURE__*/React.createElement("tr", {
      key: rowIndex
    }, /*#__PURE__*/React.createElement("td", {
      className: "align-middle ps-3 name"
    }, row.procedimiento), users.map((user, userIndex) => /*#__PURE__*/React.createElement("td", {
      key: userIndex,
      className: "align-middle text-center"
    }, row[user] ? `$${row[user].toFixed(2)}` : "-"))))))), /*#__PURE__*/React.createElement("div", {
      className: "row align-items-center justify-content-between pe-0 fs-9"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-auto d-flex"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mb-0 d-none d-sm-block me-3 fw-semibold text-body"
    }), /*#__PURE__*/React.createElement("a", {
      className: "fw-semibold",
      href: "#!"
    }, "View all", /*#__PURE__*/React.createElement("span", {
      className: "fas fa-angle-right ms-1"
    })), /*#__PURE__*/React.createElement("a", {
      className: "fw-semibold d-none",
      href: "#!"
    }, "View Less", /*#__PURE__*/React.createElement("span", {
      className: "fas fa-angle-right ms-1"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "col-auto d-flex"
    }, /*#__PURE__*/React.createElement("button", {
      className: "page-link"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fas fa-chevron-left"
    })), /*#__PURE__*/React.createElement("ul", {
      className: "mb-0 pagination"
    }), /*#__PURE__*/React.createElement("button", {
      className: "page-link pe-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fas fa-chevron-right"
    }))))));
  };
  const generateEntitiesTable = () => {
    if (!reportData || reportData.length === 0) return null;
    const filteredData = reportData.filter(item => item.insurance);
    const entities = new Set();
    const billingUsers = new Set();
    const groupedData = {};
    const totals = {};
    filteredData.forEach(entry => {
      const {
        billing_user,
        insurance,
        billed_procedure
      } = entry;
      const insuranceName = insurance?.name;
      entities.add(insuranceName);
      billingUsers.add(billing_user);
      if (!groupedData[insuranceName]) {
        groupedData[insuranceName] = {};
      }
      if (!groupedData[insuranceName][billing_user]) {
        groupedData[insuranceName][billing_user] = 0;
      }
      if (!totals[billing_user]) {
        totals[billing_user] = 0;
      }
      billed_procedure.forEach(proc => {
        const amount = parseFloat(proc.amount);
        groupedData[insuranceName][billing_user] += amount;
        totals[billing_user] += amount;
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "border-top border-translucent"
    }, /*#__PURE__*/React.createElement("div", {
      id: "purchasersSellersTable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "table-responsive scrollbar mx-n1 px-1"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm fs-9 leads-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Entidad"), Array.from(billingUsers).map((user, index) => /*#__PURE__*/React.createElement("th", {
      key: index
    }, user)))), /*#__PURE__*/React.createElement("tbody", {
      id: "list-entities"
    }, Array.from(entities).map((entity, entityIndex) => /*#__PURE__*/React.createElement("tr", {
      key: entityIndex
    }, /*#__PURE__*/React.createElement("td", null, entity), Array.from(billingUsers).map((user, userIndex) => /*#__PURE__*/React.createElement("td", {
      key: userIndex
    }, groupedData[entity][user] ? groupedData[entity][user].toFixed(2) : "0.00")))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total")), Array.from(billingUsers).map((user, index) => /*#__PURE__*/React.createElement("td", {
      key: index
    }, /*#__PURE__*/React.createElement("strong", null, totals[user].toFixed(2)))))))), /*#__PURE__*/React.createElement("div", {
      className: "row align-items-center justify-content-between pe-0 fs-9"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-auto d-flex"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mb-0 d-none d-sm-block me-3 fw-semibold text-body"
    }), /*#__PURE__*/React.createElement("a", {
      className: "fw-semibold",
      href: "#!"
    }, "View all", /*#__PURE__*/React.createElement("span", {
      className: "fas fa-angle-right ms-1"
    })), /*#__PURE__*/React.createElement("a", {
      className: "fw-semibold d-none",
      href: "#!"
    }, "View Less", /*#__PURE__*/React.createElement("span", {
      className: "fas fa-angle-right ms-1"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "col-auto d-flex"
    }, /*#__PURE__*/React.createElement("button", {
      className: "page-link"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fas fa-chevron-left"
    })), /*#__PURE__*/React.createElement("ul", {
      className: "mb-0 pagination"
    }), /*#__PURE__*/React.createElement("button", {
      className: "page-link pe-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fas fa-chevron-right"
    }))))));
  };
  const generatePaymentsTable = () => {
    if (!reportData || reportData.length === 0) return null;
    const paymentMethods = new Set();
    const billingUsers = new Set();
    const groupedData = {};
    const totals = {};
    reportData.forEach(entry => {
      const {
        billing_user,
        payment_methods
      } = entry;
      billingUsers.add(billing_user);
      payment_methods.forEach(pm => {
        const method = pm.payment_method.method;
        const amount = parseFloat(pm.amount);
        paymentMethods.add(method);
        if (!groupedData[method]) {
          groupedData[method] = {};
        }
        if (!groupedData[method][billing_user]) {
          groupedData[method][billing_user] = 0;
        }
        if (!totals[billing_user]) {
          totals[billing_user] = 0;
        }
        groupedData[method][billing_user] += amount;
        totals[billing_user] += amount;
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "border-top border-translucent"
    }, /*#__PURE__*/React.createElement("div", {
      id: "purchasersSellersTable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "table-responsive scrollbar mx-n1 px-1"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm fs-9 leads-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "M\xE9todo de Pago"), Array.from(billingUsers).map((user, index) => /*#__PURE__*/React.createElement("th", {
      key: index
    }, user)))), /*#__PURE__*/React.createElement("tbody", {
      id: "list-payments-methods"
    }, Array.from(paymentMethods).map((method, methodIndex) => /*#__PURE__*/React.createElement("tr", {
      key: methodIndex
    }, /*#__PURE__*/React.createElement("td", null, method), Array.from(billingUsers).map((user, userIndex) => /*#__PURE__*/React.createElement("td", {
      key: userIndex
    }, groupedData[method][user]?.toFixed(2) || "0.00")))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total")), Array.from(billingUsers).map((user, index) => /*#__PURE__*/React.createElement("td", {
      key: index
    }, /*#__PURE__*/React.createElement("strong", null, totals[user]?.toFixed(2) || "0.00"))))))), /*#__PURE__*/React.createElement("div", {
      className: "row align-items-center justify-content-between pe-0 fs-9"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-auto d-flex"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mb-0 d-none d-sm-block me-3 fw-semibold text-body"
    }), /*#__PURE__*/React.createElement("a", {
      className: "fw-semibold",
      href: "#!"
    }, "View all", /*#__PURE__*/React.createElement("span", {
      className: "fas fa-angle-right ms-1"
    })), /*#__PURE__*/React.createElement("a", {
      className: "fw-semibold d-none",
      href: "#!"
    }, "View Less", /*#__PURE__*/React.createElement("span", {
      className: "fas fa-angle-right ms-1"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "col-auto d-flex"
    }, /*#__PURE__*/React.createElement("button", {
      className: "page-link"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fas fa-chevron-left"
    })), /*#__PURE__*/React.createElement("ul", {
      className: "mb-0 pagination"
    }), /*#__PURE__*/React.createElement("button", {
      className: "page-link pe-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fas fa-chevron-right"
    }))))));
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "main",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pb-9"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-4"
  }, "Facturas"), /*#__PURE__*/React.createElement("div", {
    className: "row g-3 justify-content-between align-items-start mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nav nav-underline fs-9",
    id: "myTab",
    role: "tablist"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "range-dates-tab" ? "active" : ""}`,
    id: "range-dates-tab",
    onClick: () => setActiveTab("range-dates-tab"),
    role: "tab"
  }, "Filtros"))), /*#__PURE__*/React.createElement("div", {
    className: "tab-content mt-3",
    id: "myTabContent"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab-pane fade show active",
    id: "tab-range-dates",
    role: "tabpanel",
    "aria-labelledby": "range-dates-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card border border-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "procedure"
  }, "Procedimientos"), /*#__PURE__*/React.createElement(MultiSelect, {
    id: "procedure",
    value: selectedProcedures,
    options: procedures,
    onChange: e => setSelectedProcedures(e.value),
    placeholder: "Seleccione procedimientos",
    display: "chip",
    filter: true,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "especialistas"
  }, "Especialistas"), /*#__PURE__*/React.createElement(MultiSelect, {
    id: "especialistas",
    value: selectedSpecialists,
    options: specialists,
    onChange: e => setSelectedSpecialists(e.value),
    placeholder: "Seleccione especialistas",
    display: "chip",
    filter: true,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "patients"
  }, "Pacientes"), /*#__PURE__*/React.createElement(MultiSelect, {
    id: "patients",
    value: selectedPatients,
    options: patients,
    onChange: e => setSelectedPatients(e.value),
    placeholder: "Seleccione pacientes",
    display: "chip",
    filter: true,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
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
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "entity"
  }, "Entidad"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "entity",
    value: selectedEntity,
    options: entities,
    onChange: e => setSelectedEntity(e.value),
    placeholder: "Seleccione entidad",
    filter: true,
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end m-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Filtrar",
    icon: "pi pi-filter",
    onClick: handleFilter,
    className: "p-button-primary"
  })))))))))))), /*#__PURE__*/React.createElement("div", {
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
    className: `nav-link ${activeTab === "procedures-tab" ? "active" : ""}`,
    id: "procedures-tab",
    onClick: () => setActiveTab("procedures-tab"),
    role: "tab"
  }, "Procedimientos")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "entities-tab" ? "active" : ""}`,
    id: "entities-tab",
    onClick: () => setActiveTab("entities-tab"),
    role: "tab"
  }, "Entidades")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "paymentsMethods-tab" ? "active" : ""}`,
    id: "paymentsMethods-tab",
    onClick: () => setActiveTab("paymentsMethods-tab"),
    role: "tab"
  }, "M\xE9todos de pago"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-xxl-12 tab-content mt-3",
    id: "myTabContent"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "procedures-tab" ? "show active" : ""}`,
    id: "tab-procedures",
    role: "tabpanel",
    "aria-labelledby": "procedures-tab"
  }, generateProceduresTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "entities-tab" ? "show active" : ""}`,
    id: "tab-entities",
    role: "tabpanel",
    "aria-labelledby": "entities-tab"
  }, generateEntitiesTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "paymentsMethods-tab" ? "show active" : ""}`,
    id: "tab-paymentsMethods",
    role: "tabpanel",
    "aria-labelledby": "paymentsMethods-tab"
  }, generatePaymentsTable())))))));
};