import { useEffect, useState } from "react";
import { useDataPagination } from "../../../hooks/useDataPagination.js";
import { assetsService } from "../../../../services/api/index.js";
export const useAssetMaintenanceHistory = () => {
  const [dateRange, setDateRange] = useState([]);
  const [maintenanceType, setMaintenanceType] = useState(null);
  const getFilters = () => {
    return {
      createdAt: dateRange?.map(date => date?.toISOString().split("T")[0]).join(",") || null,
      type: maintenanceType
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
    totalRecords
  } = useDataPagination({
    fetchFunction: filters => assetsService.getAssetsWithMaintenanceHistory(filters),
    getCustomFilters: () => getFilters()
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
    totalRecords
  };
};