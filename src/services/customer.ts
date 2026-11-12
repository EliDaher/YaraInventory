import { Customer } from "@/components/Customers/DetailsInputs";
import apiClient from "@/lib/axios";

export interface CustomerSummary {
  id: string;
  name: string;
  number?: string;
  balance: number;
  updatedDate: string;
  purchasesCount: number;
}

export const customerSummaryKey = ["customers-summary"] as const;

export async function getCustomerSummary(): Promise<CustomerSummary[]> {

    try {
        const response = await apiClient.get<CustomerSummary[]>("/api/customers/summary");
        return response.data
      
    } catch (err) {
      console.error("خطأ :", err);
      throw new Error("خطأ أثناء جلب العملاء");
   
    }

}
export interface CustomerPageParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface CustomerPage {
  items: CustomerSummary[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalDebt: number;
  totalBalance: number;
}

export const defaultCustomerPage: CustomerPageParams = { page: 1, pageSize: 10 };

export function customerPageQuery(params: CustomerPageParams) {
  return {
    queryKey: [...customerSummaryKey, params] as const,
    queryFn: async ({ signal }: { signal: AbortSignal }) =>
      (await apiClient.get<CustomerPage>("/api/customers/page", { params, signal })).data,
  };
}

export async function addCustomer({
  name,
  number,

}) {
  try {
    const response = await apiClient.post("/api/customers",{
      name,
      number
    });
    return response.data
    
  } catch (err) {
    console.error("خطأ في تسجيل الدخول:", err);
    throw new Error("خطأ أثناء إضافة عميل جديد");
  }
}

export async function getCustomerById({ id }: { id: string }) {
  try {
    const response = await apiClient.post("/api/customers/byId", { id });
    return response.data;
  } catch (err) {
    console.error("خطأ في جلب المورد:", err);
    throw new Error("خطأ أثناء جلب العميل بواسطة المعرف");
  }
}


export async function updateCustomer(id: string, data: Partial<Customer>) {
  try {
    const response = await apiClient.put(`/api/customers/${id}`, {name: data.name, number: data.number});
    return response.data;
  } catch (err) {
    console.error("خطأ في تحديث العميل:", err);
    throw new Error("خطأ أثناء تحديث بيانات العميل");
  }
}

