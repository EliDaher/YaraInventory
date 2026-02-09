import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { routesConfig } from "./RoutesConfig";
import { WarehouseProvider } from "./contexts/WarehouseContexts";
import { ProductProvider } from "./contexts/ProductContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Loading from "./components/ui/custom/Loading";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WarehouseProvider>
      <ProductProvider>
        <ThemeProvider storageKey="dashboard-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <Suspense
                fallback={
                  <DashboardLayout>
                    <Loading/>
                  </DashboardLayout>
                }
              >
                <Routes>
                  {routesConfig.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                </Routes>
              </Suspense>
            </HashRouter>
          </TooltipProvider>
        </ThemeProvider>
      </ProductProvider>
    </WarehouseProvider>
  </QueryClientProvider>
);

export default App;
