import { useState, useEffect } from 'react';
import { patientService } from '../../../../services/api';

export const usePatientInfo = (patientId) => {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatientData = async () => {
            if (!patientId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Usar el servicio real para obtener los datos del paciente
                const paciente = await patientService.get(patientId);
                setPatientData(paciente);

            } catch (err) {
                setError(err.message);
                console.error("Error al obtener los datos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [patientId]);

    return { patientData, loading, error };
};