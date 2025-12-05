import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

// Import your services (make sure these are properly exported from your API module)
import {
  productService,
  userService,
  patientService,
  billingService,
  entityService,
} from "../../services/api/index";

export const InvoicesReport = () => {
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

  const generateProceduresTable = () => {
    if (!reportData || reportData.length === 0) return null;

    const users = [
      ...new Set(reportData.map((item: any) => item.billing_user)),
    ];
    const procedures = [
      ...new Set(
        reportData.flatMap(
          (item: any) => item.billed_procedure?.map((p) => p.product.name) || []
        )
      ),
    ];

    const rows = procedures.map((proc: any) => {
      const row = { procedimiento: proc };
      users.forEach((user) => {
        row[user] = reportData
          .filter((item: any) => item.billing_user === user)
          .flatMap((item: any) => item.billed_procedure)
          .filter((p) => p?.product.name === proc)
          .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      });
      return row;
    });

    // Add totals row
    const totalsRow = { procedimiento: "Total" };
    users.forEach((user) => {
      totalsRow[user] = rows.reduce((sum, row) => sum + (row[user] || 0), 0);
    });
    rows.push(totalsRow);

    return (
      <div className="border-top border-translucent">
        <div id="purchasersSellersTable">
          <div className="table-responsive scrollbar mx-n1 px-1">
            <table className="table table-sm fs-9 leads-table">
              <thead>
                <tr>
                  <th className="text-start">Procedimiento</th>
                  {users.map((user, index) => (
                    <th key={index}>{user}</th>
                  ))}
                </tr>
              </thead>
              <tbody id="list-billing">
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="align-middle ps-3 name">
                      {row.procedimiento}
                    </td>
                    {users.map((user, userIndex) => (
                      <td key={userIndex} className="align-middle text-center">
                        {row[user] ? `$${row[user].toFixed(2)}` : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
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

  const generateEntitiesTable = () => {
    if (!reportData || reportData.length === 0) return null;

    const filteredData = reportData.filter((item: any) => item.insurance);
    const entities = new Set();
    const billingUsers = new Set();
    const groupedData = {};
    const totals = {};

    filteredData.forEach((entry) => {
      const { billing_user, insurance, billed_procedure }: any = entry;
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

      billed_procedure.forEach((proc) => {
        const amount = parseFloat(proc.amount);
        groupedData[insuranceName][billing_user] += amount;
        totals[billing_user] += amount;
      });
    });

    return (
      <div className="border-top border-translucent">
        <div id="purchasersSellersTable">
          <div className="table-responsive scrollbar mx-n1 px-1">
            <table className="table table-sm fs-9 leads-table">
              <thead>
                <tr>
                  <th>Entidad</th>
                  {Array.from(billingUsers).map((user: any, index) => (
                    <th key={index}>{user}</th>
                  ))}
                </tr>
              </thead>
              <tbody id="list-entities">
                {Array.from(entities).map((entity: any, entityIndex) => (
                  <tr key={entityIndex}>
                    <td>{entity}</td>
                    {Array.from(billingUsers).map((user, userIndex) => (
                      <td key={userIndex}>
                        {groupedData[entity][user]
                          ? groupedData[entity][user].toFixed(2)
                          : "0.00"}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  {Array.from(billingUsers).map((user: any, index) => (
                    <td key={index}>
                      <strong>{totals[user].toFixed(2)}</strong>
                    </td>
                  ))}
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

  const generatePaymentsTable = () => {
    if (!reportData || reportData.length === 0) return null;

    const paymentMethods = new Set();
    const billingUsers = new Set();
    const groupedData = {};
    const totals = {};

    reportData.forEach((entry) => {
      const { billing_user, payment_methods }: any = entry;
      billingUsers.add(billing_user);

      payment_methods.forEach((pm) => {
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

    return (
      <div className="border-top border-translucent">
        <div id="purchasersSellersTable">
          <div className="table-responsive scrollbar mx-n1 px-1">
            <table className="table table-sm fs-9 leads-table">
              <thead>
                <tr>
                  <th>Método de Pago</th>
                  {Array.from(billingUsers).map((user: any, index) => (
                    <th key={index}>{user}</th>
                  ))}
                </tr>
              </thead>
              <tbody id="list-payments-methods">
                {Array.from(paymentMethods).map((method: any, methodIndex) => (
                  <tr key={methodIndex}>
                    <td>{method}</td>
                    {Array.from(billingUsers).map((user, userIndex) => (
                      <td key={userIndex}>
                        {groupedData[method][user]?.toFixed(2) || "0.00"}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  {Array.from(billingUsers).map((user: any, index) => (
                    <td key={index}>
                      <strong>{totals[user]?.toFixed(2) || "0.00"}</strong>
                    </td>
                  ))}
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
          <h2 className="mb-4">Facturas</h2>
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
                      activeTab === "procedures-tab" ? "active" : ""
                    }`}
                    id="procedures-tab"
                    onClick={() => setActiveTab("procedures-tab")}
                    role="tab"
                  >
                    Procedimientos
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "entities-tab" ? "active" : ""
                    }`}
                    id="entities-tab"
                    onClick={() => setActiveTab("entities-tab")}
                    role="tab"
                  >
                    Entidades
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "paymentsMethods-tab" ? "active" : ""
                    }`}
                    id="paymentsMethods-tab"
                    onClick={() => setActiveTab("paymentsMethods-tab")}
                    role="tab"
                  >
                    Métodos de pago
                  </a>
                </li>
              </ul>

              <div
                className="col-12 col-xxl-12 tab-content mt-3"
                id="myTabContent"
              >
                <div
                  className={`tab-pane fade ${
                    activeTab === "procedures-tab" ? "show active" : ""
                  }`}
                  id="tab-procedures"
                  role="tabpanel"
                  aria-labelledby="procedures-tab"
                >
                  {generateProceduresTable()}
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "entities-tab" ? "show active" : ""
                  }`}
                  id="tab-entities"
                  role="tabpanel"
                  aria-labelledby="entities-tab"
                >
                  {generateEntitiesTable()}
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "paymentsMethods-tab" ? "show active" : ""
                  }`}
                  id="tab-paymentsMethods"
                  role="tabpanel"
                  aria-labelledby="paymentsMethods-tab"
                >
                  {generatePaymentsTable()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
