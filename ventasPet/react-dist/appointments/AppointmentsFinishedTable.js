import React, { useEffect, useState } from "react";
import CustomDataTable from "../components/CustomDataTable.js";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { Calendar } from "primereact/calendar";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { PreadmissionForm } from "./PreadmissionForm.js";
import { appointmentService } from "../../services/api/index.js";
import UserManager from "../../services/userManager.js";
import { appointmentStatesColors, appointmentStateColorsByKey, appointmentStateFilters, appointmentStatesByKeyTwo } from "../../services/commons.js";
import { ExamResultsFileForm } from "../exams/components/ExamResultsFileForm.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { getUserLogged } from "../../services/utilidades.js";
export const AppointmentsFinishedTable = () => {
  const userLogged = getUserLogged();
  const patientId = new URLSearchParams(window.location.search).get("patient_id") || null;
  const {
    appointments,
    fetchAppointments
  } = useFetchAppointments(appointmentService.active());
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showLoadExamResultsFileModal, setShowLoadExamResultsFileModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState(null);
  const startDate = new Date(new Date().setDate(new Date().getDate() - 7));
  const endDate = new Date();
  const [selectedDate, setSelectedDate] = React.useState([startDate, endDate]);
  const [filteredAppointments, setFilteredAppointments] = React.useState([]);
  const [pdfFile, setPdfFile] = useState(null); // Para almacenar el archivo PDF
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); // Para la previsualización del PDF
  const [showPdfModal, setShowPdfModal] = useState(false); // Para controlar la visibilidad del modal de PDF

  const columns = [{
    data: "patientName",
    className: "text-start",
    orderable: true
  }, {
    data: "patientDNI",
    className: "text-start",
    orderable: true
  }, {
    data: "date",
    className: "text-start",
    orderable: true,
    type: "date"
  }, {
    data: "time",
    orderable: true
  }, {
    data: "doctorName",
    orderable: true
  }, {
    data: "entity",
    orderable: true
  }, {
    data: "status",
    orderable: true
  }];
  const [showFormModal, setShowFormModal] = useState({
    isShow: false,
    data: {}
  });
  const handleSubmit = async () => {
    try {
      // Llamar a la función guardarArchivoExamen
      //@ ts-ignore
      const enviarPDf = await guardarArchivoExamen("inputPdf", 2);

      // Acceder a la PromiseResult
      if (enviarPDf !== undefined) {
        console.log("PDF de prueba:", enviarPDf);
        console.log("Resultado de la promesa:", enviarPDf);
        await appointmentService.changeStatus(selectedAppointmentId, "consultation_completed");
        SwalManager.success({
          text: "Resultados guardados exitosamente"
        });
      } else {
        console.error("No se obtuvo un resultado válido.");
      }
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
    } finally {
      // Limpiar el estado después de la operación
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
      fetchAppointments();
    }
  };
  useEffect(() => {
    let filtered = [...appointments];
    if (userLogged.role.group === "DOCTOR") {
      filtered = filtered.filter(appointment => appointment?.user_availability?.user?.id === userLogged.id);
    }
    filtered = filtered.filter(appointment => `${appointment.stateKey}` === "consultation_completed");
    if (selectedDate?.length === 2 && selectedDate[0] && selectedDate[1]) {
      const startDate = new Date(Date.UTC(selectedDate[0].getFullYear(), selectedDate[0].getMonth(), selectedDate[0].getDate()));
      const endDate = new Date(Date.UTC(selectedDate[1].getFullYear(), selectedDate[1].getMonth(), selectedDate[1].getDate(), 23, 59, 59, 999));
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      });
    }
    setFilteredAppointments(filtered);
  }, [appointments, selectedBranch, selectedDate]);
  const handleMakeClinicalRecord = (patientId, appointmentId) => {
    UserManager.onAuthChange((isAuthenticated, user) => {
      if (user) {
        window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}&appointment_id=${appointmentId}`;
      }
    });
  };

  //filtrar objecto en el select
  const getAppointmentStates = () => {
    return Object.entries(appointmentStateFilters).map(([key, label]) => ({
      value: key,
      label: label
    }));
  };
  const handleRescheduleAppointment = async appointmentId => {
    console.log("Reagendando", appointmentId);
  };
  const handleCancelAppointment = async appointmentId => {
    SwalManager.confirmCancel(async () => {
      await appointmentService.changeStatus(appointmentId, "cancelled");
      SwalManager.success({
        text: "Cita cancelada exitosamente"
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };
  const handleHideFormModal = () => {
    setShowFormModal({
      isShow: false,
      data: {}
    });
  };
  const handleLoadExamResults = (appointmentId, patientId, productId) => {
    window.location.href = `cargarResultadosExamen?patient_id=${patientId}&product_id=${productId}&appointment_id=${appointmentId}`;
  };
  const handleLoadExamResultsFile = () => {
    setShowLoadExamResultsFileModal(true);
  };
  const slots = {
    0: (cell, data) => /*#__PURE__*/React.createElement("a", {
      href: `postConsultationGestion?patientId=${data.patientId}`
    }, data.patientName),
    6: (cell, data) => {
      const color = appointmentStateColorsByKey[data.stateKey] || appointmentStatesColors[data.stateId];
      const text = appointmentStatesByKeyTwo[data.stateKey]?.[data.attentionType] || appointmentStatesByKeyTwo[data.stateKey] || "SIN ESTADO";
      return /*#__PURE__*/React.createElement("span", {
        className: `badge badge-phoenix badge-phoenix-${color}`
      }, text);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse",
    "aria-expanded": "false",
    "aria-controls": "filtersCollapse"
  }, "Filtrar citas")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse",
    "aria-labelledby": "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rangoFechasCitas",
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "rangoFechasCitas",
    name: "rangoFechaCitas",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDate,
    onChange: e => setSelectedDate(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "300px"
    }
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    columns: columns,
    data: filteredAppointments,
    slots: slots
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start",
    style: {
      width: "200px"
    }
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "N\xFAmero de documento"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Fecha Consulta"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Hora Consulta"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Profesional asignado"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Entidad"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Estado")))))), showPdfModal && /*#__PURE__*/React.createElement("div", {
    className: "modal fade show",
    style: {
      display: "block",
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-dialog-centered modal-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title"
  }, "Previsualizaci\xF3n de PDF"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-close",
    onClick: () => {
      setPdfFile(null);
      setPdfPreviewUrl(null);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, pdfPreviewUrl ? /*#__PURE__*/React.createElement("embed", {
    src: pdfPreviewUrl,
    width: "100%",
    height: "500px",
    type: "application/pdf"
  }) : /*#__PURE__*/React.createElement("p", null, "Por favor, seleccione un archivo PDF.")), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".pdf",
    id: "inputPdf",
    onChange: e => {
      const file = e.target.files?.[0] || null;
      if (file) {
        setPdfFile(file);
        setPdfPreviewUrl(URL.createObjectURL(file));
      }
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => {
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
    }
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => {
      handleSubmit();
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
    }
  }, "Confirmar"))))), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "createPreadmission",
    show: showFormModal.isShow,
    onHide: handleHideFormModal,
    title: "Crear Preadmision" + " - " + showFormModal.data["patientName"]
  }, /*#__PURE__*/React.createElement(PreadmissionForm, {
    initialValues: showFormModal.data,
    formId: "createPreadmission"
  })), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "loadExamResultsFile",
    show: showLoadExamResultsFileModal,
    onHide: () => setShowLoadExamResultsFileModal(false),
    title: "Subir resultados de examen"
  }, /*#__PURE__*/React.createElement(ExamResultsFileForm, null)));
};