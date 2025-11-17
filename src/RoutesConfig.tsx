import React from "react";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import SellDetails from "./pages/SellDetails";

// Lazy Loading للصفحات
const Products = React.lazy(() => import("@/pages/Products"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const SellProduct = React.lazy(() => import("@/pages/SellProduct"));
const Analytics = React.lazy(() => import("@/pages/Analytics"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const Login = React.lazy(() => import("@/pages/Login"));
const SignUp = React.lazy(() => import("@/pages/SignUp"));
const Suppliers = React.lazy(() => import("@/pages/Suppliers"));
const Customers = React.lazy(() => import("@/pages/Customers"));
const UnauthorizedPage = React.lazy(() => import("@/pages/Unauthorized"));
const FinancialStatement = React.lazy(() => import("@/pages/FinancialStatement"));
const CustomerDetails = React.lazy(() => import("@/pages/CustomerDetails"));
const SupplierDetails = React.lazy(() => import("@/pages/SupplierDetails"));
const ProductDetails = React.lazy(() => import("@/pages/ProductDetails"));
const Exchange = React.lazy(() => import("@/pages/Exchange"));


export const routesConfig = [
  { path: "/login", element: <Login /> },
  { path: "/signUp", element: <SignUp /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/Products", element: <Products />},
  { path: "/suppliers", element:  <Suppliers /> },
  { path: "/customers", element:  <Customers /> },
  { path: "/dashboard", element: <PrivateRoute allowedRoles={["admin", "dealer"]}><Dashboard /></PrivateRoute> },
  { path: "/analytics", element: <PrivateRoute allowedRoles={["admin"]}><Analytics /></PrivateRoute> },
  { path: "/sellProduct", element: <SellProduct /> },
  { path: "/financialStatement", element: <FinancialStatement /> },
  { path: "/SupplierDetails", element: <SupplierDetails /> },
  { path: "/CustomerDetails", element: <CustomerDetails /> },
  { path: "/productDetails", element: <ProductDetails /> },
  { path: "/sellDetails", element: <SellDetails /> },
  { path: "/Exchange", element: <Exchange /> },
  { path: "*", element: <NotFound /> }
];
