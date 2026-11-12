import { formatNumericField, formatNumber } from "@/lib/numbers";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { inventoryUser } from "../layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  hidden?: boolean;
  onlyAdmin?: boolean;
}

interface TableData {
  [key: string]: any;
}

export interface RemoteTableControls {
  search: string;
  sort: { key: string; direction: "asc" | "desc" } | null;
  page: number;
  pageSize: number;
  totalItems: number;
  busy: boolean;
  failed: boolean;
  onSearch: (value: string) => void;
  onSort: (key: string) => void;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
  onRetry: () => void;
}

interface DataTableProps {
  remote?: RemoteTableControls;
  title: string;
  description?: string;
  columns: TableColumn[];
  data: TableData[];
  searchable?: boolean;
  className?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  getRowClassName?: (row: TableData) => string;
  renderRowActions?: (row: TableData) => React.ReactNode;
  amountBold?: boolean;
  onRowClick?: any;
  selectedRows?: any[];
  titleButton?: React.ReactNode;
  isLoading?: boolean
}

export function DataTable({
  title,
  description,
  columns,
  data,
  searchable = true,
  className,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
  getRowClassName,
  renderRowActions,
  amountBold = false,
  onRowClick,
  titleButton,
  isLoading,
  remote,
}: DataTableProps) {
  const [localSearch, setSearchTerm] = useState("");
  const [localSort, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [localPage, setCurrentPage] = useState(1);
  const [localPageSize, setPageSize] = useState(defaultPageSize);

  const [inventoryUser, setInventoryUser] = useState<inventoryUser>();
  useEffect(() => {
    const temUser = JSON.parse(localStorage.getItem("InventoryUser") || "null");
    setInventoryUser(temUser);
  }, []);

  const searchTerm = remote?.search ?? localSearch;
  const sortConfig = remote ? remote.sort : localSort;
  const currentPage = remote?.page ?? localPage;
  const pageSize = remote?.pageSize ?? localPageSize;

  const filteredData = remote ? data : data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const sortedData = remote ? data : [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil((remote?.totalItems ?? sortedData.length) / pageSize);
  const paginatedData = remote ? data : sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSort = (key: string) => {
    if (remote) {
      remote.onSort(key);
      return;
    }
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderCellContent = (value: any, key: string) => {
    const displayed = formatNumericField(value, key);
    if (key === "status") {
      return (
        <Badge
          variant={
            value == "completed" || value == "تم التسديد"
              ? "default"
              : value == "جاري التسديد"
                ? "secondary"
                : "destructive"
          }
          className="capitalize text-center"
        >
          {value}
        </Badge>
      );
    }
    if (key === "email") {
      return <span className="text-muted-foreground">{displayed}</span>;
    }
    if (key === "createdAt" || key === "date" || key === "timestamp") {
      return (
        <span className="text-muted-foreground">
          {value instanceof Date
            ? value.toLocaleString("en-GB")
            : !isNaN(Date.parse(value))
              ? new Date(value).toLocaleString("en-GB")
              : value}
        </span>
      );
    }
    if (key === "amount" && amountBold) {
      return (
        <span className="text-primary font-extrabold text-xl">{displayed}</span>
      );
    }
    if (key === "quantity") {
      return (
        <span className="">
          {displayed}
        </span>
      );
    }
    if (key === "totalPrice") {
      return (
        <span className="">
          {displayed}
        </span>
      );
    }
    if (key === "balance") {
      if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return "—";
      const balance = Number(value);
      if (!Number.isFinite(balance)) return "—";
      if (balance === 0) return "0";

      return balance > 0 ? (
        <span className="text-green-700 font-bold text-lg">له {formatNumber(balance)}</span>
      ) : (
        <span className="text-destructive font-bold text-lg">
          عليه {formatNumber(-balance)}
        </span>
      );
    }
    return displayed;
  };

  const SKELETON_ROWS = Array.from({ length: pageSize });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && (
                <CardDescription className="mt-2">
                  {description}
                </CardDescription>
              )}
            </div>
            {titleButton && <>{titleButton}</>}
          </div>
          {searchable && (
            <div className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={remote ? "ابحث بالاسم أو الرقم..." : "Search..."}
                  value={searchTerm}
                  onChange={(e) => {
                    if (remote) remote.onSearch(e.target.value);
                    else {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }
                  }}
                  className="pl-8"
                />
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {remote?.busy && !isLoading && <p role="status">جارٍ تحديث النتائج…</p>}
        {remote?.failed && (
          <p role="alert">
            تعذّر تحميل الزبائن.{" "}
            <button type="button" className="underline" onClick={remote.onRetry}>
              إعادة المحاولة
            </button>
          </p>
        )}
        <div className="overflow-x-auto rounded-md border">
          <Table className="text-center">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    className={
                      column.hidden ||
                      (column.onlyAdmin && inventoryUser?.role !== "admin")
                        ? "hidden"
                        : "text-center"
                    }
                    key={column.key}
                  >
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(column.key)}
                        className={`h-auto p-0 font-medium`}
                      >
                        {column.label}
                        {sortConfig?.key === column.key && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
                {renderRowActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {isLoading ? (
                SKELETON_ROWS.map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={
                          column.hidden ||
                          (column.onlyAdmin && inventoryUser?.role !== "admin")
                            ? "hidden"
                            : ""
                        }
                      >
                        <Skeleton className="h-4 w-full rounded-md" />
                      </TableCell>
                    ))}
                    {renderRowActions && (
                      <TableCell>
                        <Skeleton className="h-4 w-16 rounded-md" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TableRow
                    onClick={() => { if (!remote?.busy && !remote?.failed) onRowClick?.(row); }}
                    key={remote ? row.id : index}
                    className={getRowClassName ? getRowClassName(row) : ""}
                  >
                    {columns.map((column) => (
                      <TableCell
                        className={
                          column.hidden ||
                          (column.onlyAdmin && inventoryUser?.role !== "admin")
                            ? "hidden"
                            : ""
                        }
                        key={column.key}
                      >
                        {renderCellContent(row[column.key], column.key)}
                      </TableCell>
                    ))}
                    {renderRowActions && (
                      <TableCell>{renderRowActions(row)}</TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (renderRowActions ? 1 : 0)}
                    className="text-center"
                  >
                    {remote ? (remote.failed ? "" : "لا توجد نتائج") : "No data found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">عدد الاسطر :</span>
            <select
              className="border rounded px-2 py-1 text-sm bg-background"
              value={pageSize}
              onChange={(e) => {
                if (remote) remote.onPageSize(Number(e.target.value));
                else {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }
              }}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => remote ? remote.onPage(currentPage - 1) : setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={remote?.busy || currentPage === 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {remote ? `صفحة ${currentPage} من ${totalPages || 1}` : `Page ${currentPage} of ${totalPages || 1}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                remote ? remote.onPage(currentPage + 1) : setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={remote?.busy || currentPage >= totalPages}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
