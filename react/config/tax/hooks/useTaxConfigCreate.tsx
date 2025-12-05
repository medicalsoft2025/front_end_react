import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported";
import { ErrorHandler } from "../../../../services/errorHandler";
import { taxesService } from "../../../../services/api";
import { CreateTaxDTO } from "../interfaces/taxConfigDTO";

export const useTaxConfigCreate = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const createTax = async (data: CreateTaxDTO) => {
        setLoading(true);
        try {
            const response = await taxesService.storeTax(data);
            SwalManager.success("Impuesto creado exitosamente");
            return response;
        } catch (error) {
            console.error("Error creating tax:", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al crear el impuesto");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createTax,
    };
};