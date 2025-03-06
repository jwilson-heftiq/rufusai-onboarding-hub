import { apiRequest } from "./queryClient";
import { awsService } from "./aws-service";
import type { InsertClient } from "@shared/schema";

export async function createClient(data: InsertClient, token: string) {
  try {
    console.log('Creating client with data:', data);

    // First try local storage
    try {
      // Transform data to match API schema
      const apiData = {
        company_url: data.companyUrl,
        api_key: data.apiKey
      };

      const res = await apiRequest("POST", "/api/clients", apiData, token);
      const responseText = await res.text();

      if (!res.ok) {
        console.error('API Response:', {
          status: res.status,
          statusText: res.statusText,
          body: responseText
        });
        throw new Error(`API request failed: ${res.status} - ${responseText}`);
      }

      const localResult = responseText ? JSON.parse(responseText) : null;
      console.log('Local storage result:', localResult);

      // Then try AWS in the background
      try {
        await awsService.submitClientData(apiData);
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
    throw error;
  }
}

export async function updateClientStatus(id: number, status: string) {
  const res = await apiRequest("PATCH", `/api/clients/${id}/status`, { status });
  return res.json();
}