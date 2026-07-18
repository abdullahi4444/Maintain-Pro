import { useQuery } from "@tanstack/react-query";
import { reportsAPI, dashboardAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Download,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-muted border border-border rounded-lg px-4 py-3 shadow-2xl">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm mt-1" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ReportsPage() {
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

  const { data: techPerformance } = useQuery({
    queryKey: ["tech-performance"],
    queryFn: () => dashboardAPI.getTechnicianPerformance(),
  });

  const chartData = monthlyData?.data?.map((count: number, index: number) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index],
    requests: count,
  })) || [];

  const pieData = statusData?.data
    ? Object.entries(statusData.data).map(([key, value]) => ({
      name: key.replace("_", " "),
      value: value as number,
    }))
    : [];

  const techData = techPerformance?.data || [];

  const totalRequests = stats?.data?.totalRequests || 0;
  const completedRequests = stats?.data?.completedRequests || 0;
  const completionRate = totalRequests > 0 ? ((completedRequests / totalRequests) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Analytics and performance overview</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalRequests}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Requests</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Completion Rate</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{techData.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Technicians</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats?.data?.pendingRequests || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Pending Requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Monthly Trend */}
        <Card className="lg:col-span-4 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Monthly Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Request volume over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorReports)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="lg:col-span-3 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Status Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Current distribution</p>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
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

      {/* Technician Performance */}
      {techData.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Technician Performance</CardTitle>
            <p className="text-sm text-muted-foreground">Completed requests by technician</p>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="completed" fill="#10b981" radius={[0, 6, 6, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

