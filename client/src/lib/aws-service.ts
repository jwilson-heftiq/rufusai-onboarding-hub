import { apiRequest } from "./queryClient";

interface OAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface ApiRequestData {
  "company_url": string;
  "api_key": string;
}

class AWSService {
  private token: OAuthToken | null = null;
  private tokenExpiry: Date | null = null;

  private async getToken(): Promise<string> {
    try {
      // Return existing token if still valid
      if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
        console.log('Using existing OAuth token');
        return this.token.access_token;
      }

      console.log('Requesting new OAuth token...');
      const tokenUrl = import.meta.env.VITE_AWS_OAUTH_TOKEN_URL;
      if (!tokenUrl) {
        throw new Error('VITE_AWS_OAUTH_TOKEN_URL environment variable is not set');
      }
      console.log('OAuth Token URL:', tokenUrl);
      console.log('Available env vars:', {
        token_url: import.meta.env.VITE_AWS_OAUTH_TOKEN_URL,
        client_id: import.meta.env.VITE_AWS_OAUTH_CLIENT_ID,
        has_secret: !!import.meta.env.VITE_AWS_OAUTH_CLIENT_SECRET
      });

      // Validate URL format
      try {
        new URL(tokenUrl);
      } catch (urlError) {
        console.error('Invalid OAuth Token URL format:', tokenUrl);
        throw new Error('OAuth Token URL is not a valid URL format');
      }

      const clientId = import.meta.env.VITE_AWS_OAUTH_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_AWS_OAUTH_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        throw new Error('AWS OAuth credentials are not properly configured');
      }

      // Create authorization header
      const authHeader = 'Basic ' + btoa(`${clientId}:${clientSecret}`);

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authHeader
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'default-m2m-resource-server-e-pghm/read'
        })
      });

      const responseText = await response.text();
      console.log('OAuth response status:', response.status);
      console.log('OAuth response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response looks like HTML
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        console.error('Received HTML response instead of JSON:', responseText.substring(0, 200));
        throw new Error('Invalid OAuth response format: received HTML instead of JSON');
      }

      try {
        const tokenData = JSON.parse(responseText);
        this.token = tokenData;
        this.tokenExpiry = new Date(Date.now() + ((tokenData.expires_in - 60) * 1000));
        console.log('OAuth token obtained successfully');
        return this.token.access_token;
      } catch (parseError) {
        console.error('Failed to parse OAuth response:', parseError);
        console.error('Raw response:', responseText);
        throw new Error('Invalid OAuth response format');
      }
    } catch (error) {
      console.error('Error obtaining OAuth token:', error);
      throw error;
    }
  }

  async submitClientData(clientData: { company_url: string; api_key: string }): Promise<any> {
    try {
      const token = await this.getToken();
      console.log('Submitting client data to AWS:', clientData);

      // Format request body with explicitly quoted keys
      const requestBody: ApiRequestData = {
        "company_url": clientData.company_url,
        "api_key": clientData.api_key
      };

      console.log('AWS API request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://cgm4gnmhk1.execute-api.us-east-1.amazonaws.com/v1/onboard', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      console.log('AWS API response status:', response.status);
      console.log('AWS API response text:', responseText);

      if (!response.ok) {
        throw new Error(`AWS API request failed: ${response.status} - ${responseText}`);
      }

      try {
        const result = responseText ? JSON.parse(responseText) : null;
        console.log('AWS API parsed response:', result);
        return result;
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError);
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error submitting client data to AWS:', error);
      throw error;
    }
  }
}

export const awsService = new AWSService();