-- Migration: align RLS + storage with the send-push-notification Edge
-- Function backend. Safe to run regardless of current state — every
-- statement is idempotent (DROP POLICY IF EXISTS, ON CONFLICT, etc).
--
-- This does NOT create or alter the `notifications` table itself. If that
-- table already exists (built alongside the Edge Function), this migration
-- assumes it does and only manages access policies + the storage bucket.
-- If it does NOT exist yet, run supabase/schema.sql first.

-- ============================================================================
-- notifications: ensure RLS is on, ensure select+delete policies exist
-- ============================================================================

alter table notifications enable row level security;

-- Drop anything from earlier iterations of this project (is_admin()-gated
-- or otherwise) so this migration is safe to run more than once and after
-- any prior state.
drop policy if exists "Admins can select notifications" on notifications;
drop policy if exists "Admins can insert notifications" on notifications;
drop policy if exists "Admins can update notifications" on notifications;
drop policy if exists "Admins can delete notifications" on notifications;
drop policy if exists "App users can read their published notifications" on notifications;
drop policy if exists "Authenticated users can select notifications" on notifications;
drop policy if exists "Authenticated users can insert notifications" on notifications;
drop policy if exists "Authenticated users can update notifications" on notifications;
drop policy if exists "Authenticated users can delete notifications" on notifications;

-- No INSERT/UPDATE policy: only the Edge Function writes here, via the
-- service-role key, which bypasses RLS entirely.
create policy "Authenticated users can select notifications"
  on notifications for select
  to authenticated
  using (true);

create policy "Authenticated users can delete notifications"
  on notifications for delete
  to authenticated
  using (true);

-- ============================================================================
-- admins: email directory only, any authenticated user may read it
-- ============================================================================

alter table admins enable row level security;

drop policy if exists "Admins can read admins table" on admins;
drop policy if exists "Users can read their own admin row" on admins;
drop policy if exists "Authenticated users can read admins table" on admins;

create policy "Authenticated users can read admins table"
  on admins for select
  to authenticated
  using (true);

-- ============================================================================
-- notification-images bucket: ensure it's public with the right limits,
-- ensure a delete policy exists for the panel's cleanup-on-delete flow
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'notification-images',
  'notification-images',
  true,
  1048576,
  array['image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can upload attachments" on storage.objects;
drop policy if exists "Admins can read attachments" on storage.objects;
drop policy if exists "Admins can delete attachments" on storage.objects;
drop policy if exists "App users can read attachments for visible notifications" on storage.objects;
drop policy if exists "Authenticated users can upload attachments" on storage.objects;
drop policy if exists "Authenticated users can read attachments" on storage.objects;
drop policy if exists "Authenticated users can delete attachments" on storage.objects;
drop policy if exists "Authenticated users can delete notification images" on storage.objects;

create policy "Authenticated users can delete notification images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'notification-images');

-- Note: no INSERT policy on storage.objects for this bucket — uploads go
-- through the Edge Function's service-role key, not the authenticated
-- client. No SELECT policy either — the bucket is public, so reads via the
-- public URL bypass RLS entirely.
