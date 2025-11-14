import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { CategoryBadge } from "./CategoryBadge";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";

interface IssueCardProps {
  issue: {
    id: string;
    title: string;
    description: string;
    category: "technical" | "hostel" | "hr" | "placement" | "other";
    priority: "low" | "medium" | "high";
    status: "pending" | "under_review" | "in_progress" | "resolved" | "closed";
    created_at: string;
    comments?: { count: number }[];
  };
  onClick: () => void;
}

export const IssueCard = ({ issue, onClick }: IssueCardProps) => {
  const commentCount = issue.comments?.[0]?.count || 0;

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1">{issue.title}</h3>
          <StatusBadge status={issue.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {issue.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category={issue.category} />
          <PriorityBadge priority={issue.priority} />
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex items-center justify-between pt-3">
        <span>
          {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
        </span>
        {commentCount > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{commentCount}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
