import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { IssueCard } from "@/components/issues/IssueCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StudentDashboard = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, categoryFilter, priorityFilter]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const fetchIssues = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("issues")
        .select(`
          *,
          comments:comments(count)
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    if (categoryFilter !== "all") {
      filtered = filtered.filter((issue) => issue.category === categoryFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter);
    }

    setFilteredIssues(filtered);
  };

  const getIssuesByStatus = (status: string) => {
    return filteredIssues.filter((issue) => issue.status === status);
  };

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">My Issues</h2>
            <p className="text-muted-foreground">Manage and track your reported problems</p>
          </div>
          <Button onClick={() => navigate("/issues/new")} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Raise New Issue
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="placement">Placement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your issues...</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                All ({filteredIssues.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({getIssuesByStatus("pending").length})
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                In Progress ({getIssuesByStatus("in_progress").length})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved ({getIssuesByStatus("resolved").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">No issues found. Start by raising a new issue!</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onClick={() => navigate(`/issues/${issue.id}`)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getIssuesByStatus("pending").map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="in_progress" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getIssuesByStatus("in_progress").map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getIssuesByStatus("resolved").map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
