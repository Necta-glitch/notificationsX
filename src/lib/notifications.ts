import { supabase } from "./supabase";

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

// Mock email notification for front-end only
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
  const content = replaceTemplateVariables(template, variables);

  try {
    // Log the notification in the database
    await supabase.from("notifications").insert({
      type: "email",
      recipient: to,
      subject,
      content,
      status: "sent",
      metadata: { frontend_only: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error logging email:", error);

    // Log the failed notification
    await supabase.from("notifications").insert({
      type: "email",
      recipient: to,
      subject,
      content,
      status: "failed",
      metadata: { error: JSON.stringify(error), frontend_only: true },
    });

    return { success: false, error };
  }
}

// Mock SMS notification for front-end only
export async function sendSMS({
  to,
  template,
  variables = {},
  from = "12345678901",
}: {
  to: string;
  template: string;
  variables?: Record<string, string>;
  from?: string;
}) {
  const content = replaceTemplateVariables(template, variables);

  try {
    // For demo purposes, create a mock message ID
    const mockMessageId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Log the notification in the database
    await supabase.from("notifications").insert({
      type: "sms",
      recipient: to,
      content,
      status: "sent",
      metadata: { mock_message_id: mockMessageId, frontend_only: true },
    });

    return { success: true, message: { id: mockMessageId } };
  } catch (error) {
    console.error("Error logging SMS:", error);

    // Log the failed notification
    await supabase.from("notifications").insert({
      type: "sms",
      recipient: to,
      content,
      status: "failed",
      metadata: { error: JSON.stringify(error), frontend_only: true },
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
