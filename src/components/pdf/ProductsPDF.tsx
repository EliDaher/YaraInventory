import { Text, View, StyleSheet } from "@react-pdf/renderer";

type ProductRow = {
  id?: string;
  code?: string;
  name?: string;
  quantity?: number;
  warehouse?: string;
  payPrice?: number;
  sellPrice?: number;
  category?: string;
  unit?: string;
};

export default function ProductsPdf({ products }: { products: ProductRow[] }) {
  const safeProducts = products || [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>غرانتكس</Text>
      <Text style={styles.title}>تقرير المنتجات</Text>

      <View style={styles.metaSection}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>:عدد المنتجات</Text>
          <Text style={[styles.metaValue, styles.ltr]}>
            {safeProducts.length}
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.row, styles.rowHeader]} wrap={false}>
          <Text style={[styles.cellHeader, styles.codeCell]}>الرمز</Text>
          <Text style={[styles.cellHeader, styles.nameCell]}>الاسم</Text>
          <Text style={[styles.cellHeader, styles.qtyCell]}>الكمية</Text>
          <Text style={[styles.cellHeader, styles.warehouseCell]}>المخزن</Text>
          <Text style={[styles.cellHeader, styles.buyCell]}>سعر الشراء</Text>
          <Text style={[styles.cellHeader, styles.sellCell]}>سعر المبيع</Text>
        </View>

        {safeProducts.map((product, index) => (
          <View key={product.id || index} style={styles.row} wrap={false}>
            <Text style={[styles.cell, styles.codeCell]}>
              {product.code || "-"}
            </Text>

            <Text style={[styles.cell, styles.nameCell]}>
              {product.name || "-"}
            </Text>

            <Text style={[styles.cell, styles.qtyCell, styles.ltr]}>
              {Number(product.quantity || 0)}
            </Text>

            <Text style={[styles.cell, styles.warehouseCell]}>
              {product.warehouse || "-"}
            </Text>

            <Text style={[styles.cell, styles.buyCell, styles.ltr]}>
              {Number(product.payPrice || 0).toFixed(2)}
            </Text>

            <Text style={[styles.cell, styles.sellCell, styles.ltr]}>
              {Number(product.sellPrice || 0).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>تم إنشاء هذا التقرير تلقائياً</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Amiri",
    fontSize: 10,
    padding: 0,
    backgroundColor: "#fff",
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },

  metaSection: {
    marginBottom: 12,
  },

  metaRow: {
    flexDirection: "row-reverse",
    marginBottom: 4,
  },

  metaLabel: {
    fontSize: 11,
    marginLeft: 4,
  },

  metaValue: {
    fontSize: 11,
  },

  table: {
    borderWidth: 1,
    borderColor: "#ddd",
  },

  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  rowHeader: {
    backgroundColor: "#f3f3f3",
    borderBottomWidth: 1.5,
    borderColor: "#ccc",
  },

  cell: {
    fontSize: 9,
    textAlign: "right",
    paddingHorizontal: 2,
  },

  cellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    paddingHorizontal: 2,
  },

  codeCell: {
    width: "12%",
  },

  nameCell: {
    width: "26%",
  },

  qtyCell: {
    width: "10%",
  },

  warehouseCell: {
    width: "20%",
  },

  buyCell: {
    width: "16%",
  },

  sellCell: {
    width: "16%",
  },

  ltr: {
    direction: "ltr",
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#666",
    marginTop: 18,
  },
});
