"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Send, Clock, Smartphone, Mail, Wand2 } from "lucide-react";
import NotificationPreview from "./NotificationPreview";

interface InteractiveDemoProps {
  initialTemplate?: string;
  initialSubject?: string;
}

const InteractiveDemo = ({
  initialTemplate = "Hi {{name}}, we're excited to announce our new AI-powered features that will help you create more personalized notifications. Check out our latest blog post to learn more about how these features can improve your customer engagement by up to 35%.",
  initialSubject = "Introducing AI-Powered Personalization",
}: InteractiveDemoProps) => {
  const [notificationType, setNotificationType] = useState<"email" | "sms">(
    "email",
  );
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialTemplate);
  const [useAI, setUseAI] = useState(false);
  const [recipientName, setRecipientName] = useState("John Doe");
  const [recipientContact, setRecipientContact] = useState("+1 (555) 123-4567");

  const handleAIEnhance = () => {
    // Simulate AI enhancement
    if (notificationType === "email") {
      setContent(
        "Hi {{name}}, we're thrilled to share our latest AI-powered features with you! 🚀 Based on your previous engagement, we think you'll particularly enjoy our new personalization tools that can boost customer engagement by up to 35%. Check out our detailed blog post to see how these innovations can transform your notification strategy.",
      );
      setSubject("Exciting News: AI Personalization Just for You");
    } else {
      setContent(
        "Hi {{name}}! 🎉 Our new AI tools are here! Boost engagement by 35% with smart personalization. See how: example.com/ai-features",
      );
    }
    setUseAI(true);
  };

  const aiTemplates = [
    { id: 1, name: "Product Announcement", type: "both" },
    { id: 2, name: "Special Offer", type: "both" },
    { id: 3, name: "Event Reminder", type: "both" },
    { id: 4, name: "Welcome Message", type: "both" },
    { id: 5, name: "Feedback Request", type: "email" },
    { id: 6, name: "Appointment Confirmation", type: "sms" },
  ];

  return (
    <section className="w-full py-20 bg-slate-950 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Create Powerful Notifications in Minutes
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Our intuitive editor makes it easy to craft personalized
            notifications that convert. Try it yourself!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Editor Panel */}
          <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
            <CardContent className="p-6">
              <Tabs
                defaultValue={notificationType}
                onValueChange={(value) =>
                  setNotificationType(value as "email" | "sms")
                }
              >
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="bg-slate-800">
                    <TabsTrigger
                      value="email"
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger
                      value="sms"
                      className="flex items-center gap-2"
                    >
                      <Smartphone className="h-4 w-4" />
                      SMS
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="ai-toggle"
                      className="text-sm text-slate-400"
                    >
                      AI Assist
                    </Label>
                    <Switch
                      id="ai-toggle"
                      checked={useAI}
                      onCheckedChange={setUseAI}
                      className="data-[state=checked]:bg-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="template"
                      className="text-sm text-slate-400 mb-1 block"
                    >
                      AI Templates
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {aiTemplates
                          .filter(
                            (template) =>
                              template.type === "both" ||
                              template.type === notificationType,
                          )
                          .map((template) => (
                            <SelectItem
                              key={template.id}
                              value={template.id.toString()}
                            >
                              {template.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="recipient"
                      className="text-sm text-slate-400 mb-1 block"
                    >
                      Recipient
                    </Label>
                    <Input
                      id="recipient"
                      placeholder="Recipient name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-slate-200 mb-2"
                    />
                    <Input
                      id="contact"
                      placeholder={
                        notificationType === "email"
                          ? "Email address"
                          : "Phone number"
                      }
                      value={recipientContact}
                      onChange={(e) => setRecipientContact(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-slate-200"
                    />
                  </div>

                  <TabsContent value="email" className="space-y-4 mt-0">
                    <div>
                      <Label
                        htmlFor="subject"
                        className="text-sm text-slate-400 mb-1 block"
                      >
                        Subject Line
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Enter subject line"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-slate-200"
                      />
                    </div>
                  </TabsContent>

                  <div>
                    <Label
                      htmlFor="content"
                      className="text-sm text-slate-400 mb-1 block"
                    >
                      Message Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Enter your message content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-slate-200 min-h-[150px]"
                    />
                    <div className="text-xs text-slate-500 mt-1">
                      Use {"{{"} name {"}}"} to personalize with recipient's
                      name
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={handleAIEnhance}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Enhance with AI
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button className="ml-auto bg-indigo-600 hover:bg-indigo-700">
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </Button>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-indigo-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-xl"></div>

            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative z-10">
              <CardContent className="p-0">
                <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="p-6">
                  <NotificationPreview
                    content={content}
                    subject={subject}
                    recipientName={recipientName}
                    recipientPhone={recipientContact}
                    previewMode={notificationType}
                  />
                </div>
              </CardContent>
            </Card>

            {useAI && (
              <div className="mt-6 bg-slate-900 border border-indigo-500/30 rounded-lg p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <h4 className="text-sm font-medium text-indigo-400">
                      AI Enhancement Applied
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    We've optimized your message for better engagement using our
                    AI engine. The content has been enhanced with:
                  </p>
                  <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc list-inside">
                    <li>Personalized greeting</li>
                    <li>Engaging emoji usage</li>
                    <li>Clear call-to-action</li>
                    <li>
                      Optimized length for{" "}
                      {notificationType === "email" ? "email" : "SMS"} format
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
