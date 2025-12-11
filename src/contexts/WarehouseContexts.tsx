import { createContext, useContext } from "react";
import { useWarehouses } from "@/hooks/useWarehouses";

const WarehouseContext = createContext(null);

export function WarehouseProvider({ children }) {
  const warehousesQuery = useWarehouses();

  return (
    <WarehouseContext.Provider value={warehousesQuery}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouseContext() {
  return useContext(WarehouseContext);
}
