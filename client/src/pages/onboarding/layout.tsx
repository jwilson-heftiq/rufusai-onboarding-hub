import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { BetaBadge } from "@/components/ui/beta-badge";
import { Logo } from "@/components/ui/logo";
import { PoweredBy } from "@/components/ui/powered-by";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "wouter";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth0();
  const [_, setLocation] = useLocation();

  const handleLogout = () => {
    logout({ 
      logoutParams: {
        returnTo: window.location.origin + "/login"
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-semibold">RufusAI Operations Hub</span>
            <BetaBadge />
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto py-8 px-4">
        <Card className="p-6">
          {children}
        </Card>
      </main>

      <footer className="border-t py-4 px-6">
        <div className="container flex justify-center">
          <PoweredBy />
        </div>
      </footer>
    </div>
  );
}