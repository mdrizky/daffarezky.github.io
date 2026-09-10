# DATABASE AUDIT — FINAL STATE

## Single Source of Truth
All schema changes are consolidated in **`supabase/FINAL_DATABASE_SETUP.sql`** — the one paste-ready SQL file to run in Supabase SQL Editor. All legacy/insecure SQL files have been deleted:
- `supabase-complete-setup.sql` (root), `supabase/setup.sql`, `supabase/enhanced_setup.sql`, `supabase/update_schema.sql`, `supabase/PORTFOLIO_V2_UPGRADE.sql`, `supabase/migrations/rls_policies.sql`, `supabase/migrations/add_logo_url_to_profile.sql`.

## Canonical Tables (Single Source of Truth)
| Table | Status |
| :--- | :--- |
| `projects` | Canonical for ALL projects. `status` = `'Ongoing'` or `'Concept'` (replaces `active_projects`, `concepts`, `future_concepts`). |
| `learning_journey` | Canonical (replaces `journey_milestones`). |
| `profile` / `settings` | SEO + profile identity seeded for fresh installs. |
| `admin_users` | New: RBAC via `is_admin()` / `is_super_admin()`. |

## Approved Actions Taken
1. Dropped plaintext `admin_pin` from `settings`.
2. Created `admin_users` for secure RBAC; `is_admin()`/`is_super_admin()` helpers in SQL.
3. RLS replaced `USING (true)` with `is_published = true` on all public tables.
4. Added `updated_at` triggers and `is_published`/`published_at` on public-facing tables.
5. Storage policies enforce permitted upload folders via `is_allowed_upload_folder()`; true-admin-only write.
6. Additive-only migrations (audit → migrate → normalize; never delete data).

## Security
- Public read = `is_published = true` only.
- Admin writes = `admin_users` membership (not `auth.role() = 'authenticated'`).
- `messages` status check constraint updated for Client Lead System fields.