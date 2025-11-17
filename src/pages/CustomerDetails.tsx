import DetailsInputs from "@/components/Customers/DetailsInputs";
import { DataTable } from "@/components/dashboard/DataTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import PaymentTypeSelector from "@/components/sellProduct/PaymentTypeSelector";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import FormInput from "@/components/ui/custom/FormInput";
import PopupForm from "@/components/ui/custom/PopupForm";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCustomerById } from "@/services/customer";
import { handleCustomerReturn, payCustomerDebt } from "@/services/transaction";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import { Select } from "@radix-ui/react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CustomerDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state;
  const [isOpenTo, setIsOpenTo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();
  const [isOpenReturn, setIsOpenReturn] = useState(false);
  const [returnAmounts, setReturnAmounts] = useState<{
    [productId: string]: number;
  }>({});
  const [isDebt, setIsDebt] = useState<"cash" | "part" | "debt">("cash");
  const [partValue, setPartValue] = useState(0);
  const [reason, setReason] = useState("");
  const [currency, setCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [showTip, setShowTip] = useState(false);


  const payCustomerDebtMutation = useMutation({
    mutationFn: (dataToSend: any) => payCustomerDebt(dataToSend as any),
    onSuccess: () => {
      alert("تم إضافة الدفعة بنجاح!");
      setAmount(0);
      setNote("");
      setCurrency("");
      setExchangeRate(1);
      setIsOpen(false);
      setIsOpenTo(false);
      queryClient.invalidateQueries({ queryKey: ["customer-details"] });
    },
    onError: (error) => {
      console.error(error);
      alert("حدث خطأ أثناء إضافة المنتج");
    },
  });

  const returnMutation = useMutation({
    mutationFn: (dataToSend: {
      productCode: string;
      customerId: string;
      warehouse: string;
      qty: number;
      returnValue: number;
      referenceId: string;
      returnType: "cash" | "debt" | "part";
      partValue: number;
      productId: string;
      reason: string;
    }) => handleCustomerReturn(dataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-details"] });
    },
    onError: (error) => {
      console.error(error);
      alert("حدث خطأ أثناء الإرجاع");
    },
  });

  const [customer, setCustomer] = useState<any>({});

  // ✅ جلب بيانات الزبون
  const { data, isLoading } = useQuery({
    queryKey: ["customer-details", customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId,
  });

  if (data && customer.id !== data.id) setCustomer(data);

  const paymentsColumns = [
    { label: "المعرف", key: "id", hidden: true },
    { label: "المبلغ", key: "amount" },
    { label: "الوصف", key: "note" },
    { label: "التاريخ", key: "date" },
  ];

  const purchasesColumns = [
    { label: "المعرف", key: "id", hidden: true },
    { label: "السعر النهائي", key: "totalPrice" },
    { label: "المنتجات", key: "productsString" },
    { label: "التاريخ", key: "date" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">بيانات الزبون</h1>
          <Button onClick={() => navigate("/customers")} variant="outline">
            <ArrowLeft className="ml-2 w-4 h-4" /> رجوع
          </Button>
        </div>

        {/* معلومات أساسية */}
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data &&
              Object.entries(data.data).map(([key, value]) => {
                if (["payments", "purchases", "id"].includes(key)) return null;
                return (
                  <p
                    key={key}
                    className="flex gap-2 relative group mb-4 items-end"
                  >
                    <label className="block font-bold w-36">{key}:</label>
                    {key.includes("date") &&
                    new Date(value as any).toString() !== "Invalid Date" ? (
                      <input
                        type="text"
                        value={new Date(value as any).toLocaleString("en-GB")}
                        readOnly
                        className="bg-transparent border-b-2 border-transparent focus:border-primary-500 outline-none transition-all w-full"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value as any}
                        readOnly
                        className="bg-transparent border-b-2 border-transparent focus:border-primary-500 outline-none transition-all w-full"
                      />
                    )}
                    <span className="absolute bottom-0 right-0 w-full h-[2px] bg-primary-500 scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-300"></span>
                  </p>
                );
              })}

            <div className="grid grid-cols-2 gap-4">
              <PopupForm
                title="اضافة دفعة"
                trigger={
                  <Button
                    onClick={(e) => {
                      setIsOpen(true);
                      e.stopPropagation();
                    }}
                    variant="accent"
                    size="sm"
                    className="w-full"
                  >
                    اضافة دفعة من الزبون
                  </Button>
                }
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              >
                <form
                  className="space-y-4 mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    payCustomerDebtMutation.mutate({
                      customerId: customerId.id,
                      amount:
                        currency == "USD"
                          ? amount
                          : Number((amount / exchangeRate).toFixed(1)),
                      note,
                      currency: currency,
                      exchangeRate: exchangeRate,
                      amount_base: amount,
                    });
                  }}
                >
                  <FormInput
                    label="قيمة الدفعة"
                    id="payment-amount"
                    type="number"
                    value={amount.toString()}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                  <FormInput
                    label="ملاحظات"
                    id="note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />

                  {!(isDebt == "debt") && (
                    <>
                      {" "}
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
                        onChange={(e) =>
                          setExchangeRate(Number(e.target.value))
                        }
                        disabled={currency === "USD"}
                      />
                    </>
                  )}

                  <Button className="w-full" type="submit">
                    اضافة دفعة
                  </Button>
                </form>
              </PopupForm>

              {/* إضافة دفعة */}
              <PopupForm
                title="دفع للزبون"
                trigger={
                  <Button
                    onClick={(e) => {
                      setIsOpenTo(true);
                      e.stopPropagation();
                    }}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    دفع للزبون
                  </Button>
                }
                isOpen={isOpenTo}
                setIsOpen={setIsOpenTo}
              >
                <form
                  className="space-y-4 mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    payCustomerDebtMutation.mutate({
                      customerId: customerId.id,
                      amount:
                        currency == "USD"
                          ? -amount
                          : -Number((amount / exchangeRate).toFixed(1)),
                      note,
                      currency: currency,
                      exchangeRate: exchangeRate,
                      amount_base: -amount,
                    });
                  }}
                >
                  <FormInput
                    label="قيمة الدفعة"
                    id="payment-amount"
                    type="number"
                    value={amount.toString()}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                  <FormInput
                    label="ملاحظات"
                    id="note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />

                  {!(isDebt == "debt") && (
                    <>
                      {" "}
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
                        onChange={(e) =>
                          setExchangeRate(Number(e.target.value))
                        }
                        disabled={currency === "USD"}
                      />
                    </>
                  )}

                  <Button className="w-full" type="submit">
                    اضافة دفعة
                  </Button>
                </form>
              </PopupForm>
            </div>
          </CardContent>
        </Card>

        {/* الدفعات و المشتريات */}
        <Card className="overflow-x-auto">
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : !data?.data ? (
            <p className="text-muted-foreground text-center">
              لا توجد معاملات حالياً.
            </p>
          ) : (
            <CardContent className="space-y-4 md:space-y-0 grid md:grid-cols-2 gap-4">
              <DataTable
                title="الدفعات"
                columns={paymentsColumns}
                data={data?.data.payments}
              />
              <DataTable
                title="عمليات الشراء"
                columns={purchasesColumns}
                data={
                  data
                    ? data.data.purchases.map((purchase) => ({
                        ...purchase,
                        productsString: purchase.products
                          .map((p) => p.name)
                          .join(", "),
                      }))
                    : []
                }
                renderRowActions={(row) => (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate(`/sellDetails`, { state: row.id });
                      }}
                    >
                      تفاصيل
                    </Button>
                    <PopupForm
                      title={`إرجاع منتجات الفاتورة`}
                      isOpen={isOpenReturn}
                      setIsOpen={setIsOpenReturn}
                      trigger={
                        <Button onClick={() => setIsOpenReturn(true)}>
                          إرجاع
                        </Button>
                      }
                    >
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const productsToReturn = row.products
                            .filter((p) => (returnAmounts[p.id] || 0) > 0)
                            .map((p) => ({
                              productId: p.id,
                              productCode: p.code,
                              customerId: row.customerId,
                              warehouse: p.warehouse,
                              qty: -returnAmounts[p.id],
                              returnValue: returnAmounts[p.id] * p.sellPrice,
                              referenceId: row.id,
                              partValue: partValue,
                              returnType: isDebt,
                              reason: reason,
                            }));

                          productsToReturn.forEach((prod) =>
                            returnMutation.mutate(prod),
                          );
                          alert("تم تسجيل الإرجاع بنجاح!");
                          setIsOpenReturn(false);
                          setReturnAmounts({});
                        }}
                      >
                        {row.products.map((product) => (
                          <div
                            key={product.id}
                            className="border p-2 rounded-md"
                          >
                            <p className="font-semibold">{product.name}</p>
                            <p>الكمية الأصلية: {product.qty}</p>
                            <p>سعر الوحدة: {product.sellPrice}</p>
                            <FormInput
                              id={`return-${product.id}`}
                              label="كمية الإرجاع"
                              type="number"
                              min={0}
                              max={product.qty}
                              value={(
                                returnAmounts[product.id] || 0
                              ).toString()}
                              onChange={(e) => {
                                let qty = Number(e.target.value);

                                // التأكد من عدم تجاوز الحد الأعلى والأدنى
                                if (qty > product.qty) qty = product.qty;
                                if (qty < 0) qty = 0;

                                setReturnAmounts((prev) => ({
                                  ...prev,
                                  [product.id]: qty,
                                }));
                              }}
                            />
                            <p>
                              المبلغ:{" "}
                              {(returnAmounts[product.id] || 0) *
                                product.sellPrice}
                            </p>
                          </div>
                        ))}
                        <p className="font-bold">
                          المجموع الكلي:{" "}
                          {row.products.reduce(
                            (sum, p) =>
                              sum + (returnAmounts[p.id] || 0) * p.sellPrice,
                            0,
                          )}
                        </p>

                        <PaymentTypeSelector
                          value={isDebt}
                          onChange={setIsDebt}
                          partValue={partValue}
                          onPartValueChange={(v) => setPartValue(v)}
                        />

                        <FormInput
                          id={`return-reason`}
                          label="ملاحظات"
                          type="text"
                          value={reason}
                          onChange={(e) => {
                            setReason(e.target.value);
                          }}
                        />
                        <Button type="submit" className="w-full">
                          تأكيد الإرجاع
                        </Button>
                      </form>
                    </PopupForm>
                  </div>
                )}
                onRowClick={(row) => {
                  console.log(row);
                }}
              />
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
