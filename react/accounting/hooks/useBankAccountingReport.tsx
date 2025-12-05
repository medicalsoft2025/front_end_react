import { useState } from "react";
import { CuentaContable, MetodoPago } from "../types/bankTypes";
import BillingReportService from "../../../services/api/classes/billingReportService";

export const useBankAccountingReport = () => {
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBankAccountingReport = async ({
        from,
        to,
    }: {
        from?: string | null;
        to?: string | null;
    }) => {
        try {
            setLoading(true);
            const service = new BillingReportService();
            const response = await service.getBankAccountingReport({
                from,
                to,
            });
            console.log("response", response);
            const filteredData = response.map((item: any) => {
                const mappedMovements = item.movements.map((mov: any) => {
                    const filteredDetails = mov.details.filter(
                        (detail: any) => {
                            return (
                                detail.accounting_account ===
                                item.account.account_code
                            );
                        }
                    );

                    return {
                        ...mov,
                        details: filteredDetails,
                    };
                });

                return {
                    ...item,
                    movements: mappedMovements,
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
        loading,
    };
};
