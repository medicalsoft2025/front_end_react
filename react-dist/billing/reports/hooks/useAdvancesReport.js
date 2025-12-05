import { useState, useEffect } from "react";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { BillingReportService } from "../../../../services/api/classes/billingReportService.js";
export const useAdvancesReport = type => {
  const baseData = [];
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [thirdPartyId, setThirdPartyId] = useState(null);
  const [advancesReport, setAdvancesReport] = useState(baseData);
  const [loading, setLoading] = useState(true);
  const fetchAdvancesReport = async () => {
    setLoading(true);
    try {
      const service = new BillingReportService();
      const selectedDates = dateRange?.filter(date => !!date).map(date => date.toISOString().split("T")[0]);
      if (!selectedDates || selectedDates.length !== 2) {
        return;
      }
      const response = await service.getAdvancesReportByType({
        type
      });
      const data = response.data;
      if (!data) {
        setAdvancesReport(baseData);
      }
      setAdvancesReport(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdvancesReport();
  }, []);
  useEffect(() => {
    fetchAdvancesReport();
  }, [dateRange, thirdPartyId]);
  return {
    dateRange,
    setDateRange,
    thirdPartyId,
    setThirdPartyId,
    advancesReport,
    fetchAdvancesReport,
    loading
  };
};