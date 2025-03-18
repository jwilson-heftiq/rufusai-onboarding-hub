import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { BetaBadge } from "@/components/ui/beta-badge";
import { Logo } from "@/components/ui/logo";
import { PoweredBy } from "@/components/ui/powered-by";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="font-semibold">RufusAI Onboarding Hub</span>
          <BetaBadge />
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