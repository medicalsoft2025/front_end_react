import React from "react";
import { prescriptionService, examOrderService, patientService, examRecipeService, clinicalRecordService, admissionService } from "../../services/api/index.js";
import { Tooltip } from "primereact/tooltip";
import { AppointmentFormModal } from "./AppointmentFormModal.js";
export const PostConsultationGestion = () => {
  const [showAppointmentFormModal, setShowAppointmentFormModal] = React.useState(false);
  const patientId = new URLSearchParams(window.location.search).get("patientId");
  const cards = [{
    id: "facturaAdmision",
    icono: "hospital-user",
    titulo: "Factura de admisión",
    texto: "Descargar última factura de admisión",
    iconoButton: "download",
    tooltip: "Ultima factura de admisión"
  }, {
    id: "incapacidades",
    icono: "wheelchair",
    titulo: "Incapacidades clínicas",
    texto: "Descargar última incapacidad clínica",
    iconoButton: "download",
    tooltip: "Ultima incapacidad"
  }, {
    id: "ordenesMedicas",
    icono: "file-circle-plus",
    titulo: "Órdenes médicas",
    texto: "Descargar última orden médica",
    iconoButton: "download",
    tooltip: "Ultima orden médica"
  }, {
    id: "historiasClinicas",
    icono: "book-medical",
    titulo: "Historias clínicas",
    texto: "Descargar última historia clínica",
    iconoButton: "download",
    tooltip: "Ultima historia clínica"
  }, {
    id: "recetasMedicas",
    icono: "kit-medical",
    titulo: "Recetas médicas",
    texto: "Descargar última receta médica",
    iconoButton: "download",
    tooltip: "Ultima receta médica"
  }, {
    id: "agendarCita",
    icono: "calendar-days",
    titulo: "Agendar cita",
    texto: "Agendar nueva cita",
    iconoButton: "plus",
    tooltip: "Nueva cita"
  }];
  const handleClick = (id, patientId) => {
    handleFetchById(id, patientId);
  };
  function handleFetchById(id, patientId) {
    switch (id) {
      case "facturaAdmision":
        fetchLastAdmissionByPatientId(patientId);
        break;
      case "incapacidades":
        fetchLastDisabilityByPatientId(patientId);
        break;
      case "ordenesMedicas":
        fetchLastExamOrderByPatientId(patientId);
        break;
      case "historiasClinicas":
        fetchLastClinicalrecordByPatientId(patientId);
        break;
      case "recetasMedicas":
        fetchLastRecipeItemsByPatientId(patientId);
        break;
      case "agendarCita":
        setShowAppointmentFormModal(true);
        break;
    }
  }
  async function fetchLastAdmissionByPatientId(id) {
    const admission = await admissionService.getLastAdmissionByPatient(id);
    //@ts-ignore
    generateInvoice(admission.admission.appointment_id, false);
    // console.error(
    //   SwalManager.error({ text: "Este usuario no tiene facturas" })
    // );
  }
  async function fetchLastDisabilityByPatientId(id) {
    const disability = await patientService.getLastDisability(id);
    //@ts-ignore
    crearDocumento(disability, "Impresion", "Incapacidad", "Completa", "Incapacidad Médica");
  }
  async function fetchLastExamOrderByPatientId(id) {
    const examOrder = await examRecipeService.lastByPatient(id);
    //@ts-ignore
    crearDocumento(examOrder.id, "Impresion", "RecetaExamen", "Completa", "Receta_de_examenes");
  }
  async function fetchLastClinicalrecordByPatientId(id) {
    const clinicalRecord = await clinicalRecordService.lastByPatient(id);
    //@ts-ignore
    crearDocumento(clinicalRecord.id, "Impresion", "Consulta", "Completa", "Historia clinica");
  }
  async function fetchLastRecipeItemsByPatientId(id) {
    const recipesItems = await prescriptionService.getLastByPatientId(id);
    //@ts-ignore
    await crearDocumento(recipesItems.data.id, "Impresion", "Receta", "Completa", "Receta");
    // console.error(SwalManager.error({ text: "Este usuario no tiene recetas" }));
  }
  async function handlePreviewResults(patientId) {
    const examOrderResult = await examOrderService.getLastByPatient(patientId);
    if (examOrderResult.minio_id) {
      //@ts-ignore
      const url = await getFileUrl(examOrderResult.minio_id);
      window.open(url, "_blank");
    } else {
      window.location.href = `verResultadosExamen?patient_id=${examOrderResult.patient_id}&exam_id=${examOrderResult.id}`;
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "row row-cols-2 row-cols-sm-4 row-cols-xl-5 row-cols-xxl-5 g-3 mb-3 mt-2"
  }, cards.map(card => /*#__PURE__*/React.createElement("div", {
    className: "col",
    key: card.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "card text-center",
    style: {
      maxWidth: "15rem",
      minHeight: "15em"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body d-flex flex-column justify-content-between align-items-center",
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fas fa-${card.icono} fa-2x`
  })), /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, card.titulo), /*#__PURE__*/React.createElement("p", {
    className: "card-text fs-9 text-center"
  }, card.texto), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-icon mt-auto btn-tab",
    onClick: () => handleClick(card.id, patientId),
    id: card.id
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
    target: ".custom-target-icon"
  }), /*#__PURE__*/React.createElement("i", {
    "data-pr-tooltip": card.tooltip,
    className: `fas fa-${card.iconoButton} custom-target-icon`,
    "data-pr-position": "right"
  }))), card.id == "ordenesMedicas" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-icon mt-auto btn-tab",
    onClick: () => handlePreviewResults(patientId),
    id: card.id
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
    target: ".custom-target-icon"
  }), /*#__PURE__*/React.createElement("i", {
    "data-pr-tooltip": "Ver resultados",
    className: `fas fa-file-export custom-target-icon`,
    "data-pr-position": "right"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-icon mt-auto btn-tab",
    onClick: () => setShowAppointmentFormModal(true),
    id: card.id
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
    target: ".custom-target-icon"
  }), /*#__PURE__*/React.createElement("i", {
    "data-pr-tooltip": "Nueva cita",
    className: `fas fa-calendar-days custom-target-icon`,
    "data-pr-position": "right"
  }))))))))), /*#__PURE__*/React.createElement(AppointmentFormModal, {
    isOpen: showAppointmentFormModal,
    onClose: () => setShowAppointmentFormModal(false)
  }));
};