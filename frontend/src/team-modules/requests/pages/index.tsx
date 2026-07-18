import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { requestsAPI, techniciansAPI } from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserPlus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "bg-amber-500/15", text: "text-amber-400" },
  ASSIGNED: { bg: "bg-blue-500/15", text: "text-blue-400" },
  IN_PROGRESS: { bg: "bg-purple-500/15", text: "text-purple-400" },
  COMPLETED: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  REJECTED: { bg: "bg-red-500/15", text: "text-red-400" },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  LOW: { bg: "bg-slate-500/15", text: "text-slate-400" },
  MEDIUM: { bg: "bg-blue-500/15", text: "text-blue-400" },
  HIGH: { bg: "bg-orange-500/15", text: "text-orange-400" },
  URGENT: { bg: "bg-red-500/15", text: "text-red-400" },
};

export function RequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [assignDialog, setAssignDialog] = useState<string | null>(null);
  const [selectedTechId, setSelectedTechId] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["all-requests", page, statusFilter, search],
    queryFn: () =>
      requestsAPI.getAll({
        page,
        limit: 10,
        status: statusFilter || undefined,
        search: search || undefined,
      }),
  });

  const { data: technicians } = useQuery({
    queryKey: ["technicians"],
    queryFn: () => techniciansAPI.getAll(),
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, technicianId }: { id: string; technicianId: string }) =>
      requestsAPI.assign(id, { technicianId }),
    onSuccess: () => {
      toast.success("Technician assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["all-requests"] });
      setAssignDialog(null);
    },
    onError: () => toast.error("Failed to assign technician"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => requestsAPI.delete(id),
    onSuccess: () => {
      toast.success("Request deleted");
      queryClient.invalidateQueries({ queryKey: ["all-requests"] });
    },
    onError: () => toast.error("Failed to delete request"),
  });

  const requests = data?.data?.data || [];
  const total = data?.data?.meta?.total || 0;
  const totalPages = Math.ceil(total / 10);

  const statuses = ["", "PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "REJECTED"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">All Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and oversee all maintenance requests across the system
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, category, or location..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-blue-500/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((status) => (
                <button
                  key={status || "ALL"}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    statusFilter === status
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted/70 hover:text-muted-foreground"
                  }`}
                >
                  {status || "All"}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Title</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Priority</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Requester</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/50">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 rounded shimmer" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : requests.length === 0 ? (
                <TableRow className="border-border/50">
                  <TableCell colSpan={7} className="text-center py-12">
                    <p className="text-muted-foreground">No requests found</p>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request: any) => {
                  const statusStyle = STATUS_COLORS[request.status] || STATUS_COLORS.PENDING;
                  const priorityStyle = PRIORITY_COLORS[request.priority] || PRIORITY_COLORS.MEDIUM;

                  return (
                    <TableRow
                      key={request.id}
                      className="border-border/50 hover:bg-muted/30 transition-colors group"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                            {request.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{request.location}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{request.category}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase ${priorityStyle.bg} ${priorityStyle.text}`}>
                          {request.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase ${statusStyle.bg} ${statusStyle.text}`}>
                          {request.status?.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{request.requester?.fullName || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/app/requests/${request.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/70">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {request.status === "PENDING" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-400/50 hover:text-blue-400 hover:bg-blue-500/10"
                              onClick={() => setAssignDialog(request.id)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400/30 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => {
                              if (confirm("Delete this request?")) {
                                deleteMutation.mutate(request.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/70 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                    page === p
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <Button
                variant="ghost"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/70 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Assign Dialog */}
      <Dialog open={!!assignDialog} onOpenChange={() => setAssignDialog(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select a technician to handle this request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {technicians?.data?.map((tech: any) => (
              <button
                key={tech.id}
                onClick={() => setSelectedTechId(tech.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  selectedTechId === tech.id
                    ? "bg-blue-500/15 border border-blue-500/30"
                    : "bg-muted/30 border border-border hover:bg-muted/50"
                }`}
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-foreground">{tech.fullName?.charAt(0)}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground/80">{tech.fullName}</p>
                  <p className="text-xs text-muted-foreground">{tech.email}</p>
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setAssignDialog(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (assignDialog && selectedTechId) {
                  assignMutation.mutate({ id: assignDialog, technicianId: selectedTechId });
                }
              }}
              disabled={!selectedTechId}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

