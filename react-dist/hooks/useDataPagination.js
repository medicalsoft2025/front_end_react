import { useState, useEffect } from "react";
export const useDataPagination = ({
  fetchFunction,
  defaultPerPage = 10,
  defaultPage = 1,
  mapper,
  getCustomFilters
}) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [search, setSearch] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([]);
  const [customFilters, setCustomFilters] = useState({});
  const fetchData = async (page = currentPage, _perPage = perPage, _search = search, filters = getCustomFilters?.()) => {
    try {
      setLoading(true);
      const customFilters = typeof filters === "function" ? filters() : filters;
      const response = await fetchFunction({
        per_page: _perPage,
        page: page,
        search: _search || "",
        ...customFilters
      });
      const items = response.data || [];
      const transformedData = mapper ? items.map(mapper) : items;
      setData(transformedData);
      setTotalRecords(response.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = pageEvent => {
    const calculatedPage = Math.floor(pageEvent.first / pageEvent.rows) + 1;
    setFirst(pageEvent.first);
    setPerPage(pageEvent.rows);
    setCurrentPage(calculatedPage);
    fetchData(calculatedPage, pageEvent.rows, search, customFilters);
  };
  const handleSearchChange = _search => {
    setSearch(_search);
    setCurrentPage(1);
    setFirst(0);
    fetchData(1, perPage, _search, customFilters);
  };
  const refresh = filters => {
    if (filters) {
      setCustomFilters(filters);
    }
    fetchData(currentPage, perPage, search, filters || customFilters);
  };
  useEffect(() => {
    fetchData(defaultPage, defaultPerPage, search, getCustomFilters?.());
  }, []);
  return {
    data,
    loading,
    currentPage,
    first,
    perPage,
    totalRecords,
    search,
    fetchData,
    handlePageChange,
    handleSearchChange,
    refresh,
    setSearch,
    setCurrentPage,
    setPerPage
  };
};