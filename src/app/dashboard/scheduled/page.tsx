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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Clock,
  Calendar,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Pause,
  Play,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getScheduledNotifications } from "@/lib/notifications";

export default function ScheduledNotifications() {
  const [user, setUser] = useState<any>(null);
  const [scheduledNotifications, setScheduledNotifications] = useState<any[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          // In a real app, this would fetch scheduled notifications
          // For now, we'll use mock data
          const { success, notifications } = {
            success: true,
            notifications: [],
          };
          // const { success, notifications } = await getScheduledNotifications(currentUser.id);

          if (success) {
            setScheduledNotifications(notifications || []);
          }
        }
      } catch (error) {
        console.error("Error loading scheduled notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter notifications based on search query
  const filteredNotifications = scheduledNotifications.filter(
    (notification) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        notification.recipient?.toLowerCase().includes(query) ||
        notification.subject?.toLowerCase().includes(query) ||
        notification.content?.toLowerCase().includes(query) ||
        notification.type?.toLowerCase().includes(query)
      );
    },
  );

  // Mock data for demonstration
  const mockScheduledNotifications = [
    {
      id: "sched-1",
      type: "email",
      recipient: "john.doe@example.com",
      subject: "Weekly Newsletter",
      content:
        "Here's your weekly newsletter with the latest updates and offers.",
      scheduled_for: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "scheduled",
      recurring: "weekly",
    },
    {
      id: "sched-2",
      type: "sms",
      recipient: "+1234567890",
      content: "Reminder: Your appointment is tomorrow at 3 PM.",
      scheduled_for: new Date(
        Date.now() + 1 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "scheduled",
      recurring: null,
    },
    {
      id: "sched-3",
      type: "email",
      recipient: "jane.smith@example.com",
      subject: "Your subscription is about to expire",
      content:
        "Your premium subscription will expire in 3 days. Renew now to avoid interruption.",
      scheduled_for: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "scheduled",
      recurring: null,
    },
    {
      id: "sched-4",
      type: "sms",
      recipient: "+1987654321",
      content:
        "Your order #54321 has been shipped and will arrive in 2-3 business days.",
      scheduled_for: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      status: "paused",
      recurring: null,
    },
    {
      id: "sched-5",
      type: "email",
      recipient: "marketing-list@example.com",
      subject: "Monthly Product Update",
      content: "Check out our new products and special offers for this month!",
      scheduled_for: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "scheduled",
      recurring: "monthly",
    },
  ];

  // Use mock data if no real data is available
  const displayNotifications =
    filteredNotifications.length > 0
      ? filteredNotifications
      : mockScheduledNotifications;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "sms":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Clock className="mr-1 h-3 w-3" /> Scheduled
          </Badge>
        );
      case "paused":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Pause className="mr-1 h-3 w-3" /> Paused
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatScheduledDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (diffDays > 0) {
      return `In ${diffDays} day${diffDays > 1 ? "s" : ""} (${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`;
    } else if (diffHours > 0) {
      return `In ${diffHours} hour${diffHours > 1 ? "s" : ""} (${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`;
    } else {
      const diffMinutes = Math.floor(
        (diffTime % (1000 * 60 * 60)) / (1000 * 60),
      );
      return `In ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} (${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`;
    }
  };

  const getRecurringBadge = (recurring: string | null) => {
    if (!recurring) return null;

    return (
      <Badge
        variant="outline"
        className="ml-2 bg-purple-50 text-purple-700 border-purple-200"
      >
        <Calendar className="mr-1 h-3 w-3" />
        {recurring.charAt(0).toUpperCase() + recurring.slice(1)}
      </Badge>
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
          <h1 className="text-2xl font-bold tracking-tight">
            Scheduled Notifications
          </h1>
          <p className="text-muted-foreground">
            Manage your upcoming scheduled notifications
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scheduled..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Content
                  </TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No scheduled notifications found
                    </TableCell>
                  </TableRow>
                ) : (
                  displayNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getTypeIcon(notification.type)}
                          <span className="ml-2 capitalize">
                            {notification.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {notification.recipient}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {notification.subject ? (
                          <span className="font-medium">
                            {notification.subject}
                          </span>
                        ) : null}
                        {notification.content ? (
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {notification.content}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {formatScheduledDate(notification.scheduled_for)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusBadge(notification.status)}
                          {getRecurringBadge(notification.recurring)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {notification.status === "scheduled" ? (
                              <DropdownMenuItem>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" />
                                Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>Recurring Schedules</CardTitle>
          <CardDescription>
            Notifications that are sent on a regular schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockScheduledNotifications
                  .filter((n) => n.recurring)
                  .map((notification) => (
                    <TableRow key={`recurring-${notification.id}`}>
                      <TableCell>
                        <div className="flex items-center">
                          {getTypeIcon(notification.type)}
                          <span className="ml-2 capitalize">
                            {notification.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {notification.subject || "SMS Notification"}
                      </TableCell>
                      <TableCell className="capitalize">
                        {notification.recurring}
                      </TableCell>
                      <TableCell>
                        {formatScheduledDate(notification.scheduled_for)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause Schedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Schedule
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
