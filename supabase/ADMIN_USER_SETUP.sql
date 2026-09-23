-- ============================================================================
-- PORTFOLIO V2 - ADMIN USER SETUP
-- ============================================================================
-- STEP 2 OF 2: Create admin user with super_admin role + kontrol 100%
-- ============================================================================

-- INSTRUCTIONS:
-- 1. Copy your UUID from Supabase → Authentication → Users → [first column]
-- 2. Replace 'YOUR_UUID_HERE' below with your actual UUID
-- 3. Paste this entire query into Supabase SQL Editor
-- 4. Click "Run" or Ctrl+Enter
-- 5. Expected: "Success. 1 row(s) affected"

-- ============================================================================
-- QUERY: Create Admin User
-- ============================================================================

INSERT INTO admin_users (user_id, role, is_active)
VALUES ('YOUR_UUID_HERE', 'super_admin', true)
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'super_admin', 
  is_active = true;

-- ============================================================================
-- VERIFICATION: Check if admin user created successfully
-- ============================================================================

SELECT 
  user_id,
  role,
  is_active,
  created_at
FROM admin_users
WHERE role = 'super_admin'
ORDER BY created_at DESC;

-- Expected Output:
-- user_id                             | role        | is_active | created_at
-- 550e8400-e29b-41d4-a716-446655440000 | super_admin | true      | 2026-09-23...

-- If you see 1 row with role='super_admin' → Your admin control is 100% active! ✅

-- ============================================================================
-- OPTIONAL: Add more admin users (jika nanti perlu)
-- ============================================================================

-- Uncomment & modify jika ingin tambah admin user lain:
-- INSERT INTO admin_users (user_id, role, is_active)
-- VALUES ('ANOTHER_UUID_HERE', 'admin', true);

-- Role options: 'super_admin' (full control), 'admin' (manage content), 'editor' (edit content only)

-- ============================================================================
-- OPTIONAL: View All Admin Users
-- ============================================================================

-- SELECT user_id, role, is_active, created_at FROM admin_users ORDER BY created_at DESC;

-- ============================================================================
-- OPTIONAL: Deactivate Admin User (jika nanti perlu remove)
-- ============================================================================

-- UPDATE admin_users SET is_active = false WHERE user_id = 'UUID_HERE';

-- ============================================================================
-- DONE! ✅
-- Your portfolio now has 100% admin control.
-- Next: Deploy to Vercel (git push origin main)
-- ============================================================================
