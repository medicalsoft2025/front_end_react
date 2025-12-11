import { useState } from "react";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { patientService } from "../../../services/api/index.js";
export const useCallPatient = () => {
  const [loading, setLoading] = useState(false);
  async function callPatient(patientId) {
    setLoading(true);
    try {
      const response = await patientService.callPatient(patientId);
      SwalManager.success({
        text: response.message
      });
    } catch (error) {
      console.log(error);
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  return {
    callPatient
  };
};