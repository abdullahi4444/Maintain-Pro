import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "@/app/store";
import { LoginPage } from "@/team-modules/auth-users/pages/login";
import { RegisterPage } from "@/team-modules/auth-users/pages/register";
import { DashboardLayout } from "@/app/layouts/dashboard-layout";
import { DashboardPage } from "@/team-modules/dashboard/pages/Dashboard";
import { RequestsPage } from "@/team-modules/requests/pages";
import { MyRequestsPage } from "@/team-modules/requests/pages/my-requests";
import { AssignedRequestsPage } from "@/team-modules/requests/pages/assigned";
import { RequestDetailPage } from "@/team-modules/requests/pages/detail";
import { CreateRequestPage } from "@/team-modules/requests/pages/create";
import { UsersPage } from "@/team-modules/auth-users/pages/Users";
import { TechniciansPage } from "@/team-modules/technicians/pages/Technicians";
import { ReportsPage } from "@/team-modules/notifications-reports/pages/Reports";
import { NotificationsPage } from "@/team-modules/notifications-reports/pages/Notifications";
import { ProfilePage } from "@/team-modules/auth-users/pages/Profile";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <>{children}</>;
}

import { LandingPage } from "@/pages/landing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "requests",
        element: <RequestsPage />,
      },
      {
        path: "requests/my",
        element: <MyRequestsPage />,
      },
      {
        path: "requests/assigned",
        element: <AssignedRequestsPage />,
      },
      {
        path: "requests/create",
        element: <CreateRequestPage />,
      },
      {
        path: "requests/:id",
        element: <RequestDetailPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "technicians",
        element: <TechniciansPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
]);
