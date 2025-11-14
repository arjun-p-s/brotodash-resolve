import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/issues/StatusBadge";
import { PriorityBadge } from "@/components/issues/PriorityBadge";
import { CategoryBadge } from "@/components/issues/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [issue, setIssue] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    checkUserRole();
    fetchIssueDetails();
  }, [id]);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    setCurrentUserId(user.id);

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!roles);
  };

  const fetchIssueDetails = async () => {
    try {
      const { data: issueData, error: issueError } = await supabase
        .from("issues")
        .select(`
          *,
          profiles:student_id(full_name, batch, domain)
        `)
        .eq("id", id)
        .single();

      if (issueError) throw issueError;
      setIssue(issueData);

      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:user_id(full_name)
        `)
        .eq("issue_id", id)
        .order("created_at", { ascending: true });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);
    } catch (error) {
      console.error("Error fetching issue:", error);
      toast({
        title: "Error",
        description: "Failed to load issue details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: "pending" | "under_review" | "in_progress" | "resolved" | "closed") => {
    try {
      const { error } = await supabase
        .from("issues")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setIssue({ ...issue, status: newStatus });
      toast({
        title: "Success",
        description: "Issue status updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          issue_id: id,
          user_id: currentUserId,
          content: newComment,
          is_admin: isAdmin,
        })
        .select(`
          *,
          profiles:user_id(full_name)
        `)
        .single();

      if (error) throw error;

      setComments([...comments, data]);
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole={isAdmin ? "admin" : "student"}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading issue details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!issue) {
    return (
      <DashboardLayout userRole={isAdmin ? "admin" : "student"}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Issue not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={isAdmin ? "admin" : "student"}>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{issue.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-3">
                  <CategoryBadge category={issue.category} />
                  <PriorityBadge priority={issue.priority} />
                  <StatusBadge status={issue.status} />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Reported by: {issue.profiles?.full_name}</p>
                  {issue.profiles?.batch && <p>Batch: {issue.profiles.batch}</p>}
                  {issue.profiles?.domain && <p>Domain: {issue.profiles.domain}</p>}
                  <p className="mt-2">
                    Created {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <Select value={issue.status} onValueChange={handleStatusUpdate}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{issue.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 rounded-lg ${
                  comment.is_admin ? "bg-primary/5 border border-primary/20" : "bg-muted"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {comment.profiles?.full_name}
                      </span>
                      {comment.is_admin && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                          Admin
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}

            <form onSubmit={handleAddComment} className="space-y-3 pt-4 border-t">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button type="submit" disabled={!newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IssueDetail;
