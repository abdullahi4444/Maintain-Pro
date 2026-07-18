import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/app/store";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  ASSIGNED: "#0ea5e9",
  IN_PROGRESS: "#8b5cf6",
  COMPLETED: "#10b981",
  REJECTED: "#ef4444",
};

const PIE_COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardAPI.getStats(),
  });

  const { data: monthlyData } = useQuery({
    queryKey: ["monthly-requests"],
    queryFn: () => dashboardAPI.getMonthlyRequests(),
  });

  const { data: statusData } = useQuery({
    queryKey: ["request-status"],
    queryFn: () => dashboardAPI.getRequestStatus(),
  });

  const { data: recentRequests } = useQuery({
    queryKey: ["recent-requests"],
    queryFn: () => dashboardAPI.getRecentRequests(5),
  });

  const chartData =
    monthlyData?.data?.map((count: number, index: number) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index],
      requests: count,
    })) || [];

  const pieData = statusData?.data
    ? Object.entries(statusData.data).map(([key, value]) => ({
        name: key.replace("_", " "),
        value: value as number,
      }))
    : [];

  const statCards = [
    {
      label: "Total Requests",
      value: stats?.data?.totalRequests || 0,
      icon: FileText,
      gradient: "from-sky-500/20 to-sky-600/10",
      iconBg: "bg-sky-500/20",
      iconColor: "text-sky-500",
      change: "+12%",
    },
    {
      label: "Pending",
      value: stats?.data?.pendingRequests || 0,
      icon: Clock,
      gradient: "from-amber-500/20 to-amber-600/10",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-500",
      change: "-3%",
    },
    {
      label: "In Progress",
      value: stats?.data?.inProgressRequests || 0,
      icon: Wrench,
      gradient: "from-purple-500/20 to-purple-600/10",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-500",
      change: "+8%",
    },
    {
      label: "Completed",
      value: stats?.data?.completedRequests || 0,
      icon: CheckCircle,
      gradient: "from-emerald-500/20 to-emerald-600/10",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-500",
      change: "+24%",
    },
    {
      label: "Rejected",
      value: stats?.data?.rejectedRequests || 0,
      icon: XCircle,
      gradient: "from-red-500/20 to-red-600/10",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-500",
      change: "-5%",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-muted border border-border rounded-lg px-4 py-3 shadow-2xl">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-sm text-blue-400 mt-1">
            {payload[0].value} requests
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card, i) => (
          <Card key={i} className="border-border overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <div className={`h-10 w-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className={`font-semibold ${card.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{card.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Area Chart */}
        <Card className="lg:col-span-4 border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-foreground">Monthly Overview</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Request trends over the year</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--border))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--border))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    fill="url(#colorRequests)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="lg:col-span-3 border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-foreground">Status Distribution</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Current request status breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(224,50%,10%)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">{entry.name.toLowerCase()}</span>
                  <span className="text-xs font-semibold text-foreground/80 ml-auto">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">Recent Requests</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Latest maintenance submissions</p>
            </div>
            <Link
              to="/app/requests"
              className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentRequests?.data?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">No requests yet</p>
              </div>
            )}
            {recentRequests?.data?.map((request: any, index: number) => (
              <Link
                key={request.id}
                to={`/app/requests/${request.id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-border transition-all duration-200 group"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                    style={{
                      backgroundColor: `${STATUS_COLORS[request.status] || "#3b82f6"}20`,
                      color: STATUS_COLORS[request.status] || "#3b82f6",
                    }}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                      {request.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {request.category} • {request.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: `${STATUS_COLORS[request.status] || "#3b82f6"}15`,
                      color: STATUS_COLORS[request.status] || "#3b82f6",
                    }}
                  >
                    {request.status?.replace("_", " ")}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

