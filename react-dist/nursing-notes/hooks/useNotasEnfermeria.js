import { useState, useEffect } from 'react';
import { patientNursingNoteService, patientService } from "../../../services/api/index.js";
export const useNotasEnfermeria = patientId => {
  const [state, setState] = useState({
    notas: [],
    patient: null,
    loading: false,
    error: null
  });
  const [enfermeras, setEnfermeras] = useState([]);
  const mapNursingNote = note => {
    return {
      id: String(note.id),
      titulo: note.tituloNota || (note.note ? note.note.length > 50 ? note.note.substring(0, 50) + '...' : note.note : 'Nota de enfermería'),
      nota: note.note || '',
      fecha: note.created_at,
      created_at: note.created_at,
      updated_at: note.updated_at,
      user_id: String(note.user_id),
      enfermera: note.user ? `${note.user.first_name} ${note.user.last_name}` : `Enfermera ${note.user_id}`,
      patient_id: note.patient_id,
      tituloNota: note.tituloNota || ''
    };
  };

  // Efecto principal para cargar datos cuando cambia patientId
  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) {
        console.log("No patientId provided - waiting for valid ID");
        setState(prev => ({
          ...prev,
          loading: false,
          error: null
        }));
        return;
      }
      console.log("🔄 Fetching data for patient:", patientId);
      setState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));
      try {
        const [patientData, nursingNotesResponse] = await Promise.all([patientService.get(patientId), patientNursingNoteService.ofParent(patientId)]);
        console.log("✅ Patient data:", patientData);
        console.log("✅ Nursing notes response:", nursingNotesResponse);
        const mappedNotes = Array.isArray(nursingNotesResponse) ? nursingNotesResponse.map(mapNursingNote) : [];
        console.log("📝 Mapped notes:", mappedNotes);
        const enfermerasFromNotes = [];
        if (Array.isArray(nursingNotesResponse)) {
          const enfermerasMap = new Map();
          nursingNotesResponse.forEach(note => {
            if (note.user && note.user.id) {
              if (!enfermerasMap.has(note.user.id)) {
                enfermerasMap.set(note.user.id, {
                  id: String(note.user.id),
                  nombre: `${note.user.first_name} ${note.user.last_name}`,
                  value: String(note.user.id)
                });
              }
            }
          });
          enfermerasFromNotes.push(...enfermerasMap.values());
        }
        console.log("👩‍⚕️ Enfermeras from notes:", enfermerasFromNotes);
        setState({
          notas: mappedNotes,
          patient: patientData,
          loading: false,
          error: null
        });
        setEnfermeras(enfermerasFromNotes);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setState({
          notas: [],
          patient: null,
          loading: false,
          error: "Error al cargar los datos. Por favor, intente nuevamente."
        });
        setEnfermeras([]);
      }
    };
    fetchData();
  }, [patientId]);
  const guardarNotaEnServidor = async notaData => {
    try {
      console.log("💾 Guardando nota en servidor:", notaData);
      const datosParaServidor = {
        user_id: notaData.user_id,
        note: notaData.note,
        tituloNota: notaData.tituloNota || 'Nota de enfermería',
        guardarNota: ""
      };
      console.log("📤 Payload enviado al servidor:", datosParaServidor);
      console.log("👤 PatientId como parámetro:", patientId);
      const respuesta = await patientNursingNoteService.create(datosParaServidor, patientId);
      console.log("✅ Nota guardada en servidor:", respuesta);
      return respuesta;
    } catch (error) {
      console.error("❌ Error al guardar nota en servidor:", error);
      throw error;
    }
  };
  const editarNotaEnServidor = async (id, notaData) => {
    try {
      console.log("💾 Editando nota en servidor:", id, notaData);
      const datosParaServidor = {
        user_id: notaData.user_id,
        note: notaData.note,
        tituloNota: notaData.tituloNota || 'Nota de enfermería',
        guardarNota: ""
      };
      console.log("📤 Payload para edición:", datosParaServidor);
      const respuesta = await patientNursingNoteService.update(id, datosParaServidor);
      console.log("✅ Nota actualizada en servidor:", respuesta);
      return respuesta;
    } catch (error) {
      console.error("❌ Error al editar nota en servidor:", error);
      throw error;
    }
  };
  const eliminarNotaEnServidor = async id => {
    try {
      console.log("🗑️ Eliminando nota del servidor:", id);
      await patientNursingNoteService.delete(id);
      console.log("✅ Nota eliminada del servidor");
    } catch (error) {
      console.error("❌ Error al eliminar nota del servidor:", error);
      throw error;
    }
  };
  const agregarNota = async nuevaNota => {
    try {
      console.log("➕ Agregando nueva nota:", nuevaNota);
      const notaGuardada = await guardarNotaEnServidor(nuevaNota);
      const notaMapeada = mapNursingNote(notaGuardada);
      setState(prev => ({
        ...prev,
        notas: [notaMapeada, ...prev.notas]
      }));
      console.log("✅ Nota agregada exitosamente:", notaMapeada);
      return notaMapeada;
    } catch (error) {
      console.error("❌ Error al agregar nota:", error);
      throw error;
    }
  };
  const eliminarNota = async id => {
    try {
      console.log("🗑️ Eliminando nota:", id);
      await eliminarNotaEnServidor(id);
      setState(prev => ({
        ...prev,
        notas: prev.notas.filter(nota => nota.id !== id)
      }));
      console.log("✅ Nota eliminada exitosamente");
    } catch (error) {
      console.error("❌ Error al eliminar nota:", error);
      throw error;
    }
  };
  const editarNota = async (id, datosActualizados) => {
    try {
      console.log("✏️ Editando nota:", id, datosActualizados);
      const respuesta = await editarNotaEnServidor(id, datosActualizados);
      const notaActualizada = mapNursingNote(respuesta);
      setState(prev => ({
        ...prev,
        notas: prev.notas.map(nota => nota.id === id ? notaActualizada : nota)
      }));
      console.log("✅ Nota actualizada exitosamente:", notaActualizada);
      return notaActualizada;
    } catch (error) {
      console.error("❌ Error al editar nota:", error);
      throw error;
    }
  };
  const reload = () => {
    if (patientId) {
      console.log("🔄 Manual reload triggered");
      setState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));
    }
  };
  return {
    ...state,
    enfermeras,
    reload,
    agregarNota,
    eliminarNota,
    editarNota
  };
};