import { useState, useEffect } from 'react';
import AccountingClosingsService from "../../../../services/api/classes/accountingClosingsService.js";
export const useAccountingClosings = () => {
  const [accountingClosings, setAccountingClosings] = useState({
    data: []
  });
  const [loading, setLoading] = useState(true);
  const fetchAccountingClosings = async () => {
    try {
      setLoading(true);
      const service = new AccountingClosingsService();
      const data = await service.getAll();
      setAccountingClosings(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAccountingClosings();
  }, []);
  return {
    accountingClosings,
    fetchAccountingClosings,
    loading
  };
};