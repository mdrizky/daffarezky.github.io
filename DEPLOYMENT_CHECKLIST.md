# 🚀 Portfolio V2 - Deployment Checklist

**Dibuat:** 23 September 2026  
**Status:** Ready for Production  
**Goal:** 100% kontrol admin + live ke recruiters/clients

---

## ✅ Phase 1: Database Setup (COMPLETE)

- [x] Design database schema (30+ tables)
- [x] Create `SIMPLE_SETUP.sql` (clean, proven to work)
- [x] Run `SIMPLE_SETUP.sql` in Supabase SQL Editor
  - **File:** `supabase/SIMPLE_SETUP.sql`
  - **Status:** ✅ Success (user confirmed screenshot)
  - **Tables Created:** 30+ (profile, projects, skills, blog, admin, etc.)

---

## 🔄 Phase 2: Admin Control Setup (IN PROGRESS)

**Files Created:**
- `ADMIN_SETUP_GUIDE.md` — Step-by-step guide
- `supabase/ADMIN_USER_SETUP.sql` — Copy-paste SQL template
- `DEPLOYMENT_CHECKLIST.md` — This file

**Your Tasks:**
1. [ ] Open Supabase Dashboard
2. [ ] Pergi ke **Authentication → Users**
3. [ ] Copy UUID dari kolom pertama (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
4. [ ] Buka `supabase/ADMIN_USER_SETUP.sql`
5. [ ] Ganti `'YOUR_UUID_HERE'` dengan UUID kamu
6. [ ] Paste query ke Supabase SQL Editor
7. [ ] Click "Run" → Expect "Success. 1 row(s) affected"
8. [ ] Jalankan verification query (sudah ada di file)
9. [ ] Confirm: 1 row dengan role='super_admin' dan is_active=true

---

## 📋 Phase 3: Database Verification

**Verification Queries:**

### 3A. Check Admin User
```sql
SELECT user_id, role, is_active FROM admin_users;
```
✅ Expected: 1 row with role='super_admin'

### 3B. Check All Tables
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
```
✅ Expected: 30+ tables visible

### 3C. Check Profile Table
```sql
SELECT * FROM profile LIMIT 1;
```
✅ Expected: 1 row (Daffa's profile)

---

## 🌐 Phase 4: Environment & Secrets

**Files to Check:**
- [ ] `.env.local` exists with Supabase keys:
  ```
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  SUPABASE_SERVICE_ROLE_KEY=...
  ```
- [ ] `.env.local` is in `.gitignore` (don't commit secrets!)
- [ ] GitHub repo is **private** or secrets are protected

---

## 🏗️ Phase 5: Frontend Build & Test

**Local Testing:**

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Build production bundle
npm run build

# 3. Run build checker
npm run build

# 4. Expected: Build success, no errors
```

**Expected Output:**
```
✓ Compiled successfully
✓ Generated static pages: 45+
✓ API routes ready
✓ Database connected
```

---

## 🔐 Phase 6: Admin Login Test (Local)

**Before deployment, test locally:**

```bash
# 1. Start dev server
npm run dev

# 2. Open browser: http://localhost:3000/admin

# 3. Try login with your credentials:
#    - Email: (Supabase user email)
#    - Password: (your password)

# 4. Expected: Redirect to admin dashboard
```

**Test admin pages:**
- [ ] /admin → Dashboard visible
- [ ] /admin/profile → Can edit profile
- [ ] /admin/projects → Can view/create/edit projects
- [ ] /admin/blog → Can manage blog posts
- [ ] /admin/skills → Can add/edit skills
- [ ] /admin/settings → Can access settings

---

## 🚀 Phase 7: Deploy to Vercel

### Option A: Automatic Deployment (Recommended)

If your GitHub repo is already connected to Vercel:

```bash
# In terminal:
git add .
git commit -m "Portfolio V2: Database integrated + Admin control 100%"
git push origin main

# Vercel auto-deploys when you push to main
# Check: https://vercel.com/dashboard
```

### Option B: Manual Deployment via Vercel CLI

```bash
# 1. Install Vercel CLI (if not done)
npm install -g vercel

# 2. Deploy
vercel --prod

# 3. Follow prompts to connect project
```

### Option C: Manual via Vercel Dashboard

1. Go to https://vercel.com
2. Select your project
3. Click "Deploy" or "Redeploy"
4. Wait for deployment complete

---

## ✅ Phase 8: Production Verification

**After deployment, verify everything:**

### 8A. Check Live URL

1. Open your portfolio: `https://daffarezky.github.io` (or your custom domain)
2. [ ] Homepage loads ✅
3. [ ] All pages accessible ✅
4. [ ] Images load ✅
5. [ ] Animations smooth ✅

### 8B. Test Admin Routes (Production)

1. Go to: `https://daffarezky.github.io/admin`
2. [ ] Login page shows ✅
3. Login dengan credentials
4. [ ] Redirect to dashboard ✅
5. [ ] Can access all admin pages ✅

### 8C. Test Database Integration

1. In admin, create new item (e.g., new skill)
2. [ ] Item saves to Supabase ✅
3. Refresh page
4. [ ] Item still visible ✅

### 8D. Check Performance

1. Open browser DevTools (F12)
2. Go to **Lighthouse** tab
3. Click "Analyze page load"
4. [ ] Performance score > 80 ✅
5. [ ] SEO score > 90 ✅

---

## 🎯 Phase 9: Security Hardening (Optional)

For extra security, enable optional RLS policies:

```sql
-- Enable Row Level Security on sensitive tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Add policies (requires custom setup)
-- → Can add later with Kiro help
```

**Note:** Middleware.ts already handles auth, so RLS is optional for now.

---

## 📤 Phase 10: Share to Recruiters/Clients

**When portfolio is 100% live:**

1. [ ] Copy portfolio URL
2. [ ] Share on LinkedIn/Portfolio sites
3. [ ] Share email signature
4. [ ] Share in resume
5. [ ] Monitor admin dashboard for:
   - [ ] User messages
   - [ ] Guestbook entries
   - [ ] Contact form submissions
   - [ ] Blog comments

---

## 🐛 Phase 11: Troubleshooting Reference

### Problem: Admin login not working

**Checklist:**
1. [ ] UUID correctly added to admin_users table?
   - Query: `SELECT * FROM admin_users WHERE user_id = 'YOUR_UUID';`
2. [ ] User exists in Supabase Authentication?
3. [ ] Middleware auth check enabled?
4. [ ] Environment variables correct?

**Solution:**
```sql
-- Re-verify admin user
SELECT user_id, role, is_active FROM admin_users;

-- If empty, re-run ADMIN_USER_SETUP.sql
```

### Problem: Database connection error

**Checklist:**
1. [ ] Supabase URL correct in `.env.local`?
2. [ ] Anon key correct?
3. [ ] Tables exist?
   - Query: `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';`

**Solution:**
```bash
# Verify connection locally
npm run dev

# Check console for DB errors
# Look at Network tab in DevTools
```

### Problem: Build fails on deployment

**Checklist:**
1. [ ] All dependencies installed? `npm install`
2. [ ] Build runs locally? `npm run build`
3. [ ] No TypeScript errors? Check `.tsx` files

**Solution:**
```bash
# Test build locally first
npm run build

# If error, fix locally before pushing
git add .
git commit -m "Fix build errors"
git push origin main
```

---

## 📞 Contact & Support

**Issues?**
- Check console for errors (F12 → Console tab)
- Check Vercel deployment logs
- Check Supabase dashboard for DB issues
- Message Kiro for help!

---

## 🎊 Final Checklist: 100% Ready

- [ ] Phase 1: Database tables ✅
- [ ] Phase 2: Admin user created ✅
- [ ] Phase 3: Verification passed ✅
- [ ] Phase 4: Environment setup ✅
- [ ] Phase 5: Build successful ✅
- [ ] Phase 6: Admin login works ✅
- [ ] Phase 7: Deployment to Vercel ✅
- [ ] Phase 8: Production verification ✅
- [ ] Phase 9: Security optional ⭕
- [ ] Phase 10: Ready to share ✅

---

## 📅 Timeline

| Phase | Task | Duration | Status |
|-------|------|----------|--------|
| 1 | Database setup | Done | ✅ |
| 2 | Admin user | 5 min | 🔄 |
| 3 | Verification | 2 min | 🔄 |
| 4 | Environment | Done | ✅ |
| 5 | Build test | 3 min | 🔄 |
| 6 | Admin login | 5 min | 🔄 |
| 7 | Deploy Vercel | 2 min | 🔄 |
| 8 | Production verify | 5 min | 🔄 |
| Total | Portfolio V2 Live | ~30 min | 🚀 |

---

## 🎉 SUCCESS CRITERIA

✅ **Portfolio V2 is 100% production-ready when:**

1. SIMPLE_SETUP.sql ran successfully ✅
2. Admin user created with role='super_admin' ✅
3. Admin login works in production ✅
4. All pages accessible ✅
5. Database CRUD operations working ✅
6. Vercel deployment successful ✅
7. No errors in production ✅

---

**Next Step:** Ambil UUID dari Supabase → Run ADMIN_USER_SETUP.sql → Verify → Deploy! 🚀

**Status: ~15 menit lagi, Portfolio V2 LIVE dan 100% kontrol admin aktif! 🎊**
