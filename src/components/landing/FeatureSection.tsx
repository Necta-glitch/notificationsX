"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Zap,
  BarChart3,
  Layers,
  Globe,
  Lock,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const FeatureCard = ({
  icon = <MessageSquare className="h-6 w-6" />,
  title = "Feature Title",
  description = "Feature description goes here",
  badge,
}: FeatureCardProps) => {
  return (
    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          {badge && (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary text-xs"
            >
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const FeatureSection = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "AI Personalization",
      description:
        "Create hyper-personalized messages that resonate with each recipient using our advanced AI engine.",
      badge: "Popular",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automation Workflows",
      description:
        "Set up trigger-based notification sequences that engage customers at the perfect moment.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description:
        "Gain deep insights into notification performance with comprehensive dashboards and reports.",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Multi-Channel Support",
      description:
        "Seamlessly switch between email and SMS channels or use both in coordinated campaigns.",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Delivery",
      description:
        "Reach customers anywhere with reliable worldwide delivery and automatic time zone optimization.",
      badge: "New",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Enterprise Security",
      description:
        "Rest easy with bank-level encryption, compliance features, and advanced access controls.",
    },
  ];

  return (
    <section className="w-full bg-background py-24" id="features">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Tools for Modern Communication
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Everything you need to create, manage, and optimize your customer
            notifications in one platform.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
