import { DataTable } from "@/components/dashboard/DataTable";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import getAllPayments, { createPayment } from "@/services/payments";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle, CalendarIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Payment } from "@/services/payments";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import PopupForm from "@/components/ui/custom/PopupForm";
import FormInput from "@/components/ui/custom/FormInput";
import AddBalanceForm from "@/components/FinancialStatement/AddBalanceForm";
import TakeBalanceForm from "@/components/FinancialStatement/TakeBalanceForm";

export default function FinancialStatement() {

  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [exchangeRate, setExchangeRate] = useState<number>(1);

  const [isOpenPay, setIsOpenPay] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ["payments-table"],
    queryFn: () => getAllPayments(),
  });

  // ---------------- فلاتر ----------------
  const [selectedType, setSelectedType] = useState<string>("all");

  // تصفية البيانات حسب الفلاتر
  const filteredPayments = useMemo(() => {
    let data = payments || [];

    if (selectedType !== "all") {
      data = data.filter((p) => p.type === selectedType);
    }

    if (dateRange?.from && dateRange?.to) {
      data = data.filter((p) => {
        if (!p.date) return false;
        const paymentDate = new Date(p.date);
        return paymentDate >= dateRange.from && paymentDate <= dateRange.to;
      });
    }

    return data;
  }, [payments, selectedType, dateRange]);

  // ---------------- الأعمدة ----------------
  const paymentsColumns = [
    { label: "المعرف", key: "id", hidden: true },
    { label: "النوع", key: "type", sortable: true },
    { label: "المبلغ", key: "amount", sortable: true },
    { label: "الوصف", key: "note", sortable: true },
    {
      label: "التاريخ",
      key: "date",
      sortable: true,
    },
  ];

  // ---------------- إحصائيات ----------------
  const returns = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return filteredPayments
      ?.filter((c) => c.type === "return")
      .reduce((sum, c) => sum + Number(c.amount), 0) || 0;
  }, [filteredPayments]);

  const todaystotals = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return payments
      ?.filter(
        (c) => new Date(c.date!).toISOString().split("T")[0] === today
      )
      .reduce<Record<string, number>>((acc, curr) => {
        const currency = curr.currency.toUpperCase();
      
        const value =
          currency === "USD" ? curr.amount : curr.amount_base;
      
        acc[currency] = (acc[currency] || 0) + value;
      
        return acc;
      }, {});
  }, [payments]);
  
  const totals = useMemo(() => {
    return payments?.reduce<Record<string, number>>((acc, curr) => {
      const currency = curr.currency.toUpperCase();
    
      const value =
        currency === "USD" ? curr.amount : curr.amount_base;
    
      acc[currency] = (acc[currency] || 0) + value;
    
      return acc;
    }, {});
  }, [payments]);

  const createPaymentMutate = useMutation({
    mutationFn: (dataToSend: Payment) => createPayment({newPayment: dataToSend}),
    onSuccess: () => {
      alert("تم اضافة الدفعة!");
      setIsOpen(false);
    },
    onError: (error) => {
      console.error(error);
      alert("حدث خطأ اثناء الاضفة");
    }
  });
  
  useEffect(() => {
    if (currency === "USD") {
      setExchangeRate(1);
    }
  }, [currency]);


  return (
    <DashboardLayout>
      <div dir="rtl" className="space-y-6">
        {/* البطاقات الإحصائية */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {
            todaystotals && Object.entries(todaystotals).map(([currency, total]) => (
              <StatsCard
                title="صندوق اليوم"
                value={total.toLocaleString('en-US') || 0}
                icon={Wallet}
                description={currency}
              />
            ))
          }
          
          {
            totals && Object.entries(totals).map(([currency, total]) => (
              <div>
                <StatsCard
                  title="الرصيد الحالي"
                  value={total.toLocaleString('en-US') || 0}
                  icon={TrendingUp}
                  description={currency}
                />
              </div>
            ))
          }
          <StatsCard
            title="إجمالي المرتجع"
            value={returns.toLocaleString('en-US')}
            icon={ArrowDownCircle}
          />
        </div>

        <Card>
          <CardHeader className="flex flex-col">
            <div>
              <h1 className="font-bold text-2xl mb-4">الحركة المالية</h1>
              <div className="flex gap-2">
                <AddBalanceForm isOpen={isOpen} setIsOpen={setIsOpen} />
                <TakeBalanceForm isOpen={isOpenPay} setIsOpen={setIsOpenPay} />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* الفلاتر */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                      <SelectValue placeholder="نوع العملية" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="income">إيراد</SelectItem>
                      <SelectItem value="expense">مصروف</SelectItem>
                  </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[260px] justify-start text-left font-normal"
                    >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                          {format(dateRange.from, "yyyy-MM-dd")} -{" "}
                          {format(dateRange.to, "yyyy-MM-dd")}
                        </>
                      ) : (
                          format(dateRange.from, "yyyy-MM-dd")
                      )
                  ) : (
                      <span>اختر المدة</span>
                  )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent>
              {/* الجدول */}
              <DataTable
                title=""
                columns={paymentsColumns}
                data={filteredPayments ? [...filteredPayments].reverse() : []}
              />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
