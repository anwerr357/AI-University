-- Setup Supabase for vector storage
-- Run this in your Supabase SQL editor

-- Enable the vector extension
create extension if not exists vector;

-- Create table for storing document embeddings
create table if not exists document_embeddings (
  id bigserial primary key,
  document_id text not null,
  chunk_id text not null,
  content text not null,
  page_number integer,
  embedding vector(1536), -- OpenAI embeddings are 1536 dimensions
  created_at timestamp with time zone default now()
);

-- Create index for vector similarity search
create index if not exists document_embeddings_embedding_idx 
  on document_embeddings using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Create function for similarity search
create or replace function search_documents (
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id text,
  document_id text,
  content text,
  page_number int,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    de.chunk_id,
    de.document_id,
    de.content,
    de.page_number,
    1 - (de.embedding <=> query_embedding) as similarity
  from document_embeddings de
  where 1 - (de.embedding <=> query_embedding) > match_threshold
  order by de.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Grant permissions (adjust as needed for your setup)
grant usage on schema public to anon, authenticated;
grant all on table document_embeddings to anon, authenticated;
grant all on sequence document_embeddings_id_seq to anon, authenticated;