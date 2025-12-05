import React from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../components/CustomPRTable";
import { usePatientsByFilters } from "./hooks/usePatientsByFilters";
import { getAge } from "../../services/utilidades";
import PatientFormModal from "./modals/form/PatientFormModal";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
import { PatientInfoContainer } from "./PatientInfoContainer";
import { patientService } from "../../services/api";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NotificationsFormInputs } from "./models/Patient";
import { InputSwitch } from "primereact/inputswitch";
import { SwalManager } from "../../services/alertManagerImported";

type PatientAsyncTableItem = {
  id: string;
  patientName: string;
  documentNumber: string;
  phone: string;
  age: string;
  dateLastAppointment: string;
};

export const PatientAsyncTable: React.FC = () => {
  const [tableItems, setTableItems] = useState<PatientAsyncTableItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState<string | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingPatientId, setViewingPatientId] = useState<string | null>(null);
  const { patients, fetchPatientsByFilters, loading, totalRecords } =
    usePatientsByFilters();
  const [modalNotificationsVisible, setModalNotificationsVisible] =
    useState(false);
  const { control, handleSubmit, reset } = useForm<NotificationsFormInputs>({
    defaultValues: {
      whatsapp_notifications: false,
      email_notifications: false,
    },
  });
  const [rowPatient, setRowPatient] = useState<any>(null);

  useEffect(() => {
    fetchPatientsByFilters({});
  }, []);

  const handlePageChange = (page: any) => {
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchPatientsByFilters({
      per_page: page.rows,
      page: calculatedPage,
      search: search ?? "",
    });
  };

  const handlePatientCreated = () => {
    setShowPatientModal(false);
    refresh();
  };

  const handlePatientUpdated = () => {
    setShowEditModal(false);
    setEditingPatient(null);
    refresh();
  };

  const handleSearchChange = (_search: string) => {
    setSearch(_search);
    fetchPatientsByFilters({
      per_page: perPage,
      page: currentPage,
      search: _search,
    });
  };

  const refresh = () =>
    fetchPatientsByFilters({
      per_page: perPage,
      page: currentPage,
      search: search ?? "",
    });

  const handleEditarPaciente = async (patientId: string) => {
    const patient = await patientService.get(patientId);
    if (patient) {
      setEditingPatient(patient);
      setShowEditModal(true);
    }
  };

  const handleVerMas = (patientId: string) => {
    setViewingPatientId(patientId);
  };

  const handleAllowNotifications = (rowData: any) => {
    setRowPatient(rowData);
    reset({
      whatsapp_notifications: rowData.whatsapp_notifications,
      email_notifications: rowData.email_notifications,
    });
    setModalNotificationsVisible(true);
  };

  async function saveNotifications(data: NotificationsFormInputs) {
    const formData = {
      whatsapp_notifications: data.whatsapp_notifications,
      email_notifications: data.email_notifications,
    };
    const response = await patientService.update(Number(rowPatient.id), formData);

    SwalManager.success({
      title: "Notificaciones actualizadas",
    });

    setModalNotificationsVisible(false);
    refresh();
  }

  useEffect(() => {
    const mappedPatients: PatientAsyncTableItem[] = patients.map(
      (item: any) => {
        const lastAppointment =
          item.appointments.sort((a, b) => {
            const dateComparison =
              new Date(a.appointment_date).getTime() -
              new Date(b.appointment_date).getTime();
            if (dateComparison !== 0) return dateComparison;
            const timeComparison = a.appointment_time.localeCompare(
              b.appointment_time
            );
            return timeComparison;
          })[0] || null;

        const age = getAge(item.date_of_birth);

        return {
          id: item.id.toString(),
          patientName:
            `${item.first_name || ""} ${item.middle_name || ""} ${
              item.last_name || ""
            } ${item.second_last_name || ""}`.trim() || "--",
          documentNumber: item.document_number,
          phone: item.whatsapp || "--",
          age: age > 0 ? `${getAge(item.date_of_birth).toString()} años` : "--",
          dateLastAppointment: lastAppointment?.appointment_date || "--",
          whatsapp_notifications: item.whatsapp_notifications,
          email_notifications: item.email_notifications,
        };
      }
    );
    setTableItems(mappedPatients);
  }, [patients]);

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "patientName",
      header: "Nombre del paciente",
      body: (rowData: PatientAsyncTableItem) => {
        return (
          <>
            <a href={`verPaciente?id=${rowData.id}`}>{rowData.patientName}</a>
          </>
        );
      },
    },
    { field: "documentNumber", header: "Nro. de documento" },
    { field: "phone", header: "Teléfono" },
    { field: "age", header: "Edad" },
    { field: "dateLastAppointment", header: "Fecha de última consulta" },
    {
      field: "actions",
      header: "Acciones",
      body: (rowData: PatientAsyncTableItem) => {
        return (
          <div>
            <TableMenu
              patientId={rowData.id}
              rowData={rowData}
              onEditarPaciente={handleEditarPaciente}
              onActualizarPermisos={handleAllowNotifications}
              onVerMas={handleVerMas}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div
        className="card card-content-main text-body-emphasis rounded-3  w-100 w-md-100 w-lg-100 mx-auto"
        style={{ minHeight: "400px" }}
      >
        <div
          className="card-body h-100 w-100 d-flex flex-column"
          style={{ marginTop: "-15px" }}
        >
          <div className="d-flex justify-content-end align-items-center mb-2">
            <Button
              label="Nuevo Paciente "
              className="p-button-primary"
              onClick={() => setShowPatientModal(true)}
              icon={<i className="fas fa-plus me-2"></i>}
            ></Button>
          </div>
          <CustomPRTable
            columns={columns}
            data={tableItems}
            sortField="createdAt"
            sortOrder={-1}
            onPage={handlePageChange}
            onSearch={handleSearchChange}
            loading={loading}
            totalRecords={totalRecords}
            rows={perPage}
            first={first}
            onReload={refresh}
            lazy
          />
        </div>
      </div>

      <PatientFormModal
        visible={showPatientModal}
        onHide={() => setShowPatientModal(false)}
        onSuccess={handlePatientCreated}
      />

      {editingPatient && (
        <PatientFormModal
          visible={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSuccess={handlePatientUpdated}
          patientData={editingPatient}
        />
      )}

      <Dialog
        header="Información del Paciente"
        visible={!!viewingPatientId}
        style={{ width: "80vw", maxWidth: "1000px" }}
        onHide={() => setViewingPatientId(null)}
        draggable={false}
        resizable={false}
      >
        {viewingPatientId && (
          <PatientInfoContainer
            patientId={viewingPatientId}
            hideEditButton={true}
          />
        )}
      </Dialog>

      <Dialog
        header="Información de notificaciones"
        visible={modalNotificationsVisible}
        style={{ width: "30vw" }}
        onHide={() => setModalNotificationsVisible(false)}
        draggable={false}
        resizable={false}
      >
        <form onSubmit={handleSubmit(saveNotifications)}>
          <div className=" mb-3 d-flex align-items-center gap-3">
            <Controller
              name="whatsapp_notifications"
              control={control}
              render={({ field }) => (
                <>
                  <label htmlFor={field.name} className="form-label">
                    Notificaciones por whatsapp
                  </label>
                  <InputSwitch
                    id={field.name}
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </>
              )}
            />
          </div>

          <div className="mb-3 d-flex align-items-center gap-3">
            <Controller
              name="email_notifications"
              control={control}
              render={({ field }) => (
                <>
                  <label htmlFor={field.name} className="form-label">
                    Notificaciones por email
                  </label>
                  <InputSwitch
                    id={field.name}
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </>
              )}
            />
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Button
              type="submit"
              label="Guardar"
              icon="pi pi-check"
              className="p-button-sm"
              loading={loading}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
};

const TableMenu: React.FC<{
  patientId: string;
  rowData: any;
  onEditarPaciente: (id: string) => void;
  onActualizarPermisos: (id: string) => void;
  onVerMas: (id: string) => void;
}> = ({
  patientId,
  rowData,
  onEditarPaciente,
  onActualizarPermisos,
  onVerMas,
}) => {
  const menu = useRef<Menu>(null);

  return (
    <>
      <Button
        label="Acciones"
        className="p-button-primary flex items-center"
        onClick={(e) => menu.current?.toggle(e)}
        aria-controls={`popup_menu_${patientId}`}
        aria-haspopup
        icon={<i className="fa fa-cog me-2"></i>}
      ></Button>
      <Menu
        model={[
          {
            label: "Ver más",
            icon: <i className="fas fa-eye me-2"></i>,
            command: () => onVerMas(patientId),
          },
          {
            label: "Editar paciente",
            icon: <i className="fas fa-pencil-alt me-2"></i>,
            command: () => onEditarPaciente(patientId),
          },
          {
            label: "Actualizar permisos de notificaciones",
            icon: <i className="fas fa-bell me-2"></i>,
            command: () => onActualizarPermisos(rowData),
          },
        ]}
        popup
        ref={menu}
        id={`popup_menu_${patientId}`}
        style={{ zIndex: 9999 }}
      />
    </>
  );
};
