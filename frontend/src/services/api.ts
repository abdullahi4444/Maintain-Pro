import api from "./axios";
import type {
  User,
  MaintenanceRequest,
  Comment,
  Notification,
  ActivityLog,
  DashboardStats,
} from "@/types";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authAPI = {
  login: (data: LoginData) => api.post<AuthResponse>("/auth/login", data),
  register: (data: RegisterData) => api.post<AuthResponse>("/auth/register", data),
  getProfile: () => api.get<User>("/auth/profile"),
};

export const usersAPI = {
  getAll: () => api.get<User[]>("/users"),
  getOne: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: any) => api.post<User>("/users", data),
  update: (id: string, data: any) => api.patch<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  updateProfile: (data: any) => api.patch<User>("/users/profile", data),
  updateAvatar: (formData: FormData) => api.patch<User>("/users/avatar", formData),
};

export const techniciansAPI = {
  getAll: () => api.get<User[]>("/technicians"),
  getOne: (id: string) => api.get<User>(`/technicians/${id}`),
  create: (data: any) => api.post<User>("/technicians", data),
  update: (id: string, data: any) => api.patch<User>(`/technicians/${id}`, data),
  delete: (id: string) => api.delete(`/technicians/${id}`),
};

export const requestsAPI = {
  create: (formData: FormData) => api.post<MaintenanceRequest>("/requests", formData),
  getAll: (params?: any) => api.get("/requests", { params }),
  getMyRequests: (params?: any) => api.get("/requests/my-requests", { params }),
  getAssignedRequests: (params?: any) => api.get("/requests/assigned", { params }),
  getOne: (id: string) => api.get<MaintenanceRequest>(`/requests/${id}`),
  update: (id: string, data: any) => api.patch<MaintenanceRequest>(`/requests/${id}`, data),
  delete: (id: string) => api.delete(`/requests/${id}`),
  assign: (id: string, data: { technicianId: string }) =>
    api.patch<MaintenanceRequest>(`/requests/${id}/assign`, data),
  updateStatus: (id: string, formData: FormData) =>
    api.patch<MaintenanceRequest>(`/requests/${id}/status`, formData),
};

export const commentsAPI = {
  create: (requestId: string, data: { message: string }) =>
    api.post<Comment>(`/comments/request/${requestId}`, data),
  getByRequestId: (requestId: string) =>
    api.get<Comment[]>(`/comments/request/${requestId}`),
  delete: (id: string) => api.delete(`/comments/${id}`),
};

export const notificationsAPI = {
  getAll: (params?: any) => api.get("/notifications", { params }),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/notifications/read-all"),
};

export const dashboardAPI = {
  getStats: () => api.get<DashboardStats>("/dashboard/stats"),
  getRecentRequests: (limit?: number) => api.get("/dashboard/recent-requests", {
    params: { limit },
  }),
  getMonthlyRequests: (year?: number) => api.get("/dashboard/monthly-requests", {
    params: { year },
  }),
  getRequestStatus: () => api.get("/dashboard/request-status"),
  getTechnicianPerformance: () => api.get("/dashboard/technician-performance"),
};

export const reportsAPI = {
  getRequestsReport: (params?: any) => api.get("/reports/requests", { params }),
  getUsersReport: () => api.get("/reports/users"),
  getTechniciansReport: () => api.get("/reports/technicians"),
};

export const activityLogsAPI = {
  getAll: (params?: any) => api.get("/activity-logs", { params }),
};
