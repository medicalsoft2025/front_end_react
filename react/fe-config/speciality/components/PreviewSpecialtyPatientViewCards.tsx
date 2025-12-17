import React, { useEffect, useState } from "react";
import { useLoadUserPatientViewCards } from "../hooks/useLoadUserPatientViewCards";
import { useCallPatient } from "../../../patients/hooks/useCallPatient";
import UserManager from "../../../../services/userManager";

interface PreviewSpecialtyPatientViewCardsProps {
    patientId?: string;
    userId?: string;
    disableRedirects?: boolean;
    availableCardsIds?: string[];
}

export const PreviewSpecialtyPatientViewCards = (
    props: PreviewSpecialtyPatientViewCardsProps
) => {
    const urlParams = new URLSearchParams(window.location.search);

    const {
        patientId = urlParams.get("patient_id") || urlParams.get("id"),
        disableRedirects = false,
        availableCardsIds,
        userId,
    } = props;

    const { callPatient } = useCallPatient();

    const { patientViewCards, fetchUserPatientViewCards } =
        useLoadUserPatientViewCards();

    const [finalAvailableCardsIds, setFinalAvailableCardsIds] =
        useState<string[]>();

    useEffect(() => {
        if (availableCardsIds) {
            setFinalAvailableCardsIds(availableCardsIds);
        }
    }, [availableCardsIds]);

    useEffect(() => {
        if (userId) {
            console.log("patientViewCards", patientViewCards);
            setFinalAvailableCardsIds(patientViewCards);
        }
    }, [patientViewCards]);

    useEffect(() => {
        console.log("userId", userId);
        fetchUserPatientViewCards();
    }, [userId]);

    const cards = [
        {
            id: "consulta",
            icono: "fas fa-address-book",
            titulo: "Consultas medicas",
            texto: "Revisa o crea historias médicas",
            url: "consulta?patient_id=" + patientId,
        },
        {
            id: "citas",
            icono: "calendar-days",
            titulo: "Citas",
            texto: "Agenda una nueva cita o revisa todas las citas agendadas a este paciente",
            url: "verCitas?patient_id=" + patientId,
        },
        {
            id: "llamar-paciente",
            icono: "fas fa-address-book",
            titulo: "Llamar al paciente",
            texto: "Revisa o crea historias médicas",
            url: "llamar_paciente",
        },
        {
            id: "ordenes-medicas",
            icono: "file-circle-plus",
            titulo: "Ordenes médicas",
            texto: "Revisa todos los exámenes clínicos recetados a este paciente",
            url: "verExamenes?patient_id=" + patientId,
        },
        {
            id: "ordenes-laboratorio",
            icono: "fas fa-microscope",
            titulo: "Laboratorio",
            texto: "Revisa todos los exámenes de laboratorio ordenados a este paciente",
            url: "verOrdenesExamenes?patient_id=" + patientId,
        },
        {
            id: "recetas",
            icono: "kit-medical",
            titulo: "Recetas médicas",
            texto: "Genera y revisa todas las recetas médicas para este paciente",
            url: "verRecetas?patient_id=" + patientId,
        },
        {
            id: "recetas-optometria",
            icono: "kit-medical",
            titulo: "Recetas Optometría",
            texto: "Genera y revisa todas las recetas médicas de optometría para este paciente",
            url:
                "verRecetasOptometria?patient_id=" +
                patientId +
                "&especialidad=Optometria",
        },
        {
            id: "incapacidades",
            icono: "wheelchair",
            titulo: "Incapacidades clínicas",
            texto: "Consulta todas las incapacidades clínicas para este paciente",
            url: "verIncapacidades?patient_id=" + patientId,
        },
        {
            id: "antecedentes",
            icono: "hospital",
            titulo: "Antecedentes personales",
            texto: "Revisa todos los antecedentes personales registrados para este paciente",
            url: "verAntecedentes?patient_id=" + patientId,
        },
        {
            id: "consentimientos",
            icono: "book-medical",
            titulo: "Consentimientos",
            texto: "Genera y revisa todos los consentimientos y certificados registrados para este paciente",
            url: "verConcentimientos?patient_id=" + patientId,
        },
        {
            id: "presupuestos",
            icono: "file-invoice-dollar",
            titulo: "Presupuestos",
            texto: "Genera y revisa todos los presupuestos elaborados para este paciente",
            url: "registros-presupuestos?patient_id=" + patientId,
        },
        {
            id: "esquema-vacunacion",
            icono: "syringe",
            titulo: "Esquema de vacunación",
            texto: "Revisa el esquema de vacunación o genera un nuevo esquema",
            url: "esquemaVacunacion?patient_id=" + patientId,
        },
        {
            id: "notas-enfermeria",
            icono: "fas fa-user-nurse",
            titulo: "Notas de Enfermeria",
            texto: "Revisa las notas de enfermeria del paciente",
            url: "enfermeria?patient_id=" + patientId,
        },
        {
            id: "evoluciones",
            icono: "fas fa-external-link-alt",
            titulo: "Evoluciones",
            texto: "Revisa la evoluciones del paciente",
            url: "evoluciones?patient_id=" + patientId,
        },
        {
            id: "remisiones",
            icono: "fas fa-retweet",
            titulo: "Remisiones",
            texto: "Revisa la remisiones del paciente",
            url: "remisiones?patient_id=" + patientId,
        },
        {
            id: "preadmisiones",
            icono: "far fa-address-book",
            titulo: "Preadmisiones",
            texto: "Revisa las preadmisiones del paciente",
            url: "preadmisiones?patient_id=" + patientId,
        },
    ];

    // Llamar paciente
    const llamarPaciente = async (patientId: string) => {
        //@ts-ignore
        Swal.fire({
            title: "¿Estás seguro de llamar al paciente al consultorio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, llamar",
        }).then(async (result: any) => {
            if (result.isConfirmed) {
                callPatient(patientId);
            }
        });
    };

    const handleCardClick = (card: any) => {
        switch (card.id) {
            case "consulta":
                UserManager.onAuthChange(async (isAuthenticated, user) => {
                    window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}`;
                });
                break;
            case "llamar-paciente":
                if (!patientId) return;
                llamarPaciente(patientId);
                break;
            default:
                window.location.href = card.url;
                break;
        }
    };

    return (
        <>
            <div className="patient-cards-container">
                <div className="patient-cards-grid">
                    {cards
                        .filter((card) =>
                            finalAvailableCardsIds?.includes(card.id)
                        )
                        .map((card) => (
                            <div className="patient-card" key={card.id}>
                                <div className="card-body">
                                    <div className="card-icon">
                                        <i
                                            className={`fas fa-${card.icono} fa-2x`}
                                        ></i>
                                    </div>
                                    <h5 className="card-title">
                                        {card.titulo}
                                    </h5>
                                    <p className="card-text">{card.texto}</p>
                                    <button
                                        className="btn btn-primary btn-icon mt-auto"
                                        onClick={() => handleCardClick(card)}
                                        disabled={disableRedirects}
                                    >
                                        <span className="fa-solid fa-chevron-right"></span>
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};
