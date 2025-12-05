import { useEffect, useState } from "react";
import { useDataPagination } from "../../../hooks/useDataPagination";
import { assetsService } from "../../../../services/api";
import { Nullable } from "primereact/ts-helpers";
import { Asset } from "../interfaces/Models";

export const useAssetMaintenanceHistory = () => {
    const [dateRange, setDateRange] = useState<Nullable<(Date | null)[]>>([]);
    const [maintenanceType, setMaintenanceType] = useState<
        "preventive" | "corrective" | "predictive" | "calibration" | null
    >(null);

    const getFilters = () => {
        return {
            createdAt:
                dateRange
                    ?.map((date) => date?.toISOString().split("T")[0])
                    .join(",") || null,
            type: maintenanceType,
        };
    };

    const {
        data,
        loading,
        fetchData,
        refresh,
        handlePageChange,
        handleSearchChange,
        currentPage,
        first,
        perPage,
        search,
        totalRecords,
    } = useDataPagination<Asset>({
        fetchFunction: (filters: any) =>
            assetsService.getAssetsWithMaintenanceHistory(filters),
        getCustomFilters: () => getFilters(),
    });

    const refreshMaintenanceHistory = () => {
        refresh(getFilters());
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        refreshMaintenanceHistory,
        dateRange,
        maintenanceType,
        setDateRange,
        setMaintenanceType,
        handlePageChange,
        handleSearchChange,
        currentPage,
        first,
        perPage,
        search,
        totalRecords,
    };
};
