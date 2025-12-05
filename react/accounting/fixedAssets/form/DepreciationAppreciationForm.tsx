import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "primereact/divider";
import {
    DepreciationAppreciationFormInputs,
    DepreciationAppreciationFormProps,
} from "../interfaces/DepreciationAppreciationFormType";

const typeOptions = [
    { label: "Depreciación", value: "depreciation" },
    { label: "Apreciación", value: "appreciation" },
];

const frequencyOptions = [
    { label: "Anual", value: "annual" },
    { label: "Semestral", value: "semiannual" },
    { label: "Trimestral", value: "quarterly" },
    { label: "Mensual", value: "monthly" },
];

const DepreciationAppreciationForm: React.FC<
    DepreciationAppreciationFormProps
> = ({
    formId,
    onSubmit,
    initialData,
    onCancel,
    loading = false,
    currentValue,
}) => {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<DepreciationAppreciationFormInputs>({
        defaultValues: initialData || {
            type: "depreciation",
            amount: 0,
            date: new Date(),
            percentage: 0,
        },
    });

    const type = watch("type");

    const onFormSubmit: SubmitHandler<DepreciationAppreciationFormInputs> = (
        data
    ) => onSubmit(data);

    const getFormErrorMessage = (
        name: keyof DepreciationAppreciationFormInputs
    ) => {
        return (
            errors[name] && (
                <small className="text-danger">{errors[name]?.message}</small>
            )
        );
    };

    useEffect(() => {
        reset(
            initialData || {
                type: "depreciation",
                amount: 0,
                date: new Date(),
                percentage: 0,
            }
        );
    }, [initialData, reset]);

    return (
        <form
            id={formId}
            onSubmit={handleSubmit(onFormSubmit)}
            className="p-fluid"
        >
            {/* Sección Tipo de Ajuste en dos columnas */}

            <div className="mb-4">
                <label htmlFor="type" className="form-label">
                    Tipo de ajuste *
                </label>
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: "El tipo de ajuste es requerido" }}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown
                                id="type"
                                options={typeOptions}
                                optionLabel="label"
                                placeholder="Seleccione tipo"
                                className={classNames("w-100", {
                                    "is-invalid": fieldState.error,
                                })}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                appendTo={"self"}
                            />
                            {getFormErrorMessage("type")}
                        </>
                    )}
                />
            </div>

            <Divider />

            {/* Sección Depreciación en dos columnas */}
            {type === "depreciation" && (
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="frequency" className="form-label">
                                Frecuencia de Depreciación *
                            </label>
                            <Controller
                                name="frequency"
                                control={control}
                                rules={{
                                    required: "La frecuencia es requerida",
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            id="frequency"
                                            options={frequencyOptions}
                                            optionLabel="label"
                                            placeholder="Seleccione frecuencia"
                                            className={classNames("w-100", {
                                                "is-invalid": fieldState.error,
                                            })}
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(e.value)
                                            }
                                            appendTo={"self"}
                                        />
                                        {getFormErrorMessage("frequency")}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="percentage" className="form-label">
                                Porcentaje de Depreciación *
                            </label>
                            <Controller
                                name="percentage"
                                control={control}
                                rules={{
                                    required: "El porcentaje es requerido",
                                    min: {
                                        value: 0.01,
                                        message: "Mínimo 0.01%",
                                    },
                                    max: { value: 100, message: "Máximo 100%" },
                                }}
                                render={({ field, fieldState }) => {
                                    return (
                                        <InputNumber
                                            id="percentage"
                                            value={field.value || 0}
                                            onValueChange={(e) =>
                                                field.onChange(e.value)
                                            }
                                            mode="decimal"
                                            min={0.01}
                                            max={100}
                                            minFractionDigits={2}
                                            maxFractionDigits={2}
                                            className={classNames("w-100", {
                                                "p-invalid": fieldState.error,
                                            })}
                                            placeholder="0.00"
                                            suffix="%"
                                        />
                                    );
                                }}
                            />
                            {getFormErrorMessage("percentage")}
                        </div>
                    </div>
                </div>
            )}

            {/* Sección Apreciación en dos columnas */}
            {type === "appreciation" && (
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="reasons" className="form-label">
                                Motivos de la Apreciación *
                            </label>
                            <Controller
                                name="reasons"
                                control={control}
                                rules={{
                                    required: "Los motivos son requeridos",
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputText
                                            id="reasons"
                                            className={classNames(
                                                "form-control",
                                                {
                                                    "is-invalid":
                                                        fieldState.error,
                                                }
                                            )}
                                            placeholder="Describa los motivos del incremento de valor"
                                            {...field}
                                        />
                                        {getFormErrorMessage("reasons")}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label">
                                Monto del Ajuste *
                            </label>
                            <Controller
                                name="amount"
                                control={control}
                                rules={{
                                    required: "El monto es requerido",
                                    min: {
                                        value: 0.01,
                                        message: "Mínimo RD$0.01",
                                    },
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputNumber
                                            id="amount"
                                            value={field.value}
                                            onValueChange={(e) =>
                                                field.onChange(e.value)
                                            }
                                            mode="currency"
                                            currency="DOP"
                                            locale="es-DO"
                                            min={0.01}
                                            className={classNames("w-100", {
                                                "p-invalid": fieldState.error,
                                            })}
                                        />
                                        {getFormErrorMessage("amount")}
                                    </>
                                )}
                            />
                            <small className="text-muted">
                                Valor actual:{" "}
                                {currentValue
                                    ? currentValue.toLocaleString("es-DO", {
                                          style: "currency",
                                          currency: "DOP",
                                      })
                                    : "RD$0.00"}
                            </small>
                        </div>
                    </div>
                </div>
            )}

            {/* Sección Fecha en dos columnas */}
            <div className="row g-3">
                {type === "depreciation" && (
                    <div className="col">
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
                                            onChange={(e) =>
                                                field.onChange(e.value)
                                            }
                                            dateFormat="dd/mm/yy"
                                            showIcon
                                            className={classNames("w-100", {
                                                "is-invalid": fieldState.error,
                                            })}
                                            appendTo={document.body}
                                        />
                                        {getFormErrorMessage("date")}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}
                <div className="col">
                    <div className="mb-4">
                        <label className="form-label">
                            Información del Activo
                        </label>
                        <div className="card border">
                            <div className="card-body p-3">
                                <div className="text-sm text-muted">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Valor actual:</span>
                                        <span className="fw-medium">
                                            {currentValue
                                                ? currentValue.toLocaleString(
                                                      "es-DO",
                                                      {
                                                          style: "currency",
                                                          currency: "DOP",
                                                      }
                                                  )
                                                : "RD$0.00"}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Tipo seleccionado:</span>
                                        <span className="fw-medium">
                                            {type === "depreciation"
                                                ? "Depreciación"
                                                : "Apreciación"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Divider />

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
                    style={{ minWidth: "120px" }}
                    type="submit"
                >
                    <i className="fas fa-check me-2"></i>
                    Guardar Ajuste
                </Button>
            </div>
        </form>
    );
};

export default DepreciationAppreciationForm;
