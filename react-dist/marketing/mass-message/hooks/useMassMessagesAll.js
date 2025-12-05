import { useState } from "react";
// import { comissionConfig } from "../../../services/api";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { massMessageMedicalService } from "../../../../services/api/index.js";
export const useMassMessagesAll = () => {
  const [massMessages, setMassMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchMassMessages = async () => {
    try {
      const data = await massMessageMedicalService.getAll();
      setMassMessages(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    massMessages,
    setMassMessages,
    fetchMassMessages,
    loading
  };
};