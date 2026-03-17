import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../dashboard/DataTable";
import { Button } from "../ui/button";
import { Product } from "@/services/transaction";
import { ProductTableRow } from "@/pages/Products";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../pdf/PdfDocument";
import { FileText, Loader } from "lucide-react";
import ProductsPdf from "../pdf/ProductsPDF";

type productDataTableProp = {
  productsData: Product[] | ProductTableRow[];
  setEditRow: any;
  setOpenForm: any;
  setProductRow: any;
  setOpenTransfare: any;
  isLoading?: boolean;
};

const ProductsDataTable = ({
  productsData,
  setEditRow,
  setOpenForm,
  setOpenTransfare,
  setProductRow,
  isLoading,
}: productDataTableProp) => {
  const navigate = useNavigate();
  const [showPdfLink, setShowPdfLink] = useState(false);

  const ProductsColumns = useMemo(
    () => [
      { key: "id", label: "المعرف", sortable: true, hidden: true },
      { key: "code", label: "الرمز", sortable: true },
      { key: "name", label: "الاسم", sortable: true },
      { key: "quantity", label: "الكمية", sortable: true },
      { key: "warehouse", label: "المخزن", sortable: true },
      { key: "payPrice", label: "سعر الشراء", sortable: true, onlyAdmin: true },
      { key: "sellPrice", label: "سعر المبيع", sortable: true },
      { key: "category", label: "الصنف", sortable: true },
      { key: "unit", label: "الواحدة", sortable: true },
    ],
    [],
  );

  const pdfDocument = useMemo(() => {
    if (!showPdfLink) return null;

    return (
      <PdfDocument>
        <ProductsPdf products={productsData} />
      </PdfDocument>
    );
  }, [showPdfLink, productsData]);

  return (
    <DataTable
      isLoading={isLoading}
      title="قائمة المنتجات"
      titleButton={
        <div className="flex gap-2 items-center justify-center">
          <Button
            onClick={() => {
              setEditRow(null);
              setOpenForm(true);
            }}
          >
            إضافة منتج
          </Button>

          {!showPdfLink ? (
            <Button
              variant="ghost"
              className="border"
              onClick={() => setShowPdfLink(true)}
            >
              <FileText className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="ghost" className="border p-0">
              <PDFDownloadLink
                document={pdfDocument!}
                fileName="تقرير_المنتجات.pdf"
              >
                {({ loading }) =>
                  loading ? (
                    <div className="flex items-center justify-center px-3 py-2">
                      <Loader className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center px-3 py-2">
                      <FileText className="w-4 h-4" />
                    </div>
                  )
                }
              </PDFDownloadLink>
            </Button>
          )}
        </div>
      }
      columns={ProductsColumns}
      data={productsData}
      getRowClassName={(row) =>
        row.quantity === 0
          ? "bg-destructive/20 hover:bg-destructive/40"
          : row.quantity < 5
            ? "bg-yellow-500/20 hover:bg-yellow-500/40"
            : ""
      }
      renderRowActions={(row) => (
        <div className="flex gap-1">
          <Button
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              setEditRow(row);
              setOpenForm(true);
            }}
          >
            شراء
          </Button>

          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/productDetails", { state: row });
            }}
          >
            التفاصيل
          </Button>

          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              setProductRow(row);
              setOpenTransfare(true);
            }}
          >
            نقل
          </Button>
        </div>
      )}
    />
  );
};

export default ProductsDataTable;
