import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { clinicalRecordService } from "../../services/api/index.js";
import { Toast } from "primereact/toast";
import { formatTimeByMilliseconds, generateURLStorageKey, getDateTimeByMilliseconds, getLocalTodayISODateTime } from "../../services/utilidades.js";
import { FinishClinicalRecordForm } from "./FinishClinicalRecordForm.js";
import { usePRToast } from "../hooks/usePRToast.js";
import { PostConsultationGestion } from "../appointments/PostConsultationGestion.js";
function getPurpuse(purpuse) {
  switch (purpuse) {
    case "Tratamiento":
      return "TREATMENT";
    case "Promoción":
      return "PROMOTION";
    case "Rehabilitación":
      return "REHABILITATION";
    case "Prevención":
      return "PREVENTION";
  }
}
export const FinishClinicalRecordModal = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    showErrorToast,
    showFormErrorsToast
  } = usePRToast();
  const toast = useRef(null);
  const finishClinicalRecordFormRef = useRef(null);
  const {
    initialExternalDynamicData,
    clinicalRecordId = new URLSearchParams(window.location.search).get("clinical_record_id") || ""
  } = props;
  const [visible, setVisible] = useState(false);
  const [externalDynamicData, setExternalDynamicData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessfulSaveDialog, setShowSuccessfulSaveDialog] = useState(false);
  const [postConsultationVisibleCards, setPostConsultationVisibleCards] = useState(["historiasClinicas"]);
  const [patientId, setPatientId] = useState("");
  const [specialtyName, setSpecialtyName] = useState("");
  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };
  const updateExternalDynamicData = data => {
    setExternalDynamicData(data);
  };
  useEffect(() => {
    setExternalDynamicData(initialExternalDynamicData);
  }, [initialExternalDynamicData]);
  const handleFinish = async () => {
    setIsProcessing(true);
    const mappedData = await mapToServer();
    try {
      await clinicalRecordService.clinicalRecordsParamsStore(mappedData.extra_data?.patientId, mappedData);
      toast.current?.show({
        severity: "success",
        summary: "Completado",
        detail: "Se ha creado el registro exitosamente y se han enviado todos los mensajes correctamente",
        life: 3000
      });
      localStorage.removeItem(generateURLStorageKey("elapsedTime"));
      localStorage.removeItem(generateURLStorageKey("startTime"));
      localStorage.removeItem(generateURLStorageKey("isRunning"));
      hideModal();
      setShowSuccessfulSaveDialog(true);
    } catch (error) {
      console.error(error);
      if (error.data?.errors) {
        showFormErrorsToast({
          title: "Errores de validación",
          errors: error.data.errors
        });
      } else {
        showErrorToast({
          title: "Error",
          message: error.message || "Ocurrió un error inesperado"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  const mapToServer = async () => {
    if (!finishClinicalRecordFormRef.current) {
      throw new Error("finishClinicalRecordFormRef is not defined");
    }
    const {
      exams,
      disability,
      prescriptions,
      optometry,
      remission,
      appointment,
      currentUser,
      currentAppointment,
      diagnoses,
      treatmentPlan,
      clinicalRecordTypeId,
      examsActive,
      disabilitiesActive,
      prescriptionsActive,
      optometryActive,
      remissionsActive,
      appointmentActive,
      appointmentId,
      patientId,
      specialtyName
    } = finishClinicalRecordFormRef.current?.getFormState();
    setPatientId(patientId);
    setSpecialtyName(specialtyName);
    const requestDataAppointment = {
      assigned_user_specialty_id: currentAppointment.user_availability.user.user_specialty_id,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      assigned_user_availability_id: appointment.assigned_user_availability_id,
      assigned_supervisor_user_availability_id: appointment.assigned_supervisor_user_availability_id,
      attention_type: currentAppointment.attention_type,
      product_id: currentAppointment.product_id,
      consultation_purpose: getPurpuse(currentAppointment.consultation_purpose),
      consultation_type: "FOLLOW_UP",
      external_cause: "OTHER",
      frecuenciaCita: "",
      numRepeticiones: 0,
      selectPaciente: currentAppointment.patient_id,
      telefonoPaciente: currentAppointment.patient.whatsapp,
      correoPaciente: currentAppointment.patient.email,
      patient_id: currentAppointment.patient_id,
      appointment_state_id: currentAppointment.appointment_state_id,
      assigned_user_id: appointment.assigned_user_availability_id,
      created_by_user_id: appointment.created_by_user_id,
      duration: currentAppointment.user_availability.appointment_duration,
      branch_id: currentAppointment.user_availability.branch_id,
      phone: currentAppointment.patient.whatsapp,
      email: currentAppointment.patient.email
    };
    const formattedTime = formatTimeByMilliseconds(localStorage.getItem(generateURLStorageKey("elapsedTime")));
    const formattedStartTime = getDateTimeByMilliseconds(localStorage.getItem(generateURLStorageKey("startTime")));
    const definitiveDiagnosis = diagnoses.find(diagnosis => diagnosis.diagnosis_type === "definitivo")?.codigo;
    let result = {
      appointment_id: appointmentId,
      branch_id: "1",
      clinical_record_type_id: clinicalRecordTypeId,
      created_by_user_id: currentUser?.id,
      description: treatmentPlan || "--",
      data: {
        ...externalDynamicData,
        rips: diagnoses
      },
      consultation_duration: `${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`,
      start_time: `${getLocalTodayISODateTime(formattedStartTime)}`,
      diagnosis_main: definitiveDiagnosis || null,
      created_at: getLocalTodayISODateTime(),
      extra_data: {
        patientId,
        specialtyName,
        appointmentId
      }
    };
    if (examsActive && exams.length > 0) {
      result.exam_order = exams.map(exam => ({
        patient_id: patientId,
        exam_order_item_id: exam.id,
        exam_order_item_type: "exam_type"
      }));
      appendCardToPostConsultationVisibleCards("ordenesMedicas");
    } else {
      removePostConsultationVisibleCard("ordenesMedicas");
    }
    if (prescriptionsActive && prescriptions.length > 0) {
      result.recipe = {
        user_id: currentUser?.id,
        patient_id: patientId,
        medicines: prescriptions.map(medicine => ({
          medication: medicine.medication,
          concentration: medicine.concentration,
          duration: medicine.duration,
          frequency: medicine.frequency,
          medication_type: medicine.medication_type,
          observations: medicine.observations,
          quantity: medicine.quantity,
          take_every_hours: medicine.take_every_hours
        })),
        type: "general"
      };
      appendCardToPostConsultationVisibleCards("recetasMedicas");
    } else {
      removePostConsultationVisibleCard("recetasMedicas");
    }
    if (optometryActive && optometry) {
      result.recipe = {
        user_id: currentUser?.id,
        patient_id: patientId,
        optometry: optometry,
        type: "optometry"
      };
      appendCardToPostConsultationVisibleCards("recetasMedicasOptometry");
    } else {
      removePostConsultationVisibleCard("recetasMedicasOptometry");
    }
    if (disabilitiesActive) {
      result.patient_disability = {
        user_id: currentUser?.id,
        start_date: disability.start_date.toISOString().split("T")[0],
        end_date: disability.end_date.toISOString().split("T")[0],
        reason: disability.reason
      };
      appendCardToPostConsultationVisibleCards("incapacidades");
    } else {
      removePostConsultationVisibleCard("incapacidades");
    }
    if (remissionsActive) {
      result.remission = remission;
    }
    if (appointmentActive) {
      result.appointment = requestDataAppointment;
    }
    return result;
  };
  const appendCardToPostConsultationVisibleCards = cardId => {
    setPostConsultationVisibleCards(prev => {
      const newSet = new Set([...prev, cardId]);
      return Array.from(newSet);
    });
  };
  const removePostConsultationVisibleCard = cardId => {
    setPostConsultationVisibleCards(prev => prev.filter(id => id !== cardId));
  };
  useImperativeHandle(ref, () => ({
    updateExternalDynamicData,
    showModal,
    hideModal
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: () => {
      hideModal();
    },
    header: "Finalizar Consulta",
    modal: true,
    style: {
      width: "100vw",
      maxWidth: "100vw"
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(FinishClinicalRecordForm, {
    ref: finishClinicalRecordFormRef,
    clinicalRecordId: clinicalRecordId
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-danger",
    onClick: () => {
      hideModal();
    },
    disabled: isProcessing
  }), /*#__PURE__*/React.createElement(Button, {
    label: isProcessing ? "Procesando..." : "Finalizar",
    className: "btn btn-primary",
    onClick: () => {
      handleFinish();
    },
    disabled: isProcessing
  }))), /*#__PURE__*/React.createElement(Dialog, {
    visible: showSuccessfulSaveDialog,
    onHide: () => {
      setShowSuccessfulSaveDialog(false);
    },
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-check-circle text-success fs-5"
    }), /*#__PURE__*/React.createElement("span", {
      className: "fw-bold"
    }, "Historia Cl\xEDnica creada exitosamente")),
    modal: true,
    style: {
      width: "70vw",
      maxWidth: "900px"
    },
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end w-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${specialtyName}`;
      },
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-arrow-right me-2"
      }),
      label: "Continuar sin descargar"
    })))
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-success d-flex align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", {
    className: "alert-heading mb-1"
  }, "\xA1Historia Cl\xEDnica Guardada!"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, "La historia cl\xEDnica ha sido creada exitosamente. Ahora puede descargar o imprimir los documentos generados."))), /*#__PURE__*/React.createElement("div", {
    className: "card border-light mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body bg-light rounded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-question-circle text-primary me-2"
  }), /*#__PURE__*/React.createElement("h6", {
    className: "mb-0 fw-bold"
  }, "\xBFQu\xE9 puede hacer a continuaci\xF3n?")), /*#__PURE__*/React.createElement("ul", {
    className: "mb-0"
  }, /*#__PURE__*/React.createElement("li", null, "Descargue los documentos individualmente haciendo clic en el bot\xF3n de cada tarjeta"), /*#__PURE__*/React.createElement("li", null, "Revise que toda la informaci\xF3n sea correcta antes de imprimir")))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-primary mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-file me-2"
  }), "Documentos Disponibles")), /*#__PURE__*/React.createElement(PostConsultationGestion, {
    visibleCards: postConsultationVisibleCards
  }))));
});