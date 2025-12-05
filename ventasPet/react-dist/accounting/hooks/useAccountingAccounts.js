// hooks/useAccountingAccounts.ts
import { useState, useEffect } from 'react';
import { accountingAccountsService } from "../../../services/api/index.js";
export const useAccountingAccounts = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await accountingAccountsService.getAllAccounts();
        setApiData(response.data);

        // Imprimir en consola
        console.log('API Response:', response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return {
    apiData,
    loading,
    error
  };
};