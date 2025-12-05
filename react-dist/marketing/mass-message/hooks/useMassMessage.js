import { useState } from "react";
import { massMessageMedicalService } from "../../../../services/api/index.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useMassMessage = () => {
  const [massMessage, setMassMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchMassMessage = async id => {
    try {
      const data = await massMessageMedicalService.get(id);
      setMassMessage(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    massMessage,
    setMassMessage,
    fetchMassMessage,
    loading
  };
};