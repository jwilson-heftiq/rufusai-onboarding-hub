import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { queryClient } from './queryClient';

export function useAuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Clear any stale data when not authenticated
        queryClient.clear();

        // Only redirect if we're not already on the login page or callback route
        if (location !== '/login' && !location.startsWith('/callback')) {
          console.log('Not authenticated, redirecting to login');
          setLocation('/login');
        }
      } else if (location === '/login') {
        // If authenticated but on login page, redirect to onboarding
        console.log('Already authenticated, redirecting to onboarding');
        setLocation('/onboard/client-info');
      }
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  return { isLoading, isAuthenticated };
}