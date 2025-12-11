// hooks/useWarehouses.ts
import { useQuery } from "@tanstack/react-query";
import { getAllWarehouses } from "@/services/products";

export function useWarehouses() {
  return useQuery({
    queryKey: ["warehouses-table"],
    queryFn: getAllWarehouses,
    staleTime: 1000 * 60 * 30, // 10 minutes (بدون طلبات جديدة قبل انتهاء الوقت)
    refetchOnWindowFocus: false,
  });
}
