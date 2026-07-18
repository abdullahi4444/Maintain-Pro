import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { requestsAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  ArrowLeft,
  Upload,
  X,
  FileText,
  MapPin,
  Tag,
  AlertTriangle,
  Zap,
  Loader2,
} from "lucide-react";

const createRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

type CreateRequestFormValues = z.infer<typeof createRequestSchema>;

const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "HVAC",
  "Structural",
  "Painting",
  "Cleaning",
  "Security",
  "IT/Network",
  "Furniture",
  "Other",
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low", color: "border-slate-500/30 hover:border-slate-500/50 peer-checked:border-slate-400 peer-checked:bg-slate-500/10", dot: "bg-slate-400" },
  { value: "MEDIUM", label: "Medium", color: "border-blue-500/30 hover:border-blue-500/50 peer-checked:border-blue-400 peer-checked:bg-blue-500/10", dot: "bg-blue-400" },
  { value: "HIGH", label: "High", color: "border-orange-500/30 hover:border-orange-500/50 peer-checked:border-orange-400 peer-checked:bg-orange-500/10", dot: "bg-orange-400" },
  { value: "URGENT", label: "Urgent", color: "border-red-500/30 hover:border-red-500/50 peer-checked:border-red-400 peer-checked:bg-red-500/10", dot: "bg-red-400" },
];

export function CreateRequestPage() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequestFormValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      priority: "MEDIUM",
    },
  });

  const selectedPriority = watch("priority");

  const createRequestMutation = useMutation({
    mutationFn: (formData: FormData) => requestsAPI.create(formData),
    onSuccess: () => {
      toast.success("Request created successfully!");
      navigate("/app/requests/my");
    },
    onError: () => {
      toast.error("Failed to create request");
    },
  });

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageChange(file);
    }
  };

  const onSubmit = (data: CreateRequestFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imageFile) {
      formData.append("image", imageFile);
    }
    createRequestMutation.mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back & Title */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Request</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Submit a new maintenance request</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Title & Description */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" /> Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-muted-foreground text-sm">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  {...register("title")}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 h-11"
                />
                {errors.title && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> {errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-muted-foreground text-sm">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the maintenance issue..."
                  {...register("description")}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 min-h-[120px] resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category & Location */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" /> Location & Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-muted-foreground text-sm">Category</Label>
                  <select
                    id="category"
                    {...register("category")}
                    className="flex h-11 w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    <option value="" className="bg-card">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-card">{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> {errors.category.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-muted-foreground text-sm">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Building A, Room 101"
                    {...register("location")}
                    className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 h-11"
                  />
                  {errors.location && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> {errors.location.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" /> Priority Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRIORITY_OPTIONS.map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      checked={selectedPriority === option.value}
                      onChange={() => setValue("priority", option.value as any)}
                      className="peer sr-only"
                    />
                    <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${option.color}`}>
                      <span className={`h-2 w-2 rounded-full ${option.dot}`} />
                      <span className="text-sm font-medium text-foreground/80">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" /> Photo (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-border">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-foreground hover:bg-black/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                    dragActive
                      ? "border-blue-500/50 bg-blue-500/5"
                      : "border-border hover:border-white/[0.15] bg-muted/30"
                  }`}
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Drop an image here, or <span className="text-blue-400">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageChange(file);
                }}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createRequestMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 h-11 shadow-sm"
            >
              {(isSubmitting || createRequestMutation.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Request"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

