import { useState } from 'react';
import { moduleService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";

export const useModuleDelete = () => {
    const [loading, setLoading] = useState(false);

    const deleteModule = async (id: string) => {
        console.log("Inicio del hook")
        try {
            console.log("Inicio de ejecutarse")
            setLoading(true);
            await moduleService.delete(id);
            console.log("Luego de ejecutarse")
        } catch (err) {
            ErrorHandler.generic(err)
            return false
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteModule,
        loading
    };
};

