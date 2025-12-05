import React, { useState, useCallback, useMemo, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { FilterService } from "primereact/api";
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";

// Definición de tipos TypeScript
type AccountLevel = 'clase' | 'grupo' | 'cuenta' | 'subcuenta' | 'auxiliar' | 'subauxiliar';
type AccountStatus = 'active' | 'inactive';
type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';

interface Error {
    message: string;
}

interface ApiAccountingAccount {
    id: number;
    account_code: string;
    account_name: string;
    status: AccountStatus;
    initial_balance: string;
    account_type: AccountType;
    account: string;
    sub_account: string;
    auxiliary: string;
    sub_auxiliary: string;
    fiscal_difference?: boolean;
    created_at: string;
    updated_at: string;
}

interface AccountingAccount {
    id: number;
    account_code: string;
    account_name: string;
    status: AccountStatus;
    account_level: AccountLevel;
    fiscal_difference: boolean;
    parent_id?: string;
    children?: AccountingAccount[];
}

interface Categoria {
    label: string;
    value: string;
}

interface DetalleSaldo {
    label: string;
    value: string;
}

interface TableRow {
    tipo: string;
    codigo: string;
    nombre: string;
}

interface NewAccountForm {
    tipo: AccountLevel;
    codigo: string;
    nombre: string;
    fiscalDifference: boolean;
    activa: boolean;
}

// Configuración de filtros
FilterService.register('customSearch', (value, filter) => {
    if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
    }
    if (value === undefined || value === null) {
        return false;
    }
    return value.toString().toLowerCase().includes(filter.toLowerCase());
});

// Datos estáticos para dropdowns
const categorias: Categoria[] = [
    { label: "Caja - bancos", value: "Caja - bancos" },
    { label: "Cuentas por cobrar", value: "Cuentas por cobrar" },
    { label: "Otros activos corrientes", value: "Otros activos corrientes" },
];

const detalleSaldos: DetalleSaldo[] = [
    { label: "Sin detalle de vencimientos", value: "Sin detalle de vencimientos" },
    { label: "Clientes, controla vencimientos y estados de cuenta", value: "Clientes, controla vencimientos y estados de cuenta" },
    { label: "Proveedores, controla vencimientos y estado de cuenta", value: "Proveedores, controla vencimientos y estado de cuenta" },
];

const accountLevels = [
    { label: 'Clase', value: 'clase' },
    { label: 'Grupo', value: 'grupo' },
    { label: 'Cuenta', value: 'cuenta' },
    { label: 'SubCuenta', value: 'subcuenta' },
    { label: 'Auxiliar', value: 'auxiliar' },
    { label: 'SubAuxiliar', value: 'subauxiliar' }
];

// Función para validar códigos de cuenta
const validateCode = (code: string, level: AccountLevel, parentCode?: string): { valid: boolean; message?: string } => {
    if (!code) return { valid: false, message: 'El código es requerido' };

    const levelDigits = {
        clase: 1,
        grupo: 2,
        cuenta: 4,
        subcuenta: 6,
        auxiliar: 8,
        subauxiliar: 10
    };

    if (code.length !== levelDigits[level]) {
        return { valid: false, message: `El nivel ${level} debe tener ${levelDigits[level]} dígitos` };
    }

    if (parentCode && !code.startsWith(parentCode.substring(0, levelDigits[level] - 2))) {
        return { valid: false, message: `Debe comenzar con el código del nivel superior` };
    }

    return { valid: true };
};

