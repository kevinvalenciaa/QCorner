/*
  # Initial Schema for QCorner Marketplace

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - matches auth.users id
      - `email` (text) - Queen's University email
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    
    - `listings`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `condition` (text)
      - `images` (text[])
      - `seller_id` (uuid, references profiles)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `saved_listings`
      - `user_id` (uuid, references profiles)
      - `listing_id` (uuid, references listings)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL CHECK (email LIKE '%@queensu.ca'),
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create listings table
CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  condition text NOT NULL,
  images text[] NOT NULL,
  seller_id uuid REFERENCES profiles(id) NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_listings table
CREATE TABLE saved_listings (
  user_id uuid REFERENCES profiles(id) NOT NULL,
  listing_id uuid REFERENCES listings(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Listings policies
CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Users can create listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Saved listings policies
CREATE POLICY "Users can view own saved listings"
  ON saved_listings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save listings"
  ON saved_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave listings"
  ON saved_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);