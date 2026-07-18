export type Role = "ADMIN" | "TECHNICIAN" | "REQUESTER";
export type Status = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: Priority;
  status: Status;
  image?: string;
  completionImage?: string;
  repairNotes?: string;
  requesterId: string;
  technicianId?: string;
  createdAt: string;
  updatedAt: string;
  requester: User;
  technician?: User;
  comments: Comment[];
}

export interface Comment {
  id: string;
  message: string;
  requestId: string;
  userId: string;
  createdAt: string;
  user: User;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  userId: string;
  createdAt: string;
  user: User;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  assignedRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  rejectedRequests: number;
}
