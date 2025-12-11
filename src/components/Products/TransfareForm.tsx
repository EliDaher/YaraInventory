import { ProductTableRow } from "@/pages/Products";
import FormInput from "../ui/custom/FormInput";
import PopupForm from "../ui/custom/PopupForm";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useWarehouseContext } from "@/contexts/WarehouseContexts";
import PaymentTypeSelector from "../sellProduct/PaymentTypeSelector";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleWarehouseTransfare } from "@/services/transaction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { error } from "console";

interface TransferFormProps {
  row: ProductTableRow;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TransferForm({
  row,
  isOpen,
  setIsOpen,
}: TransferFormProps) {
  const { data: warehouses, isLoading } = useWarehouseContext();

  const [form, setForm] = useState({
    productId: row.id,
    code: row.code,
    name: row.name,
    warehouse: "",
    oldWarehouse: row.warehouse,
    category: row.category,
    unit: row.unit,
    quantity: 0,
    sellPrice: row.sellPrice,
    note: "",
    exchangeRate: 0,
    amount_base: 0,
    amount: 0,
    currency: "USD",
  });

  const [isDebt, setIsDebt] = useState<"cash" | "debt" | "part">("cash");
  const [partValue, setPartValue] = useState(0);

  const queryClient = useQueryClient();

  const warehouseTransfare = useMutation({
    mutationFn: (transferData: {
      productId: string;
      oldWarehouse: string;
      newWarehouse: string;
      exchangeRate: number;
      amount_base: number;
      amount: number;
      currency: string;
      quantity: number;
      note: string;
      newSellPrice?: number;
    }) => handleWarehouseTransfare(transferData),
    onSuccess: () => {
      setIsOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["products-table"],
      });

      queryClient.invalidateQueries({
        queryKey: ["warehouses-table"],
      });
    },
    onError: (error) => {
      console.error(error);
      alert("حدث خطأ أثناء إضافة الزبون");
    },
  });

  useEffect(() => {
    if (!row) return;

    setForm({
      productId: row.id,
      code: row.code,
      name: row.name,
      warehouse: "",
      oldWarehouse: row.warehouse,
      category: row.category,
      unit: row.unit,
      quantity: 0,
      sellPrice: row.sellPrice,
      note: "",
      exchangeRate: 0,
      amount_base: 0,
      amount: 0,
      currency: "USD",
    });
  }, [row]);

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSetMaxQuantity = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setForm((prev) => ({
      ...prev,
      quantity: row.quantity,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if(form.quantity <= 0 || form.quantity > row.quantity){
      alert("الرجاء ادخال كمية صحيحة للنقل");
      return;
    }
    if(form.warehouse === ""){
      alert("الرجاء اختيار المستودع المنقول إليه");
      return;
    }
    if(form.amount < 0){ 
      alert("الرجاء ادخال تكلفة نقل صحيحة");
      return;
    }
    if(form.currency === ""){
      alert("الرجاء اختيار العملة المدفوع بها");
      return;
    }
    if(form.sellPrice <= 0){
      alert("الرجاء ادخال سعر مبيع صحيح");
      return;
    }
    if(isDebt === "part" && partValue <= 0){
      alert("الرجاء ادخال قيمة الدفعة الجزئية");
      return;
    }
    if(isDebt === "part" && partValue >= form.amount){
      alert("قيمة الدفعة الجزئية لا يمكن ان تكون اكبر من او تساوي المبلغ الكلي");
      return;
    }

    try {
      warehouseTransfare.mutate({
        productId: form.productId,
        oldWarehouse: form.oldWarehouse,
        newWarehouse: form.warehouse,
        exchangeRate: form.exchangeRate,
        amount_base: form.amount,
        amount: form.amount,
        currency: form.currency,
        quantity: form.quantity,
        note: form.note,
        newSellPrice: form.sellPrice,
      });
    } catch (err) {
      alert("حدث خطأ أثناء نقل المنتج");
      console.error(err);
    }
  };

  return (
    <PopupForm
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={<></>}
      title="نقل منتج"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="اسم المنتج" disabled value={form?.name} />
          <FormInput label="صنف المنتج" disabled value={form?.category} />
          <FormInput label="الواحدة" disabled value={form?.unit} />
          <FormInput label="المستودع القديم" disabled value={row.warehouse} />
          <div className="flex">
            <FormInput
              type="number"
              id="prodQuantity"
              label="الكمية المراد نقلها"
              value={form.quantity}
              onChange={(e) => handleChange("quantity", Number(e.target.value))}
            />
            <Button
              type="button"
              className="mt-6 rounded-r-none"
              onClick={handleSetMaxQuantity}
            >
              {row.quantity}
            </Button>
          </div>
          <FormInput
            type="number"
            id="prodSellPrice"
            label="سعر المبيع"
            value={form.sellPrice}
            onChange={(e) => handleChange("sellPrice", Number(e.target.value))}
          />
          <FormInput
            disabled={isLoading}
            id="prodNewWarehouse"
            label="المستودع المنقول إليه"
            value={form.warehouse}
            options={warehouses?.map((name, i) => ({
              id: name,
              name,
            }))}
            onChange={(value) => {
              console.log(value);
              handleChange("warehouse", value as any);
            }}
          />
          {form.warehouse == "other" ? (
            <FormInput
              id="prodNewWarehouse"
              label="المستودع المنقول إليه"
              onBlur={(e) => {
                if (e.target.value === "") return;
                warehouses.push(e.target.value);
                handleChange("warehouse", "");
              }}
            />
          ) : (
            <></>
          )}
          <div
            className={`${form.warehouse == "other" ? "col-span-2" : "col-span-1"} grid grid-cols-3`}
          >
            <div className="col-span-2">
              <FormInput
                id="prodTransfareCost"
                label="تكلفة النقل"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
            </div>
            <Select
              value={form.currency}
              onValueChange={(value) => handleChange("currency", value)}
            >
              <SelectTrigger className="mt-6">
                <SelectValue placeholder="العملة المدفوع بها" />
              </SelectTrigger>
              <SelectContent>
                {["SYP", "USD"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <PaymentTypeSelector
              value={isDebt}
              onChange={setIsDebt}
              partValue={partValue}
              onPartValueChange={(v) => setPartValue(v)}
            />
          </div>

          <div className="col-span-2">
            <FormInput
              id="transferNote"
              label="ملاحظات النقل"
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="col-span-2"
            disabled={warehouseTransfare.isPending}
          >
            {warehouseTransfare.isPending ? 'جاري النقل...' : 'تأكيد'}
          </Button>
        </div>
      </form>
    </PopupForm>
  );
}
