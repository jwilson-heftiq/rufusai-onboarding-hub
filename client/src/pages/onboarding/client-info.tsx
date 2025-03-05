import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
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
    onError: (error: Error) => {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error creating the client. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      // Error is handled by mutation.onError
      console.error('Form submission error:', error);
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
                  <FormLabel>Company URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://" />
                  </FormControl>
                  <FormDescription>
                    Enter your company's website URL
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

            <div className="flex justify-between gap-4">
              <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                Cancel
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