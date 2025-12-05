import React from "react";
import { CustomPRTable } from "../../../components/CustomPRTable";
import { AccountingClosing } from "../hooks/useAccountingClosings";
import { AccountingClosingTableColumn } from "../accountingClosings";

interface AccountingClosingTableProps {
    data: AccountingClosing[];
    columns: AccountingClosingTableColumn[];
    onReload: () => void;
    loading?: boolean;
}
export const AccountingClosingsTable: React.FC<AccountingClosingTableProps> = ({
    data,
    columns,
    onReload,
    loading,
}) => {
    return (
        <>
            <div
                className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                style={{ minHeight: "400px" }}
            >
                <div className="card-body h-100 w-100 d-flex flex-column">
                    <CustomPRTable
                        data={data}
                        columns={columns}
                        loading={loading}
                        onReload={onReload}
                    />
                </div>
            </div>
        </>
    );
};

