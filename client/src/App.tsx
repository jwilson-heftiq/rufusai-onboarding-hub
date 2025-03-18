import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ClientInfo from "@/pages/onboarding/client-info";
import Verify from "@/pages/onboarding/verify";
import Success from "@/pages/onboarding/success";
import Login from "@/pages/login";
import { AuthProvider } from "./lib/propelauth";
import { useAuthInfo } from "@propelauth/react";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { loading, user } = useAuthInfo();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/onboard/client-info" component={() => <ProtectedRoute component={ClientInfo} />} />
      <Route path="/onboard/verify" component={() => <ProtectedRoute component={Verify} />} />
      <Route path="/onboard/success" component={() => <ProtectedRoute component={Success} />} />
      <Route path="/" component={() => <ProtectedRoute component={ClientInfo} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}