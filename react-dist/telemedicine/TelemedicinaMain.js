import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { RecordingModal } from "./modals/RecordingModal.js";
import { VideoConsultationModal } from "./modals/VideoConsultationModal.js";
import { ReportModal } from "./modals/ReportModal.js";
import { useFetchAppointments } from "../appointments/hooks/useFetchAppointments.js";
import { appointmentStateColorsByKey, appointmentStatesByKeyTwo } from "../../services/commons.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { CustomPRTableMenu } from "../components/CustomPRTableMenu.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { appointmentService } from "../../services/api/index.js";
import { useTemplateBuilded } from "../hooks/useTemplateBuilded.js";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { getIndicativeByCountry } from "../../services/utilidades.js";
export const TelemedicinaMain = () => {
  const getCustomFilters = () => ({
    appointmentType: "Virtual",
    sort: "-appointment_date,appointment_time"
  });
  const {
    appointments,
    handlePageChange,
    handleSearchChange,
    refresh,
    totalRecords,
    first,
    loading: loadingAppointments,
    perPage
  } = useFetchAppointments(getCustomFilters);
  const {
    fetchTemplate,
    switchTemplate
  } = useTemplateBuilded();
  const {
    sendMessage: sendMessageAppointmentHook
  } = useMassMessaging();
  const tenant = window.location.hostname.split(".")[0];
  const sendMessageAppointment = useRef(sendMessageAppointmentHook);
  const [mappedAppointments, setMappedAppointments] = useState([]);
  const [modalVideoVisible, setModalVideoVisible] = useState(false);
  const [modalGrabacionVisible, setModalGrabacionVisible] = useState(false);
  const [modalReporteVisible, setModalReporteVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  useEffect(() => {
    setMappedAppointments(appointments.map(appointment => ({
      id: +appointment.id,
      doctor: appointment.doctorName,
      fecha: appointment.date,
      hora: appointment.time,
      user_availability: appointment.user_availability,
      paciente: appointment.patientName,
      telefono: appointment.patientPhone,
      correo: appointment.patientEmail,
      estado: appointment.stateKey,
      attentionType: appointment.attentionType,
      stateKey: appointment.stateKey,
      patient: appointment.patient
    })));
  }, [appointments]);
  const sendMessageWhatsapp = useCallback(async (patient, templateFormatted, dataToFile) => {
    let dataMessage = {};
    if (dataToFile !== null) {
      dataMessage = {
        channel: "whatsapp",
        recipients: [getIndicativeByCountry(patient.country_id) + patient.whatsapp],
        message_type: "media",
        message: templateFormatted,
        attachment_url: dataToFile?.file_url,
        attachment_type: "document",
        minio_model_type: dataToFile?.model_type,
        minio_model_id: dataToFile?.model_id,
        minio_id: dataToFile?.id,
        webhook_url: "https://example.com/webhook"
      };
    } else {
      dataMessage = {
        channel: "whatsapp",
        recipients: [getIndicativeByCountry(patient.country_id) + patient.whatsapp],
        message_type: "text",
        message: templateFormatted,
        webhook_url: "https://example.com/webhook"
      };
    }
    await sendMessageAppointment.current(dataMessage);
  }, [sendMessageAppointmentHook]);
  const estadoBodyTemplate = rowData => {
    const color = appointmentStateColorsByKey[rowData.stateKey];
    const text = appointmentStatesByKeyTwo[rowData.stateKey]?.[rowData.attentionType] || appointmentStatesByKeyTwo[rowData.stateKey] || "SIN ESTADO";
    return /*#__PURE__*/React.createElement("span", {
      className: `badge badge-phoenix badge-phoenix-${color}`
    }, text);
  };
  const handleCancelAppointmentAction = async data => {
    SwalManager.confirmCancel(async () => {
      await appointmentService.changeStatus(Number(data.id), "cancelled");
      refresh();
      const dataTemplate = {
        tenantId: tenant,
        belongsTo: "citas-cancelacion",
        type: "whatsapp"
      };
      const dataFormated = {
        patient: data.patient,
        assigned_user_availability: data.user_availability,
        appointment_date: data.fecha,
        appointment_time: data.hora
      };
      const templateAppointment = await fetchTemplate(dataTemplate);
      const finishTemplate = await switchTemplate(templateAppointment.template, "appointments", dataFormated);
      sendMessageWhatsapp(data.patient, finishTemplate, null);
      SwalManager.success({
        text: "Cita cancelada exitosamente"
      });
    });
  };
  const getMenuItems = rowData => {
    const isCancelled = rowData.stateKey === "cancelled";
    return [{
      label: "Iniciar video",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-video me-2"
      }),
      command: () => {
        setCitaSeleccionada(rowData);
        setModalVideoVisible(true);
      },
      disabled: isCancelled
    }, {
      label: "No asistió",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-calendar-times me-2"
      }),
      command: () => handleCancelAppointmentAction(rowData),
      disabled: isCancelled
    }, {
      label: "Grabaciones",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-record-vinyl me-2"
      }),
      command: () => {
        setCitaSeleccionada(rowData);
        setModalGrabacionVisible(true);
      },
      disabled: isCancelled
    }];
  };
  const accionesBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(CustomPRTableMenu, {
      rowData: rowData,
      menuItems: getMenuItems(rowData)
    }));
  };
  const columns = [{
    header: "Doctor",
    field: "doctor",
    sortable: true
  }, {
    header: "Fecha",
    field: "fecha",
    sortable: true
  }, {
    header: "Hora",
    field: "hora",
    sortable: true
  }, {
    header: "Paciente",
    field: "paciente",
    sortable: true
  }, {
    header: "Teléfono",
    field: "telefono",
    sortable: true
  }, {
    header: "Correo",
    field: "correo",
    sortable: true
  }, {
    header: "Estado",
    field: "estado",
    sortable: true,
    body: estadoBodyTemplate
  }, {
    header: "Acciones",
    field: "acciones",
    sortable: false,
    body: accionesBodyTemplate,
    exportable: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0 text-primary"
  }, "Telemedicina")), /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm border-0"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: mappedAppointments,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingAppointments,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refresh,
    searchPlaceholder: "Buscar citas..."
  })))), /*#__PURE__*/React.createElement(VideoConsultationModal, {
    visible: modalVideoVisible,
    onHide: () => setModalVideoVisible(false),
    cita: citaSeleccionada
  }), /*#__PURE__*/React.createElement(RecordingModal, {
    visible: modalGrabacionVisible,
    onHide: () => setModalGrabacionVisible(false),
    cita: citaSeleccionada
  }), /*#__PURE__*/React.createElement(ReportModal, {
    visible: modalReporteVisible,
    onHide: () => setModalReporteVisible(false)
  }));
};
export default TelemedicinaMain;