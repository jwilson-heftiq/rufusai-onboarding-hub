import { AuthProvider as BaseAuthProvider, initializeClient } from "@propelauth/react";
import { type User } from "@propelauth/javascript";

const authUrl = import.meta.env.VITE_PROPELAUTH_URL;
if (!authUrl) {
  throw new Error('VITE_PROPELAUTH_URL environment variable is not set');
}

// Initialize the PropelAuth client
const client = initializeClient({
  authUrl,
  enableBackgroundTokenRefresh: true,
});

// Create a wrapper component for AuthProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseAuthProvider authUrl={authUrl}>
      {children}
    </BaseAuthProvider>
  );
}

// Helper function to get the current access token
export async function getAccessToken(): Promise<string> {
  try {
    const accessToken = await client.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }
    return accessToken;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw error;
  }
}

// Export useful types
export type { User };

// Export the client for direct access if needed
export { client };