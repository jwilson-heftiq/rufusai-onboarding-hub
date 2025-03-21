import { apiRequest } from "./queryClient";
import { awsService } from "./aws-service";
import type { InsertClient } from "@shared/schema";

export async function createClient(data: InsertClient, token: string) {
  try {
    console.log('Creating client with data:', data);

    // First create in local storage
    const res = await apiRequest("POST", "/api/clients", data, token);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Local storage error:', {
        status: res.status,
        statusText: res.statusText,
        body: errorText
      });
      throw new Error(`Failed to create client: ${res.status} - ${errorText}`);
    }

    const localResult = await res.json();
    console.log('Local storage result:', localResult);

    // Format data for AWS API Gateway - only include required fields
    const awsData = {
      "company_url": data.companyUrl,
      "api_key": data.apiKey
    };

    // Submit to AWS API Gateway
    try {
      console.log('Submitting to AWS:', awsData);
      const awsResult = await awsService.submitClientData(awsData);
      console.log('AWS submission successful:', awsResult);
      return localResult;
    } catch (awsError) {
      console.error('AWS submission failed:', awsError);
      // We'll continue with the flow but show the error to the user
      if (awsError instanceof Error && awsError.message.includes('CORS')) {
        console.warn('CORS issue detected with AWS API Gateway - continuing with local storage only');
        return localResult;
      }
      throw new Error(`AWS API Gateway submission failed: ${awsError instanceof Error ? awsError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error in createClient:', error);
    throw error;
  }
}

export async function updateClientStatus(id: number, status: string, token: string) {
  const res = await apiRequest("PATCH", `/api/clients/${id}/status`, { status }, token);
  return res.json();
}