// Función para transformar datos de API a estructura jerárquica
const transformApiDataToTree = (apiData: ApiAccountingAccount[]): AccountingAccount[] => {
    const tree: AccountingAccount[] = [];
    const nodeMap = new Map<string, AccountingAccount>();
    console.log("apiData", apiData);
    apiData.forEach(item => {
        const levels = [
            {
                code: item.account,
                fullCode: item.account,
                level: 'clase',
                name: `Clase ${item.account}`
            },
            {
                code: item.sub_account,
                fullCode: `${item.account}${item.sub_account}`,
                level: 'grupo',
                name: `Grupo ${item.sub_account}`
            },
            {
                code: item.auxiliary,
                fullCode: `${item.account}${item.sub_account}${item.auxiliary}`,
                level: 'cuenta',
                name: `Cuenta ${item.auxiliary}`
            },
            {
                code: item.sub_auxiliary,
                fullCode: item.account_code,
                level: 'subcuenta',
                name: item.account_name,
                isLeaf: true
            }
        ].filter(level => level.code); // Filtrar niveles vacíos

        let parentNodes = tree;

        levels.forEach((levelInfo, index) => {
            const { fullCode, name, level, isLeaf } = levelInfo;

            if (!nodeMap.has(fullCode)) {
                const newNode: AccountingAccount = {
                    id: isLeaf ? item.id : -Math.random(), // ID negativo para nodos no-hoja
                    account_code: fullCode,
                    account_name: name,
                    account_level: level as AccountLevel,
                    status: item.status,
                    fiscal_difference: item.fiscal_difference || false,
                    parent_id: index > 0 ? levels[index - 1].fullCode : undefined,
                    children: isLeaf ? undefined : []
                };

                nodeMap.set(fullCode, newNode);

                if (index === 0) {
                    parentNodes.push(newNode);
                } else {
                    const parentNode = nodeMap.get(levels[index - 1].fullCode);
                    if (parentNode?.children) {
                        parentNode.children.push(newNode);
                    }
                }
            }
        });
    });

    return tree;
};

