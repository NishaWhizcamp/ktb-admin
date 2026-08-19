-- Migration: remove the admins-table access gate.
-- Run this once against a project that already has the original
-- schema.sql / storage.sql applied. After this, any authenticated
-- Supabase user can access the admin panel — see the access-model note
-- in schema.sql / README.md for the tradeoff this accepts.

-- ============================================================================
-- notifications: drop admin-gated policies, add authenticated-only ones
-- ============================================================================

drop policy if exists "Admins can select notifications" on notifications;
drop policy if exists "Admins can insert notifications" on notifications;
drop policy if exists "Admins can update notifications" on notifications;
drop policy if exists "Admins can delete notifications" on notifications;
drop policy if exists "App users can read their published notifications" on notifications;

create policy "Authenticated users can select notifications"
  on notifications for select
  to authenticated
  using (true);

create policy "Authenticated users can insert notifications"
  on notifications for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update notifications"
  on notifications for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete notifications"
  on notifications for delete
  to authenticated
  using (true);

-- ============================================================================
-- admins: keep the table (used only for "Created By" email lookups now),
-- but let any authenticated user read it rather than only admins
-- ============================================================================

drop policy if exists "Admins can read admins table" on admins;
drop policy if exists "Users can read their own admin row" on admins;

create policy "Authenticated users can read admins table"
  on admins for select
  to authenticated
  using (true);

-- ============================================================================
-- storage.objects: same simplification for notification-attachments
-- ============================================================================

drop policy if exists "Admins can upload attachments" on storage.objects;
drop policy if exists "Admins can read attachments" on storage.objects;
drop policy if exists "Admins can delete attachments" on storage.objects;
drop policy if exists "App users can read attachments for visible notifications" on storage.objects;

create policy "Authenticated users can upload attachments"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'notification-attachments');

create policy "Authenticated users can read attachments"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'notification-attachments');

create policy "Authenticated users can delete attachments"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'notification-attachments');

-- Note: the public.is_admin() function from schema.sql is no longer used by
-- any policy after this migration. It's left in place (harmless) in case
-- you want to reintroduce an admin gate later — see the note in schema.sql.
