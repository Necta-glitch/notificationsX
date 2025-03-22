import sgMail from "@sendgrid/mail";
import twilio from "twilio";
import { supabase } from "./supabase";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize Twilio
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

// Helper function to replace template variables
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>,
) {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return result;
}

// Send email notification
export async function sendEmail({
  to,
  subject,
  template,
  variables = {},
  from = "notifications@notifyai.com",
}: {
  to: string;
  subject: string;
  template: string;
  variables?: Record<string, string>;
  from?: string;
}) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SendGrid API key not configured");
  }

  const content = replaceTemplateVariables(template, variables);

  const msg = {
    to,
    from,
    subject,
    html: content,
  };

  try {
    const response = await sgMail.send(msg);

    // Log the notification in the database
    await supabase.from("notifications").insert({
      type: "email",
      recipient: to,
      subject,
      content,
      status: "sent",
      metadata: { sendgrid_response: response[0] },
    });

    return { success: true, response };
  } catch (error) {
    console.error("Error sending email:", error);

    // Log the failed notification
    await supabase.from("notifications").insert({
      type: "email",
      recipient: to,
      subject,
      content,
      status: "failed",
      metadata: { error: JSON.stringify(error) },
    });

    return { success: false, error };
  }
}

// Send SMS notification
export async function sendSMS({
  to,
  template,
  variables = {},
  from = process.env.TWILIO_PHONE_NUMBER,
}: {
  to: string;
  template: string;
  variables?: Record<string, string>;
  from?: string;
}) {
  if (!twilioClient || !from) {
    throw new Error("Twilio not properly configured");
  }

  const content = replaceTemplateVariables(template, variables);

  try {
    const message = await twilioClient.messages.create({
      body: content,
      from,
      to,
    });

    // Log the notification in the database
    await supabase.from("notifications").insert({
      type: "sms",
      recipient: to,
      content,
      status: "sent",
      metadata: { twilio_sid: message.sid },
    });

    return { success: true, message };
  } catch (error) {
    console.error("Error sending SMS:", error);

    // Log the failed notification
    await supabase.from("notifications").insert({
      type: "sms",
      recipient: to,
      content,
      status: "failed",
      metadata: { error: JSON.stringify(error) },
    });

    return { success: false, error };
  }
}

// Schedule a notification
export async function scheduleNotification({
  type,
  recipient,
  subject,
  template,
  variables = {},
  scheduledFor,
  recurring = null,
}: {
  type: "email" | "sms";
  recipient: string;
  subject?: string;
  template: string;
  variables?: Record<string, string>;
  scheduledFor: Date;
  recurring?: "daily" | "weekly" | "monthly" | null;
}) {
  try {
    const { data, error } = await supabase
      .from("scheduled_notifications")
      .insert({
        type,
        recipient,
        subject,
        template,
        variables,
        scheduled_for: scheduledFor.toISOString(),
        recurring,
        status: "pending",
      })
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return { success: false, error };
  }
}

// Get notification statistics
export async function getNotificationStats(
  userId: string,
  dateRange?: { start: Date; end: Date },
) {
  let query = supabase
    .from("notifications")
    .select("type, status, created_at", { count: "exact" });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (dateRange) {
    query = query
      .gte("created_at", dateRange.start.toISOString())
      .lte("created_at", dateRange.end.toISOString());
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching notification stats:", error);
    return { success: false, error };
  }

  // Process the data to get counts by type and status
  const stats = {
    total: count || 0,
    byType: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
  };

  data?.forEach((notification) => {
    // Count by type
    stats.byType[notification.type] =
      (stats.byType[notification.type] || 0) + 1;

    // Count by status
    stats.byStatus[notification.status] =
      (stats.byStatus[notification.status] || 0) + 1;
  });

  return { success: true, stats };
}
