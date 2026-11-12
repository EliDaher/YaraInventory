import apiClient from "@/lib/axios";

import type { CustomerPage, CustomerPageParams, CustomerSummary } from "./customer";

export const supplierQueryKey = ["suppliers-table"] as const;
export const supplierSummaryQuery = {
  queryKey: [...supplierQueryKey, "summary"] as const,
  queryFn: async ({ signal }: { signal: AbortSignal }) =>
    (await apiClient.get<CustomerSummary[]>("/api/suppliers/summary", { signal })).data,
};

export function supplierPageQuery(params: CustomerPageParams) {
  return {
    queryKey: [...supplierQueryKey, "page", params] as const,
    queryFn: async ({ signal }: { signal: AbortSignal }) =>
      (await apiClient.get<CustomerPage>("/api/suppliers/page", { params, signal })).data,
  };
}

export default async function getAllSupplier() {
  try {
    const response = await apiClient.get("/api/suppliers");
    return response.data;
  } catch (err) {
    console.error("خطأ في تسجيل الدخول:", err);
    throw new Error("خطأ أثناء جلب الموردين");
  }
}
export async function addSupplier({ name, number }) {
  try {
    const response = await apiClient.post("/api/suppliers", {
      name,
      number,
    });
    return response.data;
  } catch (err) {
    console.error("خطأ في تسجيل الدخول:", err);
    throw new Error("خطأ أثناء إضافة مورد جديد");
  }
}

export async function getSupplierById({ id }: { id: string }) {
  try {
    console.log("frontend id:", id);
    const response = await apiClient.post("/api/suppliers/byId", { id });
    return response.data;
  } catch (err) {
    console.error("خطأ في جلب المورد:", err);
    throw new Error("خطأ أثناء جلب المورد بواسطة المعرف");
  }
}


export async function updateSupplier(id: string, data: Partial<any>) {
  try {
    const response = await apiClient.put(`/api/suppliers/${id}`, {name: data.name, number: data.number});
    return response.data;
  } catch (err) {
    console.error("خطأ في تحديث العميل:", err);
    throw new Error("خطأ أثناء تحديث بيانات العميل");
  }
}
