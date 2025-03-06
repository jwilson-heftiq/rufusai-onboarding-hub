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
        console.error('OAuth token error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to obtain OAuth token: ${response.status} - ${errorText}`);
      }

      const tokenData = await response.json();
      this.token = tokenData;
      this.tokenExpiry = new Date(Date.now() + ((tokenData.expires_in - 60) * 1000));

      console.log('OAuth token obtained successfully');
      return this.token.access_token;
    } catch (error) {
      console.error('Error obtaining OAuth token:', error);
      throw new Error('Failed to authenticate with AWS services');
    }
  }

  async submitClientData(clientData: any): Promise<any> {
    try {
      const token = await this.getToken();
      console.log('Submitting client data to AWS:', clientData);

      const response = await fetch('https://cgm4gnmhk1.execute-api.us-east-1.amazonaws.com/v1/onboard', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AWS API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`AWS API request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('AWS API response:', result);
      return result;
    } catch (error) {
      console.error('Failed to submit client data to AWS:', error);
      throw error;
    }
  }
}

export const awsService = new AWSService();