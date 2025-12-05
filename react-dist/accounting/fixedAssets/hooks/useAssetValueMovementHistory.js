import { useEffect, useState } from "react";
import { useDataPagination } from "../../../hooks/useDataPagination.js";
import { assetsService } from "../../../../services/api/index.js";
export const useAssetValueMovementHistory = () => {
  const [dateRange, setDateRange] = useState([]);
  const [type, setType] = useState(null);
  const getFilters = () => {
    return {
      createdAt: dateRange?.map(date => date?.toISOString().split("T")[0]).join(",") || null,
      type
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
    search
  } = useDataPagination({
    fetchFunction: filters => assetsService.getAssetsWithValueMovementHistory(filters),
    getCustomFilters: () => getFilters()
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
    refresh,
    dateRange,
    type,
    setDateRange,
    setType,
    handlePageChange,
    handleSearchChange,
    currentPage,
    first,
    perPage,
    search
  };
};