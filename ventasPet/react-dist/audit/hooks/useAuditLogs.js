import { useState, useEffect } from 'react';
import { auditLogService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAuditLogs = async ({
    per_page,
    page
  } = {
    per_page: 10,
    page: 1
  }) => {
    try {
      const data = await auditLogService.getPaginated({
        per_page,
        page
      });
      console.log(data);
      setAuditLogs(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAuditLogs();
  }, []);
  return {
    auditLogs,
    fetchAuditLogs,
    loading
  };
};