import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { TaxDTO } from "../interfaces/taxConfigDTO";
import { taxesService } from "../../../../services/api";

export const useTaxConfigById = () => {
    const [taxById, setTaxById] = useState<TaxDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTaxById = async (id: string) => {
        setLoading(true);
        try {
            const data = await taxesService.getTaxById(id);
            setTaxById(data);
            return data;
        } catch (err) {
            ErrorHandler.generic(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        taxById,
        setTaxById,
        fetchTaxById,
        loading
    };
};