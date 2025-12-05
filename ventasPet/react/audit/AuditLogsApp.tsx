import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuditLogs } from './hooks/useAuditLogs';
import { CustomPRTable, CustomPRTableColumnProps } from '../components/CustomPRTable';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { useUsers } from '../users/hooks/useUsers';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { auditLogActions } from '../../services/commons';

type AuditLogsTableItem = {
    createdAt: string,
    userName: string,
    description: string,
    originalData: any
}

export const AuditLogsApp: React.FC = () => {
    const [tableItems, setTableItems] = useState<AuditLogsTableItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<AuditLogsTableItem[]>([]);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [dateRange, setDateRange] = React.useState<
        Nullable<(Date | null)[]>
    >([new Date(new Date().setDate(new Date().getDate())), new Date()]);

    const { auditLogs } = useAuditLogs();
    const { users } = useUsers();

    const getAuditLogActions = () => {
        return Object.entries(auditLogActions).map(([key, label]) => ({
            value: key,
            label: label,
        }));
    };

    const generateUserActionMessage = (data: any): string => {

        const tableNames = {
            'entities': 'entidad',
            'users': 'usuario',
            'products': 'producto',
            'invoices': 'factura',
        };
        const action: string = data['action_'];
        const table: string = data['table_'];
        const tableReadable = tableNames[table.toLowerCase()] ?? table;

        let message: string;

        switch (action) {
            case 'created':
                message = `El usuario creó una nueva ${tableReadable}.`;
                break;
            case 'updated':
                message = `El usuario actualizó la ${tableReadable}.`;
                break;
            case 'deleted':
                message = `El usuario eliminó la ${tableReadable}.`;
                break;
            default:
                message = `El usuario realizó una acción (${action}) en la ${tableReadable}.`;
        }
        return message;
    }

    // Aplicar filtros
    useEffect(() => {
        const filtered = tableItems.filter(item => {
            // Filtro por usuario
            if (selectedUser && item.originalData.user_id !== parseInt(selectedUser)) {
                return false;
            }

            // Filtro por acción
            if (selectedAction && item.originalData.action_ !== selectedAction) {
                return false;
            }

            // Filtro por rango de fechas
            if (dateRange && dateRange[0] && dateRange[1]) {
                const logDate = new Date(item.originalData.created_at).getTime();
                const startDate = dateRange[0].getTime();
                const endDate = dateRange[1].getTime() + 86400000; // +1 día para incluir todo el día final

                if (logDate < startDate || logDate > endDate) {
                    return false;
                }
            }

            return true;
        });

        setFilteredItems(filtered);
    }, [selectedUser, selectedAction, dateRange, tableItems]);

    useEffect(() => {
        const mappedItems: AuditLogsTableItem[] = auditLogs.map(logs => {
            return {
                createdAt: new Intl.DateTimeFormat('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(new Date(logs.created_at)),
                userName: `${logs.user.first_name} ${logs.user.middle_name} ${logs.user.last_name} ${logs.user.second_last_name}`,
                description: generateUserActionMessage(logs),
                originalData: logs
            }
        })
        setTableItems(mappedItems);
    }, [auditLogs])

    const columns: CustomPRTableColumnProps[] = [
        { field: 'createdAt', header: 'Realizado el', sortable: true },
        { field: 'userName', header: 'Realizado por' },
        { field: 'description', header: 'Descripción' }
    ]

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <Accordion>
                        <AccordionTab header="Filtros">
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label htmlFor="branch_id" className="form-label">
                                        Usuario
                                    </label>
                                    <Dropdown
                                        inputId="branch_id"
                                        options={users}
                                        optionLabel="label"
                                        optionValue="id"
                                        filter
                                        placeholder="Filtrar por usuario"
                                        className="w-100"
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.value)}
                                        showClear
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label htmlFor="rangoFechasCitas" className="form-label">
                                        Rango de fechas
                                    </label>
                                    <Calendar
                                        id="rangoFechasCitas"
                                        name="rangoFechaCitas"
                                        selectionMode="range"
                                        dateFormat="dd/mm/yy"
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.value)}
                                        className="w-100"
                                        placeholder="Seleccione un rango"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="branch_id" className="form-label">
                                        Acciones
                                    </label>
                                    <Dropdown
                                        inputId="branch_id"
                                        options={getAuditLogActions()}
                                        optionLabel="label"
                                        optionValue="value"
                                        filter
                                        placeholder="Filtrar por estado"
                                        className="w-100"
                                        value={selectedAction}
                                        onChange={(e) => setSelectedAction(e.value)}
                                        showClear
                                    />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>
                    <CustomPRTable
                        columns={columns}
                        data={filteredItems}
                        sortField='createdAt'
                        sortOrder={-1}
                    >
                    </CustomPRTable>
                </div>
            </div>
        </>
    )
}
