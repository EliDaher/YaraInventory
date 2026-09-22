import { SalesReport } from "@/services/reports";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

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

export default function SalesReportPDF({ report }: { report: SalesReport }) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>غرانتكس</Text>
      <Text style={styles.title}>تقرير المبيعات</Text>
      <Text style={styles.period}>
        من {report.meta.from} إلى {report.meta.to}
      </Text>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>عدد الفواتير</Text>
          <Text style={styles.summaryValue}>
            {formatNumber(report.summary.invoicesCount)}
          </Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>إجمالي المبيعات</Text>
          <Text style={styles.summaryValue}>
            {formatNumber(report.summary.totalSales)}
          </Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>المدفوع</Text>
          <Text style={styles.summaryValue}>
            {formatNumber(report.summary.paidAmount)}
          </Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>المتبقي</Text>
          <Text style={styles.summaryValue}>
            {formatNumber(report.summary.remainingDebt)}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>الإجماليات حسب العملة</Text>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.headerCell, styles.smallCell]}>العملة</Text>
          <Text style={[styles.headerCell, styles.smallCell]}>الفواتير</Text>
          <Text style={styles.headerCell}>المبيعات</Text>
          <Text style={styles.headerCell}>المدفوع</Text>
          <Text style={styles.headerCell}>المتبقي</Text>
        </View>
        {report.totalsByCurrency.map((currency) => (
          <View key={currency.currency} style={styles.row}>
            <Text style={[styles.cell, styles.smallCell]}>
              {currency.currency}
            </Text>
            <Text style={[styles.cell, styles.smallCell]}>
              {formatNumber(currency.invoicesCount)}
            </Text>
            <Text style={styles.cell}>{formatNumber(currency.totalSales)}</Text>
            <Text style={styles.cell}>{formatNumber(currency.paidAmount)}</Text>
            <Text style={styles.cell}>{formatNumber(currency.remainingDebt)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>الفواتير</Text>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.headerCell, styles.customerCell]}>الزبون</Text>
          <Text style={styles.headerCell}>التاريخ</Text>
          <Text style={[styles.headerCell, styles.smallCell]}>الحالة</Text>
          <Text style={styles.headerCell}>الإجمالي</Text>
          <Text style={styles.headerCell}>المدفوع</Text>
          <Text style={styles.headerCell}>المتبقي</Text>
        </View>
        {report.invoices.map((invoice) => (
          <View key={invoice.id} style={styles.row}>
            <Text style={[styles.cell, styles.customerCell]}>
              {invoice.customerName || "-"}
            </Text>
            <Text style={styles.cell}>{invoice.date || "-"}</Text>
            <Text style={[styles.cell, styles.smallCell]}>
              {formatStatus(invoice.paymentStatus)}
            </Text>
            <Text style={styles.cell}>{formatNumber(invoice.totalPrice)}</Text>
            <Text style={styles.cell}>{formatNumber(invoice.paidAmount)}</Text>
            <Text style={styles.cell}>{formatNumber(invoice.remainingDebt)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        تم إنشاء التقرير في {new Date(report.meta.generatedAt).toLocaleString("en-GB")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Amiri",
    fontSize: 9,
    color: "#111827",
  },
  brand: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
  },
  period: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 12,
    color: "#4b5563",
  },
  summaryGrid: {
    flexDirection: "row-reverse",
    gap: 6,
    marginBottom: 14,
  },
  summaryBox: {
    flexGrow: 1,
    flexBasis: 0,
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 8,
    backgroundColor: "#f9fafb",
  },
  summaryLabel: {
    color: "#6b7280",
    fontSize: 8,
    marginBottom: 4,
    textAlign: "right",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 6,
    marginTop: 4,
    textAlign: "right",
    fontWeight: "bold",
  },
  table: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 22,
    alignItems: "center",
  },
  headerRow: {
    backgroundColor: "#eef2ff",
  },
  headerCell: {
    flexGrow: 1,
    flexBasis: 0,
    padding: 5,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "right",
  },
  cell: {
    flexGrow: 1,
    flexBasis: 0,
    padding: 5,
    fontSize: 8,
    textAlign: "right",
  },
  customerCell: {
    flexGrow: 1.4,
  },
  smallCell: {
    flexGrow: 0.6,
  },
  footer: {
    color: "#6b7280",
    fontSize: 8,
    textAlign: "center",
    marginTop: 6,
  },
});
