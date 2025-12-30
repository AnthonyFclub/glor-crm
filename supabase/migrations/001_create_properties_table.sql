-- Properties Table Migration for GLOR CRM
-- Run this in the Supabase SQL Editor

-- Create enum types if they don't exist
DO $$ BEGIN
    CREATE TYPE property_type AS ENUM ('casa', 'departamento', 'terreno', 'local_comercial', 'oficina');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE operation_type AS ENUM ('venta', 'renta', 'venta_renta');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE property_status AS ENUM ('disponible', 'vendida', 'rentada', 'en_proceso');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info
    title TEXT NOT NULL,
    property_type property_type NOT NULL,
    operation_type operation_type NOT NULL,
    description TEXT,
    status property_status DEFAULT 'disponible',
    
    -- Pricing
    price_mxn NUMERIC NOT NULL CHECK (price_mxn > 0),
    price_usd NUMERIC,
    show_price BOOLEAN DEFAULT true,
    commission_percentage NUMERIC CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    
    -- Characteristics
    bedrooms INTEGER CHECK (bedrooms >= 0),
    bathrooms INTEGER CHECK (bathrooms >= 0),
    half_bathrooms INTEGER CHECK (half_bathrooms >= 0),
    parking_spaces INTEGER CHECK (parking_spaces >= 0),
    construction_m2 NUMERIC CHECK (construction_m2 >= 0),
    land_m2 NUMERIC CHECK (land_m2 >= 0),
    year_built INTEGER CHECK (year_built >= 1800 AND year_built <= EXTRACT(YEAR FROM CURRENT_DATE) + 5),
    
    -- Location
    country TEXT DEFAULT 'México',
    state TEXT,
    city TEXT,
    neighborhood TEXT,
    street TEXT,
    postal_code TEXT,
    show_exact_location BOOLEAN DEFAULT false,
    
    -- Amenities (JSONB array of strings)
    amenities JSONB DEFAULT '[]'::jsonb,
    
    -- Collaboration
    is_exclusive BOOLEAN DEFAULT false,
    shared_commission BOOLEAN DEFAULT true,
    commission_split_percentage NUMERIC DEFAULT 50 CHECK (commission_split_percentage >= 0 AND commission_split_percentage <= 100),
    
    -- Media
    images JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    
    -- Metadata
    internal_key TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_operation_type ON properties(operation_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_state ON properties(state);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all properties (for now - can be restricted later)
DROP POLICY IF EXISTS "Users can view properties" ON properties;
CREATE POLICY "Users can view properties" ON properties
    FOR SELECT
    USING (true);

-- Policy: Users can insert their own properties
DROP POLICY IF EXISTS "Users can insert own properties" ON properties;
CREATE POLICY "Users can insert own properties" ON properties
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own properties
DROP POLICY IF EXISTS "Users can update own properties" ON properties;
CREATE POLICY "Users can update own properties" ON properties
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own properties
DROP POLICY IF EXISTS "Users can delete own properties" ON properties;
CREATE POLICY "Users can delete own properties" ON properties
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON properties TO authenticated;
GRANT SELECT ON properties TO anon;
