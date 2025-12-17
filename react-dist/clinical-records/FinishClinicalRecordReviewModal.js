import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { clinicalRecordService } from "../../services/api/index.js";
import { Toast } from "primereact/toast";
import { formatTimeByMilliseconds, generateURLStorageKey, getDateTimeByMilliseconds, getLocalTodayISODateTime } from "../../services/utilidades.js";
import { FinishClinicalRecordForm } from "./FinishClinicalRecordForm.js";
import { usePRToast } from "../hooks/usePRToast.js";
import { ResolveClinicalRecordReviewRequestForm } from "../general-request/components/ResolveClinicalRecordReviewRequestForm.js";
import { useResolveRequest } from "../general-request/hooks/useResolveRequest.js";
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
export const FinishClinicalRecordReviewModal = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    showErrorToast,
    showFormErrorsToast
  } = usePRToast();
  const {
    resolveRequest
  } = useResolveRequest();
  const toast = useRef(null);
  const finishClinicalRecordFormRef = useRef(null);
  const resolveClinicalRecordReviewRequestFormRef = useRef(null);
  const {
    initialExternalDynamicData,
    requestId,
    clinicalRecordId,
    visible,
    onSave,
    onHide
  } = props;
  const [externalDynamicData, setExternalDynamicData] = useState(null);
  const updateExternalDynamicData = data => {
    setExternalDynamicData(data);
  };
  useEffect(() => {
    setExternalDynamicData(initialExternalDynamicData);
  }, [initialExternalDynamicData]);
  const handleFinish = async () => {
    const mappedData = await mapToServer();
    if (!resolveClinicalRecordReviewRequestFormRef.current) {
      return;
    }
    const {
      notes
    } = resolveClinicalRecordReviewRequestFormRef.current?.getFormData();
    const finalData = {
      ...mappedData,
      ...{
        original_record_id: clinicalRecordId
      },
      general_request: {
        id: requestId,
        notes: notes,
        status: "approved"
      }
    };
    console.log(finalData);
    try {
      const clinicalRecordRes = await clinicalRecordService.clinicalRecordsParamsStoreFromApprovedReview(mappedData.extra_data?.patientId, finalData);

      //await prepareDataToSendMessageWPP(clinicalRecordRes.clinical_record);

      toast.current?.show({
        severity: "success",
        summary: "Completado",
        detail: "Se ha creado el registro exitosamente y se han enviado todos los mensajes correctamente",
        life: 3000
      });
      localStorage.removeItem(generateURLStorageKey("elapsedTime"));
      localStorage.removeItem(generateURLStorageKey("startTime"));
      localStorage.removeItem(generateURLStorageKey("isRunning"));
      onSave?.(clinicalRecordRes);
      onHide?.();
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
    }
  };
  const handleReject = async () => {
    try {
      const notes = resolveClinicalRecordReviewRequestFormRef.current?.getFormData().notes;
      const response = await resolveRequest(requestId, {
        status: "rejected",
        notes: notes || null
      });
      onSave?.(response);
      onHide?.();
    } catch (error) {
      console.error(error);
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
      specialtyName,
      patientId,
      appointmentId
    } = finishClinicalRecordFormRef.current?.getFormState();
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
        specialtyName,
        patientId,
        appointmentId
      }
    };
    if (examsActive && exams.length > 0) {
      result.exam_order = exams.map(exam => ({
        patient_id: patientId,
        exam_order_item_id: exam.id,
        exam_order_item_type: "exam_type"
      }));
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
    }
    if (optometryActive && optometry) {
      result.recipe = {
        user_id: currentUser?.id,
        patient_id: patientId,
        optometry: optometry,
        type: "optometry"
      };
    }
    if (disabilitiesActive) {
      result.patient_disability = {
        user_id: currentUser?.id,
        start_date: disability.start_date.toISOString().split("T")[0],
        end_date: disability.end_date.toISOString().split("T")[0],
        reason: disability.reason
      };
    }
    if (remissionsActive) {
      result.remission = remission;
    }
    if (appointmentActive) {
      result.appointment = requestDataAppointment;
    }
    return result;
  };
  useImperativeHandle(ref, () => ({
    updateExternalDynamicData
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: () => {
      onHide?.();
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
  }), /*#__PURE__*/React.createElement(ResolveClinicalRecordReviewRequestForm, {
    ref: resolveClinicalRecordReviewRequestFormRef
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-2"
    }),
    label: "Rechazar",
    className: "btn btn-danger",
    onClick: () => {
      handleReject();
    }
    //disabled={isProcessing}
  }), /*#__PURE__*/React.createElement(Button
  //label={isProcessing ? "Procesando..." : "Aprobar y guardar"}
  , {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-check me-2"
    }),
    label: "Aprobar y guardar",
    className: "btn btn-success",
    onClick: () => {
      handleFinish();
    }
    //disabled={isProcessing}
  }))));
});