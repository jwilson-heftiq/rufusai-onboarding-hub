import { apiRequest } from "./queryClient";
import { awsService } from "./aws-service";
import type { InsertClient } from "@shared/schema";

export async function createClient(data: InsertClient) {
  // First submit to AWS API Gateway
  await awsService.submitClientData(data);

  // Then store in local system
  const res = await apiRequest("POST", "/api/clients", data);
  return res.json();
}

export async function updateClientStatus(id: number, status: string) {
  const res = await apiRequest("PATCH", `/api/clients/${id}/status`, { status });
  return res.json();
}