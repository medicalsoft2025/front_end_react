import React, { useState, useEffect } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { BillingReportService } from "../../../../services/api/classes/billingReportService";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { SwalManager } from "../../../../services/alertManagerImported";

export interface ThirdPartyAdvance {
    id: number;
    third_party_id: number;
    amount: number;
    currency: string;
    type: string;
    status: string;
    reference: string;
    notes: string;
    deleted_at: any;
    created_at: string;
    updated_at: string;
    third_party: ThirdParty;
}

export interface ThirdParty {
    id: number;
    type: string;
    name: string;
    external_id: any;
    document_type: string;
    document_number: string;
    email: string;
    phone: string;
    address: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    second_last_name: string;
    date_of_birth: string;
    created_at: string;
    updated_at: string;
    deleted_at: any;
    tax_type: string;
    agreement_id: any;
}

export const useAdvancesReport = (type: "client" | "provider") => {
    const baseData: ThirdPartyAdvance[] = [];
    const [dateRange, setDateRange] = useState<Nullable<(Date | null)[]>>([
        new Date(),
        new Date(),
    ]);
    const [thirdPartyId, setThirdPartyId] = useState<string | null>(null);

    const [advancesReport, setAdvancesReport] =
        useState<ThirdPartyAdvance[]>(baseData);
    const [loading, setLoading] = useState(true);

    const fetchAdvancesReport = async () => {
        setLoading(true);
        try {
            const service = new BillingReportService();
            const selectedDates = dateRange
                ?.filter((date) => !!date)
                .map((date) => date.toISOString().split("T")[0]);
            if (!selectedDates || selectedDates.length !== 2) {
                return;
            }
            const response: any = await service.getAdvancesReportByType({
                type,
            });
            const data: ThirdPartyAdvance[] = response.data;
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
        loading,
    };
};
