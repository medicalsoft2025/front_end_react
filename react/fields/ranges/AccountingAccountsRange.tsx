import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { useAccountingAccounts } from "../../accounting/hooks/useAccountingAccounts";

interface AccountingAccountsRangeProps {
    startValue: any;
    endValue: any;
    handleStartChange: (e: any) => void;
    handleEndChange: (e: any) => void;
    optionLabel?: string;
    optionValue?: string;
    placeholder?: string;
    startLabel?: string;
    endLabel?: string;
}

export const AccountingAccountsRange: React.FC<AccountingAccountsRangeProps> = (props) => {

    const {
        startValue,
        endValue,
        handleStartChange,
        handleEndChange,
        optionLabel = 'label',
        optionValue = 'value',
        placeholder = 'Seleccione una cuenta contable',
        startLabel = 'Cuenta Inicial',
        endLabel = 'Cuenta Final'
    } = props;

    const [mappedAccounts, setMappedAccounts] = useState<any[]>([]);
    const [filteredEndAccounts, setFilteredEndAccounts] = useState<any[]>([]);

    const { accounts } = useAccountingAccounts();

    useEffect(() => {
        const mapped = accounts.map((account) => ({
            ...account,
            label: account.account_code + ' - ' + account.account_name,
            value: account.id,
            account_code: account.account_code
        }));
        setMappedAccounts(mapped);
        setFilteredEndAccounts(mapped);
    }, [accounts]);

    // Filtrar cuentas finales basado en la cuenta inicial seleccionada
    useEffect(() => {
        if (startValue) {
            const selectedStartAccount = mappedAccounts.find(account => account.value === startValue);
            if (selectedStartAccount) {
                // Filtrar cuentas que tengan un código mayor o igual al inicial
                const filtered = mappedAccounts.filter(account =>
                    account.account_code >= selectedStartAccount.account_code
                );
                setFilteredEndAccounts(filtered);

                // Si la cuenta final actual es menor que la inicial, resetearla
                if (endValue) {
                    const selectedEndAccount = mappedAccounts.find(account => account.value === endValue);
                    if (selectedEndAccount && selectedEndAccount.account_code < selectedStartAccount.account_code) {
                        handleEndChange({ value: null });
                    }
                }
            }
        } else {
            // Si no hay cuenta inicial, mostrar todas las cuentas
            setFilteredEndAccounts(mappedAccounts);
        }
    }, [startValue, mappedAccounts, endValue, handleEndChange]);

    return (
        <div className="d-flex gap-3">
            {/* Dropdown para cuenta inicial */}
            <div className="flex-grow-1">
                <label className="form-label" htmlFor="startAccount">{startLabel}</label>
                <Dropdown
                    id="startAccount"
                    value={startValue}
                    onChange={handleStartChange}
                    options={mappedAccounts}
                    optionLabel={optionLabel}
                    optionValue={optionValue}
                    placeholder={placeholder}
                    className="w-100"
                    filter
                    showClear
                />
            </div>

            {/* Dropdown para cuenta final */}
            <div className="flex-grow-1">
                <label className="form-label" htmlFor="endAccount">{endLabel}</label>
                <Dropdown
                    id="endAccount"
                    value={endValue}
                    onChange={handleEndChange}
                    options={filteredEndAccounts}
                    optionLabel={optionLabel}
                    optionValue={optionValue}
                    placeholder={placeholder}
                    className="w-100"
                    filter
                    showClear
                    disabled={!startValue} // Opcional: deshabilitar hasta que se seleccione una cuenta inicial
                />
            </div>
        </div>
    );
};