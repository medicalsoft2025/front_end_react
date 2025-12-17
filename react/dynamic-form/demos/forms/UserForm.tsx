import React, { useState } from "react";
import { DynamicForm } from "../../components/DynamicForm";
import { demoData } from "../jsons/demoData";
import { historiaCardiologia } from "../../forms/clinical-records/historiaCardiologia";

export const UserForm = () => {
    const [loading, setLoading] = useState(false);

    const onSubmit = (data: any) => {
        console.log(data);
        setLoading(true);
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 2000);
        }).then(() => {
            setLoading(false);
        });
    };

    return (
        <DynamicForm
            onSubmit={onSubmit}
            config={historiaCardiologia}
            loading={loading}
            data={demoData}
        />
    );
};
