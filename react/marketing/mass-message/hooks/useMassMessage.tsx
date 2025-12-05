import React, { useState } from "react";
import { massMessageMedicalService } from "../../../../services/api";
import { ErrorHandler } from "../../../../services/errorHandler";

export const useMassMessage = () => {
    const [massMessage, setMassMessage] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMassMessage = async (id: string) => {
        try {
            const data = await massMessageMedicalService.get(id);
            setMassMessage(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        massMessage,
        setMassMessage,
        fetchMassMessage,
        loading
    };
};
