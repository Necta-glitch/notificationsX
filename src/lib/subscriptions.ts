import { supabase } from "./supabase";
import Stripe from "stripe";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null;

// Get user subscription preferences
export async function getUserSubscriptionPreferences(userId: string) {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    console.error("Error fetching user preferences:", error);
    return { success: false, error };
  }

  // If no preferences exist yet, return default values
  if (!data) {
    return {
      success: true,
      preferences: {
        email_notifications: true,
        sms_notifications: false,
        marketing_emails: true,
      },
    };
  }

  return { success: true, preferences: data };
}

// Update user subscription preferences
export async function updateUserSubscriptionPreferences(
  userId: string,
  preferences: {
    email_notifications?: boolean;
    sms_notifications?: boolean;
    marketing_emails?: boolean;
  },
) {
  // Check if preferences already exist
  const { data: existingPrefs } = await supabase
    .from("user_preferences")
    .select("id")
    .eq("user_id", userId)
    .single();

  let result;

  if (existingPrefs) {
    // Update existing preferences
    result = await supabase
      .from("user_preferences")
      .update(preferences)
      .eq("user_id", userId)
      .select();
  } else {
    // Create new preferences
    result = await supabase
      .from("user_preferences")
      .insert({
        user_id: userId,
        ...preferences,
      })
      .select();
  }

  const { data, error } = result;

  if (error) {
    console.error("Error updating user preferences:", error);
    return { success: false, error };
  }

  return { success: true, preferences: data[0] };
}

// Get user subscription plan
export async function getUserSubscriptionPlan(userId: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, plans(name, features, price_monthly, price_yearly)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching subscription:", error);
    return { success: false, error };
  }

  // If no subscription exists, return free plan
  if (!data) {
    const { data: freePlan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("name", "Free")
      .single();

    if (planError) {
      console.error("Error fetching free plan:", planError);
      return { success: false, error: planError };
    }

    return {
      success: true,
      subscription: {
        plan: freePlan,
        status: "active",
        current_period_end: null,
      },
    };
  }

  return { success: true, subscription: data };
}

// Create a checkout session for subscription
export async function createCheckoutSession({
  userId,
  planId,
  successUrl,
  cancelUrl,
  isYearly = false,
}: {
  userId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
  isYearly?: boolean;
}) {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  // Get the plan details
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (planError) {
    console.error("Error fetching plan:", planError);
    return { success: false, error: planError };
  }

  // Get the user details
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("email")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError);
    return { success: false, error: userError };
  }

  try {
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: isYearly
            ? plan.stripe_yearly_price_id
            : plan.stripe_monthly_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planId,
        isYearly: isYearly.toString(),
      },
    });

    return { success: true, sessionId: session.id, url: session.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return { success: false, error };
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    // Update the subscription in the database
    await supabase
      .from("subscriptions")
      .update({
        status: subscription.status,
        canceled_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId);

    return { success: true, subscription };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { success: false, error };
  }
}
