---
inclusion: always
---

# Portfolio V2 — permanent rules

1. Do not rebuild from zero. Audit, migrate, normalize, and upgrade the existing project.
2. Do not create duplicate files (`HeroV2.tsx`, `ProjectCardNew.tsx`, `AdminDashboardNew.tsx`).
3. Do not create duplicate database tables for the same business concept.
4. Never delete production data. Use additive, backward-compatible migrations.
5. Public content comes from Supabase via a data layer, never hardcoded production content.
6. Admin authorization is `admin_users` + RLS, never `auth.role() = 'authenticated'` alone.
7. Do not store plaintext admin PINs. Do not expose service-role keys to the browser.
8. Public RLS must only expose published content. Messages, subscribers, and drafts stay private.
9. Reuse existing components, routes, and tables. Edit them instead of copying them.
