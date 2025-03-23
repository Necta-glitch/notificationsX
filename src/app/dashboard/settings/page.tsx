"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  CreditCard,
  Bell,
  Lock,
  Key,
  Trash,
  LogOut,
  Mail,
  MessageSquare,
  Shield,
  CheckCircle,
} from "lucide-react";
import { getCurrentUser, signOut } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/subscriptions";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    emailNotifications: true,
    marketingEmails: false,
    smsNotifications: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          // Set form data from user metadata
          setFormData({
            firstName: currentUser.user_metadata?.first_name || "",
            lastName: currentUser.user_metadata?.last_name || "",
            email: currentUser.email || "",
            company: currentUser.user_metadata?.company || "",
            emailNotifications:
              currentUser.user_metadata?.email_notifications !== false,
            marketingEmails:
              currentUser.user_metadata?.marketing_emails === true,
            smsNotifications:
              currentUser.user_metadata?.sms_notifications === true,
          });

          // Get subscription plan
          const { success, subscription } = await getUserSubscriptionPlan(
            currentUser.id,
          );
          if (success) {
            setSubscription(subscription);
          }
        }
      } catch (error) {
        console.error("Error loading settings data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveProfile = async () => {
    // In a real app, this would update the user profile
    console.log("Saving profile:", formData);
    // Show success message
    alert("Profile updated successfully");
  };

  const handleDeleteAccount = async () => {
    // In a real app, this would delete the user account
    console.log("Deleting account");
    // Redirect to home page
    window.location.href = "/";
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs
        defaultValue="account"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="account" className="flex items-center">
            <User className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
            <span className="hidden md:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
            <span className="hidden md:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Lock className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center">
            <Key className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
            <span className="hidden md:inline">API</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Your email address is used for login and cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      firstName: user.user_metadata?.first_name || "",
                      lastName: user.user_metadata?.last_name || "",
                      email: user.email || "",
                      company: user.user_metadata?.company || "",
                      emailNotifications:
                        user.user_metadata?.email_notifications !== false,
                      marketingEmails:
                        user.user_metadata?.marketing_emails === true,
                      smsNotifications:
                        user.user_metadata?.sms_notifications === true,
                    })
                  }
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>
                  Manage your account and session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Sign Out</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign out of your current session
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-destructive">
                      Delete Account
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        {subscription?.plan?.name || "Free"} Plan
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {subscription?.plan?.description ||
                          "Basic notification features"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" /> Active
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Plan Features:</h4>
                    <ul className="space-y-1">
                      {subscription?.plan?.features ? (
                        (subscription.plan.features as string[]).map(
                          (feature, index) => (
                            <li
                              key={index}
                              className="text-sm flex items-center"
                            >
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
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      {subscription?.current_period_end ? (
                        <>
                          Your plan renews on{" "}
                          {new Date(
                            subscription.current_period_end * 1000,
                          ).toLocaleDateString()}
                        </>
                      ) : (
                        <>Free plan with limited features</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1">
                    {subscription?.plan?.name === "Free"
                      ? "Upgrade Plan"
                      : "Change Plan"}
                  </Button>
                  {subscription?.plan?.name !== "Free" && (
                    <Button variant="outline" className="flex-1">
                      Manage Billing
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                {subscription?.plan?.name === "Free" ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      You're on the Free plan. Upgrade to add a payment method.
                    </p>
                    <Button className="mt-4">Upgrade Now</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md mr-4 flex items-center justify-center text-white font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">
                            Expires 12/2025
                          </p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your past invoices and billing history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscription?.plan?.name === "Free" ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      No billing history available on the Free plan.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 text-sm font-medium">
                            Date
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Description
                          </th>
                          <th className="text-right p-3 text-sm font-medium">
                            Amount
                          </th>
                          <th className="text-right p-3 text-sm font-medium">
                            Receipt
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3 text-sm">May 1, 2023</td>
                          <td className="p-3 text-sm">Pro Plan - Monthly</td>
                          <td className="p-3 text-sm text-right">$29.00</td>
                          <td className="p-3 text-sm text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                            >
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 text-sm">Apr 1, 2023</td>
                          <td className="p-3 text-sm">Pro Plan - Monthly</td>
                          <td className="p-3 text-sm text-right">$29.00</td>
                          <td className="p-3 text-sm text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                            >
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 text-sm">Mar 1, 2023</td>
                          <td className="p-3 text-sm">Pro Plan - Monthly</td>
                          <td className="p-3 text-sm text-right">$29.00</td>
                          <td className="p-3 text-sm text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                            >
                              Download
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your account via email
                      </p>
                    </div>
                    <Switch
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleToggleChange("emailNotifications", checked)
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        <MessageSquare className="h-4 w-4 inline mr-2" />
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your account via SMS
                      </p>
                    </div>
                    <Switch
                      checked={formData.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleToggleChange("smsNotifications", checked)
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Marketing Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features and promotions
                      </p>
                    </div>
                    <Switch
                      checked={formData.marketingEmails}
                      onCheckedChange={(checked) =>
                        handleToggleChange("marketingEmails", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Change Password</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Protect your account with an additional security layer
                    </p>
                  </div>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions</CardTitle>
                <CardDescription>Manage your active sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 text-sm font-medium">
                          Device
                        </th>
                        <th className="text-left p-3 text-sm font-medium">
                          Location
                        </th>
                        <th className="text-left p-3 text-sm font-medium">
                          Last Active
                        </th>
                        <th className="text-right p-3 text-sm font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-3 text-sm">Chrome on Windows</td>
                        <td className="p-3 text-sm">New York, USA</td>
                        <td className="p-3 text-sm">Now (Current)</td>
                        <td className="p-3 text-sm text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            disabled
                          >
                            Current
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3 text-sm">Safari on iPhone</td>
                        <td className="p-3 text-sm">San Francisco, USA</td>
                        <td className="p-3 text-sm">2 days ago</td>
                        <td className="p-3 text-sm text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-destructive hover:text-destructive"
                          >
                            Sign Out
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3 text-sm">Firefox on Mac</td>
                        <td className="p-3 text-sm">London, UK</td>
                        <td className="p-3 text-sm">1 week ago</td>
                        <td className="p-3 text-sm text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-destructive hover:text-destructive"
                          >
                            Sign Out
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Sign Out All Other Sessions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for programmatic access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium">Live API Key</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use this key for production environments
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value="sk_live_•••••••••••••••••••••••••••••"
                        readOnly
                        className="w-full sm:w-auto font-mono text-sm"
                      />
                      <Button variant="outline" size="sm">
                        Show
                      </Button>
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium">Test API Key</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use this key for testing and development
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value="sk_test_•••••••••••••••••••••••••••••"
                        readOnly
                        className="w-full sm:w-auto font-mono text-sm"
                      />
                      <Button variant="outline" size="sm">
                        Show
                      </Button>
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Key className="mr-2 h-4 w-4" />
                    Rotate API Keys
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>
                  Configure webhook endpoints to receive event notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-medium">Notification Delivery</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        https://example.com/webhooks/notifications
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Active
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Key className="mr-2 h-4 w-4" />
                  Add Webhook Endpoint
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Resources to help you integrate with our API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-md border p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <h3 className="font-medium">API Reference</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete documentation for all API endpoints
                    </p>
                  </div>
                  <div className="rounded-md border p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <h3 className="font-medium">SDK Libraries</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Client libraries for various programming languages
                    </p>
                  </div>
                  <div className="rounded-md border p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <h3 className="font-medium">Webhook Events</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Documentation for all webhook event types
                    </p>
                  </div>
                  <div className="rounded-md border p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <h3 className="font-medium">Code Examples</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sample code for common integration scenarios
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
