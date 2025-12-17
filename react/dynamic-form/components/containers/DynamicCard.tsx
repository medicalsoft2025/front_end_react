import React from "react";
import { Card } from "primereact/card";
import { DynamicFormContainerConfig } from "../../interfaces/models";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { UseFormReturn } from "react-hook-form";
import { FieldValues } from "react-hook-form";

interface DynamicCardProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    loading?: boolean;
    onSubmit?: () => void;
    actualFormGroup?: string;
}

export const DynamicCard = <T extends FieldValues>(
    props: DynamicCardProps<T>
) => {
    const { config, form, loading, onSubmit, actualFormGroup } = props;

    if (!config.containers || config.containers.length === 0) return null;

    return (
        <>
            <div className={config.styleClass}>
                <Card
                    header={
                        <>
                            <h5 className="px-3 pt-3">{config.name}</h5>
                        </>
                    }
                    pt={{
                        content: {
                            style: {
                                padding: "0",
                            },
                        },
                        body: {
                            style: {
                                padding: "0",
                            },
                        },
                    }}
                >
                    <div className={`p-3 ${config.contentStyleClass}`}>
                        {config.containers!.map((childConfig, index) => {
                            return (
                                <DynamicFormContainer
                                    key={
                                        childConfig.name || `container-${index}`
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
                    </div>
                </Card>
            </div>
        </>
    );
};
