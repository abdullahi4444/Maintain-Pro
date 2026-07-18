import { useState } from "react";
import { useAuthStore } from "@/app/store";
import { useMutation } from "@tanstack/react-query";
import { usersAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Camera,
  Save,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => usersAPI.updateProfile(data),
    onSuccess: (response) => {
      updateUser(response.data);
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (formData: FormData) => usersAPI.updateAvatar(formData),
    onSuccess: (response) => {
      updateUser(response.data);
      toast.success("Avatar updated!");
      setAvatarFile(null);
    },
    onError: () => toast.error("Failed to update avatar"),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = () => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      updateAvatarMutation.mutate(formData);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const roleColors: Record<string, { bg: string; text: string }> = {
    ADMIN: { bg: "bg-purple-500/15", text: "text-purple-400" },
    TECHNICIAN: { bg: "bg-blue-500/15", text: "text-blue-400" },
    REQUESTER: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  };

  const roleStyle = roleColors[user?.role || "REQUESTER"] || roleColors.REQUESTER;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal information</p>
      </div>

      {/* Avatar Card */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="h-32 bg-primary text-primary-foreground relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <div className="relative group">
              {(avatarPreview || user?.avatar) ? (
                <img
                  src={avatarPreview || getImageUrl(user?.avatar) || ""}
                  alt={user?.fullName}
                  className="h-24 w-24 rounded-2xl object-cover border-4 border-card shadow-2xl"
                />
              ) : (
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500/40 to-purple-500/40 border-4 border-card shadow-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-primary-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{user?.fullName}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${roleStyle.bg} ${roleStyle.text}`}>
                  <Shield className="h-3 w-3" /> {user?.role}
                </span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
            {avatarFile && (
              <Button
                onClick={handleAvatarUpload}
                disabled={updateAvatarMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-sm"
              >
                {updateAvatarMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                Upload Photo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 h-11"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6 h-11 shadow-sm"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Info (read-only) */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" /> Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email</span>
              </div>
              <span className="text-sm text-foreground/80">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Role</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${roleStyle.bg} ${roleStyle.text}`}>
                {user?.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Status</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Member since</span>
              </div>
              <span className="text-sm text-foreground/80">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
