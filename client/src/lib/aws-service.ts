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

      // Validate credentials
      const clientId = import.meta.env.VITE_AWS_OAUTH_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_AWS_OAUTH_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('AWS OAuth credentials are not properly configured');
      }

      // Validate client ID is not the token URL (common misconfiguration)
      if (clientId.includes('oauth2/token')) {
        throw new Error('Invalid AWS OAuth Client ID - appears to be the token URL instead of the client ID. Please check your environment configuration.');
      }

      // Create authorization header
      const authHeader = 'Basic ' + btoa(`${clientId}:${clientSecret}`);

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authHeader,
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'default-m2m-resource-server-e-pghm/read'
        }),
        mode: 'cors' as const
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
        if (!tokenData.access_token) {
          console.error('Invalid token response:', tokenData);
          throw new Error('Token response missing access_token');
        }

        this.token = tokenData;
        this.tokenExpiry = new Date(Date.now() + ((tokenData.expires_in - 60) * 1000));
        console.log('OAuth token obtained successfully:', {
          expires_in: tokenData.expires_in,
          expiry: this.tokenExpiry,
          token_type: tokenData.token_type
        });
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
      if (!token) {
        throw new Error('Failed to obtain valid OAuth token');
      }
      console.log('Submitting client data to AWS:', clientData);

      // Format request body with explicitly quoted keys
      const requestBody: ApiRequestData = {
        "company_url": clientData.company_url,
        "api_key": clientData.api_key
      };

      console.log('AWS API request body:', JSON.stringify(requestBody, null, 2));

      const apiGatewayUrl = import.meta.env.VITE_AWS_API_GATEWAY_URL;
      if (!apiGatewayUrl) {
        throw new Error('VITE_AWS_API_GATEWAY_URL environment variable is not set');
      }

      // Validate and format the URL
      let fullUrl: string;
      try {
        const baseUrl = new URL(apiGatewayUrl);
        // Remove trailing slash if present
        const cleanBaseUrl = baseUrl.toString().replace(/\/$/, '');
        fullUrl = `${cleanBaseUrl}/v1/onboard`;
        console.log('Full API Gateway URL:', fullUrl);
      } catch (urlError) {
        console.error('Invalid API Gateway URL format:', apiGatewayUrl);
        throw new Error('API Gateway URL is not a valid URL format');
      }

      try {
        const requestConfig = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody),
          mode: 'cors' as const
        };

        console.log('Request configuration:', {
          url: fullUrl,
          method: requestConfig.method,
          headers: Object.fromEntries(Object.entries(requestConfig.headers)),
          bodyLength: requestConfig.body.length
        });

        const response = await fetch(fullUrl, requestConfig);

        const responseText = await response.text();
        console.log('AWS API response status:', response.status);
        console.log('AWS API response headers:', Object.fromEntries(response.headers.entries()));
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
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        if (fetchError instanceof Error && fetchError.message.includes('CORS')) {
          throw new Error(`CORS error - The AWS API Gateway needs to be configured to allow requests from ${window.location.origin}. Please ensure the following CORS configuration is added to the API Gateway:
          - Allowed Origins: ${window.location.origin}
          - Allowed Methods: POST, OPTIONS
          - Allowed Headers: Authorization, Content-Type, Accept`);
        }
        throw new Error(`Failed to make API request: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting client data to AWS:', error);
      throw error;
    }
  }
}

export const awsService = new AWSService();