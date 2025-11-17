import { DataTable } from "@/components/dashboard/DataTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AddProductForm from "@/components/Products/AddProductForm";
import { Button } from "@/components/ui/button";
import getAllProducts from "@/services/products";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  // لفتح الفورم
  const [openForm, setOpenForm] = useState(false);

  // لتحديد الصف الذي سيتم تعديل بياناته في الفورم
  const [editRow, setEditRow] = useState<any | null>(null);

  // الصفوف المحددّة (تحديد متعدد)
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products-table"],
    queryFn: getAllProducts,
  });

  const ProductsColumns = [
    { key: "code", label: "الرمز", sortable: true },
    { key: "name", label: "الاسم", sortable: true },
    { key: "quantity", label: "الكمية", sortable: true },
    { key: "warehouse", label: "المخزن", sortable: true },
    { key: "sellPrice", label: "سعر المبيع", sortable: true },
    { key: "category", label: "الصنف", sortable: true },
    { key: "unit", label: "الواحدة", sortable: true },
  ];

  const isRowSelected = (row: any) => {
    return selectedRows.some((r) => JSON.stringify(r) === JSON.stringify(row));
  };

  const toggleRowSelection = (row: any) => {
    setSelectedRows((prev) => {
      const isSelected = isRowSelected(row);
      if (isSelected) {
        return prev.filter((r) => JSON.stringify(r) !== JSON.stringify(row));
      } else {
        return [...prev, row];
      }
    });
  };

  return (
    <DashboardLayout>
      <div>
        {/* ❗ نموذج واحد فقط في الصفحة */}
        <AddProductForm
          isOpen={openForm}
          setIsOpen={setOpenForm}
          row={editRow}
        />

        <DataTable
          title="قائمة المنتجات"
          titleButton={
            <Button
              onClick={() => {
                setEditRow(null); // ← فتح النموذج بدون بيانات
                setOpenForm(true);
              }}
            >
              إضافة منتج
            </Button>
          }
          columns={ProductsColumns}
          data={
            products
              ? Object.values(products || {}).flatMap((warehouse: any) =>
                  Object.values(warehouse),
                )
              : []
          }
          onRowClick={(row) => toggleRowSelection(row)}
          getRowClassName={(row) =>
            selectedRows?.some((r) => r === row)
              ? "bg-green-50 hover:bg-green-100"
              : ""
          }
          renderRowActions={(row) => (
            <div className="flex gap-1">
              {/* زر شراء المنتج */}
              <Button
                variant="default"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditRow(row); // تعبئة الحقول بهذه البيانات
                  setOpenForm(true); // فتح الفورم
                }}
              >
                شراء
              </Button>

              {/* زر التفاصيل */}
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/productDetails", {
                    state: row,
                  });
                }}
              >
                التفاصيل
              </Button>
            </div>
          )}
        />
      </div>
    </DashboardLayout>
  );
}
