import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { techniciansAPI } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Search,
  UserPlus,
  Edit,
  Trash2,
  Wrench,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

export function TechniciansPage() {
  const [search, setSearch] = useState("");
  const [editTech, setEditTech] = useState<any>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["technicians"],
    queryFn: () => techniciansAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => techniciansAPI.create(data),
    onSuccess: () => {
      toast.success("Technician created!");
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      setCreateDialog(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create technician"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => techniciansAPI.update(id, data),
    onSuccess: () => {
      toast.success("Technician updated!");
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      setEditTech(null);
      resetForm();
    },
    onError: () => toast.error("Failed to update technician"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => techniciansAPI.delete(id),
    onSuccess: () => {
      toast.success("Technician removed!");
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
    onError: () => toast.error("Failed to remove technician"),
  });

  const resetForm = () => {
    setFormData({ fullName: "", email: "", password: "", phone: "" });
  };

  const technicians = (data?.data || []).filter((t: any) =>
    !search || t.fullName?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Technicians</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your maintenance team</p>
        </div>
        <Button
          onClick={() => { resetForm(); setCreateDialog(true); }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Add Technician
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{technicians.length}</p>
              <p className="text-xs text-muted-foreground">Total Technicians</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {technicians.filter((t: any) => t.isActive).length}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {technicians.filter((t: any) => !t.isActive).length}
              </p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search technicians..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-blue-500/50"
        />
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full shimmer" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 rounded shimmer" />
                    <div className="h-3 w-1/2 rounded shimmer" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : technicians.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Wrench className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground">No technicians</h3>
            <p className="text-sm text-muted-foreground mt-1">Add your first technician to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {technicians.map((tech: any) => (
            <Card key={tech.id} className="border-border bg-card hover-lift group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center ring-2 ring-foreground/10">
                      <span className="text-lg font-bold text-foreground">{tech.fullName?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground/80">{tech.fullName}</p>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase ${
                        tech.isActive ? "text-emerald-400" : "text-red-400"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${tech.isActive ? "bg-emerald-400" : "bg-red-400"}`} />
                        {tech.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground/50 hover:text-foreground hover:bg-muted/70"
                      onClick={() => {
                        setFormData({
                          fullName: tech.fullName,
                          email: tech.email,
                          password: "",
                          phone: tech.phone || "",
                        });
                        setEditTech(tech);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400/20 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm("Remove this technician?")) deleteMutation.mutate(tech.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground/50" />
                    <span className="text-muted-foreground truncate">{tech.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground/50" />
                    <span className="text-muted-foreground">{tech.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
                    <span className="text-muted-foreground">Joined {new Date(tech.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={createDialog || !!editTech} onOpenChange={() => { setCreateDialog(false); setEditTech(null); resetForm(); }}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>{editTech ? "Edit Technician" : "Add Technician"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editTech ? "Update technician details" : "Add a new technician to your team"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                placeholder="jane@example.com"
              />
            </div>
            {!editTech && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Min 6 characters"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setCreateDialog(false); setEditTech(null); resetForm(); }} className="text-muted-foreground">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editTech) {
                  const { password, ...updateData } = formData;
                  updateMutation.mutate({ id: editTech.id, data: updateData });
                } else {
                  createMutation.mutate({ ...formData, role: "TECHNICIAN" });
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {editTech ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

