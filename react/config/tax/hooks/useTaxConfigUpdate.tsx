import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { taxesService } from "../../../../services/api";
import { SwalManager } from "../../../../services/alertManagerImported";
import { UpdateTaxDTO } from "../interfaces/taxConfigDTO";

export const useTaxConfigUpdate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTax = async (id: string | number, data: UpdateTaxDTO) => {
        setLoading(true);
        setError(null);
        try {
            const response = await taxesService.updateTax(id, data);
            SwalManager.success("Impuesto actualizado correctamente");
            return response;
        } catch (error) {
            console.error("Error updating tax:", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al eliminar el impuesto");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateTax,
        loading,
        error
    };
};