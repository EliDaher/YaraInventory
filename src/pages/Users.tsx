import { DataTable } from "@/components/dashboard/DataTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import ConfirmForm from "@/components/ui/custom/ConfirmForm";
import FormInput from "@/components/ui/custom/FormInput";
import PopupForm from "@/components/ui/custom/PopupForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AppUser,
  createUser,
  deleteUser,
  getAllUserOperations,
  getOperationsByUser,
  getUsers,
  PermissionKey,
  Role,
  updateUser,
} from "@/services/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const MODULE_PERMISSIONS: PermissionKey[] = [
  "dashboard",
  "products",
  "sell_product",
  "suppliers",
  "customers",
  "financial_statement",
  "warehouses",
  "categories",
  "users",
];

const PERMISSION_LABELS: Record<PermissionKey, string> = {
  dashboard: "Dashboard",
  products: "Products",
  sell_product: "Sell Product",
  suppliers: "Suppliers",
  customers: "Customers",
  financial_statement: "Financial Statement",
  warehouses: "Warehouses",
  categories: "Categories",
  users: "Users",
};

const ROLE_OPTIONS = [
  { id: "admin", name: "Admin" },
  { id: "staff", name: "Staff" },
];

const getDefaultPermissions = (role: Role): PermissionKey[] =>
  role === "admin" ? [...MODULE_PERMISSIONS] : [];

