import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import OnboardingLayout from "./layout";
import { CheckCircle2 } from "lucide-react";

export default function Success() {
  const [_, setLocation] = useLocation();

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
            <p className="font-medium">Acme Corporation</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Company Reference</p>
            <p className="font-medium">ACME-2024</p>
          </div>
          <div className="col-span-2 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">API Key</p>
            <p className="font-medium">••••••••4289</p>
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