-- Kom tot Bloom Admin — Storage bucket & policies for notification images.
-- Run this after schema.sql, against your Supabase project's SQL editor.
--
-- Ownership note: the `send-push-notification` Edge Function does the
-- uploading (using the service-role key), not the admin panel client. The
-- panel only ever reads `image_url` directly (bucket is public) and deletes
-- the object at `image_path` when a notification is deleted. If this bucket
-- already exists from the Edge Function's own setup, treat this as
-- documentation — the upsert below is safe to re-run either way.

-- ============================================================================
-- Bucket
-- ============================================================================
-- Must be PUBLIC: FCM and recipient devices fetch the image via its HTTPS
-- URL, and the panel's <img> tags use image_url directly (no signed URLs).
-- If you prefer the dashboard: Storage → New bucket → name
-- "notification-images" → Public: on.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'notification-images',
  'notification-images',
  true,
  1048576, -- 1MB, mirrors MAX_IMAGE_SIZE_BYTES in src/lib/constants.ts
  array['image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ============================================================================
-- Policies
-- ============================================================================
-- Public buckets serve reads via the public URL without going through RLS,
-- so no SELECT policy is required for the panel's <img> tags to work. A
-- DELETE policy is still required for the panel's "delete notification"
-- cleanup, which goes through the authenticated client, not the public URL.
--
-- SIMPLIFIED MODEL: any authenticated user has delete access, matching
-- schema.sql's notifications policies — see the note there.

create policy "Authenticated users can delete notification images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'notification-images');
