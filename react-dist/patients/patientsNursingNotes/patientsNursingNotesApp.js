import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useNotasEnfermeria } from "./hooks/usePatientsNursingNotes.js";
import PatientsNursingNotesModal from "./modal/PatientsNursingNotesModal.js";
import { PatientsNursingNotesTable } from "./table/PatientsNursingNotesTable.js";
export const patientsNursingNotesApp = ({
  patientId,
  onConfigurationComplete
}) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const patientIdString = typeof patientId === 'number' ? patientId.toString() : patientId;
  const {
    notas,
    loading,
    error,
    enfermeras,
    reload,
    agregarNota,
    eliminarNota,
    editarNota
  } = useNotasEnfermeria(patientIdString);
  const onCreate = () => {
    console.log("Creando nueva nota de enfermería");
    setInitialData(undefined);
    setIsEditing(false);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      console.log("Enviando datos del formulario:", data);
      if (isEditing && initialData?.id) {
        console.log("Actualizando nota existente:", initialData.id);
        await editarNota(initialData.id, data);
        SwalManager.success('Nota actualizada correctamente');
      } else {
        console.log("Creando nueva nota");
        await agregarNota(data);
        SwalManager.success('Nota creada correctamente');
      }
      setShowFormModal(false);
      setInitialData(undefined);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      SwalManager.error('Error al guardar la nota');
    }
  };
  const handleTableEdit = async id => {
    try {
      console.log("Editando nota con ID:", id);
      const notaEncontrada = notas.find(nota => nota.id === id);
      if (notaEncontrada) {
        setInitialData({
          id: notaEncontrada.id,
          tituloNota: notaEncontrada.tituloNota || notaEncontrada.titulo,
          user_id: notaEncontrada.user_id,
          note: notaEncontrada.nota
        });
        setIsEditing(true);
        setShowFormModal(true);
      } else {
        console.error("No se encontró la nota con ID:", id);
        SwalManager.error('No se pudo cargar la nota para editar');
      }
    } catch (error) {
      console.error("Error al cargar nota para editar:", error);
      SwalManager.error('Error al cargar la nota');
    }
  };
  const handleDeleteNote = async id => {
    try {
      await eliminarNota(id);
    } catch (error) {
      console.error("Error en eliminación:", error);
      SwalManager.error('Error al eliminar la nota');
    }
  };
  useEffect(() => {
    const hasNotes = notas && notas.length > 0;
    onConfigurationComplete?.(hasNotes);
  }, [notas, onConfigurationComplete]);
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, error), /*#__PURE__*/React.createElement(PatientsNursingNotesTable, {
    onEditItem: handleTableEdit,
    nursingNotes: notas,
    onDeleteItem: handleDeleteNote,
    loading: loading,
    onReload: reload,
    onCreate: onCreate
  }), /*#__PURE__*/React.createElement(PatientsNursingNotesModal, {
    visible: showFormModal,
    onHide: () => {
      console.log("Cerrando modal");
      setShowFormModal(false);
      setInitialData(undefined);
      setIsEditing(false);
    },
    onGuardarNota: handleSubmit,
    enfermeras: enfermeras,
    loading: loading,
    initialData: initialData
  }));
};