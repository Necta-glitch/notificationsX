"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Mail,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getNotificationStats } from "@/lib/notifications";
import { getUserSubscriptionPlan } from "@/lib/subscriptions";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days");

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

          // Get subscription plan
          const { success: subSuccess, subscription } =
            await getUserSubscriptionPlan(currentUser.id);
          if (subSuccess) {
            setSubscription(subscription);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Default stats if none are available
  const defaultStats = {
    total: 0,
    byType: { email: 0, sms: 0 },
    byStatus: { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0 },
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.user_metadata?.first_name || user?.email}!
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/dashboard/email/new">
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              New Email
            </Button>
          </Link>
          <Link href="/dashboard/sms/new">
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              New SMS
            </Button>
          </Link>
        </div>
      </div>

      {/* Subscription card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Plan</CardTitle>
          <CardDescription>
            {subscription?.plan?.name || "Free"} Plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-medium">
                {subscription?.plan?.name || "Free"} Plan Features:
              </h3>
              <ul className="mt-2 space-y-1">
                {subscription?.plan?.features ? (
                  (subscription.plan.features as string[]).map(
                    (feature, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ),
                  )
                ) : (
                  <>
                    <li className="text-sm flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      100 emails/month
                    </li>
                    <li className="text-sm flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      10 SMS/month
                    </li>
                    <li className="text-sm flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Basic templates
                    </li>
                  </>
                )}
              </ul>
            </div>
            <Link href="/dashboard/settings/billing">
              <Button variant="outline">
                {subscription?.plan?.name === "Free"
                  ? "Upgrade Plan"
                  : "Manage Subscription"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notification Stats</h2>
          <Tabs
            defaultValue="7days"
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <TabsList>
              <TabsTrigger value="7days">7 days</TabsTrigger>
              <TabsTrigger value="30days">30 days</TabsTrigger>
              <TabsTrigger value="90days">90 days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Notifications
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.total}</div>
              <p className="text-xs text-muted-foreground">
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
              <CardTitle className="text-sm font-medium">
                Email Notifications
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayStats.byType.email || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {(
                  ((displayStats.byType.email || 0) /
                    (displayStats.total || 1)) *
                  100
                ).toFixed(0)}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                SMS Notifications
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayStats.byType.sms || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {(
                  ((displayStats.byType.sms || 0) / (displayStats.total || 1)) *
                  100
                ).toFixed(0)}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Active scheduled notifications
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayStats.byStatus.delivered || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {(
                  ((displayStats.byStatus.delivered || 0) /
                    (displayStats.total || 1)) *
                  100
                ).toFixed(0)}
                % delivery rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opened</CardTitle>
              <Mail className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayStats.byStatus.opened || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {(
                  ((displayStats.byStatus.opened || 0) /
                    (displayStats.byStatus.delivered || 1)) *
                  100
                ).toFixed(0)}
                % open rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayStats.byStatus.failed || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {(
                  ((displayStats.byStatus.failed || 0) /
                    (displayStats.total || 1)) *
                  100
                ).toFixed(0)}
                % failure rate
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/templates">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Templates
                </CardTitle>
                <CardDescription>
                  Manage your notification templates
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/scheduled">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Scheduled
                </CardTitle>
                <CardDescription>
                  View and manage scheduled notifications
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/analytics">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analytics
                </CardTitle>
                <CardDescription>
                  View detailed notification analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
