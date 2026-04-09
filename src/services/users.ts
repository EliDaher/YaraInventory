import apiClient from "@/lib/axios";

export type PermissionKey =
  | "dashboard"
  | "products"
  | "sell_product"
  | "suppliers"
  | "customers"
  | "financial_statement"
  | "warehouses"
  | "categories"
  | "users";

export type Role = "admin" | "staff";

export interface AppUser {
  username: string;
  role: Role;
  permissions: PermissionKey[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserOperation {
  id: string;
  type: string;
  executer: string;
  date: string;
  referenceId: string;
  amount: number;
  currency: string;
  details: string;
}

export async function getUsers(): Promise<AppUser[]> {
  const response = await apiClient.get("/api/users");
  return response.data;
}

export async function createUser(payload: {
  username: string;
  password: string;
  role: Role;
  permissions: PermissionKey[];
}) {
  const response = await apiClient.post("/api/users", payload);
  return response.data;
}

export async function updateUser(
  username: string,
  payload: {
    password?: string;
    role?: Role;
    permissions?: PermissionKey[];
  }
) {
  const response = await apiClient.put(`/api/users/${username}`, payload);
  return response.data;
}

export async function deleteUser(username: string) {
  const response = await apiClient.delete(`/api/users/${username}`);
  return response.data;
}

export async function getAllUserOperations(): Promise<UserOperation[]> {
  const response = await apiClient.get("/api/users/operations?limit=50");
  return response.data;
}

export async function getOperationsByUser(
  username: string
): Promise<UserOperation[]> {
  const response = await apiClient.get(`/api/users/${username}/operations`);
  return response.data;
}
