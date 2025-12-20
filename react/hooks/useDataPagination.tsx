import { useState, useEffect } from "react";

interface PaginationParams {
    per_page?: number;
    page?: number;
    search?: string;
    [key: string]: any;
}

interface PaginationResponse<T> {
    data: T[];
    total: number;
    [key: string]: any;
}

interface UsePaginationOptions<T, M> {
    fetchFunction: (params: PaginationParams) => Promise<PaginationResponse<T>>;
    defaultPerPage?: number;
    defaultPage?: number;
    mapper?: (item: T) => M;
    getCustomFilters?: () => Record<string, any>;
}

export const useDataPagination = <T, M = T>({
    fetchFunction,
    defaultPerPage = 10,
    defaultPage = 1,
    mapper,
    getCustomFilters,
}: UsePaginationOptions<T, M>) => {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(defaultPage);
    const [first, setFirst] = useState(0);
    const [perPage, setPerPage] = useState(defaultPerPage);
    const [search, setSearch] = useState<string | null>(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [data, setData] = useState<M[]>([]);
    const [customFilters, setCustomFilters] = useState<Record<string, any>>({});

    const fetchData = async (
        page = currentPage,
        _perPage = perPage,
        _search: string | null = search,
        filters: any = getCustomFilters?.()
    ) => {
        try {
            setLoading(true);

            const customFilters =
                typeof filters === "function" ? filters() : filters;

            console.log(customFilters);

            const response = await fetchFunction({
                per_page: _perPage,
                page: page,
                search: _search || "",
                ...customFilters,
            });

            const items = response.data || [];
            const transformedData = mapper
                ? items.map(mapper)
                : (items as unknown as M[]);

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

    const handlePageChange = (pageEvent: any) => {
        const calculatedPage = Math.floor(pageEvent.first / pageEvent.rows) + 1;
        setFirst(pageEvent.first);
        setPerPage(pageEvent.rows);
        setCurrentPage(calculatedPage);
        fetchData(calculatedPage, pageEvent.rows, search, customFilters);
    };

    const handleSearchChange = (_search: string) => {
        setSearch(_search);
        setCurrentPage(1);
        setFirst(0);
        fetchData(1, perPage, _search, customFilters);
    };

    const refresh = (filters?: any) => {
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
        setPerPage,
    };
};
