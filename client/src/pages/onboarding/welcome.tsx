import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import OnboardingLayout from "./layout";

export default function Welcome() {
  const [_, setLocation] = useLocation();
  const form = useForm({
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = () => {
    setLocation("/onboard/client-info");
  };

  return (
    <OnboardingLayout>
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Rufus Labs Onboarding</h1>
        <p className="text-muted-foreground mb-8">
          Streamline your business integration with our seamless onboarding process
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Send Magic Link
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
