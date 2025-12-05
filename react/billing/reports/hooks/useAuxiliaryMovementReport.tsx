import { useEffect, useState } from "react";
import BillingReportService from "../../../../services/api/classes/billingReportService";
import { CuentaContable } from "../../../accounting/types/bankTypes";
import { Nullable } from "primereact/ts-helpers";

export const useAuxiliaryMovementReport = () => {
    const [cuentasContables, setCuentasContables] = useState<CuentaContable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<Nullable<(Date | null)[]>>([
        new Date(),
        new Date()
    ]);
    const [startAccount, setStartAccount] = useState<string | null>(null);
    const [endAccount, setEndAccount] = useState<string | null>(null);

    const fetchAuxiliaryMovementReport = async () => {
        try {
            setLoading(true);
            const service = new BillingReportService();
            const selectedDates = dateRange?.filter((date) => !!date).map((date) => date.toISOString().split("T")[0])
            if (!selectedDates || selectedDates.length !== 2) {
                return;
            }
            const response = await service.getAuxiliaryMovementReport({
                from: selectedDates[0],
                to: selectedDates[1],
                account_from: startAccount,
                account_to: endAccount
            });
            setCuentasContables(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuxiliaryMovementReport();
    }, [dateRange, startAccount, endAccount]);

    return {
        cuentasContables,
        fetchAuxiliaryMovementReport,
        loading,
        dateRange,
        setDateRange,
        startAccount,
        endAccount,
        setStartAccount,
        setEndAccount
    };
};
