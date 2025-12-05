import { useState } from "react";
import BillingReportService from "../../../services/api/classes/billingReportService.js";
export const useBankAccountingReport = () => {
  const [metodosPago, setMetodosPago] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchBankAccountingReport = async ({
    from,
    to
  }) => {
    try {
      setLoading(true);
      const service = new BillingReportService();
      const response = await service.getBankAccountingReport({
        from,
        to
      });
      console.log("response", response);
      const filteredData = response.map(item => {
        const mappedMovements = item.movements.map(mov => {
          const filteredDetails = mov.details.filter(detail => {
            return detail.accounting_account === item.account.account_code;
          });
          return {
            ...mov,
            details: filteredDetails
          };
        });
        return {
          ...item,
          movements: mappedMovements
        };
      });
      console.log("filteredData", filteredData);
      setMetodosPago(filteredData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    metodosPago,
    fetchBankAccountingReport,
    loading
  };
};