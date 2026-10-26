# Supabase setup and upgrade

Use the EXISTING Supabase project associated with BullyExchange. Public project URL from prior context: https://kgnrabhuhmrefvtxrqpv.supabase.co (not verified against a live connection in this task).

## Before changing an existing database

1. Back up the database and inspect the current schema, policies, triggers and function definitions. Compare with the recovered source: live GitHub/database may have changes absent from Downloads.
2. Run the supplied scripts on a staging copy first. `create table if not exists` does not reconcile an unrelated schema. Unexpected policies must be audited: permissive RLS policies combine with OR.
3. Apply `supabase/schema.sql`, then `supabase/migrations/20261026_security_and_images.sql` LAST. Both scripts are transactional and repeatable for the supplied MVP schema. The base script restores broad legacy grants; never deploy it without the hardening migration immediately afterward. For an already verified matching base schema, apply only the hardening migration to avoid an intermediate legacy grant window.
4. The migration backfills missing profiles for existing Auth users and preserves existing accounts/data. New content constraints are NOT VALID so legacy rows do not block the migration; new/updated rows must comply. Inspect and correct legacy content, then validate those constraints separately.
5. Audit existing profile roles and store statuses before launch: the previous schema allowed users to change their own role and owners to change store status. Hardening cannot identify or undo earlier unauthorized changes automatically.

## Configuration

Set ONLY these browser-safe values in `.env.local` and in Vercel Production/Preview as appropriate:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Do not supply service-role/secret keys or passwords in source, issues, screenshots or chat. An owner with SQL Editor access applies the SQL scripts. The website uses the signed-in user's session and RLS, not an admin key.

Supabase Auth configuration:

- Enable email/password signup and email confirmation.
- Set Site URL to your canonical deployment, currently https://bullyexchange.vercel.app.
- Add explicitly trusted local/staging redirect URLs if used.
- For the Confirm signup email template, use a confirmation link with token hash:
  `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`
- Verify SMTP/delivery and expiry handling on staging. Do not silently disable confirmation to get a test to pass.
- Enable appropriate Auth rate limits and production abuse protections in the project dashboard.

## Admin

Sign up/log in with the existing owner account. An authorized database owner should identify the exact Auth user UUID and promote ONLY that account in SQL Editor:

```sql
update public.profiles set role = 'admin' where id = 'REPLACE-WITH-VERIFIED-USER-UUID';
```

Do not grant admin through a signup metadata field or allow public self-promotion. No default admin/password is included.

## Storage and privacy

The migration creates `puppy-images`: public, JPEG/PNG/WebP, maximum 3 MiB. The application verifies file signatures and stores randomized filenames under the owner UUID. It cleans replaced/deleted images after successful database mutations and removes a new upload if saving the listing fails. Network failure between these independent operations can leave an orphan; periodic storage reconciliation is a future maintenance task.

The 3 MiB limit leaves room below Vercel's function request size ceiling. SVG uploads are rejected. Each listing has one primary photo. Public image URLs are accessible even when a listing is hidden or a store suspended: hidden means metadata is private, not that uploaded photos are confidential. Upload puppy photos only. If confidential draft media is required, change to a private bucket and signed-URL delivery before using it for sensitive content.

See the official [Supabase storage access control guide](https://supabase.com/docs/guides/storage/security/access-control) for the underlying policy model.
