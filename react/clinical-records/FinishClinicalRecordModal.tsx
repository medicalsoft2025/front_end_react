import React, {
    useState,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { StoreClinicalRecordInputs, ClinicalRecordData } from "./interfaces";
import { clinicalRecordService } from "../../services/api";
import { Toast } from "primereact/toast";
import {
    formatTimeByMilliseconds,
    generateURLStorageKey,
    getDateTimeByMilliseconds,
    getLocalTodayISODateTime,
} from "../../services/utilidades";
import { ProgressBar } from "primereact/progressbar";
import { FinishClinicalRecordForm } from "./FinishClinicalRecordForm.js";
import { usePRToast } from "../hooks/usePRToast.js";
import { FinishClinicalRecordFormRef } from "./FinishClinicalRecordForm";
import { PostConsultationGestion } from "../appointments/PostConsultationGestion.js";

interface FinishClinicalRecordModalProps {
    initialExternalDynamicData: ClinicalRecordData;
    clinicalRecordType?: string;
    appointmentId?: string;
    patientId?: string;
    specialtyName?: string;
    clinicalRecordId?: string;
    ref?: any;
}

function getPurpuse(purpuse: string): string | undefined {
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

export const FinishClinicalRecordModal: React.FC<FinishClinicalRecordModalProps> =
    forwardRef((props, ref) => {
        const { showErrorToast, showFormErrorsToast } = usePRToast();
        const toast = useRef<Toast>(null);
        const finishClinicalRecordFormRef =
            useRef<FinishClinicalRecordFormRef>(null);

        const {
            initialExternalDynamicData,
            clinicalRecordId = new URLSearchParams(window.location.search).get(
                "clinical_record_id"
            ) || "",
        } = props;

        const [visible, setVisible] = useState<boolean>(false);

        const [externalDynamicData, setExternalDynamicData] = useState<
            any | null
        >(null);
        const [isProcessing, setIsProcessing] = useState(false);
        const [showSuccessfulSaveDialog, setShowSuccessfulSaveDialog] =
            useState(false);
        const [postConsultationVisibleCards, setPostConsultationVisibleCards] =
            useState<string[]>(["historiasClinicas"]);
        const [patientId, setPatientId] = useState("");
        const [specialtyName, setSpecialtyName] = useState("");

        const showModal = () => {
            setVisible(true);
        };

        const hideModal = () => {
            setVisible(false);
        };

        const updateExternalDynamicData = (data: any) => {
            setExternalDynamicData(data);
        };

        useEffect(() => {
            setExternalDynamicData(initialExternalDynamicData);
        }, [initialExternalDynamicData]);

        const handleFinish = async () => {
            setIsProcessing(true);
            const mappedData = await mapToServer();

            try {
                await clinicalRecordService.clinicalRecordsParamsStore(
                    mappedData.extra_data?.patientId,
                    mappedData
                );

                toast.current?.show({
                    severity: "success",
                    summary: "Completado",
                    detail: "Se ha creado el registro exitosamente y se han enviado todos los mensajes correctamente",
                    life: 3000,
                });

                localStorage.removeItem(generateURLStorageKey("elapsedTime"));
                localStorage.removeItem(generateURLStorageKey("startTime"));
                localStorage.removeItem(generateURLStorageKey("isRunning"));

                hideModal();

                setShowSuccessfulSaveDialog(true);
            } catch (error: any) {
                console.error(error);
                if (error.data?.errors) {
                    showFormErrorsToast({
                        title: "Errores de validación",
                        errors: error.data.errors,
                    });
                } else {
                    showErrorToast({
                        title: "Error",
                        message: error.message || "Ocurrió un error inesperado",
                    });
                }
            } finally {
                setIsProcessing(false);
            }
        };

        const mapToServer = async (): Promise<StoreClinicalRecordInputs> => {
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
                specialtyName,
            } = finishClinicalRecordFormRef.current?.getFormState();

            setPatientId(patientId);
            setSpecialtyName(specialtyName);

            const requestDataAppointment = {
                assigned_user_specialty_id:
                    currentAppointment.user_availability.user.user_specialty_id,
                appointment_date: appointment.appointment_date,
                appointment_time: appointment.appointment_time,
                assigned_user_availability_id:
                    appointment.assigned_user_availability_id,
                assigned_supervisor_user_availability_id:
                    appointment.assigned_supervisor_user_availability_id,
                attention_type: currentAppointment.attention_type,
                product_id: currentAppointment.product_id,
                consultation_purpose: getPurpuse(
                    currentAppointment.consultation_purpose
                ),
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
                duration:
                    currentAppointment.user_availability.appointment_duration,
                branch_id: currentAppointment.user_availability.branch_id,
                phone: currentAppointment.patient.whatsapp,
                email: currentAppointment.patient.email,
            };

            const formattedTime = formatTimeByMilliseconds(
                localStorage.getItem(generateURLStorageKey("elapsedTime"))
            );
            const formattedStartTime = getDateTimeByMilliseconds(
                localStorage.getItem(generateURLStorageKey("startTime"))
            );

            const definitiveDiagnosis = diagnoses.find(
                (diagnosis: any) => diagnosis.diagnosis_type === "definitivo"
            )?.codigo;

            let result: StoreClinicalRecordInputs = {
                appointment_id: appointmentId,
                branch_id: "1",
                clinical_record_type_id: clinicalRecordTypeId,
                created_by_user_id: currentUser?.id,
                description: treatmentPlan || "--",
                data: {
                    ...externalDynamicData,
                    rips: diagnoses,
                },
                consultation_duration: `${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`,
                start_time: `${getLocalTodayISODateTime(formattedStartTime)}`,
                diagnosis_main: definitiveDiagnosis || null,
                created_at: getLocalTodayISODateTime(),
                extra_data: {
                    patientId,
                    specialtyName,
                    appointmentId,
                },
            };

            if (examsActive && exams.length > 0) {
                result.exam_order = exams.map((exam: any) => ({
                    patient_id: patientId,
                    exam_order_item_id: exam.id,
                    exam_order_item_type: "exam_type",
                }));
                appendCardToPostConsultationVisibleCards("ordenesMedicas");
            } else {
                removePostConsultationVisibleCard("ordenesMedicas");
            }

            if (prescriptionsActive && prescriptions.length > 0) {
                result.recipe = {
                    user_id: currentUser?.id,
                    patient_id: patientId,
                    medicines: prescriptions.map((medicine: any) => ({
                        medication: medicine.medication,
                        concentration: medicine.concentration,
                        duration: medicine.duration,
                        frequency: medicine.frequency,
                        medication_type: medicine.medication_type,
                        observations: medicine.observations,
                        quantity: medicine.quantity,
                        take_every_hours: medicine.take_every_hours,
                    })),
                    type: "general",
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
                    type: "optometry",
                };
                appendCardToPostConsultationVisibleCards(
                    "recetasMedicasOptometry"
                );
            } else {
                removePostConsultationVisibleCard("recetasMedicasOptometry");
            }

            if (disabilitiesActive) {
                result.patient_disability = {
                    user_id: currentUser?.id,
                    start_date: disability.start_date
                        .toISOString()
                        .split("T")[0],
                    end_date: disability.end_date.toISOString().split("T")[0],
                    reason: disability.reason,
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

        const appendCardToPostConsultationVisibleCards = (cardId: string) => {
            setPostConsultationVisibleCards((prev) => {
                const newSet = new Set([...prev, cardId]);
                return Array.from(newSet);
            });
        };

        const removePostConsultationVisibleCard = (cardId: string) => {
            setPostConsultationVisibleCards((prev) =>
                prev.filter((id) => id !== cardId)
            );
        };

        useImperativeHandle(ref, () => ({
            updateExternalDynamicData,
            showModal,
            hideModal,
        }));

        return (
            <div>
                <Dialog
                    visible={visible}
                    onHide={() => {
                        hideModal();
                    }}
                    header={"Finalizar Consulta"}
                    modal
                    style={{ width: "100vw", maxWidth: "100vw" }}
                >
                    <Toast ref={toast} />

                    <FinishClinicalRecordForm
                        ref={finishClinicalRecordFormRef}
                        clinicalRecordId={clinicalRecordId}
                    />

                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button
                            label="Cancelar"
                            className="btn btn-danger"
                            onClick={() => {
                                hideModal();
                            }}
                            disabled={isProcessing}
                        />
                        <Button
                            label={isProcessing ? "Procesando..." : "Finalizar"}
                            className="btn btn-primary"
                            onClick={() => {
                                handleFinish();
                            }}
                            disabled={isProcessing}
                        />
                    </div>
                </Dialog>

                <Dialog
                    visible={showSuccessfulSaveDialog}
                    onHide={() => {
                        setShowSuccessfulSaveDialog(false);
                    }}
                    header={
                        <div className="d-flex align-items-center gap-2">
                            <i className="fas fa-check-circle text-success fs-5"></i>
                            <span className="fw-bold">
                                Historia Clínica creada exitosamente
                            </span>
                        </div>
                    }
                    modal
                    style={{ width: "70vw", maxWidth: "900px" }}
                    footer={
                        <div className="d-flex justify-content-end w-100">
                            <div className="d-flex gap-2">
                                <Button
                                    onClick={() => {
                                        window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${specialtyName}`;
                                    }}
                                    icon={
                                        <i className="fas fa-arrow-right me-2"></i>
                                    }
                                    label="Continuar sin descargar"
                                />
                            </div>
                        </div>
                    }
                >
                    <div className="container-fluid">
                        {/* Alerta de éxito con icono */}
                        <div className="alert alert-success d-flex align-items-center mb-4">
                            <div>
                                <h5 className="alert-heading mb-1">
                                    ¡Historia Clínica Guardada!
                                </h5>
                                <p className="mb-0">
                                    La historia clínica ha sido creada
                                    exitosamente. Ahora puede descargar o
                                    imprimir los documentos generados.
                                </p>
                            </div>
                        </div>

                        {/* Sección de instrucciones */}
                        <div className="card border-light mb-4">
                            <div className="card-body bg-light rounded">
                                <div className="d-flex align-items-center mb-2">
                                    <i className="pi pi-question-circle text-primary me-2"></i>
                                    <h6 className="mb-0 fw-bold">
                                        ¿Qué puede hacer a continuación?
                                    </h6>
                                </div>
                                <ul className="mb-0">
                                    <li>
                                        Descargue los documentos individualmente
                                        haciendo clic en el botón de cada
                                        tarjeta
                                    </li>
                                    <li>
                                        Revise que toda la información sea
                                        correcta antes de imprimir
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Título de la sección de documentos */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="text-primary mb-0">
                                <i className="pi pi-file me-2"></i>
                                Documentos Disponibles
                            </h5>
                        </div>

                        {/* Componente de tarjetas */}
                        <PostConsultationGestion
                            visibleCards={postConsultationVisibleCards}
                        />
                    </div>
                </Dialog>
            </div>
        );
    });
