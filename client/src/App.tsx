import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ClientInfo from "@/pages/onboarding/client-info";
import Verify from "@/pages/onboarding/verify";
import Success from "@/pages/onboarding/success";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import { Auth0Provider } from "@auth0/auth0-react";
import { useAuthRedirect } from "./lib/auth";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { isLoading } = useAuthRedirect();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/callback" component={Login} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      {/* Onboarding routes */}
      <Route path="/onboard/client-info" component={() => <ProtectedRoute component={ClientInfo} />} />
      <Route path="/onboard/verify" component={() => <ProtectedRoute component={Verify} />} />
      <Route path="/onboard/success" component={() => <ProtectedRoute component={Success} />} />
      <Route path="/" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    throw new Error('Missing Auth0 configuration');
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience: `https://${domain}/api/v2/`,
        scope: "openid profile email"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </Auth0Provider>
  );
}