import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { AccountingClosingsTable } from './table/AccountingClosingsTable';
import AccountingClosingModal from './modal/AccountingClosingModal';
import { AccountingClosing, useAccountingClosings } from './hooks/useAccountingClosings';
import { AccountingClosingFormInputs } from './form/AccountingClosingForm';
import { useAccountingClosingsCreate } from './hooks/useAccountingClosingsCreate';
import { useAccountingClosing } from './hooks/useAccountingClosing';
import { useAccountingClosingsUpdate } from './hooks/useAccountingClosingsUpdate';
import { useAccountingClosingDelete } from './hooks/useAccountingClosingDelete';
import { formatDate, stringToDate } from '../../../services/utilidades';
import { CustomPRTableMenu } from '../../components/CustomPRTableMenu';
import { Button } from 'primereact/button';

export interface AccountingClosingTableColumn {
    field: string;
    header: string;
    body?: (rowData: AccountingClosing) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

export interface ColumnActionsProps {
    editAccountingClosing: (id: string) => void;
    deleteAccountingClosingHandler: (id: string) => void;
}



export const accountingClosings = () => {

    const [showFormModal, setShowFormModal] = useState(false);
    const [initialData, setInitialData] = useState<AccountingClosingFormInputs | undefined>(
        undefined
    );

    const { accountingClosings, fetchAccountingClosings, loading } = useAccountingClosings();
    const { createAccountingClosing } = useAccountingClosingsCreate();
    const { accountingClosing, fetchAccountingClosing, setAccountingClosing } = useAccountingClosing();
    const { updateAccountingClosing } = useAccountingClosingsUpdate();
    const { deleteAccountingClosing } = useAccountingClosingDelete();

    const handleCreate = () => {
        setInitialData(undefined);
        setAccountingClosing(null);
        setShowFormModal(true);
    };

    const handleSubmit = async (data: AccountingClosingFormInputs) => {
        try {
            if (accountingClosing) {
                await updateAccountingClosing(accountingClosing.data.id.toString(), data);
            } else {
                await createAccountingClosing(data);
            }
            fetchAccountingClosings();
            setShowFormModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const editAccountingClosing = (id: string) => {
        fetchAccountingClosing(id);
        setShowFormModal(true);
    };

    const deleteAccountingClosingHandler = async (id: string) => {
        const confirmed = await deleteAccountingClosing(id)
        if (confirmed) fetchAccountingClosings()
    };

    const getAccountingClosingColumns = ({
        editAccountingClosing,
        deleteAccountingClosingHandler
    }: ColumnActionsProps): AccountingClosingTableColumn[] => [
            {
                field: "age",
                header: "Año",
                sortable: true
            },
            {
                field: "status",
                header: "Estado",
                body: (rowData: AccountingClosing) => (
                    <span className={`badge ${rowData.status === "open" ? "bg-success" : "bg-secondary"}`}>
                        {rowData.status === "open" ? "Abierto" : "Cerrado"}
                    </span>
                ),
                sortable: true
            },
            {
                field: "start_month",
                header: "Fecha Inicio",
                body: (rowData: AccountingClosing) => formatDate(rowData.start_month),
                sortable: true
            },
            {
                field: "end_month",
                header: "Fecha Fin",
                body: (rowData: AccountingClosing) => formatDate(rowData.end_month),
                sortable: true
            },
            {
                field: "warning_days",
                header: "Días Advertencia",
                sortable: true,
                width: '150px'
            },
            {
                field: "actions",
                header: "Acciones",
                body: (rowData: AccountingClosing) => {
                    return (
                        <div className="d-flex justify-content-center">
                            <CustomPRTableMenu
                                menuItems={[
                                    {
                                        icon: <i className="fas fa-pencil-alt me-2"></i>,
                                        label: "Editar",
                                        command: () => editAccountingClosing(rowData.id.toString()),
                                    },
                                    {
                                        icon: <i className="fa-solid fa-trash me-2"></i>,
                                        label: "Eliminar",
                                        command: () => deleteAccountingClosingHandler(rowData.id.toString()),
                                    },
                                ]}
                                rowData={rowData}
                            />
                        </div>
                    );
                },
            }
        ];

    const columns = getAccountingClosingColumns({
        editAccountingClosing,
        deleteAccountingClosingHandler
    });

    useEffect(() => {
        if (accountingClosing) {
            setInitialData({
                age: accountingClosing.data.age,
                status: accountingClosing.data.status,
                start_month: stringToDate(accountingClosing.data.start_month.split("T")[0]),
                end_month: stringToDate(accountingClosing.data.end_month.split("T")[0]),
                warning_days: accountingClosing.data.warning_days
            });
        }
    }, [accountingClosing]);

    const accountingClosingsData = accountingClosings?.data || [];


    return (
        <PrimeReactProvider>
            <div className="d-flex justify-content-end mb-4">
                <div style={{ margin: "-2px 20px -20px" }} className="text-end">
                    <Button
                        label='Nuevo Período'
                        className="p-button-primary"
                        onClick={handleCreate}
                    >
                        <i className="fas fa-plus me-2" style={{ marginLeft: "5px" }}></i>
                    </Button>
                </div>
            </div>

            <AccountingClosingsTable
                data={accountingClosingsData}
                columns={columns}
                loading={loading}
                onReload={fetchAccountingClosings}
            />

            <AccountingClosingModal
                isVisible={showFormModal}
                onSave={handleSubmit}
                onClose={() => setShowFormModal(false)}
                initialData={initialData}
            />
        </PrimeReactProvider>
    );
};