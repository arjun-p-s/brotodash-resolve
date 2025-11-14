import { Badge } from "@/components/ui/badge";

type IssueStatus = "pending" | "under_review" | "in_progress" | "resolved" | "closed";

interface StatusBadgeProps {
  status: IssueStatus;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-status-pending text-white",
  },
  under_review: {
    label: "Under Review",
    className: "bg-status-under-review text-white",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-status-in-progress text-white",
  },
  resolved: {
    label: "Resolved",
    className: "bg-status-resolved text-white",
  },
  closed: {
    label: "Closed",
    className: "bg-status-closed text-white",
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};
