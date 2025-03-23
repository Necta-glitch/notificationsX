"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Mail,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Clock,
  Download,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getNotificationStats } from "@/lib/notifications";

export default function Analytics() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30days");
  const [chartType, setChartType] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          // Get date range based on selected time range
          const end = new Date();
          const start = new Date();

          if (timeRange === "7days") {
            start.setDate(end.getDate() - 7);
          } else if (timeRange === "30days") {
            start.setDate(end.getDate() - 30);
          } else if (timeRange === "90days") {
            start.setDate(end.getDate() - 90);
          }

          // Get notification stats
          const { success, stats } = await getNotificationStats(
            currentUser.id,
            { start, end },
          );
          if (success) {
            setStats(stats);
          }
        }
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [timeRange]);

  // Mock data for demonstration
  const mockStats = {
    total: 1250,
    byType: { email: 850, sms: 400 },
    byStatus: {
      sent: 1250,
      delivered: 1180,
      opened: 620,
      clicked: 310,
      failed: 70,
    },
    dailyStats: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split("T")[0],
        email: Math.floor(Math.random() * 50) + 10,
        sms: Math.floor(Math.random() * 20) + 5,
        delivered: Math.floor(Math.random() * 60) + 20,
        opened: Math.floor(Math.random() * 40) + 10,
        clicked: Math.floor(Math.random() * 20) + 5,
      };
    }),
    topPerforming: [
      {
        id: "camp-1",
        name: "Product Launch",
        type: "email",
        sent: 500,
        delivered: 485,
        opened: 320,
        clicked: 180,
        openRate: 66,
        clickRate: 37,
      },
      {
        id: "camp-2",
        name: "Flash Sale",
        type: "sms",
        sent: 300,
        delivered: 295,
        opened: 0,
        clicked: 95,
        openRate: 0,
        clickRate: 32,
      },
      {
        id: "camp-3",
        name: "Weekly Newsletter",
        type: "email",
        sent: 350,
        delivered: 340,
        opened: 210,
        clicked: 85,
        openRate: 62,
        clickRate: 25,
      },
      {
        id: "camp-4",
        name: "Appointment Reminder",
        type: "sms",
        sent: 100,
        delivered: 98,
        opened: 0,
        clicked: 0,
        openRate: 0,
        clickRate: 0,
      },
    ],
  };

  // Use mock data if no real data is available
  const displayStats = stats || mockStats;

  // Calculate percentage changes (mock data for demonstration)
  const percentageChanges = {
    total: 12.5,
    delivered: 8.3,
    opened: 15.2,
    clicked: -3.7,
  };

  const renderPercentageChange = (value: number) => {
    if (value === 0) return null;

    const isPositive = value > 0;
    return (
      <div
        className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}
      >
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 mr-1" />
        )}
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  };

  // Function to render a simple bar chart using divs
  const renderBarChart = () => {
    // Get the last 14 days of data
    const chartData = displayStats.dailyStats.slice(-14);
    const maxValue = Math.max(
      ...chartData.map((day: any) => {
        if (chartType === "all") return day.email + day.sms;
        if (chartType === "email") return day.email;
        if (chartType === "sms") return day.sms;
        if (chartType === "opened") return day.opened;
        if (chartType === "clicked") return day.clicked;
        return day.delivered;
      }),
    );

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Daily Activity</h3>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="email">Email Only</SelectItem>
              <SelectItem value="sms">SMS Only</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="opened">Opened</SelectItem>
              <SelectItem value="clicked">Clicked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end h-64 gap-1">
          {chartData.map((day: any, index: number) => {
            let value = 0;
            if (chartType === "all") value = day.email + day.sms;
            else if (chartType === "email") value = day.email;
            else if (chartType === "sms") value = day.sms;
            else if (chartType === "opened") value = day.opened;
            else if (chartType === "clicked") value = day.clicked;
            else value = day.delivered;

            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-primary rounded-t-sm"
                  style={{ height: `${height}%` }}
                  title={`${day.date}: ${value}`}
                ></div>
                <div className="text-xs text-muted-foreground mt-2 rotate-45 origin-left">
                  {new Date(day.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track and analyze your notification performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tabs
            defaultValue="30days"
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <TabsList>
              <TabsTrigger value="7days">7 days</TabsTrigger>
              <TabsTrigger value="30days">30 days</TabsTrigger>
              <TabsTrigger value="90days">90 days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Notifications
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{displayStats.total}</div>
              {renderPercentageChange(percentageChanges.total)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {timeRange === "7days"
                ? "Last 7 days"
                : timeRange === "30days"
                  ? "Last 30 days"
                  : "Last 90 days"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {(
                  (displayStats.byStatus.delivered / displayStats.total) *
                  100
                ).toFixed(1)}
                %
              </div>
              {renderPercentageChange(percentageChanges.delivered)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {displayStats.byStatus.delivered} of {displayStats.total}{" "}
              delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {(
                  (displayStats.byStatus.opened / displayStats.byType.email) *
                  100
                ).toFixed(1)}
                %
              </div>
              {renderPercentageChange(percentageChanges.opened)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {displayStats.byStatus.opened} of {displayStats.byType.email}{" "}
              emails opened
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {(
                  (displayStats.byStatus.clicked /
                    displayStats.byStatus.opened) *
                  100
                ).toFixed(1)}
                %
              </div>
              {renderPercentageChange(percentageChanges.clicked)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {displayStats.byStatus.clicked} clicks from{" "}
              {displayStats.byStatus.opened} opens
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Performance</CardTitle>
          <CardDescription>
            Track your notification activity over time
          </CardDescription>
        </CardHeader>
        <CardContent>{renderBarChart()}</CardContent>
      </Card>

      {/* Notification Type Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>
              Breakdown of notifications by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" /> Email
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {displayStats.byType.email} (
                    {(
                      (displayStats.byType.email / displayStats.total) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${(displayStats.byType.email / displayStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-green-500" />{" "}
                    SMS
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {displayStats.byType.sms} (
                    {(
                      (displayStats.byType.sms / displayStats.total) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${(displayStats.byType.sms / displayStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <CardDescription>Notification status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Delivered</span>
                  <span className="text-sm text-muted-foreground">
                    {displayStats.byStatus.delivered} (
                    {(
                      (displayStats.byStatus.delivered / displayStats.total) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(displayStats.byStatus.delivered / displayStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Opened (Email)</span>
                  <span className="text-sm text-muted-foreground">
                    {displayStats.byStatus.opened} (
                    {(
                      (displayStats.byStatus.opened /
                        displayStats.byType.email) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${(displayStats.byStatus.opened / displayStats.byType.email) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Clicked</span>
                  <span className="text-sm text-muted-foreground">
                    {displayStats.byStatus.clicked} (
                    {(
                      (displayStats.byStatus.clicked /
                        displayStats.byStatus.opened) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${(displayStats.byStatus.clicked / displayStats.byStatus.opened) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Failed</span>
                  <span className="text-sm text-muted-foreground">
                    {displayStats.byStatus.failed} (
                    {(
                      (displayStats.byStatus.failed / displayStats.total) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${(displayStats.byStatus.failed / displayStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Campaigns</CardTitle>
          <CardDescription>
            Your best performing notification campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                  <TableHead className="text-right">Delivered</TableHead>
                  <TableHead className="text-right">Open Rate</TableHead>
                  <TableHead className="text-right">Click Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayStats.topPerforming.map((campaign: any) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      {campaign.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {campaign.type === "email" ? (
                          <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        ) : (
                          <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                        )}
                        <span className="capitalize">{campaign.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.sent}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.delivered}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.type === "email"
                        ? `${campaign.openRate}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.clickRate}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
