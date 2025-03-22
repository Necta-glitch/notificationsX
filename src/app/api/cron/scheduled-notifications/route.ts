import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail, sendSMS } from "@/lib/notifications";

// This endpoint should be called by a cron job every minute
export async function GET(req: NextRequest) {
  // Check for API key for security
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.CRON_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all scheduled notifications that are due
    const now = new Date();
    const { data: scheduledNotifications, error } = await supabase
      .from("scheduled_notifications")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_for", now.toISOString())
      .limit(100);

    if (error) {
      throw error;
    }

    if (!scheduledNotifications || scheduledNotifications.length === 0) {
      return NextResponse.json({ message: "No notifications to process" });
    }

    const results = [];

    // Process each scheduled notification
    for (const notification of scheduledNotifications) {
      try {
        // Send the notification
        let result;
        if (notification.type === "email") {
          result = await sendEmail({
            to: notification.recipient,
            subject: notification.subject || "Notification",
            template: notification.template,
            variables: notification.variables || {},
          });
        } else if (notification.type === "sms") {
          result = await sendSMS({
            to: notification.recipient,
            template: notification.template,
            variables: notification.variables || {},
          });
        }

        // Update the scheduled notification status
        await supabase
          .from("scheduled_notifications")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            result: result,
          })
          .eq("id", notification.id);

        // If it's a recurring notification, schedule the next one
        if (notification.recurring) {
          await scheduleNextRecurring(notification);
        }

        results.push({
          id: notification.id,
          success: true,
        });
      } catch (error) {
        console.error(
          `Error processing notification ${notification.id}:`,
          error,
        );

        // Update the notification status to failed
        await supabase
          .from("scheduled_notifications")
          .update({
            status: "failed",
            error: JSON.stringify(error),
          })
          .eq("id", notification.id);

        results.push({
          id: notification.id,
          success: false,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Error processing scheduled notifications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function scheduleNextRecurring(notification: any) {
  const scheduledFor = new Date(notification.scheduled_for);
  let nextDate = new Date(scheduledFor);

  // Calculate the next date based on the recurring pattern
  switch (notification.recurring) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      return; // Unknown recurring pattern
  }

  // Create a new scheduled notification
  await supabase.from("scheduled_notifications").insert({
    type: notification.type,
    recipient: notification.recipient,
    subject: notification.subject,
    template: notification.template,
    variables: notification.variables,
    scheduled_for: nextDate.toISOString(),
    recurring: notification.recurring,
    status: "pending",
    parent_id: notification.id,
  });
}
