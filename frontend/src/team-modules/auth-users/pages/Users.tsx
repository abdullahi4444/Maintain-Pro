import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  UserPlus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Users as UsersIcon,
  Wrench,
  User,
} from "lucide-react";
import { toast } from "sonner";

const ROLE_STYLES: Record<string, { bg: string; text: string; icon: any }> = {
  ADMIN: { bg: "bg-purple-500/15", text: "text-purple-400", icon: ShieldCheck },
  TECHNICIAN: { bg: "bg-blue-500/15", text: "text-blue-400", icon: Wrench },
  REQUESTER: { bg: "bg-emerald-500/15", text: "text-emerald-400", icon: User },
};

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<any>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "REQUESTER",
  });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => usersAPI.create(data),
    onSuccess: () => {
      toast.success("User created!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setCreateDialog(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create user"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => usersAPI.update(id, data),
    onSuccess: () => {
      toast.success("User updated!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditUser(null);
      resetForm();
    },
    onError: () => toast.error("Failed to update user"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersAPI.delete(id),
    onSuccess: () => {
      toast.success("User deleted!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const resetForm = () => {
    setFormData({ fullName: "", email: "", password: "", phone: "", role: "REQUESTER" });
  };

  const users = (data?.data || []).filter((u: any) =>
    !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleStats = {
    ADMIN: users.filter((u: any) => u.role === "ADMIN").length,
    TECHNICIAN: users.filter((u: any) => u.role === "TECHNICIAN").length,
    REQUESTER: users.filter((u: any) => u.role === "REQUESTER").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system users and their roles</p>
        </div>
        <Button
          onClick={() => { resetForm(); setCreateDialog(true); }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(ROLE_STYLES).map(([role, style]) => (
          <Card key={role} className="border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl ${style.bg} flex items-center justify-center`}>
                <style.icon className={`h-5 w-5 ${style.text}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{roleStats[role as keyof typeof roleStats]}</p>
                <p className="text-xs text-muted-foreground capitalize">{role.toLowerCase()}s</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-blue-500/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">User</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Role</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Phone</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Joined</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><div className="h-4 rounded shimmer" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow className="border-border/50">
                  <TableCell colSpan={6} className="text-center py-12">
                    <p className="text-muted-foreground">No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u: any) => {
                  const roleStyle = ROLE_STYLES[u.role] || ROLE_STYLES.REQUESTER;
                  return (
                    <TableRow key={u.id} className="border-border/50 hover:bg-muted/30 transition-colors group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-foreground/10">
                            <span className="text-sm font-bold text-foreground">{u.fullName?.charAt(0)?.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground/80">{u.fullName}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${roleStyle.bg} ${roleStyle.text}`}>
                          {u.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{u.phone || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-emerald-400" : "bg-red-400"}`} />
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                            onClick={() => {
                              setFormData({
                                fullName: u.fullName,
                                email: u.email,
                                password: "",
                                phone: u.phone || "",
                                role: u.role,
                              });
                              setEditUser(u);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400/30 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => {
                              if (confirm("Delete this user?")) deleteMutation.mutate(u.id);
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
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={createDialog || !!editUser} onOpenChange={() => { setCreateDialog(false); setEditUser(null); resetForm(); }}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>{editUser ? "Edit User" : "Create User"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editUser ? "Update user information" : "Add a new user to the system"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                placeholder="john@example.com"
              />
            </div>
            {!editUser && (
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
            <div className="space-y-2">
              <Label className="text-muted-foreground">Role</Label>
              <div className="grid grid-cols-3 gap-2">
                {["ADMIN", "TECHNICIAN", "REQUESTER"].map((role) => {
                  const style = ROLE_STYLES[role];
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                        formData.role === role
                          ? `${style.bg} ${style.text} border border-current/30`
                          : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted/70"
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setCreateDialog(false); setEditUser(null); resetForm(); }} className="text-muted-foreground">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editUser) {
                  const { password, ...updateData } = formData;
                  updateMutation.mutate({ id: editUser.id, data: updateData });
                } else {
                  createMutation.mutate(formData);
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {editUser ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

