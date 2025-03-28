import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClientSchema, type InsertClient } from "@shared/schema";
import OnboardingLayout from "./layout";
import { useToast } from "@/hooks/use-toast";

export default function ClientInfo() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertClient>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      name: "",
      companyUrl: "",
      apiKey: "",
      services: ["API Integration", "Data Analytics Dashboard"]
    }
  });

  const onSubmit = async (data: InsertClient) => {
    try {
      // Store the form data in sessionStorage for the verify page
      sessionStorage.setItem('pendingClientData', JSON.stringify(data));
      // Redirect to verify page
      setLocation("/onboard/verify");
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <OnboardingLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">New Client Onboarding</h1>
        <p className="text-muted-foreground mb-8">
          Please fill in the client information below to begin the onboarding process.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter client name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Reference</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter reference ID" />
                  </FormControl>
                  <FormDescription>
                    Enter the company's reference identifier (i.e. company url)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </OnboardingLayout>
  );
}