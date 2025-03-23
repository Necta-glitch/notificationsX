"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MessageSquare,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Eye,
  Copy,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { getNotifications } from "@/lib/notifications";

export default function SMSNotifications() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          // Get notifications
          const { success, notifications } = await getNotifications(
            currentUser.id,
            {
              type: "sms",
              status: activeTab !== "all" ? activeTab : undefined,
            },
          );

          if (success) {
            setNotifications(notifications || []);
          }
        }
      } catch (error) {
        console.error("Error loading SMS notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activeTab]);

  // Filter notifications based on search query
  const filteredNotifications = notifications.filter((notification) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      notification.recipient?.toLowerCase().includes(query) ||
      notification.content?.toLowerCase().includes(query) ||
      notification.status?.toLowerCase().includes(query)
    );
  });

  // Mock data for demonstration
  const mockNotifications = [
    {
      id: "sms-1",
      recipient: "+1234567890",
      content: "Your appointment is confirmed for tomorrow at 2 PM.",
      status: "delivered",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "sms-2",
      recipient: "+1987654321",
      content:
        "Your order #12345 has been shipped and will arrive in 2-3 business days.",
      status: "sent",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "sms-3",
      recipient: "+1122334455",
      content: "Your verification code is 123456. It expires in 10 minutes.",
      status: "failed",
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "sms-4",
      recipient: "+1555666777",
      content: "Flash sale! 50% off all items for the next 24 hours. Shop now!",
      status: "scheduled",
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "sms-5",
      recipient: "+1999888777",
      content:
        "Thank you for your purchase! Here's your receipt: https://example.com/receipt/12345",
      status: "delivered",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Use mock data if no real data is available
  const displayNotifications =
    filteredNotifications.length > 0
      ? filteredNotifications
      : mockNotifications;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Delivered
          </Badge>
        );
      case "sent":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Sent
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <XCircle className="mr-1 h-3 w-3" /> Failed
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="mr-1 h-3 w-3" /> Scheduled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
            SMS Notifications
          </h1>
          <p className="text-muted-foreground">
            Manage and track your SMS notifications
          </p>
        </div>

        <Link href="/dashboard/sms/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New SMS
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SMS..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Content
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No SMS notifications found
                    </TableCell>
                  </TableRow>
                ) : (
                  displayNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">
                        {notification.recipient}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {truncateText(notification.content)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(notification.status)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {formatDate(notification.created_at)}
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
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
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

      {/* SMS Usage Card */}
      <Card>
        <CardHeader>
          <CardTitle>SMS Usage</CardTitle>
          <CardDescription>
            Your current SMS usage for this billing period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Used</span>
              <span className="text-sm text-muted-foreground">5 / 100 SMS</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: "5%" }}
              ></div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Your plan resets on{" "}
            {new Date(new Date().setDate(1)).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
