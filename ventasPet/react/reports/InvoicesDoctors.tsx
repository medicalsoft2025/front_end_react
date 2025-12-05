import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

// Import your services
import {
  productService,
  userService,
  patientService,
  billingService,
  entityService,
} from "../../services/api/index";

export const SpecialistsReport = () => {
  // Set default date range (last 5 days)
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);
  // State for filters
  const [procedures, setProcedures] = useState<any[]>([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [entities, setEntities] = useState<any[]>([]);
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
      setProcedures(
        response.data.map((item) => ({
          label: item.attributes.name,
          value: item.id,
        }))
      );
    } catch (error) {
      console.error("Error loading procedures:", error);
    }
  };

  const loadSpecialists = async () => {
    try {
      const response = await userService.getAllUsers();
      setSpecialists(
        response.map((user) => ({
          label: `${user.first_name} ${user.last_name} - ${
            user.specialty?.name || ""
          }`,
          value: user.id,
        }))
      );
    } catch (error) {
      console.error("Error loading specialists:", error);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await patientService.getAll();
      setPatients(
        response.map((patient) => ({
          label: `${patient.first_name} ${patient.last_name}`,
          value: patient.id,
        }))
      );
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };

  const loadEntities = async () => {
    try {
      const response = await entityService.getAll();
      setEntities([
        { label: "Seleccione", value: null },
        ...response.data.map((entity) => ({
          label: entity.name,
          value: entity.id,
        })),
      ]);
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
        entity_id: selectedEntity,
      };

      await loadData(filterParams);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const formatDate = (date) => {
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

    reportData.forEach((entry: any) => {
      const doctor = entry.billing_doctor;
      doctors.add(doctor);

      entry.billed_procedure.forEach((proc) => {
        const procedureName = proc.product.name;
        const amount = parseFloat(proc.amount);

        procedures.add(procedureName);

        if (!procedureDoctorTotals[procedureName]) {
          procedureDoctorTotals[procedureName] = {};
        }

        procedureDoctorTotals[procedureName][doctor] =
          (procedureDoctorTotals[procedureName][doctor] || 0) + amount;
      });
    });

    // Calcular totales por columnas (médicos)
    const doctorTotals: object = {};
    Array.from(doctors).forEach((doctor: any) => {
      doctorTotals[doctor] = Array.from(procedures).reduce((sum, proc: any) => {
        return sum + (procedureDoctorTotals[proc][doctor] || 0);
      }, 0);
    });

    return (
      <div className="border-top border-translucent">
        <div id="purchasersSellersTable">
          <div className="table-responsive scrollbar mx-n1 px-1">
            <table className="table table-sm fs-9 leads-table">
              <thead>
                <tr>
                  <th>Procedimiento</th>
                  {Array.from(doctors).map((doctor: any, index) => (
                    <th key={index}>{doctor}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody id="list-doctors">
                {Array.from(procedures).map((proc: any, procIndex) => {
                  let rowTotal = 0;

                  return (
                    <tr key={procIndex}>
                      <td>{proc}</td>
                      {Array.from(doctors).map((doctor, docIndex) => {
                        const total = procedureDoctorTotals[proc][doctor] || 0;
                        rowTotal += total;
                        return (
                          <td key={docIndex}>
                            ${total.toLocaleString("es-CO")}
                          </td>
                        );
                      })}
                      <td>${rowTotal.toLocaleString("es-CO")}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  {Array.from(doctors).map((doctor: any, index) => {
                    const total = doctorTotals[doctor];
                    return (
                      <td key={index}>
                        <strong>${total.toLocaleString("es-CO")}</strong>
                      </td>
                    );
                  })}
                  <td>
                    <strong>
                      $
                      {Object.values(doctorTotals)
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString("es-CO")}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row align-items-center justify-content-between pe-0 fs-9">
            <div className="col-auto d-flex">
              <p className="mb-0 d-none d-sm-block me-3 fw-semibold text-body"></p>
              <a className="fw-semibold" href="#!">
                View all<span className="fas fa-angle-right ms-1"></span>
              </a>
              <a className="fw-semibold d-none" href="#!">
                View Less<span className="fas fa-angle-right ms-1"></span>
              </a>
            </div>
            <div className="col-auto d-flex">
              <button className="page-link">
                <span className="fas fa-chevron-left"></span>
              </button>
              <ul className="mb-0 pagination"></ul>
              <button className="page-link pe-0">
                <span className="fas fa-chevron-right"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const generateEntityPricesTable = () => {
    if (!reportData || reportData.length === 0) return null;

    // Procesar datos y agrupar por médico y entidad
    const filteredData = reportData.filter((item: any) => item.insurance);
    const doctorEntityTotals = {};
    const entities = new Set();
    const doctors = new Set();

    filteredData.forEach((entry: any) => {
      const entity = entry.insurance.name;
      const doctor = entry.billing_doctor;
      const total = entry.billed_procedure.reduce(
        (sum, proc) => sum + parseFloat(proc.amount),
        0
      );

      entities.add(entity);
      doctors.add(doctor);

      if (!doctorEntityTotals[doctor]) doctorEntityTotals[doctor] = {};
      doctorEntityTotals[doctor][entity] =
        (doctorEntityTotals[doctor][entity] || 0) + total;
    });

    // Calcular totales por columnas (entidades)
    const entityTotals: object = {};
    Array.from(entities).forEach((entity: any) => {
      entityTotals[entity] = Array.from(doctors).reduce((sum, doctor: any) => {
        return sum + (doctorEntityTotals[doctor][entity] || 0);
      }, 0);
    });

    return (
      <div className="border-top border-translucent">
        <div id="purchasersSellersTable">
          <div className="table-responsive scrollbar mx-n1 px-1">
            <table className="table table-sm fs-9 leads-table-precios-entidad">
              <thead>
                <tr>
                  <th>Médico</th>
                  {Array.from(entities).map((entity: any, index) => (
                    <th key={index}>{entity}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody id="list-precios-entidad">
                {Array.from(doctors).map((doctor: any, docIndex) => {
                  let rowTotal = 0;

                  return (
                    <tr key={docIndex}>
                      <td>{doctor}</td>
                      {Array.from(entities).map((entity, entIndex) => {
                        const total = doctorEntityTotals[doctor][entity] || 0;
                        rowTotal += total;
                        return (
                          <td key={entIndex}>
                            ${total.toLocaleString("es-CO")}
                          </td>
                        );
                      })}
                      <td>${rowTotal.toLocaleString("es-CO")}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  {Array.from(entities).map((entity: any, index) => {
                    const total = entityTotals[entity];
                    return (
                      <td key={index}>
                        <strong>${total.toLocaleString("es-CO")}</strong>
                      </td>
                    );
                  })}
                  <td>
                    <strong>
                      $
                      {Object.values(entityTotals)
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString("es-CO")}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row align-items-center justify-content-between pe-0 fs-9">
            <div className="col-auto d-flex">
              <p className="mb-0 d-none d-sm-block me-3 fw-semibold text-body"></p>
              <a className="fw-semibold" href="#!">
                View all<span className="fas fa-angle-right ms-1"></span>
              </a>
              <a className="fw-semibold d-none" href="#!">
                View Less<span className="fas fa-angle-right ms-1"></span>
              </a>
            </div>
            <div className="col-auto d-flex">
              <button className="page-link">
                <span className="fas fa-chevron-left"></span>
              </button>
              <ul className="mb-0 pagination"></ul>
              <button className="page-link pe-0">
                <span className="fas fa-chevron-right"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const generateEntityCountTable = () => {
    if (!reportData || reportData.length === 0) return null;

    // Procesar datos y agrupar por entidad y médico
    const filteredData = reportData.filter((item: any) => item.insurance);
    const entityDoctorCounts = {};
    const doctors = new Set();
    const entities = new Set();

    filteredData.forEach((entry: any) => {
      const entity = entry.insurance.name;
      const doctor = entry.billing_doctor;
      const procedureCount = entry.billed_procedure.length;

      entities.add(entity);
      doctors.add(doctor);

      if (!entityDoctorCounts[entity]) entityDoctorCounts[entity] = {};
      entityDoctorCounts[entity][doctor] =
        (entityDoctorCounts[entity][doctor] || 0) + procedureCount;
    });

    // Calcular totales por columnas (médicos)
    const doctorTotals: object = {};
    Array.from(doctors).forEach((doctor: any) => {
      doctorTotals[doctor] = Array.from(entities).reduce((sum, entity: any) => {
        return sum + (entityDoctorCounts[entity][doctor] || 0);
      }, 0);
    });

    return (
      <div className="border-top border-translucent">
        <div id="purchasersSellersTable">
          <div className="table-responsive scrollbar mx-n1 px-1">
            <table className="table table-sm fs-9 leads-table-conteo-entidad">
              <thead>
                <tr>
                  <th>Entidad</th>
                  {Array.from(doctors).map((doctor: any, index) => (
                    <th key={index}>{doctor}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody id="list-conteo-entidad">
                {Array.from(entities).map((entity: any, entIndex) => {
                  let rowTotal = 0;

                  return (
                    <tr key={entIndex}>
                      <td>{entity}</td>
                      {Array.from(doctors).map((doctor, docIndex) => {
                        const count = entityDoctorCounts[entity][doctor] || 0;
                        rowTotal += count;
                        return (
                          <td key={docIndex}>
                            {count.toLocaleString("es-CO")}
                          </td>
                        );
                      })}
                      <td>{rowTotal.toLocaleString("es-CO")}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  {Array.from(doctors).map((doctor: any, index) => {
                    const total = doctorTotals[doctor];
                    return (
                      <td key={index}>
                        <strong>{total.toLocaleString("es-CO")}</strong>
                      </td>
                    );
                  })}
                  <td>
                    <strong>
                      {Object.values(doctorTotals)
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString("es-CO")}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row align-items-center justify-content-between pe-0 fs-9">
            <div className="col-auto d-flex">
              <p className="mb-0 d-none d-sm-block me-3 fw-semibold text-body"></p>
              <a className="fw-semibold" href="#!">
                View all<span className="fas fa-angle-right ms-1"></span>
              </a>
              <a className="fw-semibold d-none" href="#!">
                View Less<span className="fas fa-angle-right ms-1"></span>
              </a>
            </div>
            <div className="col-auto d-flex">
              <button className="page-link">
                <span className="fas fa-chevron-left"></span>
              </button>
              <ul className="mb-0 pagination"></ul>
              <button className="page-link pe-0">
                <span className="fas fa-chevron-right"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const generateConsultationsTable = () => {
    if (!reportData || reportData.length === 0) return null;

    // Procesar datos y agrupar por profesional y fecha
    const doctorDateCounts = {};
    const dates = new Set();
    const doctors = new Set();

    reportData.forEach((entry: any) => {
      const doctor = entry.billing_doctor;
      const date = entry.appointment_date_time.date;

      doctors.add(doctor);
      dates.add(date);

      if (!doctorDateCounts[doctor]) {
        doctorDateCounts[doctor] = {};
      }

      doctorDateCounts[doctor][date] =
        (doctorDateCounts[doctor][date] || 0) + 1;
    });

    // Ordenar fechas
    const sortedDates = Array.from(dates).sort();

    // Calcular totales por columnas (fechas)
    const dateTotals: object = {};
    sortedDates.forEach((date: any) => {
      dateTotals[date] = Array.from(doctors).reduce((sum, doctor: any) => {
        return sum + (doctorDateCounts[doctor][date] || 0);
      }, 0);
    });

    return (
      <div className="border-top border-translucent">
        <div id="purchasersSellersTable">
          <div className="table-responsive scrollbar mx-n1 px-1">
            <table className="table table-sm fs-9 leads-table-consultas">
              <thead>
                <tr>
                  <th>Profesional</th>
                  {sortedDates.map((date: any, index) => (
                    <th key={index}>{date}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody id="list-consultas">
                {Array.from(doctors).map((doctor: any, docIndex) => {
                  let rowTotal = 0;

                  return (
                    <tr key={docIndex}>
                      <td>{doctor}</td>
                      {sortedDates.map((date, dateIndex) => {
                        const count = doctorDateCounts[doctor][date] || 0;
                        rowTotal += count;
                        return <td key={dateIndex}>{count}</td>;
                      })}
                      <td>{rowTotal}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  {sortedDates.map((date: any, index) => {
                    const total = dateTotals[date];
                    return (
                      <td key={index}>
                        <strong>{total}</strong>
                      </td>
                    );
                  })}
                  <td>
                    <strong>
                      {Object.values(dateTotals).reduce((a, b) => a + b, 0)}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row align-items-center justify-content-between pe-0 fs-9">
            <div className="col-auto d-flex">
              <p className="mb-0 d-none d-sm-block me-3 fw-semibold text-body"></p>
              <a className="fw-semibold" href="#!">
                View all<span className="fas fa-angle-right ms-1"></span>
              </a>
              <a className="fw-semibold d-none" href="#!">
                View Less<span className="fas fa-angle-right ms-1"></span>
              </a>
            </div>
            <div className="col-auto d-flex">
              <button className="page-link">
                <span className="fas fa-chevron-left"></span>
              </button>
              <ul className="mb-0 pagination"></ul>
              <button className="page-link pe-0">
                <span className="fas fa-chevron-right"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="main" id="top">
      <div className="content">
        <div className="pb-9">
          <h2 className="mb-4">Especialistas</h2>
          <div className="row g-3 justify-content-between align-items-start mb-4">
            <div className="col-12">
              <ul className="nav nav-underline fs-9" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "range-dates-tab" ? "active" : ""
                    }`}
                    id="range-dates-tab"
                    onClick={() => setActiveTab("range-dates-tab")}
                    role="tab"
                  >
                    Filtros
                  </a>
                </li>
              </ul>
              <div className="tab-content mt-3" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="tab-range-dates"
                  role="tabpanel"
                  aria-labelledby="range-dates-tab"
                >
                  <div className="d-flex">
                    <div style={{ width: "100%" }}>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <div className="card border border-light">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                  <label
                                    className="form-label"
                                    htmlFor="procedure"
                                  >
                                    Procedimientos
                                  </label>
                                  <MultiSelect
                                    id="procedure"
                                    value={selectedProcedures}
                                    options={procedures}
                                    onChange={(e) =>
                                      setSelectedProcedures(e.value)
                                    }
                                    placeholder="Seleccione procedimientos"
                                    display="chip"
                                    filter
                                    className="w-100"
                                  />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                  <label
                                    className="form-label"
                                    htmlFor="especialistas"
                                  >
                                    Especialistas
                                  </label>
                                  <MultiSelect
                                    id="especialistas"
                                    value={selectedSpecialists}
                                    options={specialists}
                                    onChange={(e) =>
                                      setSelectedSpecialists(e.value)
                                    }
                                    placeholder="Seleccione especialistas"
                                    display="chip"
                                    filter
                                    className="w-100"
                                  />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                  <label
                                    className="form-label"
                                    htmlFor="patients"
                                  >
                                    Pacientes
                                  </label>
                                  <MultiSelect
                                    id="patients"
                                    value={selectedPatients}
                                    options={patients}
                                    onChange={(e) =>
                                      setSelectedPatients(e.value)
                                    }
                                    placeholder="Seleccione pacientes"
                                    display="chip"
                                    filter
                                    className="w-100"
                                  />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                  <label
                                    className="form-label"
                                    htmlFor="fechasProcedimiento"
                                  >
                                    Fecha inicio - fin Procedimiento
                                  </label>
                                  <Calendar
                                    id="fechasProcedimiento"
                                    value={dateRange}
                                    onChange={(e: any) => setDateRange(e.value)}
                                    selectionMode="range"
                                    readOnlyInput
                                    dateFormat="dd/mm/yy"
                                    placeholder="dd/mm/yyyy - dd/mm/yyyy"
                                    className="w-100"
                                  />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                  <label
                                    className="form-label"
                                    htmlFor="entity"
                                  >
                                    Entidad
                                  </label>
                                  <Dropdown
                                    id="entity"
                                    value={selectedEntity}
                                    options={entities}
                                    onChange={(e) => setSelectedEntity(e.value)}
                                    placeholder="Seleccione entidad"
                                    filter
                                    className="w-100"
                                  />
                                </div>
                              </div>
                              <div className="d-flex justify-content-end m-2">
                                <Button
                                  label="Filtrar"
                                  icon="pi pi-filter"
                                  onClick={handleFilter}
                                  className="p-button-primary"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row gy-5">
            <div className="col-12 col-xxl-12">
              <ul className="nav nav-underline fs-9" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "doctors-tab" ? "active" : ""
                    }`}
                    id="doctors-tab"
                    onClick={() => setActiveTab("doctors-tab")}
                    role="tab"
                  >
                    Procedimientos
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "precios-entidad-tab" ? "active" : ""
                    }`}
                    id="precios-entidad-tab"
                    onClick={() => setActiveTab("precios-entidad-tab")}
                    role="tab"
                  >
                    Entidades
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "conteo-entidad-tab" ? "active" : ""
                    }`}
                    id="conteo-entidad-tab"
                    onClick={() => setActiveTab("conteo-entidad-tab")}
                    role="tab"
                  >
                    Precios - conteo
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "consultas-tab" ? "active" : ""
                    }`}
                    id="consultas-tab"
                    onClick={() => setActiveTab("consultas-tab")}
                    role="tab"
                  >
                    Consultas
                  </a>
                </li>
              </ul>

              <div
                className="col-12 col-xxl-12 tab-content mt-3"
                id="myTabContent"
              >
                <div
                  className={`tab-pane fade ${
                    activeTab === "doctors-tab" ? "show active" : ""
                  }`}
                  id="tab-doctors"
                  role="tabpanel"
                  aria-labelledby="doctors-tab"
                >
                  {generateDoctorsTable()}
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "precios-entidad-tab" ? "show active" : ""
                  }`}
                  id="tab-precios-entidad"
                  role="tabpanel"
                  aria-labelledby="precios-entidad-tab"
                >
                  {generateEntityPricesTable()}
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "conteo-entidad-tab" ? "show active" : ""
                  }`}
                  id="tab-conteo-entidad"
                  role="tabpanel"
                  aria-labelledby="conteo-entidad-tab"
                >
                  {generateEntityCountTable()}
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "consultas-tab" ? "show active" : ""
                  }`}
                  id="tab-consultas"
                  role="tabpanel"
                  aria-labelledby="consultas-tab"
                >
                  {generateConsultationsTable()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
