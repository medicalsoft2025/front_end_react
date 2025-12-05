import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { MenuItem } from "primereact/menuitem";
import { CitaTelemedicina } from "./interfaces/TelemedicinaTypes";
import { RecordingModal } from "./modals/RecordingModal";
import { VideoConsultationModal } from "./modals/VideoConsultationModal";
import { ReportModal } from "./modals/ReportModal";
import { useFetchAppointments } from "../appointments/hooks/useFetchAppointments";
import { appointmentStateColorsByKey, appointmentStatesByKeyTwo } from "../../services/commons";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { CustomPRTableMenu } from "../components/CustomPRTableMenu";
import { SwalManager } from "../../services/alertManagerImported";
import { appointmentService } from "../../services/api";
import { useTemplateBuilded } from "../hooks/useTemplateBuilded";
import { useMassMessaging } from "../hooks/useMassMessaging";
import { getIndicativeByCountry } from "../../services/utilidades";

export const TelemedicinaMain: React.FC = () => {
    const getCustomFilters = () => ({ appointmentType: "Virtual", sort: "-appointment_date,appointment_time" });

    const { appointments, handlePageChange, handleSearchChange, refresh, totalRecords, first, loading: loadingAppointments, perPage } = useFetchAppointments(getCustomFilters);
    const { fetchTemplate, switchTemplate } = useTemplateBuilded();
    const { sendMessage: sendMessageAppointmentHook } = useMassMessaging();
    const tenant = window.location.hostname.split(".")[0];
    const sendMessageAppointment = useRef(sendMessageAppointmentHook);

    const [mappedAppointments, setMappedAppointments] = useState<CitaTelemedicina[]>([]);
    const [modalVideoVisible, setModalVideoVisible] = useState(false);
    const [modalGrabacionVisible, setModalGrabacionVisible] = useState(false);
    const [modalReporteVisible, setModalReporteVisible] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState<CitaTelemedicina | null>(null);

    useEffect(() => {
        setMappedAppointments(
            appointments.map((appointment) => ({
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
                patient: appointment.patient,
            }))
        );
    }, [appointments]);

    const sendMessageWhatsapp = useCallback(async (patient: any, templateFormatted: string, dataToFile: any) => {
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
                webhook_url: "https://example.com/webhook",
            };
        } else {
            dataMessage = {
                channel: "whatsapp",
                recipients: [getIndicativeByCountry(patient.country_id) + patient.whatsapp],
                message_type: "text",
                message: templateFormatted,
                webhook_url: "https://example.com/webhook",
            };
        }
        await sendMessageAppointment.current(dataMessage);
    }, [sendMessageAppointmentHook]);

    const estadoBodyTemplate = (rowData: CitaTelemedicina) => {
        const color = appointmentStateColorsByKey[rowData.stateKey];
        const text = appointmentStatesByKeyTwo[rowData.stateKey]?.[rowData.attentionType] || appointmentStatesByKeyTwo[rowData.stateKey] || "SIN ESTADO";
        return <span className={`badge badge-phoenix badge-phoenix-${color}`}>{text}</span>;
    };

    const handleCancelAppointmentAction = async (data: CitaTelemedicina) => {
        SwalManager.confirmCancel(async () => {
            await appointmentService.changeStatus(Number(data.id), "cancelled");
            refresh();
            const dataTemplate = { tenantId: tenant, belongsTo: "citas-cancelacion", type: "whatsapp" };
            const dataFormated = { patient: data.patient, assigned_user_availability: data.user_availability, appointment_date: data.fecha, appointment_time: data.hora };
            const templateAppointment = await fetchTemplate(dataTemplate);
            const finishTemplate = await switchTemplate(templateAppointment.template, "appointments", dataFormated);
            sendMessageWhatsapp(data.patient, finishTemplate, null);
            SwalManager.success({ text: "Cita cancelada exitosamente" });
        });
    };

    const getMenuItems = (rowData: CitaTelemedicina): MenuItem[] => {
        const isCancelled = rowData.stateKey === "cancelled";
        return [
            {
                label: "Iniciar video",
                icon: <i className="fa-solid fa-video me-2"></i>,
                command: () => {
                    setCitaSeleccionada(rowData);
                    setModalVideoVisible(true);
                },
                disabled: isCancelled
            },
            {
                label: "No asistió",
                icon: <i className="fa-solid fa-calendar-times me-2"></i>,
                command: () => handleCancelAppointmentAction(rowData),
                disabled: isCancelled
            },
            {
                label: "Grabaciones",
                icon: <i className="fa-solid fa-record-vinyl me-2"></i>,
                command: () => {
                    setCitaSeleccionada(rowData);
                    setModalGrabacionVisible(true);
                },
                disabled: isCancelled
            }
        ];
    };

    const accionesBodyTemplate = (rowData: CitaTelemedicina) => {
        return (
            <div className="flex align-items-center justify-content-center" style={{ minWidth: "120px" }}>
                <CustomPRTableMenu
                    rowData={rowData}
                    menuItems={getMenuItems(rowData)}
                />
            </div>
        );
    };

    const columns: CustomPRTableColumnProps[] = [
        { header: "Doctor", field: "doctor", sortable: true },
        { header: "Fecha", field: "fecha", sortable: true },
        { header: "Hora", field: "hora", sortable: true },
        { header: "Paciente", field: "paciente", sortable: true },
        { header: "Teléfono", field: "telefono", sortable: true },
        { header: "Correo", field: "correo", sortable: true },
        { header: "Estado", field: "estado", sortable: true, body: estadoBodyTemplate },
        { header: "Acciones", field: "acciones", sortable: false, body: accionesBodyTemplate, exportable: false },
    ];

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0 text-primary">Telemedicina</h2>
                        <Button
                            icon={<i className="fa-solid fa-file-pdf me-1"></i>}
                            label="Generar Reporte"
                            className="p-button-primary"
                            onClick={() => setModalReporteVisible(true)}
                        />
                    </div>

                    <Card className="shadow-sm border-0">
                        <CustomPRTable
                            columns={columns}
                            data={mappedAppointments}
                            lazy
                            first={first}
                            rows={perPage}
                            totalRecords={totalRecords}
                            loading={loadingAppointments}
                            onPage={handlePageChange}
                            onSearch={handleSearchChange}
                            onReload={refresh}
                            searchPlaceholder="Buscar citas..."
                        />
                    </Card>
                </div>
            </div>

            <VideoConsultationModal visible={modalVideoVisible} onHide={() => setModalVideoVisible(false)} cita={citaSeleccionada} />
            <RecordingModal visible={modalGrabacionVisible} onHide={() => setModalGrabacionVisible(false)} cita={citaSeleccionada} />
            <ReportModal visible={modalReporteVisible} onHide={() => setModalReporteVisible(false)} />
        </div>
    );
};

export default TelemedicinaMain;