import { apiRequest } from "./queryClient";
import type { InsertClient } from "@shared/schema";

export async function createClient(data: InsertClient) {
  const res = await apiRequest("POST", "/api/clients", data);
  return res.json();
}

export async function updateClientStatus(id: number, status: string) {
  const res = await apiRequest("PATCH", `/api/clients/${id}/status`, { status });
  return res.json();
}
