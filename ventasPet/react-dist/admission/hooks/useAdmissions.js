import { useState, useEffect } from 'react';
import { admissionService } from "../../../services/api/index.js";
export const useAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const fetchAdmissions = async () => {
    const data = await admissionService.active();
    console.log(data);
    setAdmissions(data.map(admission => {
      return admission;
    }));
  };
  useEffect(() => {
    fetchAdmissions();
  }, []);
  return {
    admissions,
    fetchAdmissions
  };
};