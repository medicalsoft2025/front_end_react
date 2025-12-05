import React, { useState, useEffect, useRef, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useCashRecipes } from "../hooks/useCashReceipts";
import { classNames } from "primereact/utils";
import { FiltrosRecibos, ReciboCaja } from "../interface/interfaceCashRecipe";
import { SplitButton } from "primereact/splitbutton";
import { MenuItem } from "primereact/menuitem";
import { NewReceiptBoxModalTable } from "./modalNewReceiptBox/NewReceiptBoxModalTable";
import { useDataPagination } from "../../hooks/useDataPagination";
import {
  cashRecipes,
  resourcesAdminService,
} from "../../../services/api/index";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../../components/CustomPRTable";
import { formatDate } from "../../../services/utilidades";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu";
import { useReceiptBoxFormat } from "../../documents-generation/hooks/billing/receipt-box/useReceiptBoxFormat";
import { CustomFormModal } from "../../components/CustomFormModal";
import { MakeRequestForm } from "../../general-request/components/MakeRequestForm";
import { getUserLogged } from "../../../services/utilidades";
import { SwalManager } from "../../../services/alertManagerImported";

export const NewReceiptBoxTable = () => {
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const { generateFormatReceiptBox } = useReceiptBoxFormat();
  const [thirdParties, setThirdParties] = useState<any>(null);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [currentReceiptType, setCurrentReceiptType] = useState<
    "advance" | "purchase" | "quotation"
  >("advance");
  const [dataReceipt, setDataReceipt] = useState<any>(null);
  const userLogged = getUserLogged();

  const printReceipt = useRef(generateFormatReceiptBox);

  useEffect(() => {
    printReceipt.current = generateFormatReceiptBox;
  }, [generateFormatReceiptBox]);

  const [filtros, setFiltros] = useState<FiltrosRecibos>({
    type: "",
    action: "",
    thirdParty: null,
    createdAt: null,
    status: "",
  });

  // Opciones para los dropdowns
  const tiposRecibo = [
    { label: "Ingreso", value: "ingreso" },
    { label: "Egreso", value: "egreso" },
  ];

  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    fectThirdParties();
  }, []);

  async function fectThirdParties() {
    const data: any = await resourcesAdminService.getThirdParties();
    setThirdParties(data.data);
  }
  // Función para obtener recibos de caja
  const fetchCashRecipe = async (params: any) => {
    try {
      // Aplicar filtros adicionales a los parámetros de paginación
      const filters = {
        ...params,
        type: filtros.type,
        action: filtros.action,
        status: filtros.status,
        createdAt: filtros.createdAt
          ?.filter((date) => !!date)
          .map((date) => date.toISOString().split("T")[0])
          .join(","),
        thirdParty: filtros.thirdParty?.id ?? null,
      };

      const response = await cashRecipes.getAllCashRecipes(filters);

      return {
        data: response.data.data || response.data, // Ajusta según la estructura de tu API
        total: response.data.total || response.data.count || 0,
      };
    } catch (error) {
      console.error("Error fetching cash recipes:", error);
      return {
        data: [],
        total: 0,
      };
    }
  };

  const {
    data: cashRecipesData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: fetchCashRecipe,
    defaultPerPage: 10,
  });

  const limpiarFiltros = () => {
    setFiltros({
      type: "",
      action: "",
      thirdParty: null,
      createdAt: null,
      status: "",
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const generatePrintReceipt = useCallback(
    (recibo: ReciboCaja) => {
      return printReceipt.current(recibo, "Impresion");
    },
    [generateFormatReceiptBox]
  );

  const generateCancelReceipt = (recibo: ReciboCaja) => {
    setDataReceipt(recibo);
    setShowCancellationModal(true);
  };

  const handleMakeRequest = async (requestData: any) => {
    const makeRequest = {
      cancellation_reason: requestData.notes,
      user_name: userLogged.full_name,
    };
    try {
      if (dataReceipt.id) {
        await cashRecipes.createRequestCancellation(
          dataReceipt.id,
          makeRequest
        );
        SwalManager.success({
          text: "La solicitud de anulación se ha enviado correctamente",
          title: "Éxito",
        });
        setShowCancellationModal(false);
        refresh();
      }
    } catch (error) {
      console.error(error);
       SwalManager.error({
          text: error,
          title: "Error",
        });
    }
  };

  const openModalWithType = (type: "advance" | "purchase" | "quotation") => {
    setCurrentReceiptType(type);
    setShowReciboModal(true);
  };

  const createActionTemplate = (
    icon: string,
    label: string,
    colorClass: string = ""
  ) => {
    return () => (
      <div
        className="flex align-items-center gap-2 p-2 point"
        style={{ cursor: "pointer" }}
      >
        <i className={`fas fa-${icon} ${colorClass}`} />
        <span>{label}</span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData: ReciboCaja) => {
    return (
      <div className="d-flex justify-content-center">
        <CustomPRTableMenu
          menuItems={[
            {
              label: "Imprimir Recibo",
              icon: <i className="fas fa-receipt me-2"></i>,
              command: () => generatePrintReceipt(rowData),
            },
            {
              label: "Anular Recibo Caja",
              icon: <i className="fas fa-money-bill-transfer me-2"></i>,
              command: () => generateCancelReceipt(rowData),
            },
          ]}
          rowData={rowData}
        />
      </div>
    );
  };

  const getEstadoSeverity = (estado: string) => {
    switch (estado) {
      case "approved":
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
      case "Anulado":
        return "danger";
      default:
        return null;
    }
  };

  const getStatusLabel = (type: string) => {
    switch (type) {
      case "approved":
        return "Aprobado";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Anulado";
      case "completed":
        return "Completado";
      default:
        return null;
    }
  };

  const getTipoSeverity = (tipo: string) => {
    switch (tipo) {
      case "ingreso":
        return "success";
      case "egreso":
        return "danger";
      case "reembolso":
        return "info";
      default:
        return null;
    }
  };

  const getAction = (action: string) => {
    switch (action) {
      case "partial_payment":
        return "Pago Parcial";
      case "full_payment":
        return "Pagado";
      default:
        return action;
    }
  };

  // Definición de columnas para la tabla
  const columns: CustomPRTableColumnProps[] = [
    {
      field: "id",
      header: "Número Recibo",
    },
    {
      field: "type",
      header: "Tipo",
      body: (rowData: any) => (
        <Tag value={rowData.type} severity={getTipoSeverity(rowData.type)} />
      ),
    },
    {
      field: "third_party.name",
      header: "Cliente",
    },
    {
      field: "action",
      header: "Origen Dinero",
      body: (rowData: any) => <span>{getAction(rowData.action)}</span>,
    },
    {
      field: "created_at",
      header: "Fecha",
      body: (data: any) => (
        <>
          <span>{formatDate(data.created_at, true)}</span>
        </>
      ),
    },
    {
      field: "total_amount",
      header: "Valor",
      body: (data: any) => (
        <span>{`$${formatCurrency(data.total_amount)}`}</span>
      ),
    },
    {
      field: "status",
      header: "Estado",
      sortable: true,
      body: (rowData: any) => (
        <Tag
          value={getStatusLabel(rowData.status)}
          severity={getEstadoSeverity(rowData.status)}
        />
      ),
    },
    {
      field: "actions",
      header: "Acciones",
      body: actionBodyTemplate,
    },
  ];

  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333",
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600,
    },
    tableCell: {
      padding: "0.75rem 1rem",
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block",
    },
  };

  return (
    <div
      className="container-fluid mt-4"
      style={{ width: "100%", padding: "0 15px" }}
    >
      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <Button
          label="Nuevo Recibo de Caja"
          className="btn btn-primary"
          onClick={() => setShowReciboModal(true)}
        />
      </div>

      {/* Card de Filtros */}
      <Card style={styles.card}>
        <div className="row g-3">
          {/* Tipo de Recibo */}
          <div className="col-md-8 col-lg-3">
            <label style={styles.formLabel}>Tipo de Recibo</label>
            <Dropdown
              value={filtros.type}
              options={tiposRecibo}
              onChange={(e) => handleFilterChange("type", e.value)}
              optionLabel="label"
              placeholder="Tipo"
              className={classNames("w-100")}
            />
          </div>

          {/* Rango de fechas */}
          <div className="col-md-8 col-lg-3">
            <label style={styles.formLabel}>Rango de fechas</label>
            <Calendar
              value={filtros.createdAt}
              onChange={(e) => handleFilterChange("createdAt", e.value)}
              selectionMode="range"
              dateFormat="dd/mm/yy"
              placeholder="Rango fechas"
              className={classNames("w-100")}
              showIcon
              readOnlyInput
            />
          </div>

          {/* Estado */}
          <div className="col-md-8 col-lg-3">
            <label style={styles.formLabel}>Estado</label>
            <Dropdown
              value={filtros.status}
              options={[
                { label: "Aprobado", value: "approved" },
                { label: "Pendiente", value: "pending" },
                { label: "Completado", value: "completed" },
                { label: "Anulado", value: "cancelled" },
              ]}
              onChange={(e) => handleFilterChange("status", e.value)}
              placeholder="Estado"
              className={classNames("w-100")}
            />
          </div>

          <div className="col-md-8 col-lg-3">
            <label style={styles.formLabel}>Origen</label>
            <Dropdown
              value={filtros.action}
              options={[
                { label: "Anticipo", value: "advance_payment" },
                { label: "Pago Parcial ", value: "partial_payment" },
                { label: "Pago completo", value: "full_payment" },
              ]}
              onChange={(e) => handleFilterChange("action", e.value)}
              placeholder="Origen"
              className={classNames("w-100")}
            />
          </div>

          {/* Cliente */}
          <div className="col-md-8 col-lg-3">
            <label style={styles.formLabel}>Cliente</label>
            <Dropdown
              value={filtros.thirdParty}
              options={thirdParties}
              onChange={(e) => handleFilterChange("thirdParty", e.value)}
              optionLabel="name"
              placeholder="Cliente"
              className={classNames("w-100")}
            />
          </div>

          {/* Botones compactos */}
          <div className="col-12 d-flex justify-content-end gap-2">
            <Button
              label="Limpiar filtros"
              className="btn btn-phoenix-secondary"
              onClick={limpiarFiltros}
            />
            <Button
              label="Aplicar filtro"
              className="btn btn-primary"
              onClick={refresh}
              loading={loadingPaginator}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de resultados */}
      <Card title="Recibos de Caja" className="shadow-2">
        <CustomPRTable
          columns={columns}
          data={cashRecipesData}
          lazy
          first={first}
          rows={perPage}
          totalRecords={totalRecords}
          loading={loadingPaginator}
          onPage={handlePageChange}
          onSearch={handleSearchChange}
          onReload={refresh}
        />
      </Card>

      {/* Modal para nuevo recibo */}
      <NewReceiptBoxModalTable
        visible={showReciboModal}
        onHide={() => setShowReciboModal(false)}
        receiptType={currentReceiptType}
        onSubmit={(data) => {
          setShowReciboModal(false);
          refresh(); // Refrescar la tabla después de crear un nuevo recibo
        }}
      />

      <CustomFormModal
        show={showCancellationModal}
        onHide={() => setShowCancellationModal(false)}
        formId="cancellationForm"
        title="Solicitud de anulación"
      >
        <MakeRequestForm
          formId="cancellationForm"
          onHandleSubmit={handleMakeRequest}
        />
      </CustomFormModal>
    </div>
  );
};
