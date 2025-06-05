/*
  # Initial Schema for MyContri App

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - name (text)
      - email (text)
      - phone (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - goals
      - id (uuid)
      - user_id (uuid, references profiles)
      - name (text)
      - target_amount (numeric)
      - saved_amount (numeric)
      - target_date (date)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - groups
      - id (uuid)
      - name (text)
      - cycle_amount (numeric)
      - frequency (text)
      - member_limit (int)
      - invite_code (text)
      - next_payout_date (date)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - group_members
      - group_id (uuid, references groups)
      - user_id (uuid, references profiles)
      - has_contributed (boolean)
      - payout_order (int)
      - created_at (timestamp)
      
    - contributions
      - id (uuid)
      - user_id (uuid, references profiles)
      - goal_id (uuid, references goals)
      - amount (numeric)
      - date (timestamp)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own profile
      - Read/write their own goals
      - Read groups they're members of
      - Read/write their own contributions
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create goals table
CREATE TABLE goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  target_amount numeric NOT NULL CHECK (target_amount > 0),
  saved_amount numeric NOT NULL DEFAULT 0 CHECK (saved_amount >= 0),
  target_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create groups table
CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cycle_amount numeric NOT NULL CHECK (cycle_amount > 0),
  frequency text NOT NULL CHECK (frequency IN ('Daily', 'Weekly', 'Monthly')),
  member_limit int NOT NULL CHECK (member_limit > 1),
  invite_code text NOT NULL UNIQUE,
  next_payout_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create group_members table
CREATE TABLE group_members (
  group_id uuid REFERENCES groups ON DELETE CASCADE,
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  has_contributed boolean DEFAULT false,
  payout_order int NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- Create contributions table
CREATE TABLE contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  goal_id uuid REFERENCES goals ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Goals policies
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Groups policies
CREATE POLICY "Users can view groups they're members of"
  ON groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  WITH CHECK (true);

-- Group members policies
CREATE POLICY "Users can view group members for their groups"
  ON group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_id
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join groups"
  ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their contribution status"
  ON group_members FOR UPDATE
  USING (auth.uid() = user_id);

-- Contributions policies
CREATE POLICY "Users can view own contributions"
  ON contributions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contributions"
  ON contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create functions

-- Function to update goal saved amount when contribution is added
CREATE OR REPLACE FUNCTION update_goal_saved_amount()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE goals
  SET saved_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM contributions
    WHERE goal_id = NEW.goal_id
  )
  WHERE id = NEW.goal_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update goal saved amount
CREATE TRIGGER update_goal_saved_amount_trigger
AFTER INSERT OR DELETE ON contributions
FOR EACH ROW
EXECUTE FUNCTION update_goal_saved_amount();

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  code TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;