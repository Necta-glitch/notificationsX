import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const events = await req.json();

    // Process each event
    for (const event of events) {
      await processEvent(event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing SendGrid webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 },
    );
  }
}

async function processEvent(event: any) {
  const { sg_message_id, event: eventType, timestamp, email } = event;

  if (!sg_message_id || !eventType) {
    console.error("Invalid event data:", event);
    return;
  }

  try {
    // Find the notification in the database
    const { data: notification } = await supabase
      .from("notifications")
      .select("id")
      .eq("type", "email")
      .eq("metadata->sendgrid_message_id", sg_message_id)
      .single();

    if (!notification) {
      console.warn(`No notification found for message ID: ${sg_message_id}`);
      return;
    }

    // Update the notification status based on the event type
    let status;
    switch (eventType) {
      case "delivered":
        status = "delivered";
        break;
      case "open":
        status = "opened";
        break;
      case "click":
        status = "clicked";
        break;
      case "bounce":
      case "dropped":
      case "deferred":
        status = "failed";
        break;
      case "unsubscribe":
        status = "unsubscribed";
        // Also update user preferences
        if (email) {
          await updateUserPreferences(email);
        }
        break;
      default:
        status = eventType;
    }

    // Update the notification in the database
    await supabase
      .from("notifications")
      .update({
        status,
        updated_at: new Date().toISOString(),
        metadata: {
          ...notification.metadata,
          [eventType]: timestamp,
        },
      })
      .eq("id", notification.id);
  } catch (error) {
    console.error(`Error processing event ${event.event}:`, error);
  }
}

async function updateUserPreferences(email: string) {
  try {
    // Find the user by email
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!user) return;

    // Update user preferences to opt out of marketing emails
    await supabase
      .from("user_preferences")
      .update({
        marketing_emails: false,
      })
      .eq("user_id", user.id);
  } catch (error) {
    console.error("Error updating user preferences:", error);
  }
}
