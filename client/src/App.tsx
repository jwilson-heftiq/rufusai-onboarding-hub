import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/onboarding/welcome";
import ClientInfo from "@/pages/onboarding/client-info";
import Verify from "@/pages/onboarding/verify";
import Success from "@/pages/onboarding/success";
import Dashboard from "@/pages/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/onboard/welcome" component={Welcome} />
      <Route path="/onboard/client-info" component={ClientInfo} />
      <Route path="/onboard/verify" component={Verify} />
      <Route path="/onboard/success" component={Success} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
