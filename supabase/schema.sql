-- Kom tot Bloom Admin — Notification Management Schema
-- Run this against your Supabase project's SQL editor (or via `supabase db push`).

-- ============================================================================
-- Tables
-- ============================================================================

-- Owned by the `send-push-notification` Edge Function, which inserts rows
-- using the service-role key (bypassing RLS entirely). The admin panel only
-- ever SELECTs and DELETEs from this table — see src/lib/notifications/api.ts
-- and BLOOM_PUSH_EDGE_FUNCTION_GUIDE for the authoritative column list and
-- the Edge Function's own read/write behavior. This definition mirrors that
-- guide; if the table already exists with a different exact shape, treat
-- this as documentation, not something to re-run.
create table if not exists notifications (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  description          text not null,
  audience             text not null
                         check (audience in ('all', 'free', 'paid', 'monthly', 'yearly', 'expired')),
  image_path           text,
  image_url            text,
  status               text not null default 'processing'
                         check (status in ('processing', 'sent', 'partial', 'failed')),
  users_matched        integer not null default 0,
  tokens_found         integer not null default 0,
  sent_count           integer not null default 0,
  failed_count         integer not null default 0,
  invalid_tokens_count integer not null default 0,
  errors               jsonb not null default '{}'::jsonb,
  created_by           uuid references auth.users(id),
  created_at           timestamptz not null default now(),
  sent_at              timestamptz
);

create index if not exists notifications_status_created_idx
  on notifications (status, created_at desc);

-- One row per matched user per notification campaign (see the Edge Function
-- guide, section 9). Not read by the admin panel today — no UI surfaces
-- recipient-level detail — so its exact column list isn't reproduced here.
-- RLS should still be enabled and scoped the same way as `notifications` if
-- this table is ever queried from the client.

-- Optional email directory, used only to resolve a notification's
-- "Created By" display in the panel. NOT used as an access gate — see the
-- note on RLS below.
create table if not exists admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table notifications enable row level security;
alter table admins enable row level security;

-- SIMPLIFIED MODEL: any authenticated Supabase user has full access to
-- notifications. There is no separate admin gate — every account in this
-- project is trusted with the admin panel. This is only safe if this
-- Supabase project has no other (non-admin) user population, e.g. the
-- mobile app's regular users authenticate elsewhere or don't exist yet.
-- If that ever changes, reintroduce an admin check here before it does.
--
-- No INSERT/UPDATE policy is needed: only the Edge Function ever writes to
-- this table, using the service-role key, which bypasses RLS entirely.
create policy "Authenticated users can select notifications"
  on notifications for select
  to authenticated
  using (true);

create policy "Authenticated users can delete notifications"
  on notifications for delete
  to authenticated
  using (true);

-- Admins table (email directory only, not an access gate): any authenticated
-- user may read it, so the panel can resolve a notification's "Created By"
-- display for any creator, not just themself.
create policy "Authenticated users can read admins table"
  on admins for select
  to authenticated
  using (true);

-- No insert/update/delete policy is defined for `admins` on purpose: manage
-- entries from the Supabase dashboard / service-role context only, never
-- from the client. It's just a display convenience now, not required to log in.
