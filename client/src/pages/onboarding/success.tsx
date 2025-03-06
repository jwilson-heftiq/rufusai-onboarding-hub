import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import OnboardingLayout from "./layout";
import { CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Client } from "@shared/schema";

export default function Success() {
  const [_, setLocation] = useLocation();
  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"]
  });

  // Get the most recently created client
  const latestClient = clients ? clients[clients.length - 1] : null;

  return (
    <OnboardingLayout>
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Onboarding Successful!</h1>
          <p className="text-muted-foreground mt-2">
            Your account has been successfully set up
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left mb-8">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Client Name</p>
            <p className="font-medium">{latestClient?.name || "Not available"}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Company Reference</p>
            <p className="font-medium">{latestClient?.companyUrl || "Not available"}</p>
          </div>
          <div className="col-span-2 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">API Key</p>
            <p className="font-medium">••••••••{latestClient?.apiKey.slice(-4) || "####"}</p>
          </div>
        </div>

        <div className="space-x-4">
          <Button onClick={() => setLocation("/dashboard")}>
            Go to Dashboard
          </Button>
          <Button variant="outline">
            View Documentation
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}