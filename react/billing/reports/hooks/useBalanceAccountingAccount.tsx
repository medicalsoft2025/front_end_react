import React, { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../../services/errorHandler';
import { BillingReportService } from '../../../../services/api/classes/billingReportService';
import { Nullable } from 'primereact/ts-helpers';

export type BalanceCuentaContable = {
    cuenta_id: number;
    cuenta_codigo: string;
    cuenta_nombre: string;
    saldo_inicial: string;
    debe_total: number;
    haber_total: number;
    saldo_final: number;
};

export const useBalanceAccountingAccount = () => {
    const baseData: BalanceCuentaContable[] = []
    const [dateRange, setDateRange] = useState<Nullable<(Date | null)[]>>([
        new Date(),
        new Date()
    ]);

    const [startAccount, setStartAccount] = useState<string | null>(null);
    const [endAccount, setEndAccount] = useState<string | null>(null);

    const [balanceAccountingAccount, setBalanceAccountingAccount] = useState<BalanceCuentaContable[]>(baseData);
    const [loading, setLoading] = useState(true);

    const fetchBalanceAccountingAccount = async () => {
        setLoading(true);
        try {
            const service = new BillingReportService();
            const selectedDates = dateRange?.filter((date) => !!date).map((date) => date.toISOString().split("T")[0])
            if (!selectedDates || selectedDates.length !== 2) {
                return;
            }
            const data: BalanceCuentaContable[] = await service.getBalanceAccountingAccount({
                from: selectedDates[0],
                to: selectedDates[1],
                account_from: startAccount,
                account_to: endAccount
            });
            if (!data) {
                setBalanceAccountingAccount(baseData);
            }
            setBalanceAccountingAccount(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalanceAccountingAccount();
    }, []);

    useEffect(() => {
        fetchBalanceAccountingAccount();
    }, [dateRange, startAccount, endAccount]);

    return {
        dateRange,
        setDateRange,
        startAccount,
        endAccount,
        setStartAccount,
        setEndAccount,
        balanceAccountingAccount,
        fetchBalanceAccountingAccount,
        loading
    };
};
