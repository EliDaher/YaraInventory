import React from "react";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

const Products = React.lazy(() => import("@/pages/Products"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const SellProduct = React.lazy(() => import("@/pages/SellProduct"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const Login = React.lazy(() => import("@/pages/Login"));
const SignUp = React.lazy(() => import("@/pages/SignUp"));
const Suppliers = React.lazy(() => import("@/pages/Suppliers"));
const Customers = React.lazy(() => import("@/pages/Customers"));
const UnauthorizedPage = React.lazy(() => import("@/pages/Unauthorized"));
const FinancialStatement = React.lazy(
  () => import("@/pages/FinancialStatement")
);
const CustomerDetails = React.lazy(() => import("@/pages/CustomerDetails"));
const SupplierDetails = React.lazy(() => import("@/pages/SupplierDetails"));
const ProductDetails = React.lazy(() => import("@/pages/ProductDetails"));
const Exchange = React.lazy(() => import("@/pages/Exchange"));
const Warehouses = React.lazy(() => import("@/pages/Warehouses"));
const SellDetails = React.lazy(() => import("@/pages/SellDetails"));
const WarehousesDetails = React.lazy(() => import("@/pages/WarehousesDetails"));
const Categories = React.lazy(() => import("@/pages/Categories"));
const CategoryDetails = React.lazy(() => import("@/pages/CategoryDetails"));
const Users = React.lazy(() => import("@/pages/Users"));

const withPermission = (
  element: JSX.Element,
  requiredPermission: string,
  allowedRoles: string[] = ["admin", "staff"]
) => (
  <PrivateRoute
    allowedRoles={allowedRoles}
    requiredPermission={requiredPermission}
  >
    {element}
  </PrivateRoute>
);

export const routesConfig = [
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/signUp", element: <SignUp /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  { path: "/dashboard", element: withPermission(<Dashboard />, "dashboard") },
  { path: "/Products", element: withPermission(<Products />, "products") },
  {
    path: "/productDetails",
    element: withPermission(<ProductDetails />, "products"),
  },

  {
    path: "/sellProduct",
    element: withPermission(<SellProduct />, "sell_product"),
  },
  {
    path: "/sellDetails",
    element: withPermission(<SellDetails />, "sell_product"),
  },

  { path: "/suppliers", element: withPermission(<Suppliers />, "suppliers") },
  {
    path: "/SupplierDetails",
    element: withPermission(<SupplierDetails />, "suppliers"),
  },

  { path: "/customers", element: withPermission(<Customers />, "customers") },
  {
    path: "/CustomerDetails",
    element: withPermission(<CustomerDetails />, "customers"),
  },

  {
    path: "/financialStatement",
    element: withPermission(<FinancialStatement />, "financial_statement"),
  },
  {
    path: "/Exchange",
    element: withPermission(<Exchange />, "financial_statement"),
  },

  { path: "/warehouses", element: withPermission(<Warehouses />, "warehouses") },
  {
    path: "/Warehouses/:id",
    element: withPermission(<WarehousesDetails />, "warehouses"),
  },

  { path: "/categories", element: withPermission(<Categories />, "categories") },
  {
    path: "/categories/:id",
    element: withPermission(<CategoryDetails />, "categories"),
  },

  {
    path: "/users",
    element: withPermission(<Users />, "users", ["admin"]),
  },

  { path: "*", element: <NotFound /> },
];
