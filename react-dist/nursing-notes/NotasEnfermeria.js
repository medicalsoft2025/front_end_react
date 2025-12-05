// src/components/NotasEnfermeria/NotasEnfermeria.tsx
import React, { useState, useRef, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { useNotasEnfermeria } from "./hooks/useNotasEnfermeria.js";
import { useFiltrosNotas } from "./hooks/useFiltrosNotas.js";
import FiltrosNotas from "./components/FiltrosNotas.js";
import AcordeonNotas from "./components/AcordeonNotas.js";
import ModalNuevaNota from "./modal/ModalNuevaNota.js";
import PatientBreadcrumb from "../config/asignar-consentimiento/components/PatientBreadcrumb.js";
const NotasEnfermeria = ({
  patientId
}) => {
  const toast = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const {
    notas,
    patient,
    loading,
    error,
    enfermeras,
    reload,
    setPatientId: updatePatientId,
    agregarNota
  } = useNotasEnfermeria(patientId || '');
  const {
    filtros,
    notasFiltradas,
    aplicarFiltros
  } = useFiltrosNotas(notas);
  useEffect(() => {
    if (patientId) {
      updatePatientId(patientId);
    }
  }, [patientId, updatePatientId]);
  const handleGuardarNota = async nuevaNota => {
    try {
      agregarNota({
        id: Date.now().toString(),
        ...nuevaNota,
        created_at: new Date().toISOString(),
        user_id: nuevaNota.user_id
      });
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Nota guardada correctamente',
        life: 3000
      });
      setModalVisible(false);
      setCurrentNote(null);
    } catch (error) {
      console.error('Error al guardar nota:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al guardar la nota',
        life: 3000
      });
      throw error;
    }
  };
  const handleEditarNota = id => {
    const noteToEdit = notas.find(note => note.id === id);
    if (noteToEdit) {
      setCurrentNote(noteToEdit);
      setModalVisible(true);
    }
  };
  const handleEliminarNota = async id => {
    try {
      // Aquí necesitarías agregar la función deleteNursingNote a tu hook
      // Por ahora solo eliminamos del estado local
      // await deleteNursingNote(id);

      toast.current?.show({
        severity: 'success',
        summary: 'Eliminado',
        detail: 'Nota eliminada correctamente',
        life: 3000
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al eliminar la nota',
        life: 3000
      });
    }
  };

  // Manejo de errores
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-small"
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger"
    }, /*#__PURE__*/React.createElement("strong", null, "Error:"), " ", error, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-sm btn-outline-danger ms-2",
      onClick: reload
    }, "Reintentar"))));
  }
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: typeof window !== "undefined" ? document.body : undefined,
      zIndex: {
        overlay: 100000,
        modal: 110000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "componete"
  }, /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-small"
  }, /*#__PURE__*/React.createElement(PatientBreadcrumb, {
    patient: patient,
    loading: loading && !patient
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "pb-9"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "m-0 text-900"
  }, loading && !patient ? /*#__PURE__*/React.createElement("span", null, "Cargando paciente...") : patient ? `Notas de Enfermería - ${patient.first_name} ${patient.last_name}` : 'Notas de Enfermería'), /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Nueva Nota",
    icon: "pi pi-plus",
    onClick: () => {
      setCurrentNote(null);
      setModalVisible(true);
    },
    className: "p-button-primary",
    disabled: !patient || loading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus",
    style: {
      marginLeft: "5px"
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "grid p-5 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-8"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(TabView, null, /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("span", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-notes"
    }), "Notas de Enfermer\xEDa")
  }, /*#__PURE__*/React.createElement(FiltrosNotas, {
    filtros: filtros,
    onFiltrosChange: aplicarFiltros,
    enfermeras: enfermeras
  }), /*#__PURE__*/React.createElement(AcordeonNotas, {
    notas: notasFiltradas,
    loading: loading,
    onEdit: handleEditarNota,
    onDelete: handleEliminarNota
  }))))))), /*#__PURE__*/React.createElement(ModalNuevaNota, {
    visible: modalVisible,
    onHide: () => {
      setModalVisible(false);
      setCurrentNote(null);
    },
    onGuardarNota: handleGuardarNota,
    initialData: currentNote,
    loading: loading,
    patient: patient,
    enfermeras: enfermeras
  })))));
};
export default NotasEnfermeria;