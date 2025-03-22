import { supabase } from "./supabase";

// Get all templates
export async function getTemplates(type?: "email" | "sms") {
  let query = supabase.from("templates").select("*");

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query.order("name");

  if (error) {
    console.error("Error fetching templates:", error);
    return { success: false, error };
  }

  return { success: true, templates: data };
}

// Get a single template by ID
export async function getTemplateById(id: string) {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching template:", error);
    return { success: false, error };
  }

  return { success: true, template: data };
}

// Create a new template
export async function createTemplate({
  name,
  type,
  subject,
  content,
  variables = [],
}: {
  name: string;
  type: "email" | "sms";
  subject?: string;
  content: string;
  variables?: string[];
}) {
  const { data, error } = await supabase
    .from("templates")
    .insert({
      name,
      type,
      subject,
      content,
      variables,
    })
    .select();

  if (error) {
    console.error("Error creating template:", error);
    return { success: false, error };
  }

  return { success: true, template: data[0] };
}

// Update an existing template
export async function updateTemplate(
  id: string,
  updates: {
    name?: string;
    subject?: string;
    content?: string;
    variables?: string[];
  },
) {
  const { data, error } = await supabase
    .from("templates")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating template:", error);
    return { success: false, error };
  }

  return { success: true, template: data[0] };
}

// Delete a template
export async function deleteTemplate(id: string) {
  const { error } = await supabase.from("templates").delete().eq("id", id);

  if (error) {
    console.error("Error deleting template:", error);
    return { success: false, error };
  }

  return { success: true };
}
