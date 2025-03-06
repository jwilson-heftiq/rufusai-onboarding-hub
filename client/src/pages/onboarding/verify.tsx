import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import OnboardingLayout from "./layout";
import { CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Client } from "@shared/schema";

export default function Verify() {
  const [_, setLocation] = useLocation();
  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"]
  });

  // Get the most recently created client
  const latestClient = clients ? clients[clients.length - 1] : null;

  return (
    <OnboardingLayout>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold">Verify Your Information</h1>
        </div>

        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Client Name</p>
              <p className="font-medium">{latestClient?.name || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reference ID</p>
              <p className="font-medium">{latestClient?.companyUrl || 'Not provided'}</p>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">API Key</p>
            <p className="font-medium">••••••••{latestClient?.apiKey.slice(-4) || '####'}</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="font-medium">
              {latestClient?.createdAt 
                ? new Date(latestClient.createdAt).toLocaleString()
                : new Date().toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Selected Services</p>
            <ul className="space-y-2">
              {latestClient?.services?.map((service: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={() => setLocation("/onboard/client-info")}>
            Back
          </Button>
          <Button onClick={() => setLocation("/onboard/success")}>
            Confirm & Proceed
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}