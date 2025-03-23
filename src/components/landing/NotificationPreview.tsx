"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Clock, Check } from "lucide-react";

interface NotificationPreviewProps {
  content?: string;
  subject?: string;
  senderName?: string;
  senderEmail?: string;
  recipientName?: string;
  recipientPhone?: string;
  timestamp?: string;
  previewMode?: "email" | "sms";
}

const NotificationPreview = ({
  content = "Hi {{name}}, we're excited to announce our new AI-powered features that will help you create more personalized notifications. Check out our latest blog post to learn more about how these features can improve your customer engagement by up to 35%.",
  subject = "Introducing AI-Powered Personalization",
  senderName = "Notification Platform",
  senderEmail = "notifications@example.com",
  recipientName = "John Doe",
  recipientPhone = "+1 (555) 123-4567",
  timestamp = "10:45 AM",
  previewMode = "email",
}: NotificationPreviewProps) => {
  const [activeTab, setActiveTab] = useState<"email" | "sms">(previewMode);

  // Replace placeholders with actual values
  const personalizedContent = content.replace(
    "{{name}}",
    recipientName.split(" ")[0],
  );

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 rounded-xl p-3 sm:p-4 shadow-lg">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
          Preview
        </h3>
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as "email" | "sms")}
        >
          <TabsList className="grid w-full max-w-[180px] sm:max-w-[200px] grid-cols-2">
            <TabsTrigger
              value="email"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger
              value="sms"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              SMS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-3 sm:mt-4">
            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 sm:p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-white text-xs sm:text-sm font-medium">
                      {senderName}
                    </div>
                    <div className="text-white/80 text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timestamp}
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-indigo-100">
                      <div className="bg-gradient-to-br from-indigo-400 to-purple-500 h-full w-full flex items-center justify-center text-white font-semibold">
                        {senderName.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                        {senderName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {senderEmail}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1">
                      {subject}
                    </h3>
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {personalizedContent}
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 w-fit"
                    >
                      <Check className="h-3 w-3 mr-1" /> Personalized
                    </Badge>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      To: {recipientName}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="mt-3 sm:mt-4">
            <Card className="bg-slate-100 dark:bg-slate-800 border-0 shadow-md max-w-full sm:max-w-[350px] mx-auto">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 sm:p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-white text-xs sm:text-sm font-medium">
                      SMS Preview
                    </div>
                    <div className="text-white/80 text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timestamp}
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <div className="bg-indigo-500 text-white p-2 sm:p-3 rounded-lg rounded-bl-none mb-2 sm:mb-3 max-w-[85%] text-xs sm:text-sm">
                    {personalizedContent}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-slate-500 dark:text-slate-400 mt-2 gap-1">
                    <div>From: {senderName}</div>
                    <div>To: {recipientPhone}</div>
                  </div>

                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-700">
                    <Badge
                      variant="outline"
                      className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      <Check className="h-3 w-3 mr-1" /> Personalized
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationPreview;
