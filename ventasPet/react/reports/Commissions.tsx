import React, { useEffect, useState } from "react";
import {
  productService,
  userService,
  comissionConfig,
  entityService,
} from "../../services/api/index.js";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";

export const Commissions = () => {
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [selectedEspecialistas, setSelectedEspecialistas] = useState([]);
  const [dateRange, setDateRange] = useState<any>([fiveDaysAgo, today]);
  const [comissionData, setComissionData] = useState([]);
  const [treeNodes, setTreeNodes] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({});
  const [especialistasOptions, setEspecialistasOptions] = useState([]);
  const [proceduresOptions, setProceduresOptions] = useState([]);
  const [entitiesOptions, setEntitiesOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await cargarServicios();
        await cargarEspecialistas();
        await createSelectEntities();
        const filterParams = await obtenerFiltros();
        await obtenerDatos(filterParams);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const cargarServicios = async () => {
    try {
      const procedimientos = await productService.getAllProducts();
      setProceduresOptions(
        procedimientos.data.map((procedure) => ({
          value: procedure.id,
          label: procedure.attributes.name,
        }))
      );
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const createSelectEntities = async () => {
    try {
      const entities = await entityService.getAll();
      setEntitiesOptions(
        entities.data.map((entity) => ({
          value: entity.id,
          label: entity.name,
        }))
      );
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  const cargarEspecialistas = async () => {
    try {
      const especialistas = await userService.getAllUsers();
      setEspecialistasOptions(
        especialistas.map((especialista) => ({
          value: especialista.id,
          label: `${especialista.first_name} ${especialista.last_name} - ${
            especialista.specialty?.name || "Sin especialidad"
          }`,
        }))
      );
    } catch (error) {
      console.error("Error loading specialists:", error);
    }
  };

  const obtenerDatos = async (filterParams = {}) => {
    setLoading(true);
    try {
      const data = await comissionConfig.comissionReportServices(filterParams);
      console.log(data);
      setComissionData(data);
      formatDataToTreeNodes(data);
    } catch (error) {
      console.error("Error fetching commission data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDataToTreeNodes = (users) => {
    const nodes = users.map((user, userIndex) => {
      // Calcular totales para el usuario
      const nombre = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      const totalServicios = user.admissions?.length || 0;

      const montoEntidad =
        user.admissions?.reduce((sum, admission) => {
          return sum + (parseFloat(admission.entity_authorized_amount) || 0);
        }, 0) || 0;

      // Calcular base y comisión
      let baseCalculo = 0;
      let comision = 0;

      const comisionesValidas =
        user.commissions?.filter(
          (commission) =>
            commission.attention_type === "entity" &&
            commission.percentage_base === "entity"
        ) || [];

      if (comisionesValidas.length > 0) {
        const comisionConfig = comisionesValidas[0];
        const serviciosComision =
          comisionConfig.services?.map((s) => s.service_id) || [];

        baseCalculo =
          user.admissions?.reduce((sum, admission) => {
            const productId = admission.appointment?.product_id?.toString();
            if (productId && serviciosComision.includes(productId)) {
              const amount =
                parseFloat(admission.entity_authorized_amount) || 0;
              const percentage =
                parseFloat(comisionConfig.percentage_value) || 0;
              return sum + (amount * percentage) / 100;
            }
            return sum;
          }, 0) || 0;

        const commissionValue =
          parseFloat(comisionConfig.commission_value) || 0;
        comision = (baseCalculo * commissionValue) / 100;
      }

      const entidadesFacturadas =
        user.invoices?.filter((invoice) => invoice.type === "entity").length ||
        0;

      // Crear nodos hijos (admisiones)
      const children =
        user.admissions?.map((admission, admissionIndex) => {
          const servicioNombre =
            admission.appointment?.product?.attributes?.name ||
            "Servicio no especificado";
          const montoAdmision =
            parseFloat(admission.entity_authorized_amount) || 0;
          const dateAdmission = new Date(admission.created_at)
            .toISOString()
            .split("T")[0];

          // Calcular base y comisión para esta admisión específica
          let baseAdmision = 0;
          let comisionAdmision = 0;

          if (comisionesValidas.length > 0) {
            const comisionConfig = comisionesValidas[0];
            const productId = admission.appointment?.product_id?.toString();
            const serviciosComision =
              comisionConfig.services?.map((s) => s.service_id) || [];

            if (productId && serviciosComision.includes(productId)) {
              const percentage =
                parseFloat(comisionConfig.percentage_value) || 0;
              baseAdmision = (montoAdmision * percentage) / 100;

              const commissionValue =
                parseFloat(comisionConfig.commission_value) || 0;
              comisionAdmision = (baseAdmision * commissionValue) / 100;
            }
          }

          return {
            key: `${userIndex}-${admissionIndex}`,
            data: {
              profesional: servicioNombre,
              totalServices: dateAdmission,
              monto: montoAdmision,
              base: baseAdmision,
              comision: comisionAdmision,
              entidad: admission.entity_id ? "Sí" : "No",
              isLeaf: true,
            },
          };
        }) || [];

      return {
        key: userIndex.toString(),
        data: {
          profesional: nombre,
          totalServices: totalServicios,
          monto: montoEntidad,
          base: baseCalculo,
          comision: comision,
          entidad: entidadesFacturadas,
          isLeaf: false,
        },
        children: children,
      };
    });

    setTreeNodes(nodes);

    // Expandir todos los nodos padre por defecto
    const keys = {};
    nodes.forEach((node) => {
      keys[node.key] = true;
    });
    setExpandedKeys(keys);
  };

  const obtenerFiltros = () => {
    const paramsFilter = {
      end_date: dateRange?.[1]?.toISOString().split("T")[0] || "",
      start_date: dateRange?.[0]?.toISOString().split("T")[0] || "",
      service_ids: selectedProcedures.map((item: any) => item),
      user_ids: selectedEspecialistas.map((item: any) => item),
      entity_ids: selectedEntities.map((item: any) => item),
    };

    return paramsFilter;
  };

  const handleFilterClick = async () => {
    const paramsFilter = await obtenerFiltros();
    await obtenerDatos(paramsFilter);
  };

  const formatCurrency = (value) => {
    return (
      value?.toLocaleString("es-CO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: "currency",
        currency: "COP",
      }) || "$0.00"
    );
  };

  const amountTemplate = (node) => {
    return formatCurrency(node.data.monto);
  };

  const baseTemplate = (node) => {
    return formatCurrency(node.data.base);
  };

  const commissionTemplate = (node) => {
    return formatCurrency(node.data.comision);
  };

  const profesionalTemplate = (node) => {
    return node.data.isLeaf ? (
      <span style={{ paddingLeft: "30px" }}>{node.data.profesional}</span>
    ) : (
      <strong>{node.data.profesional}</strong>
    );
  };

  const dateTemplate = (node) => {
    // console.log(node);
    return <span>{node.data.totalServices}</span>;
  };

  return (
    <main className="main" id="top">
      <div className="content">
        <div className="pb-9">
          <h2 className="mb-4">Comisiones por Profesional</h2>
          <div className="row g-3 justify-content-between align-items-start mb-4">
            <div className="col-12">
              <ul className="nav nav-underline fs-9" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="range-dates-tab"
                    data-bs-toggle="tab"
                    href="#tab-range-dates"
                    role="tab"
                    aria-controls="tab-range-dates"
                    aria-selected="true"
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
                                    htmlFor="dateRange"
                                  >
                                    Fecha inicio - fin Procedimiento
                                  </label>
                                  <Calendar
                                    id="dateRange"
                                    value={dateRange}
                                    onChange={(e: any) => setDateRange(e.value)}
                                    selectionMode="range"
                                    readOnlyInput
                                    dateFormat="dd/mm/yy"
                                    placeholder="Seleccione un rango de fechas"
                                    className="w-100"
                                  />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                  <label className="form-label">
                                    Profesional
                                  </label>
                                  <MultiSelect
                                    value={selectedEspecialistas}
                                    options={especialistasOptions}
                                    onChange={(e) =>
                                      setSelectedEspecialistas(e.value)
                                    }
                                    optionLabel="label"
                                    placeholder="Seleccione profesionales"
                                    className="w-100"
                                    filter
                                    display="chip"
                                  />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                  <label className="form-label">
                                    Servicios
                                  </label>
                                  <MultiSelect
                                    value={selectedProcedures}
                                    options={proceduresOptions}
                                    onChange={(e) =>
                                      setSelectedProcedures(e.value)
                                    }
                                    optionLabel="label"
                                    placeholder="Seleccione procedimientos"
                                    className="w-100"
                                    display="chip"
                                  />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                  <label className="form-label">
                                    Entidades
                                  </label>
                                  <MultiSelect
                                    value={selectedEntities}
                                    options={entitiesOptions}
                                    onChange={(e) =>
                                      setSelectedEntities(e.value)
                                    }
                                    optionLabel="label"
                                    placeholder="Seleccione entidades"
                                    className="w-100"
                                    display="chip"
                                  />
                                </div>
                              </div>
                              <div className="d-flex justify-content-end m-2">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={handleFilterClick}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <i className="pi pi-spinner pi-spin me-2"></i>
                                      Procesando...
                                    </>
                                  ) : (
                                    "Filtrar"
                                  )}
                                </button>
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
                    className="nav-link active"
                    id="commissions-tab"
                    data-bs-toggle="tab"
                    href="#tab-commissions"
                    role="tab"
                    aria-controls="tab-commissions"
                    aria-selected="true"
                  >
                    Entidad
                  </a>
                </li>
              </ul>

              <div className="col-12 tab-content mt-3" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="tab-commissions"
                  role="tabpanel"
                  aria-labelledby="commissions-tab"
                >
                  <div className="border-top border-translucent">
                    {loading ? (
                      <div className="text-center p-5">
                        <i
                          className="pi pi-spinner pi-spin"
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <p>Cargando datos...</p>
                      </div>
                    ) : (
                      <div id="purchasersSellersTable">
                        <div className="card">
                          <TreeTable
                            value={treeNodes}
                            expandedKeys={expandedKeys}
                            onToggle={(e) => setExpandedKeys(e.value)}
                            scrollable
                            scrollHeight="600px"
                          >
                            <Column
                              field="profesional"
                              header="Profesional"
                              body={profesionalTemplate}
                              expander
                            />
                            <Column
                              field="Fecha"
                              header="Fecha"
                              body={dateTemplate}
                            />
                            <Column
                              field="monto"
                              header="Monto"
                              body={amountTemplate}
                            />
                            <Column
                              field="base"
                              header="Base Cálculo"
                              body={baseTemplate}
                            />
                            <Column
                              field="comision"
                              header="Comisión"
                              body={commissionTemplate}
                            />
                            <Column
                              field="entidad"
                              header="Factura a Entidad"
                            />
                          </TreeTable>
                        </div>
                        <div className="row align-items-center justify-content-between pe-0 fs-9 mt-3">
                          <div className="col-auto d-flex">
                            <p className="mb-0 d-none d-sm-block me-3 fw-semibold text-body">
                              Mostrando {treeNodes.length} profesionales
                            </p>
                          </div>
                        </div>
                      </div>
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
