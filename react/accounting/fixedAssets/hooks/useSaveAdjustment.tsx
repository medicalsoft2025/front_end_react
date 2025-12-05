import AppreciationService from "../../../../services/api/classes/appreciationService";
import DepreciationService from "../../../../services/api/classes/depreciationService";

export const useSaveAdjustment = () => {
    const saveAdjustment = async (data: any) => {
        try {
            if (data.type === "depreciation") {
                const depreciationService = new DepreciationService();
                await depreciationService.createDepreciation(data);
            } else {
                const appreciationService = new AppreciationService();
                await appreciationService.createAppreciation(data);
            }
        } catch (error) {
            console.error("Error al guardar ajuste:", error);
            throw error;
        }
    };
    return { saveAdjustment };
};
