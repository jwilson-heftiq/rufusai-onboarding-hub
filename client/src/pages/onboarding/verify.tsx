import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import OnboardingLayout from "./layout";
import { CheckCircle2 } from "lucide-react";

export default function Verify() {
  const [_, setLocation] = useLocation();

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
              <p className="font-medium">Acme Corporation</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Company URL</p>
              <p className="font-medium">www.acmecorp.com</p>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">API Key</p>
            <p className="font-medium">••••••••4289</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="font-medium">{new Date().toLocaleString()}</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Selected Services</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>API Integration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Data Analytics Dashboard</span>
              </li>
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