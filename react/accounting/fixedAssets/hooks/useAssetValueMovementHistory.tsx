import { useEffect, useState } from "react";
import { useDataPagination } from "../../../hooks/useDataPagination";
import { assetsService } from "../../../../services/api";
import { Nullable } from "primereact/ts-helpers";
import { Asset } from "../interfaces/Models";

export const useAssetValueMovementHistory = () => {
    const [dateRange, setDateRange] = useState<Nullable<(Date | null)[]>>([]);
    const [type, setType] = useState<"appreaciation" | "depreciation" | null>(
        null
    );

    const getFilters = () => {
        return {
            createdAt:
                dateRange
                    ?.map((date) => date?.toISOString().split("T")[0])
                    .join(",") || null,
            type,
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
            assetsService.getAssetsWithValueMovementHistory(filters),
        getCustomFilters: () => getFilters(),
    });

    const refreshValueMovements = () => {
        refresh(getFilters());
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        refreshValueMovements,
        dateRange,
        type,
        setDateRange,
        setType,
        handlePageChange,
        handleSearchChange,
        currentPage,
        first,
        perPage,
        search,
        totalRecords,
    };
};
