import React from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { useDynamicFormContainer } from "../../hooks/useDynamicFormContainer";
import { DynamicFormContainerConfig } from "../../interfaces/models";
import { DynamicField } from "../fields/DynamicField";
import { DynamicCard } from "./DynamicCard";
import { DynamicTabs } from "./DynamicTabs";
import { DynamicAccordion } from "./DynamicAccordion";
import { DynamicStepper } from "./DynamicStepper";
import { Divider } from "primereact/divider";

interface DynamicFormContainerProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    loading?: boolean;
    onSubmit?: () => void;
    parentPath?: string;
    className?: string;
}

export const DynamicFormContainer = <T extends FieldValues>({
    config,
    form,
    loading,
    onSubmit,
    parentPath = "",
    className = "",
}: DynamicFormContainerProps<T>) => {
    const {
        actualFormGroup,
        containerType,
        hasFields,
        hasContainers,
        shouldRenderFields,
        shouldRenderDivider,
    } = useDynamicFormContainer({
        config,
        form,
        parentPath,
    });

    const renderByType = () => {
        switch (containerType) {
            case "card":
                return (
                    <DynamicCard
                        config={config}
                        form={form}
                        actualFormGroup={actualFormGroup}
                    />
                );

            case "tabs":
                return (
                    <DynamicTabs
                        config={config}
                        form={form}
                        actualFormGroup={actualFormGroup}
                    />
                );

            case "accordion":
                return (
                    <DynamicAccordion
                        config={config}
                        form={form}
                        actualFormGroup={actualFormGroup}
                    />
                );

            case "stepper":
                return (
                    <DynamicStepper
                        config={config}
                        form={form}
                        loading={loading}
                        onSubmit={onSubmit}
                        actualFormGroup={actualFormGroup}
                    />
                );

            default:
                return (
                    <>
                        {shouldRenderFields && hasFields && (
                            <>
                                {config.fields!.map((field) => (
                                    <DynamicField
                                        key={field.name}
                                        field={field}
                                        form={
                                            form as UseFormReturn<FieldValues>
                                        }
                                        parentPath={actualFormGroup}
                                        className={field.styleClass}
                                    />
                                ))}
                            </>
                        )}
                        {hasContainers &&
                            config.containers!.map((childConfig, index) => {
                                return (
                                    <DynamicFormContainer
                                        key={
                                            childConfig.name ||
                                            `container-${index}`
                                        }
                                        config={childConfig}
                                        form={form}
                                        loading={loading}
                                        onSubmit={onSubmit}
                                        parentPath={actualFormGroup}
                                        className={childConfig.styleClass}
                                    />
                                );
                            })}
                    </>
                );
        }
    };

    return (
        <>
            {renderByType()}
            {shouldRenderDivider && <Divider className={className} />}
        </>
    );
};
