import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

// Import your services
import {
  productService,
  userService,
  patientService,
  billingService,
  entityService,
} from "../../services/api/index";

export const InvoicesByEntity = () => {
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
  const [selectedEntity, setSelectedEntity] = useState(0);
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);

  // State for report data
  const [reportData, setReportData] = useState([]);
  const [activeTab, setActiveTab] = useState("byEntity-tab");
  const [treeData, setTreeData] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

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

  useEffect(() => {
    if (reportData.length > 0) {
      prepareTreeData();
    }
  }, [reportData]);

  const loadData = async (filterParams = {}) => {
    try {
      const data = await billingService.getBillingReportByEntity(filterParams);
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

  const prepareTreeData = () => {
    const groupedByEntity: Record<string, any> = {};

    reportData.forEach((item: any) => {
      const entity = item.admission?.patient?.social_security?.entity;
      const entityKey = entity?.id || "sin-entidad";
      const entityName = entity?.name || "Sin entidad";

      if (!groupedByEntity[entityKey]) {
        groupedByEntity[entityKey] = {
          key: `entity_${entityKey}`,
          data: {
            entidad: entityName,
            facturador: "",
            paciente: ` 0`, // Inicializar contador
            producto: ` 0`, // Inicializar contador
            numeroAutorizacion: "",
            montoPagado: 0,
            fechaVencimiento: "",
          },
          children: [],
          totalPacientes: 0,
          totalProductos: 0,
        };
      }

      const facturador = item.user
        ? `${item.user.first_name} ${item.user.last_name}`
        : "-";

      const paciente = item.admission?.patient
        ? `${item.admission.patient.first_name} ${item.admission.patient.last_name}`
        : "-";

      const producto = item.admission?.appointment?.product?.name || "-";
      const montoPagado =
        parseFloat(item.admission.entity_authorized_amount) || 0;

      // Agregar factura como hijo
      groupedByEntity[entityKey].children.push({
        key: `invoice_${item.invoice.id}_${item.admission.id}`,
        data: {
          entidad: "",
          facturador: facturador,
          paciente: paciente,
          producto: producto,
          numeroAutorizacion: item.admission.authorization_number || "-",
          montoPagado: montoPagado,
          fechaVencimiento: item.invoice.due_date || "-",
        },
      });

      // Actualizar totales
      groupedByEntity[entityKey].totalPacientes++;
      groupedByEntity[entityKey].totalProductos++;
      groupedByEntity[entityKey].data.montoPagado += montoPagado;

      // Actualizar texto en nodo padre
      groupedByEntity[
        entityKey
      ].data.paciente = ` ${groupedByEntity[entityKey].totalPacientes}`;
      groupedByEntity[
        entityKey
      ].data.producto = ` ${groupedByEntity[entityKey].totalProductos}`;
    });

    const treeData = Object.values(groupedByEntity).sort((a, b) =>
      a.data.entidad.localeCompare(b.data.entidad)
    );

    setTreeData(treeData);
  };

  const amountBodyTemplate = (node: any) => {
    return `$${node.data.montoPagado.toFixed(2)}`;
  };

  const header = (
    <div className="flex justify-content-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.currentTarget.value)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  return (
    <main className="main" id="top">
      <div className="content">
        <div className="pb-9">
          <h2 className="mb-4">Facturas por Entidad</h2>
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
                      activeTab === "byEntity-tab" ? "active" : ""
                    }`}
                    id="byEntity-tab"
                    onClick={() => setActiveTab("byEntity-tab")}
                    role="tab"
                  >
                    Entidad
                  </a>
                </li>
              </ul>

              <div
                className="col-12 col-xxl-12 tab-content mt-3"
                id="myTabContent"
              >
                <div
                  className={`tab-pane fade ${
                    activeTab === "byEntity-tab" ? "show active" : ""
                  }`}
                  id="tab-byEntity"
                  role="tabpanel"
                  aria-labelledby="byEntity-tab"
                >
                  <div className="card">
                    <TreeTable
                      value={treeData}
                      header={header}
                      globalFilter={globalFilter}
                      scrollable
                      scrollHeight="400px"
                      className="p-treetable-sm"
                    >
                      <Column
                        field="entidad"
                        header="Entidad"
                        expander
                      ></Column>
                      <Column field="facturador" header="Facturador"></Column>
                      <Column field="paciente" header="Paciente"></Column>
                      <Column field="producto" header="Producto"></Column>
                      <Column
                        field="numeroAutorizacion"
                        header="Número autorización"
                      ></Column>
                      <Column
                        field="montoPagado"
                        header="Monto pagado"
                        body={amountBodyTemplate}
                      ></Column>
                      <Column
                        field="fechaVencimiento"
                        header="Fecha vencimiento"
                      ></Column>
                    </TreeTable>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
