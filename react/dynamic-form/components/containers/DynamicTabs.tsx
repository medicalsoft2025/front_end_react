import React from "react";
import { TabPanel, TabView } from "primereact/tabview";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { DynamicFormContainerConfig } from "../../interfaces/models";
import { UseFormReturn } from "react-hook-form";
import { FieldValues } from "react-hook-form";

interface DynamicTabsProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    loading?: boolean;
    onSubmit?: () => void;
    actualFormGroup?: string;
    className?: string;
}

export const DynamicTabs = <T extends FieldValues>(
    props: DynamicTabsProps<T>
) => {
    const { config, form, loading, onSubmit, actualFormGroup } = props;

    const activeTab = config.defaultActiveChildren
        ? Number(config.defaultActiveChildren)
        : 0;

    return (
        <TabView activeIndex={activeTab} renderActiveOnly={false}>
            {config.containers?.map((tab, index) => (
                <TabPanel key={index} header={tab.name}>
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
                </TabPanel>
            ))}
        </TabView>
    );
};
