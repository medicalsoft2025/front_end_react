import { useState, useEffect, useCallback } from 'react';
import { patientService } from "../../../../services/api/index.js";
export const usePatientInfo = patientId => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchPatientData = useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const paciente = await patientService.get(patientId);
      setPatientData(paciente);
    } catch (err) {
      setError(err.message);
      console.error("Error al obtener los datos:", err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);
  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);
  const refresh = useCallback(async () => {
    await fetchPatientData();
  }, [fetchPatientData]);
  return {
    patientData,
    refresh,
    loading,
    error
  };
};