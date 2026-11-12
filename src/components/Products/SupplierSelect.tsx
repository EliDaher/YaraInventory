import { useSupplierPage } from "@/hooks/useCustomerPage";
import React from "react";
import PopupForm from "../ui/custom/PopupForm";
import { Button } from "../ui/button";
import FormInput from "../ui/custom/FormInput";
import { addSupplier, supplierQueryKey } from "@/services/supplier";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../dashboard/DataTable";
import { toast } from "sonner";

type SupplierSelectProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  supplierId: string | number | null;
  setSupplierId: any;
  className?: string;
  withDataTable?: boolean;
};

export default function SupplierSelect({
  isOpen,
  setIsOpen,
  supplierId,
  setSupplierId,
  className,
  withDataTable,
}: SupplierSelectProps) {
  const [supplierName, setSupplierName] = React.useState("");
  const [supplierNumber, setSupplierNumber] = React.useState("");
  const queryClient = useQueryClient();

  const addSupplierMutation = useMutation({
    mutationFn: (newSupplier: any) =>
      addSupplier({ ...newSupplier, balance: 0 }),
    onSuccess: () => {
      setSupplierName("");
      setSupplierNumber("");

      !withDataTable && setIsOpen(false);

      queryClient.invalidateQueries({
        queryKey: supplierQueryKey,
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("حدث خطأ أثناء إضافة المورد");
    },
  });

  const { data, isLoading, controls } = useSupplierPage(3, isOpen && Boolean(withDataTable));
  const [selectedName, setSelectedName] = React.useState("");

  const supplierColumns = [
    { key: "id", label: "الرمز", sortable: true, hidden: true },
    { key: "name", label: "الاسم", sortable: true },
    { key: "number", label: "الرقم", sortable: true },
  ];

  return (
    <PopupForm
      title="اختيار البائع"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={
        <Button
          type="button"
          variant="outline"
          className={`w-full ${className}`}
        >
          {supplierId && selectedName ? selectedName : "اختيار المورد"}
        </Button>
      }
    >
      {withDataTable && (
        <DataTable
          title=""
          pageSizeOptions={[3]}
          defaultPageSize={3}
          onRowClick={(row) => {
            setSupplierId(row.id);
            setSelectedName(row.name);
            setIsOpen(false);
          }}
          columns={supplierColumns}
          data={data?.items ?? []}
          isLoading={isLoading}
          remote={controls}
        />
      )}

      <FormInput
        id="supplier-name"
        label="اسم المورد"
        value={supplierName}
        onChange={(e) => setSupplierName(e.target.value)}
      />
      <FormInput
        type="number"
        id="supplier-number"
        label="رقم المورد"
        value={supplierNumber}
        onChange={(e) => setSupplierNumber(e.target.value)}
      />

      <Button
        type="button"
        onClick={() => {
          if (!supplierName || !supplierNumber) {
            toast.error("يرجى ملء جميع الحقول");
            return;
          } else {
            addSupplierMutation.mutate({
              name: supplierName,
              number: supplierNumber,
            });
          }
        }}
        className="w-full"
      >
        {addSupplierMutation.isPending ? "جاري الإضافة..." : "اضافة"}
      </Button>
    </PopupForm>
  );
}
