"use client";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, Mail, MessageSquare } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
}

const HeroSection = ({
  title = "AI-Powered Notifications That Convert",
  description = "Create, manage, and automate personalized email and SMS communications with your customers using our advanced AI platform.",
  ctaText = "Get Started",
}: HeroSectionProps) => {
  return (
    <section className="relative w-full min-h-[700px] flex items-center justify-center overflow-hidden bg-background">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20 dark:from-purple-900/10 dark:via-background dark:to-blue-900/10" />

      {/* Floating elements */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        {/* Email notification */}
        <div className="absolute top-1/4 right-[15%] w-64 bg-card rounded-lg p-4 shadow-xl transform rotate-6 opacity-80 dark:opacity-60 animate-[float_8s_ease-in-out_infinite]">
          <div className="flex items-center mb-2">
            <Mail className="w-5 h-5 mr-2 text-blue-500" />
            <div className="text-sm font-medium">New Email Campaign</div>
          </div>
          <div className="text-xs text-muted-foreground">
            Personalized welcome message ready to send to 1,248 new subscribers
          </div>
        </div>

        {/* SMS notification */}
        <div className="absolute bottom-1/3 left-[10%] w-56 bg-card rounded-lg p-4 shadow-xl transform -rotate-3 opacity-80 dark:opacity-60 animate-[float_6s_ease-in-out_infinite_reverse]">
          <div className="flex items-center mb-2">
            <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
            <div className="text-sm font-medium">SMS Alert</div>
          </div>
          <div className="text-xs text-muted-foreground">
            Order #12345 has shipped! Track your package with this link:
            https://track.io/abc123
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-8 py-6 h-auto rounded-full"
          >
            {ctaText}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 px-8 py-6 h-auto rounded-full"
          >
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-4">
            <div className="text-3xl font-bold text-primary mb-1">10M+</div>
            <div className="text-sm text-muted-foreground">
              Messages Delivered Daily
            </div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-primary mb-1">98.7%</div>
            <div className="text-sm text-muted-foreground">Delivery Rate</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-primary mb-1">5,000+</div>
            <div className="text-sm text-muted-foreground">
              Business Customers
            </div>
          </div>
        </div>
      </div>

      {/* Floating animation is handled by Tailwind classes */}
    </section>
  );
};

export default HeroSection;
