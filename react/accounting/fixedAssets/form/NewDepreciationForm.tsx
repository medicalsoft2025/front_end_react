import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";

export interface DepreciationFormInputs {
    assetId: string;
    date: Date;
    changeType: "depreciation" | "appreciation";
    previousValue: number;
    newValue: number;
    notes?: string;
}

export interface NewDepreciationFormProps {
    formId: string;
    onSubmit: (data: DepreciationFormInputs) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    assetOptions: { label: string; value: string }[];
    changeTypeOptions: { label: string; value: string }[];
    records: any[];
    initialData?: DepreciationFormInputs;
}

const NewDepreciationForm: React.FC<NewDepreciationFormProps> = ({
    formId,
    onSubmit,
    onCancel,
    records,
    loading = false,
    initialData,
}) => {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<DepreciationFormInputs>({
        defaultValues: initialData || {
            assetId: "",
            date: new Date(),
            changeType: "depreciation",
            previousValue: 0,
            newValue: 0,
            notes: "",
        },
    });

    const assetId = watch("assetId");
    const changeType = watch("changeType");
    const previousValue = watch("previousValue");
    const newValue = watch("newValue");

    const onFormSubmit: SubmitHandler<DepreciationFormInputs> = (data) => onSubmit(data);

    const getFormErrorMessage = (name: keyof DepreciationFormInputs) => {
        return (
            errors[name] && <small className="text-danger">{errors[name]?.message}</small>
        );
    };

    const assetOptions = records.map((record) => ({
        label: `${record.assetName} (${record.internalCode})`,
        value: record.assetId,
        data: record,
    }));

    const selectedAsset = assetOptions.find(asset => asset.value === assetId)?.data;

    // Calcular variación automáticamente
    const changeAmount = newValue - previousValue;
    const changePercentage = previousValue > 0 ? (changeAmount / previousValue) * 100 : 0;

    useEffect(() => {
        reset(
            initialData || {
                assetId: "",
                date: new Date(),
                changeType: "depreciation",
                previousValue: 0,
                newValue: 0,
                notes: "",
            }
        );
    }, [initialData, reset]);

    // Cuando se selecciona un activo, cargar sus valores actuales
    useEffect(() => {
        if (selectedAsset) {
            setValue("previousValue", selectedAsset.newValue);
        }
    }, [selectedAsset, setValue]);

    return (
        <form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="p-fluid">
            {/* Sección Selección de Activo */}
            <div className="mb-4">
                <label htmlFor="assetId" className="form-label">
                    Activo Fijo *
                </label>
                <Controller
                    name="assetId"
                    control={control}
                    rules={{ required: "El activo es requerido" }}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown
                                id="assetId"
                                options={assetOptions}
                                optionLabel="label"
                                placeholder="Seleccione un activo"
                                className={classNames("w-100", {
                                    "is-invalid": fieldState.error,
                                })}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                appendTo={document.body}
                                disabled={loading}
                            />
                            {getFormErrorMessage("assetId")}
                        </>
                    )}
                />
            </div>

            <Divider />

            {/* Sección Tipo de Ajuste y Fecha */}
            <div className="row g-3">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="changeType" className="form-label">
                            Tipo de Ajuste *
                        </label>
                        <Controller
                            name="changeType"
                            control={control}
                            rules={{ required: "El tipo de ajuste es requerido" }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id="changeType"
                                        options={[
                                            { label: "Depreciación", value: "depreciation" },
                                            { label: "Apreciación", value: "appreciation" },
                                        ]}
                                        optionLabel="label"
                                        placeholder="Seleccione tipo"
                                        className={classNames("w-100", {
                                            "is-invalid": fieldState.error,
                                        })}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        appendTo={document.body}
                                        disabled={loading}
                                    />
                                    {getFormErrorMessage("changeType")}
                                </>
                            )}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">
                            Fecha del Ajuste *
                        </label>
                        <Controller
                            name="date"
                            control={control}
                            rules={{ required: "La fecha es requerida" }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Calendar
                                        id="date"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        dateFormat="dd/mm/yy"
                                        showIcon
                                        className={classNames("w-100", {
                                            "is-invalid": fieldState.error,
                                        })}
                                        appendTo={document.body}
                                        disabled={loading}
                                    />
                                    {getFormErrorMessage("date")}
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Sección Valores Monetarios */}
            <div className="row g-3">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="previousValue" className="form-label">
                            Valor Anterior *
                        </label>
                        <Controller
                            name="previousValue"
                            control={control}
                            rules={{
                                required: "El valor anterior es requerido",
                                min: { value: 0, message: "El valor no puede ser negativo" },
                            }}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputNumber
                                        id="previousValue"
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        mode="currency"
                                        currency="DOP"
                                        locale="es-DO"
                                        min={0}
                                        className={classNames("w-100", {
                                            "p-invalid": fieldState.error,
                                        })}
                                        disabled={loading}
                                    />
                                    {getFormErrorMessage("previousValue")}
                                </>
                            )}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="newValue" className="form-label">
                            Nuevo Valor *
                        </label>
                        <Controller
                            name="newValue"
                            control={control}
                            rules={{
                                required: "El nuevo valor es requerido",
                                min: { value: 0, message: "El valor no puede ser negativo" },
                                validate: (value) => {
                                    if (changeType === "depreciation" && value > previousValue) {
                                        return "En depreciación, el nuevo valor debe ser menor al valor anterior";
                                    }
                                    if (changeType === "appreciation" && value < previousValue) {
                                        return "En apreciación, el nuevo valor debe ser mayor al valor anterior";
                                    }
                                    return true;
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputNumber
                                        id="newValue"
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        mode="currency"
                                        currency="DOP"
                                        locale="es-DO"
                                        min={0}
                                        className={classNames("w-100", {
                                            "p-invalid": fieldState.error,
                                        })}
                                        disabled={loading}
                                    />
                                    {getFormErrorMessage("newValue")}
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>

            {(previousValue > 0 || newValue > 0) && (
                <div className="mb-4">
                    <label className="form-label fw-semibold">
                        Resumen del Ajuste
                    </label>
                    <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                            <div className="row g-2 g-md-3 align-items-center">
                                {/* Variación */}
                                <div className="col-12 col-sm-6 col-md-4">
                                    <div className="d-flex flex-column">
                                        <span className="text-muted small mb-1">Variación Monetaria</span>
                                        <span className={classNames("fw-bold fs-6", {
                                            "text-success": changeAmount > 0,
                                            "text-danger": changeAmount < 0,
                                            "text-muted": changeAmount === 0
                                        })}>
                                            {changeAmount >= 0 ? '+' : ''}{changeAmount.toLocaleString("es-DO", {
                                                style: "currency",
                                                currency: "DOP"
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Porcentaje */}
                                <div className="col-12 col-sm-6 col-md-4">
                                    <div className="d-flex flex-column">
                                        <span className="text-muted small mb-1">Porcentaje</span>
                                        <span className={classNames("fw-bold fs-6", {
                                            "text-success": changePercentage > 0,
                                            "text-danger": changePercentage < 0,
                                            "text-muted": changePercentage === 0
                                        })}>
                                            {changePercentage >= 0 ? '+' : ''}{changePercentage.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Tipo */}
                                <div className="col-12 col-sm-6 col-md-4">
                                    <div className="d-flex flex-column">
                                        <span className="text-muted small mb-1">Tipo de Movimiento</span>
                                        <span className={classNames("fw-bold fs-6", {
                                            "text-danger": changeType === "depreciation",
                                            "text-success": changeType === "appreciation"
                                        })}>
                                            {changeType === "depreciation" ? "📉 Depreciación" : "📈 Apreciación"}
                                        </span>
                                    </div>
                                </div>

                                {/* Información del Activo (si está seleccionado) */}
                                {selectedAsset && (
                                    <div className="col-12 mt-2 pt-2 border-top">
                                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                                            <span className="text-muted small">Activo seleccionado:</span>
                                            <span className="fw-medium text-dark mt-1 mt-sm-0">{selectedAsset.assetName}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Barra de progreso visual */}
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <small className="text-muted">Valor Anterior</small>
                                        <small className="text-muted">Valor Nuevo</small>
                                    </div>
                                    <div className="progress" style={{ height: "8px" }}>
                                        <div
                                            className={classNames("progress-bar", {
                                                "bg-success": changeAmount > 0,
                                                "bg-danger": changeAmount < 0,
                                                "bg-secondary": changeAmount === 0
                                            })}
                                            style={{
                                                width: `${Math.min(Math.abs(changePercentage), 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="d-flex justify-content-between mt-1">
                                        <small className="text-muted">
                                            {previousValue.toLocaleString("es-DO", {
                                                style: "currency",
                                                currency: "DOP"
                                            })}
                                        </small>
                                        <small className="text-muted">
                                            {newValue.toLocaleString("es-DO", {
                                                style: "currency",
                                                currency: "DOP"
                                            })}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sección Notas */}
            <div className="mb-4">
                <label htmlFor="notes" className="form-label">
                    Notas y Observaciones
                </label>
                <Controller
                    name="notes"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <InputTextarea
                                id="notes"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                rows={3}
                                className={classNames("w-100", {
                                    "is-invalid": fieldState.error,
                                })}
                                placeholder="Ingrese notas adicionales sobre el ajuste..."
                                disabled={loading}
                            />
                            {getFormErrorMessage("notes")}
                        </>
                    )}
                />
            </div>

            <Divider />

            {/* Botones de Acción */}
            <div className="d-flex justify-content-center gap-3">
                {onCancel && (
                    <Button
                        className="p-button-secondary d-flex justify-content-center align-items-center"
                        onClick={onCancel}
                        disabled={loading}
                        style={{ minWidth: "120px" }}
                        type="button"
                    >
                        <i className="fas fa-times me-2"></i>
                        Cancelar
                    </Button>
                )}
                <Button
                    className="p-button-primary d-flex justify-content-center align-items-center"
                    loading={loading}
                    disabled={loading}
                    style={{ minWidth: "140px" }}
                    type="submit"
                >
                    <i className="fas fa-check me-2"></i>
                    Guardar Ajuste
                </Button>
            </div>
        </form>
    );
};

export { NewDepreciationForm };