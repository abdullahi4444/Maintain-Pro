import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { requestsAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  ArrowUpRight,
  Clock,
  MapPin,
  Tag,
  FileText,
} from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  ASSIGNED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  IN_PROGRESS: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
  COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "border-slate-500/20",
  MEDIUM: "border-blue-500/20",
  HIGH: "border-orange-500/20",
  URGENT: "border-red-500/30",
};

export function MyRequestsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-requests"],
    queryFn: () => requestsAPI.getMyRequests(),
  });

  const requests = data?.data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage your submitted maintenance requests</p>
        </div>
        <Link to="/app/requests/create">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> New Request
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 stagger-children">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-5 w-3/4 rounded shimmer" />
                  <div className="h-4 w-1/2 rounded shimmer" />
                  <div className="h-4 w-1/3 rounded shimmer" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground">No requests yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Create your first maintenance request to get started</p>
            <Link to="/app/requests/create">
              <Button className="bg-primary text-primary-foreground gap-2">
                <Plus className="h-4 w-4" /> Create Request
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 stagger-children">
          {requests.map((request: any) => {
            const statusStyle = STATUS_COLORS[request.status] || STATUS_COLORS.PENDING;
            const priorityBorder = PRIORITY_COLORS[request.priority] || PRIORITY_COLORS.MEDIUM;

            return (
              <Link key={request.id} to={`/app/requests/${request.id}`}>
                <Card className={`border-border bg-card hover-lift group cursor-pointer border-l-2 ${priorityBorder}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground/80 group-hover:text-foreground transition-colors truncate">
                            {request.title}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${statusStyle.bg} ${statusStyle.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                            {request.status?.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {request.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Tag className="h-3 w-3" /> {request.category}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" /> {request.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-foreground/10 group-hover:text-muted-foreground transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

