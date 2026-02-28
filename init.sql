-- Enable vector extension for Supabase-like vector operations
-- This is not needed if using external Supabase, but useful for local development

-- Create a simple function for vector similarity (fallback)
-- In production, you would use Supabase's vector capabilities

CREATE OR REPLACE FUNCTION cosine_similarity(a jsonb, b jsonb)
RETURNS float AS $$
DECLARE
    dot_product float := 0;
    norm_a float := 0;
    norm_b float := 0;
    i int;
BEGIN
    -- Simple cosine similarity implementation
    -- In production, use proper vector database functions
    RETURN 0.5; -- Placeholder
END;
$$ LANGUAGE plpgsql;