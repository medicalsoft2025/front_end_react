import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Button,
    InputText,
    Dropdown,
    Calendar,
    DataTable,
    Column,
    Toast,
    InputNumber,
    InputTextarea
} from "primereact";
import { classNames } from "primereact/utils";

// Definición de tipos
type AccountOption = {
    id: number;
    code: string;
    name: string;
};

type ThirdPartyOption = {
    id: number;
    name: string;
    identification: string;
};

type CostCenterOption = {
    id: number;
    code: string;
    name: string;
};

type ReceiptTypeOption = {
    id: number;
    code: string;
    name: string;
};

type Transaction = {
    id: string;
    account: AccountOption | null;
    thirdParty: string;
    detail: string;
    description: string;
    costCenter: CostCenterOption | null;
    debit: number | null;
    credit: number | null;
};

export const FormAccoutingVouchers: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const toast = useRef<Toast>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: generateId(),
            account: null,
            thirdParty: "",
            detail: "",
            description: "",
            costCenter: null,
            debit: null,
            credit: null,
        },
    ]);

    // Helper function to generate unique IDs
    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Opciones del formulario
    const receiptTypeOptions: ReceiptTypeOption[] = [
        { id: 1, code: "RC", name: "Recibo de Caja" },
        { id: 2, code: "CE", name: "Comprobante de Egreso" },
        { id: 3, code: "CI", name: "Comprobante de Ingreso" },
        { id: 4, code: "DC", name: "Diario Contable" },
    ];

    const accountOptions: AccountOption[] = [
        { id: 1, code: "1105", name: "Caja General" },
        { id: 2, code: "1110", name: "Bancos" },
        { id: 3, code: "1305", name: "Clientes Nacionales" },
        { id: 4, code: "2205", name: "Proveedores Nacionales" },
        { id: 5, code: "5105", name: "Ingresos por Ventas" },
        { id: 6, code: "5205", name: "Devoluciones en Ventas" },
    ];

    const costCenterOptions: CostCenterOption[] = [
        { id: 1, code: "ADM", name: "Administración" },
        { id: 2, code: "VNT", name: "Ventas" },
        { id: 3, code: "MKT", name: "Marketing" },
        { id: 4, code: "LOG", name: "Logística" },
        { id: 5, code: "TEC", name: "Tecnología" },
    ];

    // Funciones de cálculo
    const calculateTotalDebit = () => {
        return transactions.reduce((total, transaction) => total + (transaction.debit || 0), 0);
    };

    const calculateTotalCredit = () => {
        return transactions.reduce((total, transaction) => total + (transaction.credit || 0), 0);
    };

    const isBalanced = () => {
        return calculateTotalDebit() === calculateTotalCredit();
    };

    // Funciones para manejar transacciones
    const addTransaction = () => {
        setTransactions([
            ...transactions,
            {
                id: generateId(),
                account: null,
                thirdParty: "",
                detail: "",
                description: "",
                costCenter: null,
                debit: null,
                credit: null,
            },
        ]);
    };

    const removeTransaction = (id: string) => {
        if (transactions.length > 1) {
            setTransactions(transactions.filter(transaction => transaction.id !== id));
        } else {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe tener al menos una transacción',
                life: 3000
            });
        }
    };

    const handleTransactionChange = (id: string, field: keyof Transaction, value: any) => {
        setTransactions(transactions.map(transaction =>
            transaction.id === id ? { ...transaction, [field]: value } : transaction
        ));
    };

    // Función para guardar datos
    const save = (formData: any) => {
        if (!isBalanced()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'El comprobante no está balanceado (Débitos ≠ Créditos)',
                life: 5000
            });
            return;
        }

        const voucherData = {
            receiptType: formData.receiptType,
            invoiceNumber: formData.invoiceNumber,
            date: formData.date,
            observations: formData.observations,
            transactions: transactions.map(transaction => ({
                account: transaction.account,
                thirdParty: transaction.thirdParty,
                detail: transaction.detail,
                description: transaction.description,
                costCenter: transaction.costCenter,
                debit: transaction.debit || 0,
                credit: transaction.credit || 0,
            })),
            totalDebit: calculateTotalDebit(),
            totalCredit: calculateTotalCredit(),
            isBalanced: isBalanced(),
            currency: "DOP"
        };

        console.log("Datos del comprobante contable:", voucherData);

        toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Comprobante contable guardado correctamente',
            life: 3000
        });
    };

    const saveAndSend = (formData: any) => {
        save(formData);
        console.log("Enviando comprobante contable...");

        toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Comprobante contable guardado y enviado',
            life: 3000
        });
    };

    const cancel = () => {
        console.log("Cancelando creación de comprobante...");
    };

    // Columnas para la tabla de transacciones
    const transactionColumns = [
        {
            field: "account",
            header: "Cuenta",
            body: (rowData: Transaction) => (
                <Dropdown
                    value={rowData.account}
                    options={accountOptions}
                    optionLabel="name"
                    placeholder="Seleccione cuenta"
                    className="w-full"
                    onChange={(e) => handleTransactionChange(rowData.id, 'account', e.value)}
                    filter
                    filterBy="name,code"
                    showClear
                />
            ),
        },
        {
            field: "thirdParty",
            header: "Tercero",
            body: (rowData: Transaction) => (
                <InputText
                    value={rowData.thirdParty}
                    placeholder="Ingrese tercero"
                    className="w-full"
                    onChange={(e) => handleTransactionChange(rowData.id, 'thirdParty', e.target.value)}
                />
            ),
        },
        {
            field: "detail",
            header: "Detalle contable",
            body: (rowData: Transaction) => (
                <InputText
                    value={rowData.detail}
                    placeholder="Ingrese detalle"
                    className="w-full"
                    onChange={(e) => handleTransactionChange(rowData.id, 'detail', e.target.value)}
                />
            ),
        },
        {
            field: "description",
            header: "Descripción",
            body: (rowData: Transaction) => (
                <InputText
                    value={rowData.description}
                    placeholder="Ingrese descripción"
                    className="w-full"
                    onChange={(e) => handleTransactionChange(rowData.id, 'description', e.target.value)}
                />
            ),
        },
        {
            field: "costCenter",
            header: "Centro de costo",
            body: (rowData: Transaction) => (
                <Dropdown
                    value={rowData.costCenter}
                    options={costCenterOptions}
                    optionLabel="name"
                    placeholder="Seleccione centro"
                    className="w-full"
                    onChange={(e) => handleTransactionChange(rowData.id, 'costCenter', e.value)}
                    filter
                    filterBy="name,code"
                    showClear
                />
            ),
        },
        {
            field: "debit",
            header: "Débito",
            body: (rowData: Transaction) => (
                <InputNumber
                    value={rowData.debit}
                    placeholder="0.00"
                    className="w-full"
                    mode="currency"
                    currency="DOP"
                    locale="es-DO"
                    onValueChange={(e) => handleTransactionChange(rowData.id, 'debit', e.value)}
                />
            ),
        },
        {
            field: "credit",
            header: "Crédito",
            body: (rowData: Transaction) => (
                <InputNumber
                    value={rowData.credit}
                    placeholder="0.00"
                    className="w-full"
                    mode="currency"
                    currency="DOP"
                    locale="es-DO"
                    onValueChange={(e) => handleTransactionChange(rowData.id, 'credit', e.value)}
                />
            ),
        },
        {
            field: "actions",
            header: "Acciones",
            body: (rowData: Transaction) => (
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-text"
                    onClick={() => removeTransaction(rowData.id)}
                    disabled={transactions.length <= 1}
                    tooltip="Eliminar transacción"
                    tooltipOptions={{ position: 'top' }}
                />
            ),
        },
    ];

    return (
        <div className="container-fluid p-4">
            {/* Encabezado */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h1 className="h3 mb-0 text-primary">
                                <i className="pi pi-file-edit me-2"></i>
                                Crear nuevo comprobante contable
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <form onSubmit={handleSubmit(save)}>
                        {/* Sección de Información Básica */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light">
                                <h2 className="h5 mb-0">
                                    <i className="pi pi-info-circle me-2 text-primary"></i>
                                    Información básica
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Tipo de comprobante *</label>
                                            <Controller
                                                name="receiptType"
                                                control={control}
                                                rules={{ required: 'Campo obligatorio' }}
                                                render={({ field, fieldState }) => (
                                                    <>
                                                        <Dropdown
                                                            {...field}
                                                            options={receiptTypeOptions}
                                                            optionLabel="name"
                                                            placeholder="Seleccione tipo"
                                                            className={classNames("w-100", { 'p-invalid': fieldState.error })}
                                                            filter
                                                            filterBy="name,code"
                                                            showClear
                                                        />
                                                        {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Número de comprobante *</label>
                                            <Controller
                                                name="invoiceNumber"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputText
                                                        {...field}
                                                        placeholder="Generado automáticamente"
                                                        className="w-100"
                                                        readOnly
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Fecha *</label>
                                            <Controller
                                                name="date"
                                                control={control}
                                                rules={{ required: 'Campo obligatorio' }}
                                                render={({ field, fieldState }) => (
                                                    <>
                                                        <Calendar
                                                            {...field}
                                                            placeholder="Seleccione fecha"
                                                            className={classNames("w-100", { 'p-invalid': fieldState.error })}
                                                            showIcon
                                                            dateFormat="dd/mm/yy"
                                                        />
                                                        {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Transacciones */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <h2 className="h5 mb-0">
                                    <i className="pi pi-credit-card me-2 text-primary"></i>
                                    Transacciones contables
                                </h2>
                                <Button
                                    icon="pi pi-plus"
                                    label="Agregar transacción"
                                    className="btn btn-primary"
                                    onClick={addTransaction}
                                />
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <DataTable
                                        value={transactions}
                                        responsiveLayout="scroll"
                                        emptyMessage="No hay transacciones agregadas"
                                        className="p-datatable-sm"
                                        showGridlines
                                        stripedRows
                                    >
                                        {transactionColumns.map((col, i) => (
                                            <Column
                                                key={i}
                                                field={col.field}
                                                header={col.header}
                                                body={col.body}
                                                style={{ minWidth: '150px' }}
                                            />
                                        ))}
                                    </DataTable>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <div className="alert alert-info" style={{ background: "rgb(194 194 194 / 85%)", border: "none", color: "black" }}>
                                            <strong>Total débitos:</strong>
                                            <InputNumber
                                                value={calculateTotalDebit()}
                                                className="ms-2"
                                                mode="currency"
                                                currency="DOP"
                                                locale="es-DO"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="alert alert-info" style={{ background: "rgb(194 194 194 / 85%)", border: "none", color: "black" }}>
                                            <strong>Total créditos:</strong>
                                            <InputNumber
                                                value={calculateTotalCredit()}
                                                className="ms-2"
                                                mode="currency"
                                                currency="DOP"
                                                locale="es-DO"
                                                readOnly
                                            />
                                            {!isBalanced() && (
                                                <span className="text-danger ms-2">
                                                    <i className="pi pi-exclamation-triangle"></i> El comprobante no está balanceado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Observaciones */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light">
                                <h2 className="h5 mb-0">
                                    <i className="pi pi-comment me-2 text-primary"></i>
                                    Observaciones
                                </h2>
                            </div>
                            <div className="card-body">
                                <Controller
                                    name="observations"
                                    control={control}
                                    render={({ field }) => (
                                        <InputTextarea
                                            {...field}
                                            rows={5}
                                            className="w-100"
                                            placeholder="Ingrese observaciones relevantes"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="d-flex justify-content-end gap-3 mb-4">
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                className="p-button-secondary"
                                onClick={cancel}
                            />
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                className="btn-info"
                                type="submit"
                                disabled={!isBalanced()}
                            />
                            <Button
                                label="Guardar y Enviar"
                                icon="pi pi-send"
                                className="btn-info"
                                onClick={handleSubmit(saveAndSend)}
                                disabled={!isBalanced()}
                            />
                        </div>
                    </form>
                </div>
            </div>

            <Toast ref={toast} />
        </div>
    );
};