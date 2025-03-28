import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { Plus, Users, Zap, Clock } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { queryClient } from "@/lib/queryClient";
import { BetaBadge } from "@/components/ui/beta-badge";
import { Logo } from "@/components/ui/logo";
import type { Client } from "@shared/schema";

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const { logout } = useAuth0();
  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"]
  });

  const handleLogout = () => {
    queryClient.clear();
    logout({ 
      logoutParams: {
        returnTo: window.location.origin + "/login"
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 container">
          <div className="flex items-center gap-2 flex-1">
            <Logo size="sm" />
            <span className="font-semibold">RufusAI Operations Hub</span>
            <BetaBadge />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setLocation("/onboard/client-info")}>
              <Plus className="mr-2 h-4 w-4" /> Add New Client
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      <main className="container py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Total Clients</h3>
              </div>
              <p className="text-3xl font-bold mt-2">{clients?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Active Integrations</h3>
              </div>
              <p className="text-3xl font-bold mt-2">
                {clients?.filter(c => c.status === 'active').length || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Pending Setup</h3>
              </div>
              <p className="text-3xl font-bold mt-2">
                {clients?.filter(c => c.status === 'pending').length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-lg font-medium mb-4">Recent Clients</h2>
        <Card>
          <CardContent className="py-6">
            <div className="space-y-4">
              {clients && clients.length > 0 ? (
                clients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.companyUrl}</p>
                      </div>
                    </div>
                    <span className={`text-sm ${client.status === 'active' ? 'text-green-500' : 'text-orange-500'}`}>
                      {client.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No clients yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}