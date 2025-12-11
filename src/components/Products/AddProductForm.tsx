import React, { useEffect, useState } from "react";
import PopupForm from "../ui/custom/PopupForm";
import { Button } from "../ui/button";
import FormInput from "../ui/custom/FormInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payNewProduct, Product, purchase } from "@/services/transaction";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import SupplierSelect from "./SupplierSelect";

export default function AddProductForm({
  isOpen,
  setIsOpen,
  row,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row?: any;
}) {
  const [openSupplier, setOpenSupplier] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [payPrice, setPayPrice] = useState("0");
  const [sellPrice, setSellPrice] = useState("0");
  const [quantity, setQuantity] = useState("0");
  const [unit, setUnit] = useState("");
  const [isDebt, setIsDebt] = useState("cash");
  const [partValue, setPartValue] = useState("0");
  const [supplierId, setSupplierId] = useState("");
  const [currency, setCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (row) {
      setName(row.name);
      setCode(row.code);
      setCategory(row.category);
      setWarehouse(row.warehouse);
      setPayPrice(row.payPrice);
      setSellPrice(row.sellPrice);
      setUnit(row.unit);
    }
  }, [row]);

  const payProductMutation = useMutation({
    mutationFn: (dataToSend: { newProduct: Product; newPurchase: purchase }) =>
      payNewProduct(
        dataToSend as { newProduct: Product; newPurchase: purchase },
      ),
    onSuccess: () => {
      alert("تم إضافة المنتج بنجاح!");

      setName("");
      setCode("");
      setCategory("");
      setWarehouse("");
      setPayPrice("0");
      setSellPrice("0");
      setUnit("");
      setQuantity("0");
      setIsDebt("cash");
      setSupplierId("");
      setIsOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["products-table"],
      });
    },
    onError: (error) => {
      console.error(error);
      alert("حدث خطأ أثناء إضافة المنتج");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !code ||
      !category ||
      !warehouse ||
      !payPrice ||
      !sellPrice ||
      !unit ||
      !quantity
    ) {
      alert("الرجاء التأكد من البيانات");
      return;
    }

    if (!supplierId) {
      alert("الرجاء اختيار المورد");
      return;
    }

    if (isDebt !== "debt" && !currency) {
      alert("الرجاء اختيار العملة");
      return;
    }

    if (isDebt === "part" && Number(partValue) <= 0) {
      alert("الرجاء ادخال قيمة الدفعة الجزئية");
      return;
    }

    if (isDebt !== "debt" && currency === "SYP" && exchangeRate <= 0) {
      alert("الرجاء ادخال سعر صرف صحيح");
      return;
    }

    if (
      isDebt === "part" &&
      Number(partValue) >= Number(quantity) * Number(payPrice)
    ) {
      alert(
        "قيمة الدفعة الجزئية لا يمكن ان تكون اكبر من او تساوي المبلغ الكلي",
      );
      return;
    }

    payProductMutation.mutate({
      newProduct: {
        name,
        code,
        category,
        warehouse,
        payPrice: Number(payPrice),
        sellPrice: Number(sellPrice),
        unit,
        quantity: Number(quantity),
      },
      newPurchase: {
        supplierId: supplierId,
        name,
        code,
        warehouse,
        quantity: Number(quantity),
        payPrice: Number(payPrice),
        currency: currency,
        exchangeRate: exchangeRate,
        amount_base: Number(payPrice) * exchangeRate,
        totalPrice: Number(quantity) * Number(payPrice),
        paymentStatus: "pending",
        remainingDebt:
          isDebt == "debt"
            ? Number(quantity) * Number(payPrice)
            : isDebt == "cash"
              ? 0
              : Number(quantity) * Number(payPrice) -
                (currency == "USD"
                  ? Number(payPrice)
                  : Number((Number(partValue) / exchangeRate).toFixed(1))),
      },
    } as {
      newProduct: Product;
      newPurchase: purchase;
    });

    setName("");
    setCode("");
    setCategory("");
    setWarehouse("");
    setPayPrice("0");
    setSellPrice("0");
    setUnit("");
    setQuantity("0");
    setIsDebt("cash");
    setSupplierId("");
    setCurrency("USD");
    setExchangeRate(1);

  };

  return (
    <div>
      <PopupForm
        title="شراء منتجات"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        trigger={<></>}
      >
        <form
          dir="rtl"
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-3"
        >
          <FormInput
            id="productName"
            label="اسم المنتج"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormInput
            id="RMZProduct"
            label="رمز المنتج"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <FormInput
            id="productCategory"
            label="الصنف"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <FormInput
            id="invId"
            label="المستودع"
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
          />
          <FormInput
            id="payPrice"
            label="سعر الشراء"
            value={payPrice}
            onChange={(e) => setPayPrice(e.target.value)}
          />
          <FormInput
            id="sellPrice"
            label="سعر المبيع"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
          />
          <FormInput
            id="quantity"
            label="الكمية"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <FormInput
            id="unit"
            label="الواحدة"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />

          <div className="col-span-2 grid grid-cols-3 gap-2">
            <Button
              onClick={() => {
                setIsDebt("cash");
              }}
              className="col-span-1"
              variant={isDebt === "cash" ? "default" : "outline"}
              type="button"
            >
              نقدا
            </Button>
            <Button
              onClick={() => {
                setIsDebt("part");
              }}
              className="col-span-1"
              variant={isDebt === "part" ? "default" : "outline"}
              type="button"
            >
              جزئي
            </Button>
            <Button
              onClick={() => {
                setIsDebt("debt");
              }}
              className="col-span-1"
              variant={isDebt === "debt" ? "default" : "outline"}
              type="button"
            >
              دين
            </Button>
          </div>
          {isDebt === "part" && (
            <FormInput
              id="partPayment"
              label="قيمة الدفعة"
              value={partValue}
              onChange={(e) => setPartValue(e.target.value)}
            />
          )}

          {!(isDebt == "debt") && (
            <>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full mt-6">
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
              <FormInput
                id="exchangeRate"
                label="سعر الصرف"
                value={currency == "USD" ? 1 : exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value))}
                disabled={currency === "USD"}
              />
            </>
          )}

          <SupplierSelect
            className="mt-6"
            isOpen={openSupplier}
            setIsOpen={setOpenSupplier}
            supplierId={supplierId}
            setSupplierId={setSupplierId}
            withDataTable={true}
          />
          <Button className="col-span-2" type="submit">
            اضافة
          </Button>
        </form>
      </PopupForm>
    </div>
  );
}
