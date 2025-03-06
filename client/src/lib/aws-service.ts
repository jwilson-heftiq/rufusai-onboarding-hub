import { apiRequest } from "./queryClient";

interface OAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class AWSService {
  private token: OAuthToken | null = null;
  private tokenExpiry: Date | null = null;

  private async getToken(): Promise<string> {
    try {
      // Return existing token if still valid
      if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
        return this.token.access_token;
      }

      const response = await fetch(import.meta.env.AWS_OAUTH_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: import.meta.env.AWS_OAUTH_CLIENT_ID,
          client_secret: import.meta.env.AWS_OAUTH_CLIENT_SECRET,
          scope: 'default-m2m-resource-server-e-pghm/read'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OAuth token request failed: ${response.status} - ${errorText}`);
      }

      const tokenData = await response.json();
      this.token = tokenData;
      this.tokenExpiry = new Date(Date.now() + ((this.token.expires_in - 60) * 1000));

      return this.token.access_token;
    } catch (error) {
      console.error('Error obtaining OAuth token:', error);
      throw new Error('Failed to authenticate with AWS services');
    }
  }

  async makeRequest(path: string, options: RequestInit = {}): Promise<Response> {
    try {
      const token = await this.getToken();
      const baseUrl = import.meta.env.AWS_API_GATEWAY_URL.replace(/\/$/, '');
      console.log('Making AWS API request to:', `${baseUrl}${path}`);

      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AWS API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      return response;
    } catch (error) {
      console.error('Error making AWS API request:', error);
      throw error;
    }
  }

  async submitClientData(clientData: any): Promise<any> {
    try {
      console.log('Making AWS API request with data:', clientData);
      const response = await this.makeRequest('/clients', {
        method: 'POST',
        body: JSON.stringify(clientData),
      });
      const result = await response.json();
      console.log('AWS API response:', result);
      return result;
    } catch (error) {
      console.error('Error submitting client data to AWS:', error);
      throw new Error('Failed to submit client data to AWS API Gateway. Please try again.');
    }
  }
}

export const awsService = new AWSService();