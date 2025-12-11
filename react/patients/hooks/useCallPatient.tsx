import React, { useState } from "react";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from "../../../services/alertManagerImported";
import { patientService } from "../../../services/api";

export const useCallPatient = () => {
    const [loading, setLoading] = useState<boolean>(false);

    async function callPatient(patientId: string) {
        setLoading(true);
        try {
            const response = await patientService.callPatient(patientId);
            SwalManager.success({
                text: response.message,
            });
        } catch (error) {
            console.log(error);
            ErrorHandler.generic(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        callPatient,
    };
};
