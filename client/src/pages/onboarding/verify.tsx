import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import OnboardingLayout from "./layout";
import { CheckCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/onboarding";
import type { InsertClient } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export default function Verify() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { getAccessTokenSilently } = useAuth0();
  const [pendingClient, setPendingClient] = useState<InsertClient | null>(null);

  useEffect(() => {
    // Load the pending client data from sessionStorage
    const savedData = sessionStorage.getItem('pendingClientData');
    if (savedData) {
      setPendingClient(JSON.parse(savedData));
    } else {
      // If no data is found, redirect back to the form
      setLocation("/onboard/client-info");
    }
  }, [setLocation]);

  const mutation = useMutation({
    mutationFn: async (data: InsertClient) => {
      const token = await getAccessTokenSilently();
      return createClient(data, token);
    },
    onSuccess: () => {
      // Clear the pending data
      sessionStorage.removeItem('pendingClientData');
      setLocation("/onboard/success");
    },
    onError: (error: Error) => {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error creating the client. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleConfirm = async () => {
    if (!pendingClient) {
      toast({
        title: "Error",
        description: "No client data found to submit",
        variant: "destructive"
      });
      return;
    }

    try {
      await mutation.mutateAsync(pendingClient);
    } catch (error) {
      // Error will be handled by mutation.onError
    }
  };

  if (!pendingClient) {
    return (
      <OnboardingLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </OnboardingLayout>
    );
  }

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
              <p className="font-medium">{pendingClient.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reference ID</p>
              <p className="font-medium">{pendingClient.companyUrl}</p>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">API Key</p>
            <p className="font-medium">••••••••{pendingClient.apiKey.slice(-4)}</p>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={() => setLocation("/onboard/client-info")}>
            Back
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Confirm & Proceed"}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}