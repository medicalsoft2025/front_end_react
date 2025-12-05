import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

// Import your services
import { productService, userService, patientService, billingService, entityService } from "../../services/api/index.js";
export const SpecialistsReport = () => {
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
  const [activeTab, setActiveTab] = useState("doctors-tab");
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load initial data
        await loadProcedures();
        await loadSpecialists();
        await loadPatients();
        await loadEntities();
        await loadData();
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
  const generateDoctorsTable = () => {
    if (!reportData || reportData.length === 0) return null;

    // Procesar datos y agrupar por procedimiento y médico
    const procedureDoctorTotals = {};
    const doctors = new Set();
    const procedures = new Set();
    reportData.forEach(entry => {
      const doctor = entry.billing_doctor;
      doctors.add(doctor);
      entry.billed_procedure.forEach(proc => {
        const procedureName = proc.product.name;
        const amount = parseFloat(proc.amount);
        procedures.add(procedureName);
        if (!procedureDoctorTotals[procedureName]) {
          procedureDoctorTotals[procedureName] = {};
        }
        procedureDoctorTotals[procedureName][doctor] = (procedureDoctorTotals[procedureName][doctor] || 0) + amount;
      });
    });

    // Calcular totales por columnas (médicos)
    const doctorTotals = {};
    Array.from(doctors).forEach(doctor => {
      doctorTotals[doctor] = Array.from(procedures).reduce((sum, proc) => {
        return sum + (procedureDoctorTotals[proc][doctor] || 0);
      }, 0);
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "border-top border-translucent"
    }, /*#__PURE__*/React.createElement("div", {
      id: "purchasersSellersTable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "table-responsive scrollbar mx-n1 px-1"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm fs-9 leads-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Procedimiento"), Array.from(doctors).map((doctor, index) => /*#__PURE__*/React.createElement("th", {
      key: index
    }, doctor)), /*#__PURE__*/React.createElement("th", null, "Total"))), /*#__PURE__*/React.createElement("tbody", {
      id: "list-doctors"
    }, Array.from(procedures).map((proc, procIndex) => {
      let rowTotal = 0;
      return /*#__PURE__*/React.createElement("tr", {
        key: procIndex
      }, /*#__PURE__*/React.createElement("td", null, proc), Array.from(doctors).map((doctor, docIndex) => {
        const total = procedureDoctorTotals[proc][doctor] || 0;
        rowTotal += total;
        return /*#__PURE__*/React.createElement("td", {
          key: docIndex
        }, "$", total.toLocaleString("es-CO"));
      }), /*#__PURE__*/React.createElement("td", null, "$", rowTotal.toLocaleString("es-CO")));
    }), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total")), Array.from(doctors).map((doctor, index) => {
      const total = doctorTotals[doctor];
      return /*#__PURE__*/React.createElement("td", {
        key: index
      }, /*#__PURE__*/React.createElement("strong", null, "$", total.toLocaleString("es-CO")));
    }), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "$", Object.values(doctorTotals).reduce((a, b) => a + b, 0).toLocaleString("es-CO"))))))), /*#__PURE__*/React.createElement("div", {
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
  const generateEntityPricesTable = () => {
    if (!reportData || reportData.length === 0) return null;

    // Procesar datos y agrupar por médico y entidad
    const filteredData = reportData.filter(item => item.insurance);
    const doctorEntityTotals = {};
    const entities = new Set();
    const doctors = new Set();
    filteredData.forEach(entry => {
      const entity = entry.insurance.name;
      const doctor = entry.billing_doctor;
      const total = entry.billed_procedure.reduce((sum, proc) => sum + parseFloat(proc.amount), 0);
      entities.add(entity);
      doctors.add(doctor);
      if (!doctorEntityTotals[doctor]) doctorEntityTotals[doctor] = {};
      doctorEntityTotals[doctor][entity] = (doctorEntityTotals[doctor][entity] || 0) + total;
    });

    // Calcular totales por columnas (entidades)
    const entityTotals = {};
    Array.from(entities).forEach(entity => {
      entityTotals[entity] = Array.from(doctors).reduce((sum, doctor) => {
        return sum + (doctorEntityTotals[doctor][entity] || 0);
      }, 0);
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "border-top border-translucent"
    }, /*#__PURE__*/React.createElement("div", {
      id: "purchasersSellersTable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "table-responsive scrollbar mx-n1 px-1"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm fs-9 leads-table-precios-entidad"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "M\xE9dico"), Array.from(entities).map((entity, index) => /*#__PURE__*/React.createElement("th", {
      key: index
    }, entity)), /*#__PURE__*/React.createElement("th", null, "Total"))), /*#__PURE__*/React.createElement("tbody", {
      id: "list-precios-entidad"
    }, Array.from(doctors).map((doctor, docIndex) => {
      let rowTotal = 0;
      return /*#__PURE__*/React.createElement("tr", {
        key: docIndex
      }, /*#__PURE__*/React.createElement("td", null, doctor), Array.from(entities).map((entity, entIndex) => {
        const total = doctorEntityTotals[doctor][entity] || 0;
        rowTotal += total;
        return /*#__PURE__*/React.createElement("td", {
          key: entIndex
        }, "$", total.toLocaleString("es-CO"));
      }), /*#__PURE__*/React.createElement("td", null, "$", rowTotal.toLocaleString("es-CO")));
    }), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total")), Array.from(entities).map((entity, index) => {
      const total = entityTotals[entity];
      return /*#__PURE__*/React.createElement("td", {
        key: index
      }, /*#__PURE__*/React.createElement("strong", null, "$", total.toLocaleString("es-CO")));
    }), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "$", Object.values(entityTotals).reduce((a, b) => a + b, 0).toLocaleString("es-CO"))))))), /*#__PURE__*/React.createElement("div", {
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
  const generateEntityCountTable = () => {
    if (!reportData || reportData.length === 0) return null;

    // Procesar datos y agrupar por entidad y médico
    const filteredData = reportData.filter(item => item.insurance);
    const entityDoctorCounts = {};
    const doctors = new Set();
    const entities = new Set();
    filteredData.forEach(entry => {
      const entity = entry.insurance.name;
      const doctor = entry.billing_doctor;
      const procedureCount = entry.billed_procedure.length;
      entities.add(entity);
      doctors.add(doctor);
      if (!entityDoctorCounts[entity]) entityDoctorCounts[entity] = {};
      entityDoctorCounts[entity][doctor] = (entityDoctorCounts[entity][doctor] || 0) + procedureCount;
    });

    // Calcular totales por columnas (médicos)
    const doctorTotals = {};
    Array.from(doctors).forEach(doctor => {
      doctorTotals[doctor] = Array.from(entities).reduce((sum, entity) => {
        return sum + (entityDoctorCounts[entity][doctor] || 0);
      }, 0);
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "border-top border-translucent"
    }, /*#__PURE__*/React.createElement("div", {
      id: "purchasersSellersTable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "table-responsive scrollbar mx-n1 px-1"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm fs-9 leads-table-conteo-entidad"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Entidad"), Array.from(doctors).map((doctor, index) => /*#__PURE__*/React.createElement("th", {
      key: index
    }, doctor)), /*#__PURE__*/React.createElement("th", null, "Total"))), /*#__PURE__*/React.createElement("tbody", {
      id: "list-conteo-entidad"
    }, Array.from(entities).map((entity, entIndex) => {
      let rowTotal = 0;
      return /*#__PURE__*/React.createElement("tr", {
        key: entIndex
      }, /*#__PURE__*/React.createElement("td", null, entity), Array.from(doctors).map((doctor, docIndex) => {
        const count = entityDoctorCounts[entity][doctor] || 0;
        rowTotal += count;
        return /*#__PURE__*/React.createElement("td", {
          key: docIndex
        }, count.toLocaleString("es-CO"));
      }), /*#__PURE__*/React.createElement("td", null, rowTotal.toLocaleString("es-CO")));
    }), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total")), Array.from(doctors).map((doctor, index) => {
      const total = doctorTotals[doctor];
      return /*#__PURE__*/React.createElement("td", {
        key: index
      }, /*#__PURE__*/React.createElement("strong", null, total.toLocaleString("es-CO")));
    }), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, Object.values(doctorTotals).reduce((a, b) => a + b, 0).toLocaleString("es-CO"))))))), /*#__PURE__*/React.createElement("div", {
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
  const generateConsultationsTable = () => {
    if (!reportData || reportData.length === 0) return null;

    // Procesar datos y agrupar por profesional y fecha
    const doctorDateCounts = {};
    const dates = new Set();
    const doctors = new Set();
    reportData.forEach(entry => {
      const doctor = entry.billing_doctor;
      const date = entry.appointment_date_time.date;
      doctors.add(doctor);
      dates.add(date);
      if (!doctorDateCounts[doctor]) {
        doctorDateCounts[doctor] = {};
      }
      doctorDateCounts[doctor][date] = (doctorDateCounts[doctor][date] || 0) + 1;
    });

    // Ordenar fechas
    const sortedDates = Array.from(dates).sort();

    // Calcular totales por columnas (fechas)
    const dateTotals = {};
    sortedDates.forEach(date => {
      dateTotals[date] = Array.from(doctors).reduce((sum, doctor) => {
        return sum + (doctorDateCounts[doctor][date] || 0);
      }, 0);
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "border-top border-translucent"
    }, /*#__PURE__*/React.createElement("div", {
      id: "purchasersSellersTable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "table-responsive scrollbar mx-n1 px-1"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm fs-9 leads-table-consultas"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Profesional"), sortedDates.map((date, index) => /*#__PURE__*/React.createElement("th", {
      key: index
    }, date)), /*#__PURE__*/React.createElement("th", null, "Total"))), /*#__PURE__*/React.createElement("tbody", {
      id: "list-consultas"
    }, Array.from(doctors).map((doctor, docIndex) => {
      let rowTotal = 0;
      return /*#__PURE__*/React.createElement("tr", {
        key: docIndex
      }, /*#__PURE__*/React.createElement("td", null, doctor), sortedDates.map((date, dateIndex) => {
        const count = doctorDateCounts[doctor][date] || 0;
        rowTotal += count;
        return /*#__PURE__*/React.createElement("td", {
          key: dateIndex
        }, count);
      }), /*#__PURE__*/React.createElement("td", null, rowTotal));
    }), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total")), sortedDates.map((date, index) => {
      const total = dateTotals[date];
      return /*#__PURE__*/React.createElement("td", {
        key: index
      }, /*#__PURE__*/React.createElement("strong", null, total));
    }), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, Object.values(dateTotals).reduce((a, b) => a + b, 0))))))), /*#__PURE__*/React.createElement("div", {
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
  }, "Especialistas"), /*#__PURE__*/React.createElement("div", {
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
    className: `nav-link ${activeTab === "doctors-tab" ? "active" : ""}`,
    id: "doctors-tab",
    onClick: () => setActiveTab("doctors-tab"),
    role: "tab"
  }, "Procedimientos")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "precios-entidad-tab" ? "active" : ""}`,
    id: "precios-entidad-tab",
    onClick: () => setActiveTab("precios-entidad-tab"),
    role: "tab"
  }, "Entidades")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "conteo-entidad-tab" ? "active" : ""}`,
    id: "conteo-entidad-tab",
    onClick: () => setActiveTab("conteo-entidad-tab"),
    role: "tab"
  }, "Precios - conteo")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "consultas-tab" ? "active" : ""}`,
    id: "consultas-tab",
    onClick: () => setActiveTab("consultas-tab"),
    role: "tab"
  }, "Consultas"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-xxl-12 tab-content mt-3",
    id: "myTabContent"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "doctors-tab" ? "show active" : ""}`,
    id: "tab-doctors",
    role: "tabpanel",
    "aria-labelledby": "doctors-tab"
  }, generateDoctorsTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "precios-entidad-tab" ? "show active" : ""}`,
    id: "tab-precios-entidad",
    role: "tabpanel",
    "aria-labelledby": "precios-entidad-tab"
  }, generateEntityPricesTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "conteo-entidad-tab" ? "show active" : ""}`,
    id: "tab-conteo-entidad",
    role: "tabpanel",
    "aria-labelledby": "conteo-entidad-tab"
  }, generateEntityCountTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "consultas-tab" ? "show active" : ""}`,
    id: "tab-consultas",
    role: "tabpanel",
    "aria-labelledby": "consultas-tab"
  }, generateConsultationsTable())))))));
};