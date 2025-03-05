import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClientSchema } from "@shared/schema";
import OnboardingLayout from "./layout";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/onboarding";
import { useToast } from "@/hooks/use-toast";

export default function ClientInfo() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      name: "",
      companyUrl: "",
      apiKey: "",
      services: ["API Integration", "Data Analytics Dashboard"]
    }
  });

  const mutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      setLocation("/onboard/verify");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive"
      });
    }
  });

  return (
    <OnboardingLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">New Client Onboarding</h1>
        <p className="text-muted-foreground mb-8">
          Please fill in the client information below to begin the onboarding process.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter client name" />
                  </FormControl>
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
                    <Input {...field} placeholder="Enter Rufus reference ID" />
                  </FormControl>
                  <FormDescription>
                    Enter your unique Rufus system reference identifier
                  </FormDescription>
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
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-4">
              <Button variant="outline" onClick={() => setLocation("/onboard/welcome")}>
                Back
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </OnboardingLayout>
  );
}