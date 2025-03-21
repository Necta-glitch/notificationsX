import React from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import InteractiveDemo from "@/components/landing/InteractiveDemo";
import FeatureSection from "@/components/landing/FeatureSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <HeroSection
          title="AI-Powered Notifications That Convert"
          description="Create, manage, and automate personalized email and SMS communications with your customers using our advanced AI platform."
          ctaText="Get Started"
        />
        <InteractiveDemo
          initialTemplate="Hi {{name}}, we're excited to announce our new AI-powered features that will help you create more personalized notifications. Check out our latest blog post to learn more about how these features can improve your customer engagement by up to 35%."
          initialSubject="Introducing AI-Powered Personalization"
        />
        <FeatureSection />
        <PricingSection
          title="Simple, transparent pricing"
          description="Choose the plan that's right for your business"
        />
      </main>
      <Footer />
    </div>
  );
}
