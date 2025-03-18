import { initializeClient, useAuthInfo, AuthProvider } from "@propelauth/react";

const authUrl = import.meta.env.VITE_PROPELAUTH_URL;
if (!authUrl) {
  throw new Error('VITE_PROPELAUTH_URL environment variable is not set');
}

export const client = initializeClient({
  authUrl,
  enableBackgroundTokenRefresh: true,
});

// Re-export commonly used hooks and components
export { AuthProvider, useAuthInfo };

// Helper function to get the current access token
export async function getAccessToken(): Promise<string> {
  const accessToken = await client.getAccessToken();
  if (!accessToken) {
    throw new Error('No access token available');
  }
  return accessToken;
}