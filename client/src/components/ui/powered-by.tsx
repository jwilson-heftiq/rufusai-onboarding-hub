import { cn } from "@/lib/utils";

interface PoweredByProps {
  className?: string;
}

export function PoweredBy({ className }: PoweredByProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span>Powered by</span>
      <img
        src="https://img.propelauth.com/c839d65a-f07b-4ed7-b5e7-36fc9ce25fb9_79cf79a2-8efd-47a8-8230-122c996ce048.png"
        alt="Heftiq Logo"
        className="h-5 object-contain"
      />
    </div>
  );
}
