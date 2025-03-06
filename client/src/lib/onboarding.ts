import { apiRequest } from "./queryClient";
import { awsService } from "./aws-service";
import type { InsertClient } from "@shared/schema";

export async function createClient(data: InsertClient) {
  try {
    console.log('Creating client with data:', data);

    // First try local storage
    try {
      const res = await apiRequest("POST", "/api/clients", data);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API request failed: ${res.status} - ${errorText}`);
      }
      const localResult = await res.json();
      console.log('Local storage result:', localResult);

      // Then try AWS in the background
      try {
        await awsService.submitClientData(data);
      } catch (awsError) {
        console.error('AWS submission failed (non-blocking):', awsError);
        // Don't block the flow for AWS errors
      }

      return localResult;
    } catch (error) {
      console.error('Error in API request:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating client:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create client. Please try again.');
  }
}

export async function updateClientStatus(id: number, status: string) {
  const res = await apiRequest("PATCH", `/api/clients/${id}/status`, { status });
  return res.json();
}