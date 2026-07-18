import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { requestsAPI } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Tag,
  ClipboardList,
  Play,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  ASSIGNED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  IN_PROGRESS: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
  COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
};

export function AssignedRequestsPage() {
  const [updateDialog, setUpdateDialog] = useState<{ id: string; status: string } | null>(null);
  const [repairNotes, setRepairNotes] = useState("");
  const [completionImage, setCompletionImage] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["assigned-requests"],
    queryFn: () => requestsAPI.getAssignedRequests(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      requestsAPI.updateStatus(id, formData),
    onSuccess: () => {
      toast.success("Status updated!");
      queryClient.invalidateQueries({ queryKey: ["assigned-requests"] });
      setUpdateDialog(null);
      setRepairNotes("");
      setCompletionImage(null);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const handleStatusUpdate = () => {
    if (!updateDialog) return;
    const formData = new FormData();
    formData.append("status", updateDialog.status);
    if (repairNotes) formData.append("repairNotes", repairNotes);
    if (completionImage) formData.append("completionImage", completionImage);
    updateStatusMutation.mutate({ id: updateDialog.id, formData });
  };

  const requests = data?.data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assigned to Me</h1>
        <p className="text-sm text-muted-foreground mt-1">Requests assigned to you for maintenance work</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 stagger-children">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-5 w-3/4 rounded shimmer" />
                  <div className="h-4 w-1/2 rounded shimmer" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground">No assigned requests</h3>
            <p className="text-sm text-muted-foreground mt-1">You'll see requests here when they're assigned to you</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 stagger-children">
          {requests.map((request: any) => {
            const statusStyle = STATUS_COLORS[request.status] || STATUS_COLORS.ASSIGNED;

            return (
              <Card key={request.id} className="border-border bg-card group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/app/requests/${request.id}`}
                          className="font-semibold text-foreground/80 hover:text-foreground transition-colors truncate"
                        >
                          {request.title}
                        </Link>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${statusStyle.bg} ${statusStyle.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                          {request.status?.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{request.description}</p>
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

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {request.status === "ASSIGNED" && (
                        <Button
                          size="sm"
                          onClick={() => setUpdateDialog({ id: request.id, status: "IN_PROGRESS" })}
                          className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 gap-1.5 text-xs"
                        >
                          <Play className="h-3 w-3" /> Start
                        </Button>
                      )}
                      {request.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          onClick={() => setUpdateDialog({ id: request.id, status: "COMPLETED" })}
                          className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 gap-1.5 text-xs"
                        >
                          <CheckCircle className="h-3 w-3" /> Complete
                        </Button>
                      )}
                      <Link to={`/app/requests/${request.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Status Update Dialog */}
      <Dialog open={!!updateDialog} onOpenChange={() => setUpdateDialog(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>
              {updateDialog?.status === "IN_PROGRESS" ? "Start Working" : "Mark as Complete"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {updateDialog?.status === "IN_PROGRESS"
                ? "This will move the request to 'In Progress' status"
                : "Provide completion details and notes"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Repair Notes</Label>
              <Textarea
                placeholder="Describe the work done..."
                value={repairNotes}
                onChange={(e) => setRepairNotes(e.target.value)}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
              />
            </div>
            {updateDialog?.status === "COMPLETED" && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">Completion Photo (optional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCompletionImage(e.target.files?.[0] || null)}
                  className="bg-muted/50 border-border text-muted-foreground"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUpdateDialog(null)} className="text-muted-foreground hover:text-foreground">
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {updateDialog?.status === "IN_PROGRESS" ? "Start Working" : "Mark Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

