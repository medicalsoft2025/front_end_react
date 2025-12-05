import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { useSocket } from "../hooks/useSocket";
import { VideoConsultaModalProps } from "../interfaces/VideoConsultationTypes";
import TelemedicinaService from "../../../services/api/classes/telemedicinaService";
import { usePRToast } from "../../hooks/usePRToast";
import { Toast } from "primereact/toast";

export const VideoConsultationModal: React.FC<VideoConsultaModalProps> = ({
    visible,
    onHide,
    cita,
}) => {
    const { showSuccessToast, showErrorToast, toast: toastRef } = usePRToast();
    const [roomId, setRoomId] = useState("");
    const [roomLink, setRoomLink] = useState("");
    const socket = useSocket();

    useEffect(() => {
        if (visible && socket) {
            // Configurar eventos de socket
            // socket.on('room-created', (newRoomId: string) => {
            //     setRoomId(newRoomId);
            //     setRoomLink(`${window.location.origin}/video-llamada?roomId=${newRoomId}`);
            // });
        }

        return () => {
            // if (socket) {
            //     socket.off('room-created');
            // }
        };
    }, [visible, socket]);

    const crearSala = async () => {
        try {
            const service = new TelemedicinaService();
            const room = await service.createRoom();
            const notificationsResponse =
                await service.sendRoomOpenNotification({
                    roomID: room.roomKey,
                    token: room.token,
                    appointmentId: cita?.id,
                });
            console.log({ room, notificationsResponse });
            const newRoomId = room.roomKey;
            setRoomId(newRoomId);
            setRoomLink(
                `https://erp.medicalsoft.ai/telemedicinav2/?roomId=${room.roomKey}&token=${room.token}`
            );
            showSuccessToast({ message: "Sala creada exitosamente" });
            // if (socket) {
            //     socket.emit('create-room', 'doctor');
            // }
        } catch (error) {
            console.error(error);
            showErrorToast({ message: "Error al crear la sala" });
        }
    };

    const copiarEnlace = () => {
        navigator.clipboard
            .writeText(roomLink)
            .then(() => {
                showSuccessToast({ message: "Enlace copiado al portapapeles" });
            })
            .catch((err) => console.error("Error al copiar:", err));
    };

    const entrarSala = () => {
        if (roomId) {
            window.open(roomLink, "_blank");
        }
    };

    const footerContent = (
        <div>
            <Button
                label="Cerrar"
                icon={<i className="fa-solid fa-xmark me-1"></i>}
                onClick={onHide}
                className="p-button-secondary"
            />
        </div>
    );

    //@ts-ignore
    const doctorAvatar = cita?.user_availability.user.minio_url
        ? getUrlImage(cita.user_availability.user.minio_url)
        : "assets/img/profile/profile_default.jpg";
    //@ts-ignore
    const patientAvatar =
        cita?.patient.full_profile_minio_url ||
        "assets/img/profile/profile_default.jpg";

    return (
        <>
            <Toast ref={toastRef} />
            <Dialog
                header={
                    <>
                        <i className="fa-solid fa-video me-2"></i> Video
                        Consulta
                    </>
                }
                visible={visible}
                style={{ width: "90vw", maxWidth: "700px" }}
                footer={footerContent}
                onHide={onHide}
                className="video-consultation-modal"
            >
                <Card className="border-0">
                    {cita && (
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="d-flex align-items-start gap-3 mb-3">
                                    <div
                                        className="avatar avatar-l d-flex"
                                        style={{
                                            minWidth: "50px",
                                            minHeight: "50px",
                                        }}
                                    >
                                        <img
                                            className="rounded-circle"
                                            src={patientAvatar}
                                            onError={(e) =>
                                                (e.currentTarget.src =
                                                    "assets/img/profile/profile_default.jpg")
                                            }
                                            alt="Descripción de la imagen"
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h4 className="mb-0">
                                            {cita.paciente}
                                        </h4>
                                        <small className="text-muted">
                                            Paciente
                                        </small>
                                    </div>
                                </div>
                                <p>
                                    <i className="pi pi-calendar mr-2"></i>{" "}
                                    <strong>Fecha:</strong> {cita.fecha}
                                </p>
                                <p>
                                    <i className="pi pi-phone mr-2"></i>{" "}
                                    <strong>Teléfono:</strong> {cita.telefono}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-start gap-3 mb-3">
                                    <div
                                        className="avatar avatar-l d-flex"
                                        style={{
                                            minWidth: "50px",
                                            minHeight: "50px",
                                        }}
                                    >
                                        <img
                                            className="rounded-circle"
                                            src={doctorAvatar}
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h4 className="mb-0">{cita.doctor}</h4>
                                        <small className="text-muted">
                                            Médico
                                        </small>
                                    </div>
                                </div>
                                <p>
                                    <i className="pi pi-inbox mr-2"></i>{" "}
                                    <strong>Correo:</strong> {cita.correo}
                                </p>
                            </div>
                        </div>
                    )}

                    <Divider />

                    <div className="row mt-4">
                        <div className="col-md-6 mb-3">
                            <h5>
                                <i className="pi pi-key mr-2"></i> Código de
                                sala
                            </h5>
                            <div className="p-3 bg-gray-100 border-round">
                                <span
                                    className={
                                        roomId
                                            ? "text-primary font-bold text-xl"
                                            : "text-color-secondary"
                                    }
                                >
                                    {roomId ||
                                        'Presiona "Crear sala" para generar un código'}
                                </span>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <h5>
                                <i className="pi pi-info-circle mr-2"></i>{" "}
                                Estado
                            </h5>
                            <div className="d-flex align-items-center">
                                <span
                                    className={`badge ${
                                        roomId ? "bg-success" : "bg-secondary"
                                    } me-2`}
                                >
                                    {roomId ? "Abierta" : "No creada"}
                                </span>
                            </div>
                            <p className="text-sm text-color-secondary mt-2">
                                <i className="pi pi-clock mr-1"></i> Apertura:{" "}
                                {new Date().toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-12">
                            <div className="bg-blue-50 p-3 border-round text-sm">
                                <i className="pi pi-info-circle mr-2 text-blue-500"></i>
                                Esta información junto con el enlace para
                                ingresar a la sala será enviada por correo
                                electrónico a{" "}
                                <strong>
                                    {cita?.correo || "user@test.com"}
                                </strong>{" "}
                                y por WhatsApp a{" "}
                                <strong>{cita?.telefono || "96385214"}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-4 mb-2">
                            <Button
                                icon={<i className="fa-solid fa-plus me-1"></i>}
                                label="Crear sala"
                                className="w-full"
                                onClick={crearSala}
                                disabled={!!roomId}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <Button
                                icon={
                                    <i className="fa-solid fa-arrow-right me-1"></i>
                                }
                                label="Entrar"
                                className="p-button-primary w-full"
                                onClick={entrarSala}
                                disabled={!roomId}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <Button
                                icon={<i className="fa-solid fa-link me-1"></i>}
                                label="Copiar enlace"
                                className="p-button-help w-full"
                                onClick={copiarEnlace}
                                disabled={!roomId}
                            />
                        </div>
                    </div>
                </Card>
            </Dialog>
        </>
    );
};
