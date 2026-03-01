-- Migration to create chat_conversations table

create table if not exists chat_conversations (
    id uuid default gen_random_uuid() primary key,
    session_id text not null unique,
    messages jsonb not null,
    user_email text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists chat_conversations_created_at_idx on chat_conversations (created_at desc);

alter table chat_conversations enable row level security;

create policy "Enable insert for anon" on chat_conversations for insert with check (true);
create policy "Enable select for anon" on chat_conversations for select using (true);
create policy "Enable update for anon" on chat_conversations for update using (true);

