import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { BetaBadge } from "@/components/ui/beta-badge";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          <span className="font-semibold">Rufus Labs Onboarding</span>
          <BetaBadge />
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto py-8 px-4">
        <Card className="p-6">
          {children}
        </Card>
      </main>
    </div>
  );
}