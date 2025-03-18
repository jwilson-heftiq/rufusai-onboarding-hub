import { Badge } from "@/components/ui/badge";

export function BetaBadge() {
  return (
    <Badge 
      variant="secondary" 
      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    >
      BETA
    </Badge>
  );
}
