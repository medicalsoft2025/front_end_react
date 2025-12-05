import React, { useState, useEffect } from "react";
import { PrimeReactProvider } from "primereact/api";
import { clinicalRecordTypeService, clinicalRecordService } from "../../services/api/index.js";
import { usePatient } from "../patients/hooks/usePatient.js";
const heredofamiliares = [
// Paso 1 - Heredofamiliares
{
  id: "diabetes",
  label: "¿Tiene antecedentes de diabetes en su familia?",
  placeholder: "Ejemplo: Padre y abuela materna",
  step: 1
}, {
  id: "hipertension",
  label: "¿Quién en su familia ha tenido hipertensión?",
  placeholder: "Ejemplo: Madre y abuelo paterno",
  step: 1
}, {
  id: "cancer",
  label: "¿Algún familiar ha tenido cáncer?",
  placeholder: "Ejemplo: Tía materna (de mama)",
  step: 1
}, {
  id: "cardiovasculares",
  label: "¿Existen antecedentes de enfermedades cardiovasculares?",
  placeholder: "Ejemplo: Ninguna reportada",
  step: 1
}];

// Paso 2 - Personales Patológicos
const personalesPatologicos = [{
  id: "enfermedades_previas",
  label: "¿Ha tenido enfermedades previas?",
  placeholder: "Ejemplo: Hepatitis A (infancia)",
  step: 2
}, {
  id: "cirugias",
  label: "¿Se ha sometido a alguna cirugía?",
  placeholder: "Ejemplo: Apendicectomía (2015)",
  step: 2
}, {
  id: "hospitalizaciones",
  label: "¿Ha sido hospitalizado anteriormente?",
  placeholder: "Ejemplo: Ninguna adicional",
  step: 2
}, {
  id: "alergias",
  label: "¿Tiene alguna alergia?",
  placeholder: "Ejemplo: Penicilina",
  step: 2
}, {
  id: "medicamentos",
  label: "¿Está en algún tratamiento con medicamentos?",
  placeholder: "Ejemplo: Metformina (tratamiento actual)",
  step: 2
}];
const personalesNoPatologicos = [
// Paso 3 - Personales No Patológicos
{
  id: "habitos",
  label: "¿Cuáles son sus hábitos?",
  placeholder: "Ejemplo: No fuma, consume alcohol ocasionalmente",
  step: 3
}, {
  id: "actividad_fisica",
  label: "¿Con qué frecuencia realiza actividad física?",
  placeholder: "Ejemplo: Realiza ejercicio 3 veces por semana",
  step: 3
}, {
  id: "vacunacion",
  label: "¿Está al día con su esquema de vacunación?",
  placeholder: "Ejemplo: Esquema completo hasta la última revisión",
  step: 3
}, {
  id: "dieta",
  label: "¿Sigue alguna dieta?",
  placeholder: "Ejemplo: Controlada en carbohidratos",
  step: 3
}];
const ginecoObtestrica = [{
  id: "menarquia",
  label: "¿A qué edad tuvo su primera menstruación?",
  placeholder: "Ejemplo: 12 años",
  step: 4
}, {
  id: "ciclos_menstruales",
  label: "¿Cómo son sus ciclos menstruales?",
  placeholder: "Ejemplo: Regulares",
  step: 4
}, {
  id: "gestaciones",
  label: "¿Cuántas gestaciones ha tenido?",
  placeholder: "Ejemplo: 2 (1 parto vaginal, 1 cesárea)",
  step: 4
}, {
  id: "metodos_anticonceptivos",
  label: "¿Usa algún método anticonceptivo?",
  placeholder: "Ejemplo: DIU",
  step: 4
}];
export const PastMedicalHistoryDetail = () => {
  const [selectedRecordType, setSelectedRecordType] = useState();
  const [selectedClinicalRecord, setSelectedClinicalRecord] = useState();
  const [patientId, setPatientId] = useState();
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState(null);
  const {
    patient
  } = usePatient(patientId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchClinicalRecordTypes();
        await fetchClinicalRecord();
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
      }
    };
    fetchData();
  }, []);
  const fetchClinicalRecordTypes = async () => {
    try {
      let data = await clinicalRecordTypeService.getAll();
      if (data.length) {
        data = data.filter(item => item.key_ === "PAST_MEDICAL_HISTORY");
      }
      setSelectedRecordType(data[0]);
    } catch (err) {
      console.error("Error fetching clinical record types:", err);
    }
  };
  const fetchClinicalRecord = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientId = new URLSearchParams(window.location.search).get("patient_id");
      const id = new URLSearchParams(window.location.search).get("id");
      let idValidation = patientId || id;
      setPatientId(idValidation);
      const data = await clinicalRecordService.ofParentByType("PAST_MEDICAL_HISTORY", idValidation);
      console.log("Clinical record data:", data);
      if (data.length > 0) {
        setSelectedClinicalRecord(data[0]);
        checkIfHasData(data[0]);
      } else {
        setSelectedClinicalRecord(null);
        setHasData(false);
      }
    } catch (error) {
      console.error("Error fetching clinical record:", error);
      setError("No se pudo cargar la información del paciente. Por favor, verifique la conexión.");
      setSelectedClinicalRecord(null);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };
  const checkIfHasData = clinicalRecord => {
    if (!clinicalRecord || !clinicalRecord.data) {
      setHasData(false);
      return;
    }
    const allFields = [...heredofamiliares, ...personalesPatologicos, ...personalesNoPatologicos, ...ginecoObtestrica];

    // Verificar si al menos un campo tiene datos
    const hasAnyData = allFields.some(field => {
      const value = clinicalRecord.data[field.id];
      return value && value.trim() !== "";
    });
    setHasData(hasAnyData);
  };
  const checkSectionHasData = fields => {
    if (!selectedClinicalRecord || !selectedClinicalRecord.data) {
      return false;
    }
    return fields.some(field => {
      const value = selectedClinicalRecord.data[field.id];
      return value && value.trim() !== "";
    });
  };
  const renderField = campo => {
    if (!selectedClinicalRecord || !selectedClinicalRecord.data) {
      return null;
    }
    const value = selectedClinicalRecord.data[campo.id];
    if (!value || value.trim() === "") {
      return null;
    }
    return /*#__PURE__*/React.createElement("div", {
      key: campo.id,
      className: "col-md-6 mt-2"
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
      className: "fw-bold"
    }, campo.label, ":"), /*#__PURE__*/React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: value
      }
    })));
  };
  const renderSection = (title, icon, fields) => {
    const sectionHasData = checkSectionHasData(fields);
    if (!sectionHasData) {
      return null;
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
      className: "fw-bold mb-3"
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${icon} fa-lg`
    }), "\xA0 ", title), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, fields.map(renderField)), /*#__PURE__*/React.createElement("hr", null));
  };

  // Estado de carga
  if (loading) {
    return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
      className: "wizard-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center align-items-center",
      style: {
        minHeight: '300px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "spinner-border text-primary",
      role: "status",
      style: {
        width: '3rem',
        height: '3rem'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "visually-hidden"
    }, "Cargando...")), /*#__PURE__*/React.createElement("p", {
      className: "mt-3 text-muted"
    }, "Cargando antecedentes m\xE9dicos...")))));
  }

  // Estado de error
  if (error) {
    return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
      className: "wizard-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger",
      role: "alert"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-triangle-exclamation me-2"
    }), error), /*#__PURE__*/React.createElement("div", {
      className: "text-center mt-4"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: fetchClinicalRecord
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-rotate me-2"
    }), "Reintentar"))));
  }

  // No hay datos
  if (!selectedClinicalRecord || !hasData) {
    return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
      className: "wizard-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center py-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-medical fa-4x text-muted"
    })), /*#__PURE__*/React.createElement("h4", {
      className: "text-muted mb-3"
    }, "No hay antecedentes m\xE9dicos registrados"), /*#__PURE__*/React.createElement("p", {
      className: "text-muted mb-4"
    }, "Este paciente no tiene antecedentes m\xE9dicos registrados en el sistema."), /*#__PURE__*/React.createElement("div", {
      className: "alert alert-info",
      role: "alert"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-info-circle me-2"
    }), "Los antecedentes m\xE9dicos pueden incluir: antecedentes familiares, personales patol\xF3gicos y no patol\xF3gicos."))));
  }

  // Verificar qué secciones tienen datos
  const hasHeredofamiliares = checkSectionHasData(heredofamiliares);
  const hasPersonalesPatologicos = checkSectionHasData(personalesPatologicos);
  const hasPersonalesNoPatologicos = checkSectionHasData(personalesNoPatologicos);
  const hasGinecoObstetrica = patient && patient.gender === "FEMALE" && checkSectionHasData(ginecoObtestrica);
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "wizard-content"
  }, hasHeredofamiliares && renderSection("Antecedentes Heredofamiliares", "fa-users", heredofamiliares), hasPersonalesPatologicos && renderSection("Antecedentes Personales Patológicos", "fa-heart-pulse", personalesPatologicos), hasPersonalesNoPatologicos && renderSection("Antecedentes Personales No Patológicos", "fa-person-walking", personalesNoPatologicos), patient && patient.gender === "FEMALE" && hasGinecoObstetrica && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    className: "fw-bold mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-baby fa-lg"
  }), "\xA0 Historia Gineco-Obst\xE9trica"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, ginecoObtestrica.map(renderField))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-3 border-top"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar me-1"
  }), "\xDAltima actualizaci\xF3n: ", selectedClinicalRecord.updatedAt ? new Date(selectedClinicalRecord.updatedAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) : 'Fecha no disponible'))));
};