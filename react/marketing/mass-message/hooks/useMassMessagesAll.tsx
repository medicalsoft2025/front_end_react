import React, { useEffect, useState } from "react";
// import { comissionConfig } from "../../../services/api";
import { ErrorHandler } from "../../../../services/errorHandler";
import { massMessageMedicalService } from "../../../../services/api";

export const useMassMessagesAll = () => {
    const [massMessages, setMassMessages] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMassMessages = async () => {
        try {
            const data = await massMessageMedicalService.getAll();
            setMassMessages(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };
    return {
        massMessages,
        setMassMessages,
        fetchMassMessages,
        loading
    };
};
