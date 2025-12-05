import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useSocket } from "../hooks/useSocket.js";
import TelemedicinaService from "../../../services/api/classes/telemedicinaService.js";
import { usePRToast } from "../../hooks/usePRToast.js";
import { Toast } from "primereact/toast";
export const VideoConsultationModal = ({
  visible,
  onHide,
  cita
}) => {
  const {
    showSuccessToast,
    showErrorToast,
    toast: toastRef
  } = usePRToast();
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
      const notificationsResponse = await service.sendRoomOpenNotification({
        roomID: room.roomKey,
        token: room.token,
        appointmentId: cita?.id
      });
      console.log({
        room,
        notificationsResponse
      });
      const newRoomId = room.roomKey;
      setRoomId(newRoomId);
      setRoomLink(`https://erp.medicalsoft.ai/telemedicinav2/?roomId=${room.roomKey}&token=${room.token}`);
      showSuccessToast({
        message: "Sala creada exitosamente"
      });
      // if (socket) {
      //     socket.emit('create-room', 'doctor');
      // }
    } catch (error) {
      console.error(error);
      showErrorToast({
        message: "Error al crear la sala"
      });
    }
  };
  const copiarEnlace = () => {
    navigator.clipboard.writeText(roomLink).then(() => {
      showSuccessToast({
        message: "Enlace copiado al portapapeles"
      });
    }).catch(err => console.error("Error al copiar:", err));
  };
  const entrarSala = () => {
    if (roomId) {
      window.open(roomLink, "_blank");
    }
  };
  const footerContent = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cerrar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-xmark me-1"
    }),
    onClick: onHide,
    className: "p-button-secondary"
  }));

  //@ts-ignore
  const doctorAvatar = cita?.user_availability.user.minio_url ? getUrlImage(cita.user_availability.user.minio_url) : "assets/img/profile/profile_default.jpg";
  //@ts-ignore
  const patientAvatar = cita?.patient.full_profile_minio_url || "assets/img/profile/profile_default.jpg";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toastRef
  }), /*#__PURE__*/React.createElement(Dialog, {
    header: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-video me-2"
    }), " Video Consulta"),
    visible: visible,
    style: {
      width: "90vw",
      maxWidth: "700px"
    },
    footer: footerContent,
    onHide: onHide,
    className: "video-consultation-modal"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "border-0"
  }, cita && /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-start gap-3 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar avatar-l d-flex",
    style: {
      minWidth: "50px",
      minHeight: "50px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "rounded-circle",
    src: patientAvatar,
    onError: e => e.currentTarget.src = "assets/img/profile/profile_default.jpg",
    alt: "Descripci\xF3n de la imagen"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-0"
  }, cita.paciente), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Paciente"))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-calendar mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Fecha:"), " ", cita.fecha), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-phone mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Tel\xE9fono:"), " ", cita.telefono)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-start gap-3 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar avatar-l d-flex",
    style: {
      minWidth: "50px",
      minHeight: "50px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "rounded-circle",
    src: doctorAvatar,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-0"
  }, cita.doctor), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "M\xE9dico"))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-inbox mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Correo:"), " ", cita.correo))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-key mr-2"
  }), " C\xF3digo de sala"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-gray-100 border-round"
  }, /*#__PURE__*/React.createElement("span", {
    className: roomId ? "text-primary font-bold text-xl" : "text-color-secondary"
  }, roomId || 'Presiona "Crear sala" para generar un código'))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-info-circle mr-2"
  }), " ", "Estado"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: `badge ${roomId ? "bg-success" : "bg-secondary"} me-2`
  }, roomId ? "Abierta" : "No creada")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-color-secondary mt-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-clock mr-1"
  }), " Apertura:", " ", new Date().toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-50 p-3 border-round text-sm"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-info-circle mr-2 text-blue-500"
  }), "Esta informaci\xF3n junto con el enlace para ingresar a la sala ser\xE1 enviada por correo electr\xF3nico a", " ", /*#__PURE__*/React.createElement("strong", null, cita?.correo || "user@test.com"), " ", "y por WhatsApp a", " ", /*#__PURE__*/React.createElement("strong", null, cita?.telefono || "96385214")))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-plus me-1"
    }),
    label: "Crear sala",
    className: "w-full",
    onClick: crearSala,
    disabled: !!roomId
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-right me-1"
    }),
    label: "Entrar",
    className: "p-button-primary w-full",
    onClick: entrarSala,
    disabled: !roomId
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-link me-1"
    }),
    label: "Copiar enlace",
    className: "p-button-help w-full",
    onClick: copiarEnlace,
    disabled: !roomId
  }))))));
};