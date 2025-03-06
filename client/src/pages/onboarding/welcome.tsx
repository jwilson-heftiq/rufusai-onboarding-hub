import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import OnboardingLayout from "./layout";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export default function Welcome() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: "/onboard/client-info" },
        authorizationParams: {
          connection: 'email',
          prompt: 'login',
        }
      });
    }
  }, [isAuthenticated, loginWithRedirect]);

  const form = useForm({
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = () => {
    setLocation("/onboard/client-info");
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting to login
  }

  return (
    <OnboardingLayout>
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Rufus Labs Onboarding</h1>
        <p className="text-muted-foreground mb-8">
          Streamline your business integration with our seamless onboarding process
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Button type="submit" className="w-full">
              Start Onboarding
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-sm text-muted-foreground">
          Don't have an account? <a href="#" className="text-primary">Contact Sales</a>
        </p>
      </div>
    </OnboardingLayout>
  );
}