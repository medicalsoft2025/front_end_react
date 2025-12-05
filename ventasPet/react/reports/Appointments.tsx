import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";

// Import your services
import { appointmentService } from "../../services/api/index";
import { appointmentStatesByKeyTwo } from "../../services/commons";

export const Appointments = () => {
  // Set default date range (last 5 days)
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);

  // State for report data
  const [reportData, setReportData] = useState([]);
  const [treeData, setTreeData] = useState<any[]>([]);
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

  const createTreeData = (data) => {
    const grouped = {};

    // Agrupar por estado
    data.forEach((appointment) => {
      if (!grouped[appointment.state]) {
        grouped[appointment.state] = {
          key: appointment.state,
          data: {
            state: appointment.state,
            patientName:
              "Total: " +
              data.filter((a) => a.state === appointment.state).length,
            documentNumber: "",
            city: "",
            productId: "",
          },
          children: [],
        };
      }

      grouped[appointment.state].children.push({
        key: `${appointment.state}-${appointment.id}`,
        data: {
          state: '',
          patientName: `${appointment.patient.first_name} ${appointment.patient.last_name}`,
          documentNumber: appointment.patient.document_number,
          city: appointment.patient.city_id,
          productId: appointment.product_id,
        },
      });
    });

    return Object.values(grouped);
  };

  const loadData = async (filterParams = {}) => {
    try {
      const data = await appointmentService.appointmentsWithFilters(
        filterParams
      );
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
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
      };

      console.log("filters:", filterParams);

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

  function handlerDataAppointments(data: any) {
    const dataMapped = data.map((item: any) => {
      const state = appointmentStatesByKeyTwo[item.appointment_state.name];
      return {
        ...item,
        state: (typeof state === "object" ? state.CONSULTATION : state) ?? 'Sin estado', 
      };
    });

    console.log("dataMapped", dataMapped);
    return dataMapped;
  }

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
          <h2 className="mb-4">Citas</h2>
          
          {/* Sección de Filtros (siempre visible) */}
          <div className="row g-3 justify-content-between align-items-start mb-4">
            <div className="col-12">
              <div className="card border border-light mb-4">
                <div className="card-body">
                  <div className="row">
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
                        appendTo={document.body}
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

          {/* Sección de Resultados con Tabs */}
          <div className="row gy-5">
            <div className="col-12 col-xxl-12">
              <ul className="nav nav-underline fs-9" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "appointments-tab" ? "active" : ""
                    }`}
                    id="appointments-tab"
                    onClick={() => setActiveTab("appointments-tab")}
                    role="tab"
                  >
                    Citas por Estado
                  </a>
                </li>
              </ul>

              <div className="col-12 col-xxl-12 tab-content mt-3">
                <div
                  className={`tab-pane fade ${
                    activeTab === "appointments-tab" ? "show active" : ""
                  }`}
                  id="tab-appointments"
                  role="tabpanel"
                  aria-labelledby="appointments-tab"
                >
                  <div className="card">
                    {treeData.length > 0 ? (
                      <TreeTable
                        value={treeData}
                        globalFilter={globalFilter}
                        header={header}
                        emptyMessage="No se encontraron citas"
                        className="p-treetable-striped"
                      >
                        <Column field="state" header="Estado" expander />
                        <Column
                          field="patientName"
                          header="Paciente"
                        />
                        <Column
                          field="documentNumber"
                          header="Identificación"
                        />
                        <Column field="city" header="Ciudad" />
                        <Column field="productId" header="Producto" />
                      </TreeTable>
                    ) : (
                      <p>No hay datos para mostrar</p>
                    )}
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