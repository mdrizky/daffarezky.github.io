# Database Setup Decision

**Date:** 23 September 2026  
**Production source of truth:** `supabase/FINAL_DATABASE_SETUP.sql`

## Decision

Use `FINAL_DATABASE_SETUP.sql` for production. It matches the application's `admin_users` RBAC model and enables database-level Row Level Security (RLS).

`SIMPLE_SETUP.sql` must not be used for production because it does not provide the RLS boundary required by the application. Middleware and the client-side admin guard are not substitutes for database security; several admin screens use the Supabase anon key.

## Production Procedure

1. Run `supabase/FINAL_DATABASE_SETUP.sql` in the Supabase SQL Editor.
2. Confirm RLS is enabled on all application tables.
3. Create or confirm the Supabase Auth user.
4. Promote the user with the `admin_users` statement at the bottom of the final SQL file.
5. Verify anonymous reads return only published content and anonymous writes are limited to the documented public forms.

If the final script reports an error, fix the specific SQL error and rerun the affected section. Do not disable RLS or fall back to `SIMPLE_SETUP.sql` for a production launch.

## Security Model

```text
Request
  -> Middleware and server auth checks
  -> Supabase query
  -> RLS policy check
  -> Published public data or active-admin data
```

The final setup provides:

- Public reads limited to published content, except intentionally public profile fields.
- Admin writes gated by `public.is_admin()`.
- Admin-user management gated by `public.is_super_admin()`.
- Validation policies for contact, guestbook, newsletter, comments, and analytics inserts.
- Storage upload policies restricted to active admins and approved folders.

## Verification Queries

Run these in Supabase SQL Editor after setup:

```sql
SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class
WHERE relnamespace = 'public'::regnamespace
  AND relname IN ('profile', 'projects', 'admin_users', 'messages');
```

Every returned application table should have `relrowsecurity = true`.

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```
