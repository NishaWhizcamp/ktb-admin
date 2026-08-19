# Kom tot Bloom — Notification Admin Panel

A statically exported Next.js admin panel for managing push notifications in
the Kom tot Bloom mobile app. Backend: Supabase (Auth, Postgres, Storage,
Edge Functions).

Scope is strictly notification management — see "Scope" below.

## Stack

- Next.js (App Router, `output: 'export'`) — no server runtime at all in
  production; the built `out/` folder is plain static HTML/CSS/JS.
- Supabase: Auth (email/password), Postgres + RLS, Storage, one Edge
  Function.
- Tailwind CSS v4 for styling, design tokens lifted from the mobile app.

## Delivery mechanism

Push delivery is handled by an existing Supabase Edge Function,
**`send-push-notification`**, built and deployed separately from this repo
(not included here — see `BLOOM_PUSH_EDGE_FUNCTION_GUIDE` for its contract).
The admin panel does not write to `notifications` or upload images directly;
it calls this function with the notification's fields (and image file, if
any) via `src/lib/notifications/api.ts`'s `sendPushNotification()`, and the
function does everything server-side: uploads the image to the
`notification-images` bucket, inserts the `notifications` row (using the
service-role key, bypassing RLS), and sends the actual push via FCM.

This replaces an earlier stub `send-notification` function that shipped
with this project before `send-push-notification` existed; that stub has
been removed since nothing calls it anymore.

Because the panel only ever calls the function and then reads its result,
`notifications` and the `notification-images` bucket only need
**SELECT + DELETE** RLS policies for the client — no INSERT/UPDATE, since
the Edge Function's service-role key bypasses RLS for its own writes. See
`supabase/schema.sql` and `supabase/storage.sql`.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Create a project at [supabase.com](https://supabase.com) (or use an existing
one — see the note on shared projects below).

### 3. Run the SQL

If `notifications` and the `notification-images` bucket already exist
(created alongside the `send-push-notification` Edge Function), you likely
only need `supabase/migrations/0002_align_with_push_edge_function.sql` — it
only manages RLS policies and the bucket's public/size/mime settings, and is
safe to run regardless of current state. Otherwise, in the Supabase SQL
editor, run, in order:

1. `supabase/schema.sql` — creates `notifications`, `admins`, and RLS
   policies.
2. `supabase/storage.sql` — creates the public `notification-images`
   bucket and its storage policy. (Requires `schema.sql` to have run
   first.)

> **Access model:** any authenticated user in this Supabase project can use
> the admin panel — there is no separate admin-role check. The `admins`
> table still exists, but only as an optional email directory for the
> "Created By" display; it does not gate access. This is only safe if this
> Supabase project has no other (non-admin) user population — e.g. the
> mobile app's regular users authenticate against a different project, or
> don't exist yet. If that ever changes, add an admin-role check back to the
> RLS policies in `schema.sql` / `storage.sql` before it does.

### 4. Create the first user

1. Supabase Dashboard → Authentication → Users → Add user. Set an email and
   password (or invite by email), and make sure the account is confirmed
   (check "Auto Confirm User" if adding manually from the dashboard —
   otherwise sign-in will fail until the email is confirmed).
2. Optionally, so their name shows up on "Created By" in the notification
   detail view, add them to the email directory:

   ```sql
   insert into admins (user_id, email)
   values ('paste-the-user-uuid-here', 'the-same-email@example.com');
   ```

That user can now sign in to the admin panel at `/login`.

### 5. Confirm `send-push-notification` is deployed

This project calls it but doesn't own its deployment — confirm it already
exists in your project (Supabase Dashboard → Edge Functions), since the
"Create Notification" flow depends on it entirely.

### 6. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
your project's API settings. Both are safe to expose client-side — this
project never references a service-role key outside the Edge Function.

### 7. Run it

```bash
npm run dev       # local dev server
npm run build      # static export -> ./out
```

`next build` produces a self-contained `out/` directory that can be served
by any static host (Nginx, S3 + CloudFront, GitHub Pages, etc.) — see the
[Next.js static export guide](https://nextjs.org/docs/app/guides/static-exports#deploying)
for host-specific rewrite rules (detail pages use `?id=` query params, not
route segments, so most static hosts work with zero extra config beyond the
default `try_files`).

## Security note

Because this is a static export, the client-side route guard in
`src/components/layout/AuthGuard.tsx` is **UX only** — anyone can view the
unauthenticated page's JS. **Row Level Security is the real security
boundary.** Currently that boundary is "any authenticated user" (see the
access model note in Setup step 3) — every notification and storage
read/write requires a valid Supabase session, but does not further check
who that session belongs to. If this project ever needs to share its
Supabase instance with the mobile app's regular users, tighten the RLS
policies in `schema.sql` / `storage.sql` to an actual admin-role check
before that happens.

## Scope

**In scope:** Login, notification listing (search/filter/paginate), create &
send (with real push delivery via `send-push-notification`), view, delete,
image upload.

**Out of scope — intentionally not built:** editing an existing notification
(content is immutable once created), drafts, scheduling, archive/unarchive
(dropped — the backend's `status` field is delivery outcome, not a
visibility toggle), user/admin management UI, analytics, a dashboard, or any
settings page.
