import React, { useRef } from "react";
import { FieldValues } from "react-hook-form";
import { DynamicFormContainerConfig } from "../../interfaces/models";
import { UseFormReturn } from "react-hook-form";
import { Stepper, StepperChangeEvent } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { useDynamicStepper } from "../../hooks/useDynamicStepper";

interface DynamicStepperProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    loading?: boolean;
    onSubmit?: () => void;
    actualFormGroup?: string;
}

export const DynamicStepper = <T extends FieldValues>(
    props: DynamicStepperProps<T>
) => {
    const { config, form, loading, onSubmit, actualFormGroup } = props;
    const { stepActiveIndex, setStepActiveIndex, validStep } =
        useDynamicStepper({
            config,
            form,
            parentPath: actualFormGroup,
        });

    const stepperRef = useRef<any>(null);

    const handleNext = () => {
        if (validStep()) {
            stepperRef.current?.nextCallback();
        }
    };

    const handlePrev = () => {
        stepperRef.current?.prevCallback();
    };

    const handleSubmit = () => {
        if (validStep() && onSubmit) {
            onSubmit();
        }
    };

    // Actualizar el índice activo cuando cambia el paso en el stepper
    const handleStepChange = (event: StepperChangeEvent) => {
        setStepActiveIndex(event.index);
    };

    return (
        <div className="card d-flex justify-content-center">
            <Stepper
                ref={stepperRef}
                linear={config.linear}
                activeStep={stepActiveIndex}
                onChangeStep={handleStepChange}
                style={{ flexBasis: "50rem" }}
            >
                {config.containers?.map((tab, index) => (
                    <StepperPanel
                        key={index}
                        header={tab.name || `Paso ${index + 1}`}
                    >
                        <div className="d-flex flex-column">
                            <DynamicFormContainer
                                config={tab}
                                form={form}
                                loading={loading}
                                onSubmit={onSubmit}
                                parentPath={actualFormGroup}
                                className={tab.styleClass}
                            />
                        </div>

                        <div className="d-flex pt-4 justify-content-between">
                            {index > 0 && (
                                <Button
                                    label="Anterior"
                                    severity="secondary"
                                    icon={
                                        <i className="fa fa-arrow-left me-2"></i>
                                    }
                                    onClick={handlePrev}
                                    type="button"
                                />
                            )}

                            {index < (config.containers?.length || 0) - 1 ? (
                                <Button
                                    label="Siguiente"
                                    icon={
                                        <i className="fa fa-arrow-right me-2"></i>
                                    }
                                    onClick={handleNext}
                                    type="button"
                                    disabled={config.linear && !validStep()}
                                    className={index === 0 ? "ml-auto" : ""}
                                />
                            ) : (
                                config.hasSubmitButton && (
                                    <Button
                                        label={
                                            config.submitButtonLabel || "Enviar"
                                        }
                                        icon={
                                            <i
                                                className={`${
                                                    config.submitButtonIcon ||
                                                    "fa fa-save"
                                                } me-2`}
                                            ></i>
                                        }
                                        loadingIcon={
                                            <i className="fa fa-spinner fa-spin"></i>
                                        }
                                        loading={loading}
                                        onClick={handleSubmit}
                                        type="button"
                                        disabled={config.linear && !validStep()}
                                        className={index === 0 ? "ml-auto" : ""}
                                    />
                                )
                            )}
                        </div>
                    </StepperPanel>
                ))}
            </Stepper>
        </div>
    );
};
