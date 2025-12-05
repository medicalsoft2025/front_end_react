import { useState, useEffect } from 'react';
import { patientNursingNoteService, patientService } from '../../../../services/api/index';

export const useNotasEnfermeria = (patientId) => {
    const [state, setState] = useState({
        notas: [],
        patient: null,
        loading: false,
        error: null
    });
    const [enfermeras, setEnfermeras] = useState([]);

    const mapNursingNote = (note) => {
        return {
            id: String(note.id),
            titulo: note.tituloNota || (note.note ? (note.note.length > 50 ? note.note.substring(0, 50) + '...' : note.note) : 'Nota de enfermería'),
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

        setState(prev => ({
            ...prev,
            loading: true,
            error: null
        }));

        try {
            const [patientData, nursingNotesResponse] = await Promise.all([
                patientService.get(patientId),
                patientNursingNoteService.ofParent(patientId)
            ]);

            const mappedNotes = Array.isArray(nursingNotesResponse)
                ? nursingNotesResponse.map(mapNursingNote)
                : [];


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


            setState({
                notas: mappedNotes,
                patient: patientData,
                loading: false,
                error: null
            });

            setEnfermeras(enfermerasFromNotes);

        } catch (error) {
            setState({
                notas: [],
                patient: null,
                loading: false,
                error: "Error al cargar los datos. Por favor, intente nuevamente."
            });
            setEnfermeras([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [patientId]);

    const guardarNotaEnServidor = async (notaData) => {
        try {
            const datosParaServidor = {
                user_id: notaData.user_id,
                note: notaData.note,
                tituloNota: notaData.tituloNota || 'Nota de enfermería',
                guardarNota: ""
            };

            const respuesta = await patientNursingNoteService.createForParent(patientId, datosParaServidor);

            return respuesta;

        } catch (error) {
            throw error;
        }
    };

    const editarNotaEnServidor = async (id, notaData) => {
        try {

            const datosParaServidor = {
                user_id: notaData.user_id,
                note: notaData.note,
                tituloNota: notaData.tituloNota || 'Nota de enfermería',
                guardarNota: ""
            };


            const respuesta = await patientNursingNoteService.updateForParent(id, datosParaServidor);

            return respuesta;

        } catch (error) {
            throw error;
        }
    };

    const eliminarNotaEnServidor = async (id) => {
        try {

            await patientNursingNoteService.delete(id);

        } catch (error) {
            throw error;
        }
    };

    const agregarNota = async (nuevaNota) => {
        try {

            const notaGuardada = await guardarNotaEnServidor(nuevaNota);
            const notaMapeada = mapNursingNote(notaGuardada);

            setState((prev) => ({
                ...prev,
                notas: [notaMapeada, ...prev.notas]
            }));

            return notaMapeada;

        } catch (error) {
            throw error;
        }
    };

    const eliminarNota = async (id) => {
        try {

            await eliminarNotaEnServidor(id);

            setState((prev) => ({
                ...prev,
                notas: prev.notas.filter(nota => nota.id !== id)
            }));


        } catch (error) {
            throw error;
        }
    };

    const editarNota = async (id, datosActualizados) => {
        try {

            const respuesta = await editarNotaEnServidor(id, datosActualizados);
            const notaActualizada = mapNursingNote(respuesta);

            setState((prev) => ({
                ...prev,
                notas: prev.notas.map(nota =>
                    nota.id === id ? notaActualizada : nota
                )
            }));

            return notaActualizada;

        } catch (error) {
            throw error;
        }
    };

    const reload = async () => {
        if (patientId) {
            await fetchData();
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