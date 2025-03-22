import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const messageId = formData.get("MessageSid") as string;
    const status = formData.get("MessageStatus") as string;
    const to = formData.get("To") as string;

    if (!messageId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Find the notification in the database
    const { data: notification } = await supabase
      .from("notifications")
      .select("id, metadata")
      .eq("type", "sms")
      .eq("metadata->twilio_sid", messageId)
      .single();

    if (!notification) {
      console.warn(`No notification found for message ID: ${messageId}`);
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 },
      );
    }

    // Map Twilio status to our status
    let notificationStatus;
    switch (status) {
      case "delivered":
        notificationStatus = "delivered";
        break;
      case "sent":
        notificationStatus = "sent";
        break;
      case "failed":
      case "undelivered":
        notificationStatus = "failed";
        break;
      default:
        notificationStatus = status;
    }

    // Update the notification in the database
    await supabase
      .from("notifications")
      .update({
        status: notificationStatus,
        updated_at: new Date().toISOString(),
        metadata: {
          ...notification.metadata,
          status_update: status,
          status_updated_at: new Date().toISOString(),
        },
      })
      .eq("id", notification.id);

    // If the message failed, update user preferences
    if (notificationStatus === "failed" && to) {
      await updateUserPreferences(to);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Twilio webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 },
    );
  }
}

async function updateUserPreferences(phoneNumber: string) {
  try {
    // Find the user by phone number
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phoneNumber)
      .single();

    if (!user) return;

    // Update user preferences to opt out of SMS
    await supabase
      .from("user_preferences")
      .update({
        sms_notifications: false,
      })
      .eq("user_id", user.id);
  } catch (error) {
    console.error("Error updating user preferences:", error);
  }
}
