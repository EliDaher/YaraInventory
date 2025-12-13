import DetailsInputs from "@/components/Customers/DetailsInputs";
import { DataTable } from "@/components/dashboard/DataTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import PaymentTypeSelector from "@/components/sellProduct/PaymentTypeSelector";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import FormInput from "@/components/ui/custom/FormInput";
import PopupForm from "@/components/ui/custom/PopupForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSupplierById } from "@/services/supplier";
import {
  handleSupplierReturn,
  paySupplierDebt,
  returnData,
} from "@/services/transaction";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SupplierDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const supplierId = location.state; // يفترض أن يكون ID فقط

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTo, setIsOpenTo] = useState(false);
  const [returnAmount, setReturnAmount] = useState('');
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isDebt, setIsDebt] = useState<"cash" | "part" | "debt">("cash");
  const [partValue, setPartValue] = useState(0);
  const [reason, setReason] = useState("");
  const [currency, setCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [openRowId, setOpenRowId] = useState<string>(null);

  const queryClient = useQueryClient();
  const [supplier, setSupplier] = useState<any>({});

  // ✅ جلب بيانات المورد
  const { data, isLoading } = useQuery({
    queryKey: ["supplier-details", supplierId],
    queryFn: () => getSupplierById(supplierId),
    enabled: !!supplierId,
  });

  // ✅ تحديث الحالة عند وصول البيانات
  useEffect(() => {
    if (data) {
      setSupplier(data);
    }
  }, [data]);

  // 🔹 دفعات المورد
  const paySupplierDebtMutation = useMutation({
    mutationFn: (dataToSend: any) => paySupplierDebt(dataToSend as any),
    onSuccess: () => {
      alert("تم إضافة الدفعة بنجاح!");
      setAmount("");
      setNote("");
      setIsOpen(false);
      setIsOpenTo(false);
      queryClient.invalidateQueries({
        queryKey: ["supplier-details"],
      });
    },
    onError: (error) => {
      console.error(error);
      alert("حدث خطأ أثناء إضافة المنتج");
    },
  });

  // 🔹 إرجاع منتجات المورد
  const returnMutation = useMutation({
    mutationFn: (dataToSend: {
      productCode: string;
      supplierId: string;
      warehouse: string;
      qty: number;
      returnValue: number;
      referenceId: string;
      productId: string;
      returnType: "debt" | "cash" | "part";
      partValue: number;
      reason: string;
    }) => handleSupplierReturn(dataToSend),
    onSuccess: () => {
      alert("تم الارجاع بنجاح!");
      setReturnAmount('');
      setOpenRowId(null);
      queryClient.invalidateQueries({
        queryKey: ["supplier-details"],
      });
    },
    onError: (error) => {
      console.error(error);
      alert("حدث خطأ أثناء ارجاع المنتج");
    },
  });

  const paymentsColumns = [
    { label: "المعرف", key: "id", hidden: true },
    { label: "المبلغ", key: "amount" },
    { label: "الوصف", key: "note" },
    { label: "التاريخ", key: "date" },
  ];

  const purchasesColumns = [
    { label: "المعرف", key: "id", hidden: true },
    { label: "كود المادة", key: "code" },
    { label: "اسم المادة", key: "name" },
    { label: "الكمية", key: "quantity" },
    { label: "المستودع", key: "warehouse" },
    { label: "السعر النهائي", key: "totalPrice" },
    { label: "التاريخ", key: "date" },
  ];

  const handleReturn = async (e: React.FormEvent, row) => {
    e.preventDefault();
    try {
      const payload = {
        productCode: row.code,
        supplierId: supplierId.id,
        warehouse: row.warehouse,
        qty: -Number(returnAmount),
        returnType: isDebt,
        returnValue: Number(returnAmount) * row.payPrice,
        referenceId: row.id,
        productId: row.id,
        partValue: partValue,
        reason: reason,
      };
      returnMutation.mutate(payload);
    } catch (error: any) {
      console.error(
        "❌ خطأ أثناء الإرجاع:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">بيانات المورد</h1>
          <Button onClick={() => navigate(-1)} variant="outline">
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
                if (key === "payments" || key === "purchases" || key === "id")
                  return null;

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
              {/* دفعة من المورد */}
              <PopupForm
                title="دفعة من المورد"
                trigger={
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      setIsOpen(true);
                      e.stopPropagation();
                    }}
                    variant="accent"
                    size="sm"
                  >
                    دفعة من المورد
                  </Button>
                }
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              >
                <form
                  className="space-y-4 mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    paySupplierDebtMutation.mutate({
                      supplierId: supplierId,
                      amount:
                        currency == "USD"
                          ? amount
                          : Number((Number(amount) / exchangeRate).toFixed(1)),
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
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <FormInput
                    label="ملاحظات"
                    id="note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
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
                  <Button className="w-full" type="submit">
                    دفع للمورد
                  </Button>
                </form>
              </PopupForm>

              {/* دفع للمورد */}
              <PopupForm
                title="دفع للمورد"
                trigger={
                  <Button className="w-full" variant="destructive" size="sm">
                    دفع للمورد
                  </Button>
                }
                isOpen={isOpenTo}
                setIsOpen={setIsOpenTo}
              >
                <form
                  className="space-y-4 mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    paySupplierDebtMutation.mutate({
                      supplierId: supplierId,
                      amount:
                        currency == "USD"
                          ? -amount
                          : -Number((Number(amount) / exchangeRate).toFixed(1)),
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
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <FormInput
                    label="ملاحظات"
                    id="note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
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
                  <Button className="w-full" type="submit">
                    دفع للمورد
                  </Button>
                </form>
              </PopupForm>
            </div>
          </CardContent>
        </Card>

        {/* معاملات المورد */}
        <Card className="overflow-x-auto">
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : !data?.data?.payments?.length &&
            !data?.data?.purchases?.length ? (
            <p className="text-muted-foreground text-center">
              لا توجد معاملات حالياً.
            </p>
          ) : (
            <CardContent className="space-y-4 md:space-y-0 grid md:grid-cols-2 gap-4">
              <DataTable
                title="الدفعات"
                columns={paymentsColumns}
                data={data.data.payments}
                getRowClassName={(row) =>
                  row.type !== "income" ? "text-red-500" : "text-green-500"
                }
              />
              <DataTable
                title="عمليات الشراء"
                columns={purchasesColumns}
                data={data.data.purchases}
                renderRowActions={(row) => (
                  <PopupForm
                    title={`إرجاع منتج: ${row.code} - ${row.name || ""}`}
                    isOpen={openRowId === row.id.toString()}
                    setIsOpen={() => setOpenRowId(null)}
                    trigger={
                      <Button onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setOpenRowId(row.id.toString())
                          console.log("row id:", openRowId);
                        }}>
                        إرجاع
                      </Button>
                    }
                  >
                    <form
                      onSubmit={(e) => handleReturn(e, row)}
                      className="space-y-4"
                    >
                      <div>
                        <FormInput
                          label="الكمية"
                          id="return-quantity"
                          type="number"
                          value={returnAmount}
                          onChange={(e) =>
                            setReturnAmount(e.target.value)
                          }
                        />
                        <p className="text-sm text-gray-500">
                          الكمية الأصلية: {row.quantity}
                          <br />
                          سعر الواحدة: {row.payPrice}
                        </p>
                      </div>

                      <p className="font-semibold">
                        المبلغ الإجمالي: {row.payPrice * Number(returnAmount)}
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
                        onChange={(e) => setReason(e.target.value)}
                      />

                      <div className="flex justify-end mt-2">
                        <Button type="submit" className="w-full" disabled={returnMutation.isPending}>
                          {returnMutation.isPending ? "جاري التأكيد..." : "تأكيد الإرجاع"}
                        </Button>
                      </div>
                    </form>
                  </PopupForm>
                )}
              />
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
