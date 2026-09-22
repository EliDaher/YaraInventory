import apiClient from "@/lib/axios";

export type SalesReportInvoice = {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  paymentStatus: string;
  productsCount: number;
  totalQuantity: number;
  totalBeforeDiscount: number;
  discount: number;
  totalPrice: number;
  paidAmount: number;
  remainingDebt: number;
  currency: string;
  executer: string;
};

export type SalesReportCurrencyTotals = {
  currency: string;
  invoicesCount: number;
  totalBeforeDiscount: number;
  discount: number;
  totalSales: number;
  paidAmount: number;
  remainingDebt: number;
};

export type SalesReport = {
  meta: {
    from: string;
    to: string;
    timezone: string;
    generatedAt: string;
  };
  summary: {
    invoicesCount: number;
    totalSales: number;
    paidAmount: number;
    remainingDebt: number;
    discount: number;
  };
  statusBreakdown: {
    cash: number;
    part: number;
    debt: number;
    other: number;
  };
  totalsByCurrency: SalesReportCurrencyTotals[];
  invoices: SalesReportInvoice[];
};

export async function getSalesReport({
  from,
  to,
}: {
  from: string;
  to: string;
}): Promise<SalesReport> {
  const response = await apiClient.get("/api/reports/sales", {
    params: { from, to },
  });

  return response.data;
}
