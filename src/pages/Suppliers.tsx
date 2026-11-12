import { formatNumber } from "@/lib/numbers";
import { DataTable } from '@/components/dashboard/DataTable';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import SupplierSelect from '@/components/Products/SupplierSelect';
import { Button } from '@/components/ui/button';
import PopupForm from '@/components/ui/custom/PopupForm';
import { useSupplierPage } from "@/hooks/useCustomerPage";
import { HandCoins } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Suppliers() {

    const navigate = useNavigate()
    const [openSupplier, setOpenSupplier] = useState(false);
    const [supplierId, setSupplierId] = useState<string | number | null>(null);


    const { data, isLoading, controls } = useSupplierPage();

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
                    title="ديون للموردين"
                    value={data ? formatNumber(data.totalDebt) : "—"}
                    icon={HandCoins}
                    loading={isLoading}
                />
            </div>
            <DataTable
                isLoading={isLoading}
                title='الموردين'
                titleButton={
                    <PopupForm
                        isOpen={openSupplier}
                        setIsOpen={setOpenSupplier}
                        title='اضافة مورد'
                        trigger={
                            <Button className='w-full'>
                                اضافة مورد
                            </Button>
                        }
                    >
                        <SupplierSelect
                            className='mt-6'
                            isOpen={openSupplier}
                            setIsOpen={setOpenSupplier}
                            supplierId={supplierId}
                            setSupplierId={setSupplierId}
                            withDataTable={true}
                        />
                    </PopupForm>
                }
                columns={supplierColumns}
                data={data?.items ?? []}
                remote={controls}
                onRowClick={(row) => {
                    navigate("/SupplierDetails", {
                        state: { id: row.id },
                    });
                }}

            />
        </DashboardLayout>
    )
}
