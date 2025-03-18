import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ClientInfo from "@/pages/onboarding/client-info";
import Verify from "@/pages/onboarding/verify";
import Success from "@/pages/onboarding/success";
import Login from "@/pages/login";
import { AuthProvider, useAuthInfo } from "./lib/propelauth";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { isLoading, isLoggedIn } = useAuthInfo();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/callback" component={() => (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )} />
      {/* Onboarding routes */}
      <Route path="/onboard/client-info" component={() => <ProtectedRoute component={ClientInfo} />} />
      <Route path="/onboard/verify" component={() => <ProtectedRoute component={Verify} />} />
      <Route path="/onboard/success" component={() => <ProtectedRoute component={Success} />} />
      <Route path="/" component={() => <ProtectedRoute component={ClientInfo} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const authUrl = import.meta.env.VITE_PROPELAUTH_URL;
  if (!authUrl) {
    throw new Error('VITE_PROPELAUTH_URL environment variable is not set');
  }

  return (
    <AuthProvider authUrl={authUrl}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}
