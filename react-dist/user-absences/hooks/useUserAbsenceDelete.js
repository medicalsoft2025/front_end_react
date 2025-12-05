import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { userAbsenceService } from '../../../services/api/index.js';
export const useUserAbsenceDelete = () => {
  const [loading, setLoading] = useState(false);
  const deleteUserAbsence = async id => {
    try {
      setLoading(true);
      await userAbsenceService.delete(id);
    } catch (err) {
      ErrorHandler.generic(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    deleteUserAbsence,
    loading
  };
};