import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <img
      src="https://images.squarespace-cdn.com/content/v1/601ea5c30e199f09c486bb76/1612621596742-A7Y4QPXURWM62J68PD43/red+stripe+logo-01.png?format=1500w"
      alt="RufusAI Logo"
      className={cn(sizeClasses[size], "object-contain", className)}
    />
  );
}