export default function Users() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const [createForm, setCreateForm] = useState<{
    username: string;
    password: string;
    role: Role;
    permissions: PermissionKey[];
  }>({
    username: "",
    password: "",
    role: "staff",
    permissions: [],
  });

  const [editForm, setEditForm] = useState<{
    password: string;
    role: Role;
    permissions: PermissionKey[];
  }>({
    password: "",
    role: "staff",
    permissions: [],
  });

  const usersQuery = useQuery({
    queryKey: ["users-table"],
    queryFn: getUsers,
  });

  const globalOpsQuery = useQuery({
    queryKey: ["users-global-operations"],
    queryFn: getAllUserOperations,
  });

  const perUserOpsQuery = useQuery({
    queryKey: ["users-operations", selectedUsername],
    queryFn: () => getOperationsByUser(selectedUsername || ""),
    enabled: !!selectedUsername,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created");
      setCreateOpen(false);
      setCreateForm({
        username: "",
        password: "",
        role: "staff",
        permissions: [],
      });
      queryClient.invalidateQueries({ queryKey: ["users-table"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      username,
      payload,
    }: {
      username: string;
      payload: {
        password?: string;
        role?: Role;
        permissions?: PermissionKey[];
      };
    }) => updateUser(username, payload),
    onSuccess: () => {
      toast.success("User updated");
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users-table"] });
      queryClient.invalidateQueries({ queryKey: ["users-global-operations"] });
      if (selectedUsername) {
        queryClient.invalidateQueries({
          queryKey: ["users-operations", selectedUsername],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to update user");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["users-table"] });
      queryClient.invalidateQueries({ queryKey: ["users-global-operations"] });
      if (selectedUsername) {
        queryClient.invalidateQueries({
          queryKey: ["users-operations", selectedUsername],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to delete user");
    },
  });

  const usersRows = useMemo(
    () =>
      (usersQuery.data || []).map((user) => ({
        ...user,
        permissionsText: user.permissions.join(", "),
        permissionsCount: user.permissions.length,
        _raw: user,
      })),
    [usersQuery.data]
  );

  const usersColumns = [
    { key: "username", label: "اسم المستخدم", sortable: true },
    { key: "role", label: "الدور", sortable: true },
    { key: "permissionsCount", label: "الصلاحيات", sortable: true },
    { key: "createdAt", label: "تاريخ الإنشاء", sortable: true },
    { key: "updatedAt", label: "تاريخ التحديث", sortable: true },
  ];

  const operationColumns = [
    { key: "type", label: "النوع", sortable: true },
    { key: "executer", label: "المنفذ", sortable: true },
    { key: "referenceId", label: "المرجع", sortable: true },
    { key: "amount", label: "المبلغ", sortable: true },
    { key: "currency", label: "العملة", sortable: true },
    { key: "date", label: "التاريخ", sortable: true },
    { key: "details", label: "التفاصيل", sortable: true },
  ];

  const toggleCreatePermission = (permission: PermissionKey) => {
    setCreateForm((prev) => {
      const exists = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
      };
    });
  };

  const toggleEditPermission = (permission: PermissionKey) => {
    setEditForm((prev) => {
      const exists = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
      };
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DataTable
          title="المستخدمين"
          columns={usersColumns}
          data={usersRows}
          isLoading={usersQuery.isLoading}
          onRowClick={(row) => setSelectedUsername(row.username)}
          titleButton={
            <PopupForm
              isOpen={createOpen}
              setIsOpen={setCreateOpen}
              title="اضافة مستخدم جديد"
              trigger={<Button>اضافة مستخدم</Button>}
            >
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!createForm.username || !createForm.password) {
                    toast.error("Username and password are required");
                    return;
                  }
                  createMutation.mutate({
                    ...createForm,
                    permissions:
                      createForm.role === "admin"
                        ? getDefaultPermissions("admin")
                        : createForm.permissions,
                  });
                }}
              >
                <FormInput
                  label="اسم المستخدم"
                  value={createForm.username}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      username: event.target.value,
                    }))
                  }
                />
                <FormInput
                  label="كلمة المرور"
                  type="password"
                  value={createForm.password}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                />
                <FormInput
                  label="الصلاحية"
                  value={createForm.role}
                  options={ROLE_OPTIONS}
                  onChange={(event) => {
                    const role = event.target.value as Role;
                    setCreateForm((prev) => ({
                      ...prev,
                      role,
                      permissions: getDefaultPermissions(role),
                    }));
                  }}
                />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Permissions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    {MODULE_PERMISSIONS.map((permission) => (
                      <div key={permission} className="flex items-center gap-2">
                        <Checkbox
                          checked={createForm.permissions.includes(permission)}
                          disabled={createForm.role === "admin"}
                          onCheckedChange={() =>
                            toggleCreatePermission(permission)
                          }
                        />
                        <Label>{PERMISSION_LABELS[permission]}</Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Button
                  className="w-full"
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Saving..." : "Create User"}
                </Button>
              </form>
            </PopupForm>
          }
          renderRowActions={(row) => (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(event) => {
                  event.stopPropagation();
                  const raw = row._raw as AppUser;
                  setSelectedUser(raw);
                  setEditForm({
                    password: "",
                    role: raw.role,
                    permissions:
                      raw.role === "admin"
                        ? getDefaultPermissions("admin")
                        : raw.permissions,
                  });
                  setEditOpen(true);
                }}
              >
                Edit
              </Button>

              <ConfirmForm
                title={`Delete user ${row.username}?`}
                description="This action cannot be undone."
                confirmText="Delete"
                onConfirm={() => deleteMutation.mutate(row.username)}
                loading={deleteMutation.isPending}
                trigger={
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Delete
                  </Button>
                }
              />
            </div>
          )}
        />

        <PopupForm
          isOpen={editOpen}
          setIsOpen={setEditOpen}
          title={`تعديل ${selectedUser?.username || ""}`}
          trigger={<></>}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!selectedUser) return;
              updateMutation.mutate({
                username: selectedUser.username,
                payload: {
                  password: editForm.password || undefined,
                  role: editForm.role,
                  permissions:
                    editForm.role === "admin"
                      ? getDefaultPermissions("admin")
                      : editForm.permissions,
                },
              });
            }}
          >
            <FormInput label="اسم المستخدم" value={selectedUser?.username || ""} disabled />
            <FormInput
              label="كلمة المرور الجديدة (اختياري)"
              type="password"
              value={editForm.password}
              onChange={(event) =>
                setEditForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
            />
            <FormInput
              label="الصلاحية"
              value={editForm.role}
              options={ROLE_OPTIONS}
              onChange={(event) => {
                const role = event.target.value as Role;
                setEditForm((prev) => ({
                  ...prev,
                  role,
                  permissions: getDefaultPermissions(role),
                }));
              }}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">الصلاحيات</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {MODULE_PERMISSIONS.map((permission) => (
                  <div key={permission} className="flex items-center gap-2">
                    <Checkbox
                      checked={editForm.permissions.includes(permission)}
                      disabled={editForm.role === "admin"}
                      onCheckedChange={() => toggleEditPermission(permission)}
                    />
                    <Label>{PERMISSION_LABELS[permission]}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button
              className="w-full"
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </form>
        </PopupForm>

        <DataTable
          title="جميع العمليات"
          columns={operationColumns}
          data={globalOpsQuery.data || []}
          isLoading={globalOpsQuery.isLoading}
        />

        <DataTable
          title={
            selectedUsername
              ? `عمليات المستخدم:  ${selectedUsername}`
              : "اختر مستخدم لعرض عملياته"
          }
          columns={operationColumns}
          data={perUserOpsQuery.data || []}
          isLoading={perUserOpsQuery.isLoading}
        />
      </div>
    </DashboardLayout>
  );
}