// Componente principal
export const AccountingAccounts: React.FC = () => {
    // Estados
    const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [activeAccordionKeys, setActiveAccordionKeys] = useState<{ [key: string]: number[] }>({});
    const [selectedPath, setSelectedPath] = useState<AccountingAccount[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<AccountingAccount | null>(null);
    const [filters, setFilters] = useState({
        codigo: { value: '', matchMode: 'customSearch' },
        nombre: { value: '', matchMode: 'customSearch' }
    });
    const [fiscalChecked, setFiscalChecked] = useState<boolean>(false);
    const [activaChecked, setActivaChecked] = useState<boolean>(true);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [selectedDetalle, setSelectedDetalle] = useState<DetalleSaldo | null>(null);
    const [showNewAccountDialog, setShowNewAccountDialog] = useState<boolean>(false);
    const [newAccount, setNewAccount] = useState<NewAccountForm>({
        tipo: 'clase',
        codigo: '',
        nombre: '',
        fiscalDifference: false,
        activa: true
    });
    const [codeValidation, setCodeValidation] = useState<{ valid: boolean; message?: string }>({ valid: false });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Simulación de hook useAccountingAccounts
    useEffect(() => {
        // Simulamos la carga de datos
        const fetchData = async () => {
            try {
                // Datos de ejemplo simulados
                const mockData: ApiAccountingAccount[] = [
                    {
                        id: 1,
                        account_code: "11010101",
                        account_name: "Caja General",
                        status: "active",
                        initial_balance: "0.00",
                        account_type: "asset",
                        account: "1",
                        sub_account: "10",
                        auxiliary: "101",
                        sub_auxiliary: "0101",
                        fiscal_difference: false,
                        created_at: "2023-01-01",
                        updated_at: "2023-01-01"
                    },
                    {
                        id: 2,
                        account_code: "11010102",
                        account_name: "Caja Chica",
                        status: "active",
                        initial_balance: "0.00",
                        account_type: "asset",
                        account: "1",
                        sub_account: "10",
                        auxiliary: "101",
                        sub_auxiliary: "0102",
                        fiscal_difference: true,
                        created_at: "2023-01-01",
                        updated_at: "2023-01-01"
                    },
                    {
                        id: 3,
                        account_code: "11020101",
                        account_name: "Cuenta Corriente Banco X",
                        status: "active",
                        initial_balance: "0.00",
                        account_type: "asset",
                        account: "1",
                        sub_account: "10",
                        auxiliary: "102",
                        sub_auxiliary: "0101",
                        created_at: "2023-01-01",
                        updated_at: "2023-01-01"
                    },
                    {
                        id: 4,
                        account_code: "21010101",
                        account_name: "Proveedores Nacionales",
                        status: "active",
                        initial_balance: "0.00",
                        account_type: "liability",
                        account: "2",
                        sub_account: "10",
                        auxiliary: "101",
                        sub_auxiliary: "0101",
                        created_at: "2023-01-01",
                        updated_at: "2023-01-01"
                    }
                ];

                await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red
                setAccounts(transformApiDataToTree(mockData));
                setLoading(false);
            } catch (err) {
                setError("Error al cargar los datos de cuentas contables");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Funciones auxiliares
    const findFirstLeaf = useCallback((nodes: AccountingAccount[]): AccountingAccount | null => {
        for (const node of nodes) {
            if (!node.children || node.children.length === 0) {
                return node;
            }
            const leaf = findFirstLeaf(node.children);
            if (leaf) return leaf;
        }
        return null;
    }, []);

    const findNodePath = useCallback((nodes: AccountingAccount[], id: number, path: AccountingAccount[] = []): AccountingAccount[] | null => {
        for (const node of nodes) {
            if (node.id === id) return [...path, node];
            if (node.children) {
                const found = findNodePath(node.children, id, [...path, node]);
                if (found) return found;
            }
        }
        return null;
    }, []);

    const getActiveIndexesFromPath = useCallback((nodes: AccountingAccount[], path: AccountingAccount[]): { [key: string]: number[] } => {
        let currentNodes = nodes;
        const activeIndexes: { [key: string]: number[] } = {};
        let currentPath = 'root';

        for (const pathNode of path.slice(0, -1)) {
            const index = currentNodes.findIndex(n => n.id === pathNode.id);
            if (index === -1) break;

            if (!activeIndexes[currentPath]) {
                activeIndexes[currentPath] = [];
            }

            if (!activeIndexes[currentPath].includes(index)) {
                activeIndexes[currentPath].push(index);
            }

            currentNodes = currentNodes[index].children || [];
            currentPath = pathNode.id.toString();
        }
        return activeIndexes;
    }, []);

    // Efectos
    useEffect(() => {
        if (accounts && accounts.length > 0) {
            setActiveAccordionKeys({ 'root': [0] });
            const firstLeaf = findFirstLeaf(accounts);
            if (firstLeaf) {
                handleAccountSelect(firstLeaf.id);
            }
        }
    }, [accounts, findFirstLeaf]);

    useEffect(() => {
        if (showNewAccountDialog) {
            const parentCode = selectedAccount?.account_code;
            const validation = validateCode(newAccount.codigo, newAccount.tipo, parentCode);
            setCodeValidation(validation);
        }
    }, [newAccount.codigo, newAccount.tipo, selectedAccount, showNewAccountDialog]);

    // Handlers y funciones de renderizado
    const handleAccountSelect = useCallback((id: number, parentId?: string, event?: React.MouseEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const path = findNodePath(accounts, id);
        if (path) {
            const account = path[path.length - 1];
            setSelectedAccount(account);
            setSelectedPath(path);
            setTableData(path.map(node => ({
                tipo: node.account_level.charAt(0).toUpperCase() + node.account_level.slice(1),
                codigo: node.account_code,
                nombre: node.account_name
            })));

            const newActiveIndexes = getActiveIndexesFromPath(accounts, path);
            setActiveAccordionKeys(prev => ({
                ...prev,
                ...newActiveIndexes
            }));

            setFiscalChecked(account.fiscal_difference || false);
            setActivaChecked(account.status === 'active');
        }
    }, [accounts, findNodePath, getActiveIndexesFromPath]);

    const renderAccordion = useCallback((data: AccountingAccount[], depth: number = 0, parentId: string = 'root'): React.ReactNode[] => {
        return data.map((item, index) => {
            const hasChildren = item.children && item.children.length > 0;
            const isActive = activeAccordionKeys[parentId]?.includes(index) || false;
            const isSelected = selectedAccount?.id === item.id;

            return (
                <AccordionTab
                    key={`${item.id}-${depth}-${index}`}
                    header={
                        <div
                            className={classNames("accordion-header-content", {
                                'selected-account': isSelected,
                                'has-children': hasChildren
                            })}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAccountSelect(item.id, parentId);
                            }}
                            style={{ paddingLeft: `${depth * 16}px` }}
                        >
                            <span className="account-code">{item.account_code}</span>
                            <span className="account-name">{item.account_name}</span>
                            {hasChildren && (
                                <i className={`pi pi-chevron-${isActive ? 'down' : 'right'} accordion-arrow`} />
                            )}
                            {item.fiscal_difference && (
                                <i
                                    className="pi pi-star-fill fiscal-icon"
                                    data-pr-tooltip="Diferencia fiscal"
                                    data-pr-position="right"
                                />
                            )}
                        </div>
                    }
                >
                    {hasChildren && (
                        <Accordion
                            multiple
                            activeIndex={activeAccordionKeys[item.id.toString()] || []}
                            onTabChange={(e) => {
                                setActiveAccordionKeys(prev => ({
                                    ...prev,
                                    [item.id.toString()]: e.index as number[]
                                }));
                            }}
                        >
                            {renderAccordion(item.children || [], depth + 1, item.id.toString())}
                        </Accordion>
                    )}
                </AccordionTab>
            );
        });
    }, [activeAccordionKeys, handleAccountSelect, selectedAccount]);

    const filteredAccounts = useMemo(() => {
        if (!filters.codigo.value && !filters.nombre.value) return accounts;

        const filterNodes = (nodes: AccountingAccount[]): AccountingAccount[] => {
            return nodes
                .map(node => {
                    const matchesCode = !filters.codigo.value ||
                        node.account_code.toLowerCase().includes(filters.codigo.value.toLowerCase());
                    const matchesName = !filters.nombre.value ||
                        node.account_name.toLowerCase().includes(filters.nombre.value.toLowerCase());

                    const filteredChildren = node.children ? filterNodes(node.children) : undefined;

                    if (matchesCode || matchesName || (filteredChildren && filteredChildren.length > 0)) {
                        return { ...node, children: filteredChildren };
                    }
                    return null;
                })
                .filter(node => node !== null) as AccountingAccount[];
        };

        return filterNodes(accounts);
    }, [accounts, filters]);

    const accordionContent = useMemo(() =>
        renderAccordion(filteredAccounts, 0),
        [filteredAccounts, renderAccordion]
    );

    const getNextLevel = (currentLevel: AccountLevel): AccountLevel => {
        const levels: AccountLevel[] = ['clase', 'grupo', 'cuenta', 'subcuenta', 'auxiliar', 'subauxiliar'];
        const currentIndex = levels.indexOf(currentLevel);
        return levels[currentIndex + 1] || 'subauxiliar';
    };

    const handleCreateAccount = () => {
        if (!newAccount.codigo || !newAccount.nombre || !codeValidation.valid) return;
        console.log('Creando nueva cuenta:', newAccount);
        setShowNewAccountDialog(false);
    };

    const handleOpenNewAccountDialog = () => {
        if (selectedAccount) {
            const nextLevel = getNextLevel(selectedAccount.account_level);
            setNewAccount(prev => ({
                ...prev,
                tipo: nextLevel
            }));
        } else {
            setNewAccount(prev => ({
                ...prev,
                tipo: 'clase'
            }));
        }
        setShowNewAccountDialog(true);
    };

    // Renderizado condicional
    if (loading) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen">
                <div className="text-center p-5">
                    <i className="pi pi-spinner pi-spin text-2xl mr-2"></i>
                    <span>Cargando datos contables...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen">
                <Message
                    severity="error"
                    text={`Error al cargar las cuentas: ${error}`}
                    className="w-full md:w-6"
                />
            </div>
        );
    }

    return (
        <div className="accounting-container">
            <Tooltip target=".fiscal-icon" />
            <div className="container-fluid p-0">
                <div className="row g-0">
                    <div className="col-12">
                        <div className="card border-0">
                            <div className="card-body p-2">
                                <div className="row g-2">
                                    {/* Panel izquierdo - Estructura contable */}
                                    <div className="col-12 col-md-7">
                                        <Card className="h-100 border">
                                            <div className="d-flex flex-column h-100">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h4 className="m-0 fs-5 text-muted">Estructura Contable</h4>
                                                    <div className="d-flex gap-2 w-100 w-md-auto">
                                                        <span className="p-float-label flex-grow-1">
                                                            <InputText
                                                                id="searchCode"
                                                                value={filters.codigo.value}
                                                                onChange={(e) => setFilters({
                                                                    ...filters,
                                                                    codigo: { ...filters.codigo, value: e.target.value }
                                                                })}
                                                                className="w-100"
                                                            />
                                                            <label htmlFor="searchCode">Código</label>
                                                        </span>
                                                        <span className="p-float-label flex-grow-1">
                                                            <InputText
                                                                id="searchName"
                                                                value={filters.nombre.value}
                                                                onChange={(e) => setFilters({
                                                                    ...filters,
                                                                    nombre: { ...filters.nombre, value: e.target.value }
                                                                })}
                                                                className="w-100"
                                                            />
                                                            <label htmlFor="searchName">Nombre</label>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="account-accordion-container flex-grow-1">
                                                    <Accordion
                                                        multiple
                                                        activeIndex={activeAccordionKeys['root'] || []}
                                                        onTabChange={(e) => {
                                                            setActiveAccordionKeys(prev => ({
                                                                ...prev,
                                                                ['root']: e.index as number[]
                                                            }));
                                                        }}
                                                    >
                                                        {accordionContent}
                                                    </Accordion>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Panel derecho - Jerarquía de la cuenta */}
                                    <div className="col-12 col-md-5">
                                        <div className="d-flex flex-column h-100 gap-2">
                                            <Card className="flex-grow-1 border">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h4 className="m-0 fs-5 text-muted">Jerarquía de la Cuenta</h4>
                                                    <Button
                                                        label="Nueva Subcuenta"
                                                        icon="pi pi-plus"
                                                        className="p-button-sm p-button-outlined"
                                                        onClick={handleOpenNewAccountDialog}
                                                        disabled={!selectedAccount}
                                                        tooltip="Crear una nueva subcuenta bajo la seleccionada"
                                                        tooltipOptions={{ position: 'top' }}
                                                    />
                                                </div>

                                                <DataTable
                                                    value={tableData}
                                                    emptyMessage="Seleccione una cuenta del plan"
                                                    className="p-datatable-sm"
                                                    scrollable
                                                    scrollHeight="flex"
                                                    responsiveLayout="scroll"
                                                >
                                                    <Column
                                                        field="tipo"
                                                        header="Nivel"
                                                        style={{ width: '25%' }}
                                                        body={(rowData: TableRow) => (
                                                            <span className={`badge level-${rowData.tipo.toLowerCase()}`}>
                                                                {rowData.tipo}
                                                            </span>
                                                        )}
                                                    />
                                                    <Column field="codigo" header="Código" style={{ width: '25%' }} />
                                                    <Column field="nombre" header="Nombre" style={{ width: '50%' }} />
                                                </DataTable>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Diálogo para nueva cuenta */}
            <Dialog
                header="Crear Nueva Cuenta"
                visible={showNewAccountDialog}
                style={{ width: '90vw', maxWidth: '600px' }}
                onHide={() => setShowNewAccountDialog(false)}
                footer={
                    <div>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            onClick={() => setShowNewAccountDialog(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Crear"
                            icon="pi pi-check"
                            onClick={handleCreateAccount}
                            autoFocus
                            disabled={!newAccount.codigo || !newAccount.nombre || !codeValidation.valid}
                        />
                    </div>
                }
                breakpoints={{ '960px': '75vw', '640px': '90vw' }}
                modal
            >
                <div className="p-fluid grid formgrid">
                    <div className="field col-12">
                        <label htmlFor="accountType">Tipo de Cuenta</label>
                        <Dropdown
                            id="accountType"
                            value={newAccount.tipo}
                            options={accountLevels}
                            onChange={(e) => setNewAccount({ ...newAccount, tipo: e.value })}
                            optionLabel="label"
                            placeholder="Seleccione el tipo"
                            disabled={!!selectedAccount}
                            className="w-full"
                        />
                        {selectedAccount && (
                            <small className="block mt-1 text-500">
                                Creando una subcuenta de nivel {newAccount.tipo} para la cuenta {selectedAccount.account_name}
                            </small>
                        )}
                    </div>

                    <div className="field col-12">
                        <label htmlFor="accountCode">Código *</label>
                        <InputText
                            id="accountCode"
                            value={newAccount.codigo}
                            onChange={(e) => setNewAccount({ ...newAccount, codigo: e.target.value })}
                            required
                            className={classNames('w-full', { 'p-invalid': !codeValidation.valid && newAccount.codigo })}
                        />
                        {!codeValidation.valid && newAccount.codigo && (
                            <small className="p-error block mt-1">{codeValidation.message}</small>
                        )}
                        {selectedAccount && (
                            <small className="block mt-1 text-500">
                                Código padre: {selectedAccount.account_code}
                            </small>
                        )}
                    </div>

                    <div className="field col-12">
                        <label htmlFor="accountName">Nombre *</label>
                        <InputText
                            id="accountName"
                            value={newAccount.nombre}
                            onChange={(e) => setNewAccount({ ...newAccount, nombre: e.target.value })}
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="accountCategory">Categoría</label>
                        <Dropdown
                            id="accountCategory"
                            value={selectedCategoria}
                            options={categorias}
                            onChange={(e) => setSelectedCategoria(e.value)}
                            optionLabel="label"
                            placeholder="Seleccione categoría"
                            className="w-full"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="accountDetail">Detalle de saldos</label>
                        <Dropdown
                            id="accountDetail"
                            value={selectedDetalle}
                            options={detalleSaldos}
                            onChange={(e) => setSelectedDetalle(e.value)}
                            optionLabel="label"
                            placeholder="Seleccione opción"
                            className="w-full"
                        />
                    </div>

                    <div className="field-checkbox col-12 md:col-6">
                        <Checkbox
                            inputId="newFiscalDifference"
                            checked={newAccount.fiscalDifference}
                            onChange={(e) => setNewAccount({ ...newAccount, fiscalDifference: e.checked ?? false })}
                        />
                        <label htmlFor="newFiscalDifference" className="ml-2">Cuenta de diferencia fiscal</label>
                    </div>

                    <div className="field-checkbox col-12 md:col-6">
                        <Checkbox
                            inputId="newActive"
                            checked={newAccount.activa}
                            onChange={(e) => setNewAccount({ ...newAccount, activa: e.checked ?? false })}
                        />
                        <label htmlFor="newActive" className="ml-2">Cuenta activa</label>
                    </div>
                </div>
            </Dialog>

            <style>{`
                .accounting-container {
                    padding: 1rem;
                    min-height: calc(100vh - 2rem);
                }
                
                .card {
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                }
                
                .account-accordion-container {
                    overflow-y: auto;
                    max-height: 60vh;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                
                .accordion-header-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    transition: all 0.2s;
                    cursor: pointer;
                    border-radius: 6px;
                    margin: 2px 0;
                }
                
                .accordion-header-content:hover {
                    background-color: #f3f4f6;
                }
                
                .accordion-header-content.selected-account {
                    background-color: #e0e7ff;
                    font-weight: 600;
                }
                
                .account-code {
                    font-weight: 600;
                    color: #1f2937;
                    width: 80px;
                    font-family: monospace;
                }
                
                .account-name {
                    color: #374151;
                    flex-grow: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .accordion-arrow {
                    color: #6b7280;
                    transition: transform 0.2s;
                }
                
                .fiscal-icon {
                    color: #f59e0b;
                    margin-left: auto;
                    margin-right: 0.5rem;
                }
                
                .level-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .level-clase {
                    background-color: #dbeafe;
                    color: #1e40af;
                }
                
                .level-grupo {
                    background-color: #e0e7ff;
                    color: #1e3a8a;
                }
                
                .level-cuenta {
                    background-color: #e0f2fe;
                    color: #0369a1;
                }
                
                .level-subcuenta {
                    background-color: #ede9fe;
                    color: #5b21b6;
                }
                
                .level-auxiliar {
                    background-color: #fce7f3;
                    color: #9d174d;
                }
                
                .level-subauxiliar {
                    background-color: #ecfccb;
                    color: #365314;
                }
                
                @media (max-width: 768px) {
                    .accounting-container {
                        padding: 0.5rem;
                    }
                    
                    .account-accordion-container {
                        max-height: 40vh;
                    }
                    
                    .account-code {
                        width: 60px;
                    }
                }
            `}</style>
        </div >
    );
};