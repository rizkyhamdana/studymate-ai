-- Enable pgvector extension
create extension if not exists vector;

-- Users Table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Materials Table
create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  file_url text,
  file_name text not null,
  file_size integer not null,
  total_pages integer not null default 0,
  status text not null default 'processing', -- processing, completed, failed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Material Chunks Table (stores split portions + vector embeddings)
create table if not exists material_chunks (
  id uuid primary key default gen_random_uuid(),
  material_id uuid references materials(id) on delete cascade not null,
  content text not null,
  page_number integer not null,
  chunk_index integer not null,
  token_estimate integer not null,
  embedding vector(1536), -- 1536 dimensions for text-embedding-3-small
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast cosine similarity vector search
create index if not exists material_chunks_embedding_idx on material_chunks 
using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Summaries Table (caches generated learning summary data)
create table if not exists summaries (
  id uuid primary key default gen_random_uuid(),
  material_id uuid references materials(id) on delete cascade unique not null,
  short_summary text not null,
  detailed_summary text not null,
  key_points jsonb not null default '[]'::jsonb,
  important_terms jsonb not null default '[]'::jsonb,
  learning_path jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Flashcards Table (caches concept flashcard decks)
create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(),
  material_id uuid references materials(id) on delete cascade not null,
  front text not null,
  back text not null,
  difficulty text not null default 'medium', -- easy, medium, hard
  topic text not null,
  status text not null default 'new', -- new, mastered, review
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quizzes Table (caches general quiz configuration details)
create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  material_id uuid references materials(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quiz Questions Table
create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete cascade not null,
  question text not null,
  type text not null, -- multiple_choice, true_false, short_answer
  options jsonb not null default '[]'::jsonb, -- array of strings for multiple choice
  correct_answer text not null,
  explanation text,
  difficulty text not null default 'medium', -- easy, medium, hard
  topic text not null,
  source_reference jsonb, -- { "page_number": 1, "chunk_index": 0 }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quiz Attempts Table (tracks scores, progress, and weak subjects)
create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade,
  score integer not null,
  total_questions integer not null,
  weak_topics jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chat Messages Table (stores interaction logs and retrieved sources)
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  material_id uuid references materials(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade,
  role text not null, -- user, assistant
  content text not null,
  sources jsonb not null default '[]'::jsonb, -- array of { "page_number": 1, "chunk_index": 0, "quote": "..." }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Vector similarity search matching function
create or replace function match_material_chunks(
  query_embedding vector(1536),
  match_material_id uuid,
  match_count int
)
returns table (
  id uuid,
  content text,
  page_number int,
  chunk_index int,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    mc.id,
    mc.content,
    mc.page_number,
    mc.chunk_index,
    (1 - (mc.embedding <=> query_embedding))::float as similarity
  from material_chunks mc
  where mc.material_id = match_material_id
  order by mc.embedding <=> query_embedding
  limit match_count;
end;
$$;
