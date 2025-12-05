import React from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { usePatientsByFilters } from "./hooks/usePatientsByFilters.js";
import { getAge } from "../../services/utilidades.js";
import PatientFormModal from "./modals/form/PatientFormModal.js";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
import { PatientInfoContainer } from "./PatientInfoContainer.js";
import { patientService } from "../../services/api/index.js";
import { Controller, useForm } from "react-hook-form";
import { InputSwitch } from "primereact/inputswitch";
import { SwalManager } from "../../services/alertManagerImported.js";
export const PatientAsyncTable = () => {
  const [tableItems, setTableItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingPatientId, setViewingPatientId] = useState(null);
  const {
    patients,
    fetchPatientsByFilters,
    loading,
    totalRecords
  } = usePatientsByFilters();
  const [modalNotificationsVisible, setModalNotificationsVisible] = useState(false);
  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      whatsapp_notifications: false,
      email_notifications: false
    }
  });
  const [rowPatient, setRowPatient] = useState(null);
  useEffect(() => {
    fetchPatientsByFilters({});
  }, []);
  const handlePageChange = page => {
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchPatientsByFilters({
      per_page: page.rows,
      page: calculatedPage,
      search: search ?? ""
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
  const handleSearchChange = _search => {
    setSearch(_search);
    fetchPatientsByFilters({
      per_page: perPage,
      page: currentPage,
      search: _search
    });
  };
  const refresh = () => fetchPatientsByFilters({
    per_page: perPage,
    page: currentPage,
    search: search ?? ""
  });
  const handleEditarPaciente = async patientId => {
    const patient = await patientService.get(patientId);
    if (patient) {
      setEditingPatient(patient);
      setShowEditModal(true);
    }
  };
  const handleVerMas = patientId => {
    setViewingPatientId(patientId);
  };
  const handleAllowNotifications = rowData => {
    setRowPatient(rowData);
    reset({
      whatsapp_notifications: rowData.whatsapp_notifications,
      email_notifications: rowData.email_notifications
    });
    setModalNotificationsVisible(true);
  };
  async function saveNotifications(data) {
    const formData = {
      whatsapp_notifications: data.whatsapp_notifications,
      email_notifications: data.email_notifications
    };
    const response = await patientService.update(Number(rowPatient.id), formData);
    SwalManager.success({
      title: "Notificaciones actualizadas"
    });
    setModalNotificationsVisible(false);
    refresh();
  }
  useEffect(() => {
    const mappedPatients = patients.map(item => {
      const lastAppointment = item.appointments.sort((a, b) => {
        const dateComparison = new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime();
        if (dateComparison !== 0) return dateComparison;
        const timeComparison = a.appointment_time.localeCompare(b.appointment_time);
        return timeComparison;
      })[0] || null;
      const age = getAge(item.date_of_birth);
      return {
        id: item.id.toString(),
        patientName: `${item.first_name || ""} ${item.middle_name || ""} ${item.last_name || ""} ${item.second_last_name || ""}`.trim() || "--",
        documentNumber: item.document_number,
        phone: item.whatsapp || "--",
        age: age > 0 ? `${getAge(item.date_of_birth).toString()} años` : "--",
        dateLastAppointment: lastAppointment?.appointment_date || "--",
        whatsapp_notifications: item.whatsapp_notifications,
        email_notifications: item.email_notifications
      };
    });
    setTableItems(mappedPatients);
  }, [patients]);
  const columns = [{
    field: "patientName",
    header: "Nombre del paciente",
    body: rowData => {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
        href: `verPaciente?id=${rowData.id}`
      }, rowData.patientName));
    }
  }, {
    field: "documentNumber",
    header: "Nro. de documento"
  }, {
    field: "phone",
    header: "Teléfono"
  }, {
    field: "age",
    header: "Edad"
  }, {
    field: "dateLastAppointment",
    header: "Fecha de última consulta"
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TableMenu, {
        patientId: rowData.id,
        rowData: rowData,
        onEditarPaciente: handleEditarPaciente,
        onActualizarPermisos: handleAllowNotifications,
        onVerMas: handleVerMas
      }));
    }
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card card-content-main text-body-emphasis rounded-3  w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Paciente ",
    className: "p-button-primary",
    onClick: () => setShowPatientModal(true),
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus me-2"
    })
  })), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    sortField: "createdAt",
    sortOrder: -1,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    loading: loading,
    totalRecords: totalRecords,
    rows: perPage,
    first: first,
    onReload: refresh,
    lazy: true
  }))), /*#__PURE__*/React.createElement(PatientFormModal, {
    visible: showPatientModal,
    onHide: () => setShowPatientModal(false),
    onSuccess: handlePatientCreated
  }), editingPatient && /*#__PURE__*/React.createElement(PatientFormModal, {
    visible: showEditModal,
    onHide: () => setShowEditModal(false),
    onSuccess: handlePatientUpdated,
    patientData: editingPatient
  }), /*#__PURE__*/React.createElement(Dialog, {
    header: "Informaci\xF3n del Paciente",
    visible: !!viewingPatientId,
    style: {
      width: "80vw",
      maxWidth: "1000px"
    },
    onHide: () => setViewingPatientId(null),
    draggable: false,
    resizable: false
  }, viewingPatientId && /*#__PURE__*/React.createElement(PatientInfoContainer, {
    patientId: viewingPatientId,
    hideEditButton: true
  })), /*#__PURE__*/React.createElement(Dialog, {
    header: "Informaci\xF3n de notificaciones",
    visible: modalNotificationsVisible,
    style: {
      width: "30vw"
    },
    onHide: () => setModalNotificationsVisible(false),
    draggable: false,
    resizable: false
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(saveNotifications)
  }, /*#__PURE__*/React.createElement("div", {
    className: " mb-3 d-flex align-items-center gap-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "whatsapp_notifications",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Notificaciones por whatsapp"), /*#__PURE__*/React.createElement(InputSwitch, {
      id: field.name,
      checked: field.value,
      onChange: field.onChange
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 d-flex align-items-center gap-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "email_notifications",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Notificaciones por email"), /*#__PURE__*/React.createElement(InputSwitch, {
      id: field.name,
      checked: field.value,
      onChange: field.onChange
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar",
    icon: "pi pi-check",
    className: "p-button-sm",
    loading: loading
  })))));
};
const TableMenu = ({
  patientId,
  rowData,
  onEditarPaciente,
  onActualizarPermisos,
  onVerMas
}) => {
  const menu = useRef(null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    label: "Acciones",
    className: "p-button-primary flex items-center",
    onClick: e => menu.current?.toggle(e),
    "aria-controls": `popup_menu_${patientId}`,
    "aria-haspopup": true,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-cog me-2"
    })
  }), /*#__PURE__*/React.createElement(Menu, {
    model: [{
      label: "Ver más",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-eye me-2"
      }),
      command: () => onVerMas(patientId)
    }, {
      label: "Editar paciente",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-pencil-alt me-2"
      }),
      command: () => onEditarPaciente(patientId)
    }, {
      label: "Actualizar permisos de notificaciones",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-bell me-2"
      }),
      command: () => onActualizarPermisos(rowData)
    }],
    popup: true,
    ref: menu,
    id: `popup_menu_${patientId}`,
    style: {
      zIndex: 9999
    }
  }));
};