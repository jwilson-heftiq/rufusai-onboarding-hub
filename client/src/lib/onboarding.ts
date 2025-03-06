import { apiRequest } from "./queryClient";
import { awsService } from "./aws-service";
import type { InsertClient } from "@shared/schema";

export async function createClient(data: InsertClient) {
  try {
    // First try local storage
    const res = await apiRequest("POST", "/api/clients", data);
    const localResult = await res.json();

    // Then try AWS in the background
    try {
      await awsService.submitClientData(data);
    } catch (awsError) {
      console.error('AWS submission failed (non-blocking):', awsError);
      // Don't block the flow for AWS errors
    }

    return localResult;
  } catch (error) {
    console.error('Error creating client:', error);
    throw new Error('Failed to create client. Please try again.');
  }
}

export async function updateClientStatus(id: number, status: string) {
  const res = await apiRequest("PATCH", `/api/clients/${id}/status`, { status });
  return res.json();
}