import { initializeClient, useAuthInfo as useBaseAuthInfo, AuthProvider } from "@propelauth/react";

const authUrl = import.meta.env.VITE_PROPELAUTH_URL;
if (!authUrl) {
  throw new Error('VITE_PROPELAUTH_URL environment variable is not set');
}

export const client = initializeClient({
  authUrl,
  enableBackgroundTokenRefresh: true,
});

// Create a type-safe wrapper around useAuthInfo
export function useAuthInfo() {
  const auth = useBaseAuthInfo();
  return {
    isLoading: Boolean(auth.loading),
    isLoggedIn: Boolean(auth.user),
    user: auth.user
  };
}

// Re-export commonly used components
export { AuthProvider };

// Helper function to get the current access token
export async function getAccessToken(): Promise<string> {
  const accessToken = await client.getAccessToken();
  if (!accessToken) {
    throw new Error('No access token available');
  }
  return accessToken;
}