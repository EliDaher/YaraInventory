import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import PdfDocument from "@/components/pdf/PdfDocument";
import SalesReportPDF from "@/components/pdf/SalesReportPDF";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSalesReport, SalesReport } from "@/services/reports";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Banknote,
  CalendarDays,
  Download,
  FileText,
  Receipt,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatNumber = (value: number | string | undefined) =>
  Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });

const formatStatus = (status: string) => {
  if (status === "cash") return "مدفوع";
  if (status === "part") return "جزئي";
  if (status === "debt") return "دين";
  return status || "-";
};

const buildInitialRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    from: formatDateInput(firstDay),
    to: formatDateInput(today),
  };
};

export default function Reports() {
  const initialRange = useMemo(() => buildInitialRange(), []);
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);
  const [submittedRange, setSubmittedRange] = useState(initialRange);

  const hasValidRange = Boolean(submittedRange.from && submittedRange.to);
  const isRangeOrderInvalid = Boolean(from && to && from > to);

  const {
    data: report,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<SalesReport>({
    queryKey: ["sales-report", submittedRange.from, submittedRange.to],
    queryFn: () => getSalesReport(submittedRange),
    enabled: hasValidRange,
  });

  const invoiceRows = useMemo(
    () =>
      (report?.invoices || []).map((invoice) => ({
        ...invoice,
        paymentStatusLabel: formatStatus(invoice.paymentStatus),
        productsSummary: `${formatNumber(invoice.totalQuantity)} / ${
          invoice.productsCount
        }`,
        totalBeforeDiscountText: formatNumber(invoice.totalBeforeDiscount),
        discountText: formatNumber(invoice.discount),
        totalPriceText: formatNumber(invoice.totalPrice),
        paidAmountText: formatNumber(invoice.paidAmount),
        remainingDebtText: formatNumber(invoice.remainingDebt),
      })),
    [report]
  );

  const columns = [
    { key: "id", label: "رقم الفاتورة", sortable: true },
    { key: "date", label: "التاريخ", sortable: true },
    { key: "customerName", label: "الزبون", sortable: true },
    { key: "paymentStatusLabel", label: "حالة الدفع", sortable: true },
    { key: "productsSummary", label: "الكمية / المنتجات", sortable: true },
    { key: "totalBeforeDiscountText", label: "قبل الحسم", sortable: true },
    { key: "discountText", label: "الحسم", sortable: true },
    { key: "totalPriceText", label: "الإجمالي", sortable: true },
    { key: "paidAmountText", label: "المدفوع", sortable: true },
    { key: "remainingDebtText", label: "المتبقي", sortable: true },
    { key: "currency", label: "العملة", sortable: true },
    { key: "executer", label: "المنفذ", sortable: true },
  ];

  const errorMessage =
    (error as any)?.response?.data?.error || "حدث خطأ أثناء تحميل التقرير";

  return (
    <DashboardLayout>
      <div dir="rtl" className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-2xl">تقارير المبيعات</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  تقرير واضح لفواتير البيع ضمن فترة محددة
                </p>
              </div>

              {report && report.invoices.length > 0 && (
                <Button className="p-0">
                  <PDFDownloadLink
                    document={
                      <PdfDocument>
                        <SalesReportPDF report={report} />
                      </PdfDocument>
                    }
                    fileName={`sales-report-${report.meta.from}-${report.meta.to}.pdf`}
                    className="flex h-full w-full items-center justify-center px-4 py-2"
                  >
                    {({ loading }) => (
                      <span className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        {loading ? "جاري إنشاء PDF..." : "تصدير PDF"}
                      </span>
                    )}
                  </PDFDownloadLink>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <form
              className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                if (isRangeOrderInvalid) return;
                setSubmittedRange({ from, to });
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="sales-report-from">من تاريخ</Label>
                <Input
                  id="sales-report-from"
                  type="date"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sales-report-to">إلى تاريخ</Label>
                <Input
                  id="sales-report-to"
                  type="date"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="self-end"
                disabled={!from || !to || isRangeOrderInvalid || isFetching}
              >
                <CalendarDays className="h-4 w-4" />
                عرض التقرير
              </Button>
            </form>

            {isRangeOrderInvalid && (
              <div className="mt-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                تاريخ البداية يجب أن يكون قبل تاريخ النهاية أو مساوياً له.
              </div>
            )}
          </CardContent>
        </Card>

        {isError && (
          <Card className="border-destructive/40">
            <CardContent className="flex items-center gap-2 pt-6 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>{errorMessage}</span>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="عدد الفواتير"
            value={formatNumber(report?.summary.invoicesCount)}
            icon={Receipt}
            loading={isLoading || isFetching}
          />
          <StatsCard
            title="إجمالي المبيعات"
            value={formatNumber(report?.summary.totalSales)}
            icon={FileText}
            loading={isLoading || isFetching}
          />
          <StatsCard
            title="إجمالي المدفوع"
            value={formatNumber(report?.summary.paidAmount)}
            icon={Banknote}
            loading={isLoading || isFetching}
          />
          <StatsCard
            title="الدين المتبقي"
            value={formatNumber(report?.summary.remainingDebt)}
            icon={WalletCards}
            loading={isLoading || isFetching}
          />
        </div>

        {report && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الإجماليات حسب العملة</CardTitle>
            </CardHeader>
            <CardContent>
              {report.totalsByCurrency.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {report.totalsByCurrency.map((currency) => (
                    <div
                      key={currency.currency}
                      className="rounded-md border p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          العملة
                        </span>
                        <span className="font-bold">{currency.currency}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <span className="text-muted-foreground">الفواتير</span>
                        <span>{formatNumber(currency.invoicesCount)}</span>
                        <span className="text-muted-foreground">المبيعات</span>
                        <span>{formatNumber(currency.totalSales)}</span>
                        <span className="text-muted-foreground">المدفوع</span>
                        <span>{formatNumber(currency.paidAmount)}</span>
                        <span className="text-muted-foreground">المتبقي</span>
                        <span>{formatNumber(currency.remainingDebt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  لا توجد مبيعات ضمن الفترة المحددة.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <DataTable
          title="فواتير المبيعات"
          description={
            report
              ? `الفترة من ${report.meta.from} إلى ${report.meta.to}`
              : "اختر الفترة لعرض الفواتير"
          }
          columns={columns}
          data={invoiceRows}
          isLoading={isLoading || isFetching}
          defaultPageSize={10}
          pageSizeOptions={[10, 20, 50]}
        />
      </div>
    </DashboardLayout>
  );
}
