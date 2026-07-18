import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestsAPI, commentsAPI, techniciansAPI } from "@/services/api";
import { API_URL } from "@/services/axios";
import { useAuthStore } from "@/app/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Tag,
  User,
  Send,
  Wrench,
  CheckCircle,
  XCircle,
  Play,
  UserPlus,
  AlertTriangle,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  ASSIGNED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  IN_PROGRESS: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
  COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  LOW: { bg: "bg-slate-500/10", text: "text-slate-400" },
  MEDIUM: { bg: "bg-blue-500/10", text: "text-blue-400" },
  HIGH: { bg: "bg-orange-500/10", text: "text-orange-400" },
  URGENT: { bg: "bg-red-500/10", text: "text-red-400" },
};

const STATUS_STEPS = ["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED"];

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [assignDialog, setAssignDialog] = useState(false);
  const [selectedTechId, setSelectedTechId] = useState("");
  const [statusDialog, setStatusDialog] = useState<string | null>(null);
  const [repairNotes, setRepairNotes] = useState("");
  const [completionImage, setCompletionImage] = useState<File | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["request", id],
    queryFn: () => requestsAPI.getOne(id!),
    enabled: !!id,
  });

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => commentsAPI.getByRequestId(id!),
    enabled: !!id,
  });

  const { data: technicians } = useQuery({
    queryKey: ["technicians"],
    queryFn: () => techniciansAPI.getAll(),
    enabled: user?.role === "ADMIN",
  });

  const addCommentMutation = useMutation({
    mutationFn: (message: string) => commentsAPI.create(id!, { message }),
    onSuccess: () => {
      setCommentText("");
      refetchComments();
      toast.success("Comment added");
    },
    onError: () => toast.error("Failed to add comment"),
  });

  const assignMutation = useMutation({
    mutationFn: (technicianId: string) => requestsAPI.assign(id!, { technicianId }),
    onSuccess: () => {
      toast.success("Technician assigned!");
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      setAssignDialog(false);
    },
    onError: () => toast.error("Failed to assign"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (formData: FormData) => requestsAPI.updateStatus(id!, formData),
    onSuccess: () => {
      toast.success("Status updated!");
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      setStatusDialog(null);
      setRepairNotes("");
      setCompletionImage(null);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const handleStatusUpdate = (status: string) => {
    const formData = new FormData();
    formData.append("status", status);
    if (repairNotes) formData.append("repairNotes", repairNotes);
    if (completionImage) formData.append("completionImage", completionImage);
    updateStatusMutation.mutate(formData);
  };

  const request = data?.data;
  const commentsList = comments?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded shimmer" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="p-8 space-y-4">
                <div className="h-8 w-3/4 rounded shimmer" />
                <div className="h-4 w-full rounded shimmer" />
                <div className="h-4 w-2/3 rounded shimmer" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="h-4 w-full rounded shimmer" />
                <div className="h-4 w-full rounded shimmer" />
                <div className="h-4 w-full rounded shimmer" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h2 className="text-lg font-semibold text-muted-foreground">Request not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-6">This request may have been deleted</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          Go Back
        </Button>
      </div>
    );
  }

  const statusStyle = STATUS_COLORS[request.status] || STATUS_COLORS.PENDING;
  const priorityStyle = PRIORITY_STYLES[request.priority] || PRIORITY_STYLES.MEDIUM;
  const currentStep = STATUS_STEPS.indexOf(request.status);

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{request.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Created {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  const isRejected = request.status === "REJECTED" && index === 0;
                  
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            isRejected
                              ? "bg-red-500/20 text-red-400 ring-2 ring-red-500/30"
                              : isCurrent
                              ? "bg-primary text-primary-foreground ring-2 ring-blue-500/30 shadow-sm"
                              : isCompleted
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-muted/50 text-muted-foreground/50"
                          }`}
                        >
                          {isRejected ? (
                            <XCircle className="h-5 w-5" />
                          ) : isCompleted && !isCurrent ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className={`text-[10px] font-medium mt-2 uppercase tracking-wide ${
                          isCurrent ? "text-blue-400" : isCompleted ? "text-emerald-400/60" : "text-muted-foreground/50"
                        }`}>
                          {step.replace("_", " ")}
                        </span>
                      </div>
                      {index < STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-3 rounded-full ${
                          index < currentStep ? "bg-emerald-500/30" : "bg-muted/70"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{request.description}</p>
            </CardContent>
          </Card>

          {/* Images */}
          {(request.image || request.completionImage) && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" /> Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {request.image && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Issue Photo</p>
                      <img
                        src={request.image.startsWith('http') ? request.image : `${API_URL}${request.image}`}
                        alt="Issue"
                        className="rounded-xl border border-border w-full object-cover max-h-64"
                      />
                    </div>
                  )}
                  {request.completionImage && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Completion Photo</p>
                      <img
                        src={request.completionImage.startsWith('http') ? request.completionImage : `${API_URL}${request.completionImage}`}
                        alt="Completion"
                        className="rounded-xl border border-border w-full object-cover max-h-64"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Repair Notes */}
          {request.repairNotes && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" /> Repair Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{request.repairNotes}</p>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" /> Comments ({commentsList.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {commentsList.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No comments yet. Start the conversation!</p>
                ) : (
                  commentsList.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-foreground">
                          {comment.user?.fullName?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium text-foreground/80">{comment.user?.fullName}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{comment.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold text-foreground">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                  />
                  <Button
                    size="icon"
                    disabled={!commentText.trim()}
                    onClick={() => addCommentMutation.mutate(commentText)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${statusStyle.bg} ${statusStyle.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                  {request.status?.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Priority</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${priorityStyle.bg} ${priorityStyle.text}`}>
                  {request.priority}
                </span>
              </div>
              <div className="h-px bg-muted/70" />
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-foreground/80 ml-auto">{request.category}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="text-foreground/80 ml-auto">{request.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-foreground/80 ml-auto">{new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* People Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground">People</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Requester</p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground/80">{request.requester?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{request.requester?.email}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-muted/70" />

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Technician</p>
                {request.technician ? (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/80">{request.technician.fullName}</p>
                      <p className="text-xs text-muted-foreground">{request.technician.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Not assigned yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          {(user?.role === "ADMIN" || user?.role === "TECHNICIAN") && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" /> Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {user?.role === "ADMIN" && request.status === "PENDING" && (
                  <>
                    <Button
                      className="w-full bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 gap-2 justify-start"
                      onClick={() => setAssignDialog(true)}
                    >
                      <UserPlus className="h-4 w-4" /> Assign Technician
                    </Button>
                    <Button
                      className="w-full bg-red-500/15 text-red-400 hover:bg-red-500/25 gap-2 justify-start"
                      onClick={() => {
                        const formData = new FormData();
                        formData.append("status", "REJECTED");
                        updateStatusMutation.mutate(formData);
                      }}
                    >
                      <XCircle className="h-4 w-4" /> Reject Request
                    </Button>
                  </>
                )}
                {user?.role === "TECHNICIAN" && request.status === "ASSIGNED" && (
                  <Button
                    className="w-full bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 gap-2 justify-start"
                    onClick={() => setStatusDialog("IN_PROGRESS")}
                  >
                    <Play className="h-4 w-4" /> Start Working
                  </Button>
                )}
                {user?.role === "TECHNICIAN" && request.status === "IN_PROGRESS" && (
                  <Button
                    className="w-full bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 gap-2 justify-start"
                    onClick={() => setStatusDialog("COMPLETED")}
                  >
                    <CheckCircle className="h-4 w-4" /> Mark Complete
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription className="text-muted-foreground">Select a technician for this request</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-[300px] overflow-y-auto">
            {technicians?.data?.map((tech: any) => (
              <button
                key={tech.id}
                onClick={() => setSelectedTechId(tech.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
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
            <Button variant="ghost" onClick={() => setAssignDialog(false)} className="text-muted-foreground">Cancel</Button>
            <Button
              onClick={() => selectedTechId && assignMutation.mutate(selectedTechId)}
              disabled={!selectedTechId}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={!!statusDialog} onOpenChange={() => setStatusDialog(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>{statusDialog === "IN_PROGRESS" ? "Start Working" : "Mark as Complete"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {statusDialog === "IN_PROGRESS" ? "Begin work on this request" : "Provide completion details"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Notes</Label>
              <Textarea
                placeholder="Describe the work..."
                value={repairNotes}
                onChange={(e) => setRepairNotes(e.target.value)}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
              />
            </div>
            {statusDialog === "COMPLETED" && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">Completion Photo</Label>
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
            <Button variant="ghost" onClick={() => setStatusDialog(null)} className="text-muted-foreground">Cancel</Button>
            <Button
              onClick={() => statusDialog && handleStatusUpdate(statusDialog)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

