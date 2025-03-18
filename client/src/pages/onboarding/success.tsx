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
          <h1 className="text-2xl font-bold">Client Added Successfully!</h1>
          <p className="text-muted-foreground mt-2">
            The client has been successfully added to our system
          </p>
        </div>

        <Button onClick={() => setLocation("/onboard/client-info")}>
          Add Another Client
        </Button>
      </div>
    </OnboardingLayout>
  );
}