import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="text-center">
            <p className="text-destructive">Authentication Error: {error.message}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Rufus Labs Onboarding</h1>
          </div>
          <p className="text-muted-foreground">
            Sign in to access your client management portal
          </p>
        </div>

        <Button 
          className="w-full" 
          onClick={() => loginWithRedirect()}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in with Auth0"
          )}
        </Button>
      </Card>
    </div>
  );
}