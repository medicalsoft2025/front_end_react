import React, { useEffect, useState } from "react";
import { prescriptionService, examOrderService, patientService, examRecipeService, clinicalRecordService, admissionService, appointmentService } from "../../services/api/index.js";
import { Tooltip } from "primereact/tooltip";
import { AppointmentFormModal } from "./AppointmentFormModal.js";
import { useOptometry } from "../clinical-records/optometry/hooks/useOptometry.js";
import { OptometryBillingModal } from "../clinical-records/optometry/modal/OptometryBillingModal.js";
import { Button } from "primereact/button";
import AdmissionBilling from "../admission/admission-billing/AdmissionBilling.js";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
import { formatDate } from "../../services/utilidades.js";
export const PostConsultationGestion = () => {
  const [showAppointmentFormModal, setShowAppointmentFormModal] = React.useState(false);
  const [lastAppointment, setLastAppointment] = React.useState(null);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [admissionFormAppointment, setAdmissionFormAppointment] = useState(null);
  const patientId = new URLSearchParams(window.location.search).get("patient_id");
  const [showBillingModal, setShowBillingModal] = useState({
    show: false,
    id: 0
  });
  const {
    getRecipeInvoiceStatus
  } = useOptometry();
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
    id: "recetasMedicasOptometry",
    icono: "glasses",
    titulo: "Recetas médicas - optometría",
    texto: "Descargar última receta",
    iconoButton: "download",
    tooltip: "Ultima receta médica - optometría"
  }, {
    id: "agendarCita",
    icono: "calendar-days",
    titulo: "Agendar cita",
    texto: "Agendar nueva cita",
    iconoButton: "plus",
    tooltip: "Nueva cita"
  }, {
    id: "admission",
    icono: "file-invoice-dollar",
    titulo: "Admision",
    texto: "Admisionar paciente",
    iconoButton: "arrow-right",
    tooltip: "Admision"
  }];
  async function loadLastAppointment() {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const filters = {
      patientId: +patientId,
      appointmentDate: formattedDate,
      appointmentState: "pending"
    };
    const data = await appointmentService.appointmentsWithFilters(filters);
    if (data.data.data.length) {
      const serverLastAppointment = data.data.data[0];
      setLastAppointment(serverLastAppointment);
      setAdmissionFormAppointment({
        ...serverLastAppointment,
        patient: serverLastAppointment.patient
      });
    }
  }
  useEffect(() => {
    loadLastAppointment();
  }, []);
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
      case "recetasMedicasOptometry":
        fetchLastReceiptOptometryByPatientId(patientId);
        break;
      case "agendarCita":
        setShowAppointmentFormModal(true);
        break;
      case "admission":
        redirToAdmission();
        break;
    }
  }
  function redirToAdmission() {
    //window.location.href = `generar_admision_rd?id_cita=${lastAppointment.id}&redirTo=postConsultationGestion`;
    handleFacturarAdmision();
  }
  async function fetchLastAdmissionByPatientId(id) {
    const admission = await admissionService.getLastAdmissionByPatient(id);
    //@ts-ignore
    generateInvoice(admission.admission.appointment_id, false);
  }
  async function fetchLastDisabilityByPatientId(id) {
    const disability = await patientService.getLastDisability(id);
    console.log("disability", disability);
    generarFormato("Incapacidad", disability, "Impresion");
  }
  async function fetchLastExamOrderByPatientId(id) {
    const examOrder = await examRecipeService.lastByPatient(id);
    //@ts-ignore
    generarFormato("RecetaExamen", examOrder, "Impresion");
  }
  async function fetchLastClinicalrecordByPatientId(id) {
    const clinicalRecord = await clinicalRecordService.lastByPatient(id);
    const mnappedClinicalRecord = {
      id: clinicalRecord.id,
      clinicalRecordName: clinicalRecord.clinical_record_type.name,
      clinicalRecordType: clinicalRecord.clinical_record_type.key_ || "",
      description: clinicalRecord.description || "--",
      doctorName: `${clinicalRecord.created_by_user.first_name} ${clinicalRecord.created_by_user.middle_name} ${clinicalRecord.created_by_user.last_name} ${clinicalRecord.created_by_user.second_last_name}`,
      status: clinicalRecord.status,
      patientId: clinicalRecord.patient_id,
      patient: clinicalRecord.patient,
      createdAt: formatDate(clinicalRecord.created_at),
      user: clinicalRecord.created_by_user,
      data: clinicalRecord.data,
      clinicalRecordTypeId: clinicalRecord.clinical_record_type.id
    };
    generarFormato("Consulta", mnappedClinicalRecord, "Impresion");
  }
  async function fetchLastRecipeItemsByPatientId(id) {
    const recipesItems = await prescriptionService.getLastByPatientId(id, null);
    generarFormato("Receta", recipesItems.data, "Impresion");
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
  async function fetchLastReceiptOptometryByPatientId(patientId) {
    const recipesItems = await prescriptionService.getLastByPatientId(patientId, "optometry");
    const invoiceData = await getRecipeInvoiceStatus(recipesItems.data.id);
    if (invoiceData.has_invoice) {
      generarFormato("RecetaOptometria", recipesItems.data, "Impresion");
    } else {
      setShowBillingModal({
        show: true,
        id: recipesItems.data.id
      });
    }
  }
  const handleFacturarAdmision = () => {
    setShowBillingDialog(true);
  };
  const handleBillingSuccess = () => {
    setShowBillingDialog(false);
  };
  const handleBillingHide = () => {
    setShowBillingDialog(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "post-consultation-cards"
  }, cards.map(card => /*#__PURE__*/React.createElement("div", {
    className: "post-consultation-card",
    key: card.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fas fa-${card.icono} fa-2x`
  })), /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, card.titulo), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, card.texto), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center align-items-center gap-2"
  }, card.id == "admission" ? /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: () => handleClick(card.id, patientId),
    disabled: !lastAppointment,
    id: card.id
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
    target: ".custom-target-icon"
  }), /*#__PURE__*/React.createElement("i", {
    "data-pr-tooltip": card.tooltip,
    className: `fas fa-${card.iconoButton} custom-target-icon`,
    "data-pr-position": "right"
  }))) : /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: () => handleClick(card.id, patientId),
    id: card.id
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
    target: ".custom-target-icon"
  }), /*#__PURE__*/React.createElement("i", {
    "data-pr-tooltip": card.tooltip,
    className: `fas fa-${card.iconoButton} custom-target-icon`,
    "data-pr-position": "right"
  }))), card.id == "ordenesMedicas" && /*#__PURE__*/React.createElement("div", {
    className: "additional-buttons d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: () => handlePreviewResults(patientId)
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
    target: ".custom-target-icon"
  }), /*#__PURE__*/React.createElement("i", {
    "data-pr-tooltip": "Ver resultados",
    className: "fas fa-file-export custom-target-icon",
    "data-pr-position": "right"
  }))), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: () => setShowAppointmentFormModal(true)
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
    target: ".custom-target-icon"
  }), /*#__PURE__*/React.createElement("i", {
    "data-pr-tooltip": "Nueva cita",
    className: "fas fa-calendar-days custom-target-icon",
    "data-pr-position": "right"
  })))))))), /*#__PURE__*/React.createElement(AppointmentFormModal, {
    isOpen: showAppointmentFormModal,
    onClose: () => setShowAppointmentFormModal(false)
  }), /*#__PURE__*/React.createElement(OptometryBillingModal, {
    receiptId: showBillingModal.id,
    show: showBillingModal.show,
    onHide: () => setShowBillingModal({
      show: false,
      id: 0
    }),
    onSaveSuccess: () => {
      // Aquí puedes agregar lógica para refrescar datos si es necesario
    }
  }), /*#__PURE__*/React.createElement(AdmissionBilling, {
    visible: showBillingDialog,
    onHide: handleBillingHide,
    onSuccess: handleBillingSuccess,
    appointmentData: admissionFormAppointment
  }));
};