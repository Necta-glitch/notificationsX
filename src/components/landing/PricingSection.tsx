"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";

interface PricingFeature {
  name: string;
  included: boolean | string;
}

interface PricingPlan {
  name: string;
  description: string;
  price: {
    monthly: string;
    annually: string;
  };
  features: PricingFeature[];
  cta: {
    text: string;
    variant?:
      | "default"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | "destructive";
  };
  popular?: boolean;
}

const PricingSection = ({
  title = "Simple, transparent pricing",
  description = "Choose the plan that's right for your business",
  plans = [
    {
      name: "Free",
      description: "Essential tools for small businesses and startups",
      price: {
        monthly: "$0",
        annually: "$0",
      },
      features: [
        { name: "Up to 1,000 email notifications/mo", included: true },
        { name: "Up to 100 SMS notifications/mo", included: true },
        { name: "Basic templates", included: true },
        { name: "Email support", included: true },
        { name: "Basic analytics", included: true },
        { name: "AI personalization", included: false },
        { name: "Advanced automation", included: false },
        { name: "Custom branding", included: false },
        { name: "API access", included: false },
      ],
      cta: {
        text: "Get Started",
        variant: "outline",
      },
    },
    {
      name: "Pro",
      description: "Advanced features for growing businesses",
      price: {
        monthly: "$49",
        annually: "$39",
      },
      features: [
        { name: "Up to 50,000 email notifications/mo", included: true },
        { name: "Up to 5,000 SMS notifications/mo", included: true },
        { name: "Premium templates", included: true },
        { name: "Priority support", included: true },
        { name: "Advanced analytics", included: true },
        { name: "AI personalization", included: true },
        { name: "Advanced automation", included: true },
        { name: "Custom branding", included: true },
        { name: "API access", included: true },
      ],
      cta: {
        text: "Get Started",
        variant: "default",
      },
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large organizations",
      price: {
        monthly: "Custom",
        annually: "Custom",
      },
      features: [
        { name: "Unlimited email notifications", included: true },
        { name: "Unlimited SMS notifications", included: true },
        { name: "Custom templates", included: true },
        { name: "Dedicated support", included: true },
        { name: "Enterprise analytics", included: true },
        { name: "Advanced AI personalization", included: true },
        { name: "Custom automation workflows", included: true },
        { name: "White-labeling", included: true },
        { name: "Full API access", included: true },
        { name: "SLA guarantees", included: "Available" },
      ],
      cta: {
        text: "Contact Sales",
        variant: "secondary",
      },
    },
  ],
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly",
  );

  return (
    <section className="w-full py-24 bg-background" id="pricing">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-[700px]">{description}</p>

          <div className="flex items-center space-x-2 mt-6">
            <span
              className={`text-sm ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <Switch
              checked={billingCycle === "annually"}
              onCheckedChange={(checked) =>
                setBillingCycle(checked ? "annually" : "monthly")
              }
            />
            <span
              className={`text-sm ${billingCycle === "annually" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Annually{" "}
              <span className="text-xs text-emerald-500 font-medium">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col h-full relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {plan.price[billingCycle]}
                  </span>
                  {plan.price[billingCycle] !== "Custom" && (
                    <span className="text-muted-foreground ml-1">/month</span>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included === true ? (
                        <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                      ) : feature.included === false ? (
                        <span className="h-5 w-5 flex items-center justify-center mr-2 shrink-0">
                          —
                        </span>
                      ) : (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
                          {feature.included}
                        </span>
                      )}
                      <span className="text-sm">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.cta.variant || "default"}
                >
                  {plan.cta.text}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
            <br />
            Need a custom solution?{" "}
            <a
              href="#contact"
              className="text-primary underline underline-offset-4"
            >
              Contact our sales team
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
