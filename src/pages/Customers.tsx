import { formatNumber } from "@/lib/numbers";
import { DataTable } from '@/components/dashboard/DataTable';
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useCustomerPage } from "@/hooks/useCustomerPage";
import { useState } from "react";
import AddCustomerForm from '@/components/Customers/AddCustomerForm'
import { StatsCard } from '@/components/dashboard/StatsCard';
import { HandCoins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Customer() {

    const navigate = useNavigate()
    const [addIsOpen, setAddIsOpen] = useState(false);

    const { data, isLoading, controls } = useCustomerPage();

    const supplierColumns = [
        { key: "id", label: "الرمز", sortable: true, hidden: true },
        { key: "name", label: "الاسم", sortable: true },
        { key: "number", label: "الرقم", sortable: true },
        { key: "balance", label: "الرصيد", sortable: true },
        { key: "purchasesCount", label: "عدد عمليات الشراء", sortable: true },
        { key: "updatedDate", label: "اخر عملية", sortable: true },
    ];

    return (
      <DashboardLayout>
        {/* البطاقات الإحصائية */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="ديون على الزبائن"
            value={data ? formatNumber(data.totalDebt) : "—"}
            loading={isLoading}
            icon={HandCoins}
          />
        </div>
        <DataTable
          title="الزبائن"
          titleButton={
            <AddCustomerForm
              isOpen={addIsOpen}
              setIsOpen={setAddIsOpen}
              className="w-full mb-2"
            />
          }
          columns={supplierColumns}
          data={data?.items ?? []}
          isLoading={isLoading}
          remote={controls}
          onRowClick={(row) => {
            navigate("/customerDetails", {
              state: { id: row.id },
            });
          }}
        />
      </DashboardLayout>
    );
}
