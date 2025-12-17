import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DynamicFormContainerConfig } from "../../interfaces/models";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { UseFormReturn } from "react-hook-form";
import { FieldValues } from "react-hook-form";

interface DynamicAccordionProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    loading?: boolean;
    onSubmit?: () => void;
    actualFormGroup?: string;
}

export const DynamicAccordion = <T extends FieldValues>(
    props: DynamicAccordionProps<T>
) => {
    const { config, form, loading, onSubmit, actualFormGroup } = props;

    const activeIndex = config.defaultActiveChildren
        ? Number(config.defaultActiveChildren)
        : 0;

    return (
        <Accordion activeIndex={activeIndex}>
            {config.containers?.map((tab, index) => (
                <AccordionTab key={index} header={tab.name}>
                    <div className={tab.contentStyleClass}>
                        <DynamicFormContainer
                            config={tab}
                            form={form}
                            loading={loading}
                            onSubmit={onSubmit}
                            parentPath={actualFormGroup}
                            className={tab.styleClass}
                        />
                    </div>
                </AccordionTab>
            ))}
        </Accordion>
    );
};
