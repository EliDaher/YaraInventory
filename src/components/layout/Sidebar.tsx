import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Package,
  Shapes,
  ShoppingCart,
  UserPlus,
  Users,
  Users2,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PermissionKey =
  | "dashboard"
  | "products"
  | "sell_product"
  | "suppliers"
  | "customers"
  | "financial_statement"
  | "warehouses"
  | "categories"
  | "users";

type InventoryUser = {
  role?: string;
  permissions?: PermissionKey[];
};

const navigationGroups: {
  name: string;
  href: string;
  icon: any;
  allowed: string[];
  permission: PermissionKey;
}[] = [
  {
    name: "All Products",
    href: "/Products",
    icon: Package,
    allowed: ["admin", "staff"],
    permission: "products",
  },
  {
    name: "Sell Product",
    href: "/SellProduct",
    icon: ShoppingCart,
    allowed: ["admin", "staff"],
    permission: "sell_product",
  },
  {
    name: "Suppliers",
    href: "/Suppliers",
    icon: UserPlus,
    allowed: ["admin", "staff"],
    permission: "suppliers",
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users2,
    allowed: ["admin", "staff"],
    permission: "customers",
  },
  {
    name: "Financial Statement",
    href: "/financialStatement",
    icon: FileText,
    allowed: ["admin", "staff"],
    permission: "financial_statement",
  },
  {
    name: "Warehouses",
    href: "/warehouses",
    icon: Warehouse,
    allowed: ["admin", "staff"],
    permission: "warehouses",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Shapes,
    allowed: ["admin", "staff"],
    permission: "categories",
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    allowed: ["admin"],
    permission: "users",
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const hasPermission = (
  user: InventoryUser | null,
  permission: PermissionKey
): boolean => {
  if (!user?.role) return false;
  if (user.role === "admin") return true;
  return Array.isArray(user.permissions) && user.permissions.includes(permission);
};

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  let user: InventoryUser | null = null;

  try {
    const userStr = localStorage.getItem("InventoryUser");
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Failed to parse InventoryUser:", error);
    user = null;
  }

  const isDashboardActive = location.pathname === "/dashboard";
  const canSeeDashboard =
    ["admin", "staff"].includes(user?.role || "") &&
    hasPermission(user, "dashboard");

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r bg-sidebar transition-all duration-300 ease-in-out shadow-md",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-accent px-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text font-extrabold text-transparent">
              غرانتكس
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 rounded-full text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {canSeeDashboard && (
        <nav className="px-2 py-3">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
              isDashboardActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-inner"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Home className="mr-3 h-5 w-5 flex-shrink-0" />
            {!isCollapsed && "Dashboard"}
          </Link>
        </nav>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {navigationGroups.map((group) => {
          const isActive = location.pathname === group.href;
          const isRoleAllowed = group.allowed.includes(user?.role || "");
          const canAccess = isRoleAllowed && hasPermission(user, group.permission);

          if (!canAccess) {
            return null;
          }

          return (
            <Link
              key={group.name}
              to={group.href}
              className={cn(
                "group mt-2 flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-inner"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <group.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {!isCollapsed && group.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
