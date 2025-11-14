import { Badge } from "@/components/ui/badge";
import { Code, Home, Users, Briefcase, MoreHorizontal } from "lucide-react";

type IssueCategory = "technical" | "hostel" | "hr" | "placement" | "other";

interface CategoryBadgeProps {
  category: IssueCategory;
}

const categoryConfig = {
  technical: {
    label: "Technical",
    icon: Code,
  },
  hostel: {
    label: "Hostel",
    icon: Home,
  },
  hr: {
    label: "HR",
    icon: Users,
  },
  placement: {
    label: "Placement",
    icon: Briefcase,
  },
  other: {
    label: "Other",
    icon: MoreHorizontal,
  },
};

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const config = categoryConfig[category];
  const Icon = config.icon;
  
  return (
    <Badge variant="outline" className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
