import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

type IssuePriority = "low" | "medium" | "high";

interface PriorityBadgeProps {
  priority: IssuePriority;
}

const priorityConfig = {
  low: {
    label: "Low",
    className: "bg-priority-low text-white",
    icon: Info,
  },
  medium: {
    label: "Medium",
    className: "bg-priority-medium text-white",
    icon: AlertTriangle,
  },
  high: {
    label: "High",
    className: "bg-priority-high text-white",
    icon: AlertCircle,
  },
};

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  const Icon = config.icon;
  
  return (
    <Badge className={`${config.className} gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
