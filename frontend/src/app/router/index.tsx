import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuthStore } from "@/app/store";

// Lazy load all pages for better performance
const LoginPage = lazy(() => import("@/team-modules/auth-users/pages/login").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("@/team-modules/auth-users/pages/register").then(m => ({ default: m.RegisterPage })));
const DashboardLayout = lazy(() => import("@/app/layouts/dashboard-layout").then(m => ({ default: m.DashboardLayout })));
const DashboardPage = lazy(() => import("@/team-modules/dashboard/pages/Dashboard").then(m => ({ default: m.DashboardPage })));
const RequestsPage = lazy(() => import("@/team-modules/requests/pages").then(m => ({ default: m.RequestsPage })));
const MyRequestsPage = lazy(() => import("@/team-modules/requests/pages/my-requests").then(m => ({ default: m.MyRequestsPage })));
const AssignedRequestsPage = lazy(() => import("@/team-modules/requests/pages/assigned").then(m => ({ default: m.AssignedRequestsPage })));
const RequestDetailPage = lazy(() => import("@/team-modules/requests/pages/detail").then(m => ({ default: m.RequestDetailPage })));
const CreateRequestPage = lazy(() => import("@/team-modules/requests/pages/create").then(m => ({ default: m.CreateRequestPage })));
const UsersPage = lazy(() => import("@/team-modules/auth-users/pages/Users").then(m => ({ default: m.UsersPage })));
const TechniciansPage = lazy(() => import("@/team-modules/technicians/pages/Technicians").then(m => ({ default: m.TechniciansPage })));
const ReportsPage = lazy(() => import("@/team-modules/notifications-reports/pages/Reports").then(m => ({ default: m.ReportsPage })));
const NotificationsPage = lazy(() => import("@/team-modules/notifications-reports/pages/Notifications").then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import("@/team-modules/auth-users/pages/Profile").then(m => ({ default: m.ProfilePage })));
const LandingPage = lazy(() => import("@/pages/landing").then(m => ({ default: m.LandingPage })));

// Loading fallback component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <LoginPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <RegisterPage />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "requests",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <RequestsPage />
          </Suspense>
        ),
      },
      {
        path: "requests/my",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <MyRequestsPage />
          </Suspense>
        ),
      },
      {
        path: "requests/assigned",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AssignedRequestsPage />
          </Suspense>
        ),
      },
      {
        path: "requests/create",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CreateRequestPage />
          </Suspense>
        ),
      },
      {
        path: "requests/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <RequestDetailPage />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UsersPage />
          </Suspense>
        ),
      },
      {
        path: "technicians",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TechniciansPage />
          </Suspense>
        ),
      },
      {
        path: "reports",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ReportsPage />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NotificationsPage />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
]);
