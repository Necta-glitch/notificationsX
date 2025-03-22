-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  recipient TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed', 'unsubscribed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL
);

-- Create scheduled_notifications table
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  recipient TEXT NOT NULL,
  subject TEXT,
  template TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  scheduled_for TIMESTAMPTZ NOT NULL,
  recurring TEXT CHECK (recurring IN ('daily', 'weekly', 'monthly')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  result JSONB,
  error TEXT,
  parent_id UUID REFERENCES public.scheduled_notifications(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  sms_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_emails BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  price_monthly INTEGER NOT NULL,
  price_yearly INTEGER NOT NULL,
  stripe_monthly_price_id TEXT,
  stripe_yearly_price_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  is_yearly BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create webhooks table
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events JSONB NOT NULL DEFAULT '[]',
  secret TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create default plans
INSERT INTO public.plans (name, description, features, price_monthly, price_yearly)
VALUES 
  ('Free', 'Basic features for small businesses', '["100 emails/month", "10 SMS/month", "Basic templates", "Email support"]', 0, 0),
  ('Pro', 'Advanced features for growing businesses', '["10,000 emails/month", "1,000 SMS/month", "Advanced templates", "Priority support", "Analytics", "API access"]', 2900, 29900),
  ('Enterprise', 'Enterprise-grade features for large organizations', '["Unlimited emails", "10,000 SMS/month", "Custom templates", "Dedicated support", "Advanced analytics", "API access", "Custom integrations"]', 9900, 99900)
ON CONFLICT (name) DO NOTHING;

-- Create default email templates
INSERT INTO public.templates (name, type, subject, content, variables)
VALUES 
  ('Welcome Email', 'email', 'Welcome to NotifyAI!', '<h1>Welcome to NotifyAI, {{name}}!</h1><p>Thank you for signing up. We''re excited to have you on board.</p><p>With NotifyAI, you can create, manage, and automate personalized email and SMS communications with your customers.</p><p>Get started by exploring our features or checking out our documentation.</p><p>Best regards,<br>The NotifyAI Team</p>', '["name"]'),
  ('Password Reset', 'email', 'Reset Your Password', '<h1>Password Reset Request</h1><p>Hello {{name}},</p><p>We received a request to reset your password. Click the link below to reset it:</p><p><a href="{{reset_link}}">Reset Password</a></p><p>If you didn''t request this, please ignore this email.</p><p>Best regards,<br>The NotifyAI Team</p>', '["name", "reset_link"]'),
  ('Order Confirmation', 'email', 'Your Order Confirmation #{{order_id}}', '<h1>Order Confirmation</h1><p>Hello {{name}},</p><p>Thank you for your order! Your order #{{order_id}} has been confirmed and is being processed.</p><p>Order Details:</p><ul>{{order_items}}</ul><p>Total: ${{total}}</p><p>Best regards,<br>The NotifyAI Team</p>', '["name", "order_id", "order_items", "total"]'),
  ('Welcome SMS', 'sms', NULL, 'Welcome to NotifyAI, {{name}}! Thank you for signing up. Reply STOP to unsubscribe.', '["name"]'),
  ('Order Status SMS', 'sms', NULL, 'Your order #{{order_id}} status: {{status}}. Track at: {{tracking_link}}', '["order_id", "status", "tracking_link"]')
ON CONFLICT DO NOTHING;

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Templates are readable by all authenticated users
DROP POLICY IF EXISTS "Templates are readable by authenticated users" ON public.templates;
CREATE POLICY "Templates are readable by authenticated users" ON public.templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create and manage their own templates
DROP POLICY IF EXISTS "Users can manage own templates" ON public.templates;
CREATE POLICY "Users can manage own templates" ON public.templates
  FOR ALL USING (auth.uid() = created_by);

-- Users can read their own notifications
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own scheduled notifications
DROP POLICY IF EXISTS "Users can manage own scheduled notifications" ON public.scheduled_notifications;
CREATE POLICY "Users can manage own scheduled notifications" ON public.scheduled_notifications
  FOR ALL USING (auth.uid() = user_id);

-- Users can manage their own preferences
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Plans are readable by all
DROP POLICY IF EXISTS "Plans are readable by all" ON public.plans;
CREATE POLICY "Plans are readable by all" ON public.plans
  FOR SELECT USING (true);

-- Users can read their own subscriptions
DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can read own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own webhooks
DROP POLICY IF EXISTS "Users can manage own webhooks" ON public.webhooks;
CREATE POLICY "Users can manage own webhooks" ON public.webhooks
  FOR ALL USING (auth.uid() = user_id);

-- Enable realtime for notifications
alter publication supabase_realtime add table notifications;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (NEW.id, NEW.email, '', '', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
