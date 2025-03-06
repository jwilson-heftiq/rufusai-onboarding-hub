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
        console.log('Using existing OAuth token');
        return this.token.access_token;
      }

      console.log('Requesting new OAuth token...');
      const tokenUrl = import.meta.env.AWS_OAUTH_TOKEN_URL;
      if (!tokenUrl) {
        throw new Error('AWS_OAUTH_TOKEN_URL environment variable is not set');
      }
      console.log('Token URL:', tokenUrl);

      const clientId = import.meta.env.AWS_OAUTH_CLIENT_ID;
      const clientSecret = import.meta.env.AWS_OAUTH_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        throw new Error('AWS OAuth credentials are not properly configured');
      }

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'default-m2m-resource-server-e-pghm/read'
        })
      });

      const responseText = await response.text();
      console.log('OAuth response text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to obtain OAuth token: ${response.status} - ${responseText}`);
      }

      try {
        const tokenData = JSON.parse(responseText);
        this.token = tokenData;
        this.tokenExpiry = new Date(Date.now() + ((tokenData.expires_in - 60) * 1000));
        console.log('OAuth token obtained successfully');
        return this.token.access_token;
      } catch (parseError) {
        console.error('Failed to parse OAuth response:', parseError);
        throw new Error('Invalid OAuth response format');
      }
    } catch (error) {
      console.error('Error obtaining OAuth token:', error);
      throw error;
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

      const responseText = await response.text();
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