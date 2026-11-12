import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { customerPageQuery, defaultCustomerPage } from "@/services/customer";
import { supplierPageQuery } from "@/services/supplier";
import type { RemoteTableControls } from "@/components/dashboard/DataTable";

function useDirectoryPage(pageQuery: typeof customerPageQuery | typeof supplierPageQuery, pageSize: number, enabled: boolean) {
  const [params, setParams] = useState({ ...defaultCustomerPage, pageSize });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const value = search.trim();
    if (value === (params.search ?? "")) return;
    const timer = window.setTimeout(() => {
      setParams(previous => ({ ...previous, search: value || undefined, page: 1 }));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, params.search]);

  const query = useQuery({
    ...pageQuery(params),
    enabled,
    placeholderData: keepPreviousData,
    retry: false,
  });
  const sort = params.sortBy && params.sortDirection
    ? { key: params.sortBy, direction: params.sortDirection }
    : null;
  const controls: RemoteTableControls = {
    search,
    sort,
    page: query.data?.page ?? params.page,
    pageSize: params.pageSize,
    totalItems: query.data?.totalItems ?? 0,
    busy: query.isFetching || search.trim() !== (params.search ?? ""),
    failed: query.isError,
    onSearch: setSearch,
    onSort: key => setParams(previous => ({
      ...previous,
      page: 1,
      sortBy: key,
      sortDirection: previous.sortBy === key && previous.sortDirection === "asc" ? "desc" : "asc",
    })),
    onPage: page => setParams(previous => ({ ...previous, page })),
    onPageSize: pageSize => setParams(previous => ({ ...previous, pageSize, page: 1 })),
    onRetry: () => void query.refetch(),
  };

  return { ...query, controls };
}

export function useCustomerPage() {
  return useDirectoryPage(customerPageQuery, 10, true);
}

export function useSupplierPage(pageSize = 10, enabled = true) {
  return useDirectoryPage(supplierPageQuery, pageSize, enabled);
}
