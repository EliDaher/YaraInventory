import { Text, View, StyleSheet } from "@react-pdf/renderer";

export default function InvoicePdf({ sell }: { sell: any }) {
  const products = sell?.products || [];
  const discount = Number(sell?.discount || 0);
  const totalPrice = Number(sell?.totalPrice || 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>غرانتكس</Text>
      <Text style={styles.title}>فاتورة بيع</Text>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>:اسم الزبون</Text>
          <Text style={styles.value}>{sell?.customerName || "-"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>:التاريخ</Text>
          <Text style={[styles.value, styles.ltr]}>{sell?.date || "-"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>:العملة</Text>
          <Text style={[styles.value, styles.ltr]}>
            {sell?.currency || "-"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>:رقم الفاتورة</Text>
          <Text style={[styles.value, styles.ltr]}>{sell?.id || "-"}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.row, styles.rowHeader]}>
          <Text style={[styles.cellHeader, styles.productCell]}>المنتج</Text>
          <Text style={[styles.cellHeader, styles.qtyPriceCell]}>
            السعر × الكمية
          </Text>
          <Text style={[styles.cellHeader, styles.totalCell]}>الإجمالي</Text>
        </View>

        {products.map((p: any, i: number) => {
          const qty = Number(p?.qty || 0);
          const sellPrice = Number(p?.sellPrice || 0);
          const lineTotal = qty * sellPrice;

          return (
            <View key={i} style={styles.row}>
              <Text style={[styles.cell, styles.productCell]}>
                {p?.name || "-"}
              </Text>

              <View style={[styles.cellRow, styles.qtyPriceCell]}>
                <Text style={styles.ltr}>{sellPrice.toFixed(2)}</Text>
                <Text> × </Text>
                <Text style={styles.ltr}>{qty}</Text>
              </View>

              <Text style={[styles.cell, styles.totalCell]}>
                {lineTotal.toFixed(2)}
              </Text>
            </View>
          );
        })}
      </View>

      {discount > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>الحسم:</Text>
          <Text style={[styles.totalAmount, styles.ltr]}>
            {discount.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>المجموع:</Text>
        <Text style={[styles.totalAmount, styles.ltr]}>
          {totalPrice.toFixed(2)}
        </Text>
      </View>

      <Text style={styles.footer}>شكراً لتعاملكم معنا</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Amiri",
    fontSize: 12,
    padding: 20,
    backgroundColor: "#fff",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },

  section: {
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    marginBottom: 4,
  },

  label: {
    fontSize: 12,
    marginLeft: 4,
  },

  value: {
    fontSize: 12,
  },

  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  rowHeader: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },

  cell: {
    fontSize: 12,
    textAlign: "right",
  },

  cellHeader: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "right",
  },

  productCell: {
    width: "40%",
  },

  qtyPriceCell: {
    width: "30%",
  },

  totalCell: {
    width: "30%",
  },

  cellRow: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
  },

  totalContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 2,
    borderColor: "#ccc",
    paddingTop: 6,
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },

  totalAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#666",
    marginTop: 18,
  },

  ltr: {
    direction: "ltr",
  },
});
