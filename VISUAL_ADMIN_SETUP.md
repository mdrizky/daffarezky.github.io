# 🎬 Visual Step-by-Step: Admin Control Setup

**Ikuti dengan screenshot/visuals di Supabase dashboard**

---

## STEP 1: Get Your UUID

### 1A. Buka Supabase Dashboard
```
→ Pergi ke https://supabase.com
→ Login dengan akun kamu
→ Pilih project Portfolio V2
```

### 1B. Navigasi ke Authentication → Users
```
Sidebar kiri:
├── Home
├── Editor
├── SQL Editor
├── Database
├── Authentication  ← KLIK DI SINI
│   ├── Users  ← KLIK DI SINI (tab)
│   ├── Policies
│   └── Providers
```

### 1C. Copy UUID dari Users List
```
Tabel Users akan menampilkan:

┌─────────────────────────────────────────┬────────────────┬──────────┐
│ UID (copy ini!)                         │ Email          │ Created  │
├─────────────────────────────────────────┼────────────────┼──────────┤
│ 550e8400-e29b-41d4-a716-446655440000   │ your@email.com │ Sep 23   │
└─────────────────────────────────────────┴────────────────┴──────────┘
      ↑
      Copy dari kolom paling kiri (UID)
      Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars)
```

### 1D. Simpan UUID
```
Paste UUID di tempat aman (notepad/text editor):
550e8400-e29b-41d4-a716-446655440000
```

---

## STEP 2: Run Admin User Query

### 2A. Buka SQL Editor
```
Sidebar kiri:
├── Home
├── Editor
├── SQL Editor  ← KLIK DI SINI
├── Database
├── Authentication
```

### 2B. Create New Query
```
Di SQL Editor:
┌─────────────────────────────────────────┐
│ Your Queries     [New Query] ← KLIK     │
├─────────────────────────────────────────┤
│                                         │
│  [Blank query editor akan terbuka]      │
│                                         │
└─────────────────────────────────────────┘
```

### 2C. Copy-Paste Admin Query
```
Paste query berikut (ganti UUID):

INSERT INTO admin_users (user_id, role, is_active)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'super_admin', true)
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'super_admin', 
  is_active = true;

Catatan: Ganti UUID dengan UUID kamu dari STEP 1!
```

### 2D. Run Query
```
┌─────────────────────────────────────────┐
│ Query:                                  │
│ INSERT INTO admin_users ...             │
│                                         │
│ [Run] atau Ctrl+Enter ← KLIK SINI      │
└─────────────────────────────────────────┘

Expected hasil:
┌──────────────────────────────────────────┐
│ Success. 1 row(s) affected               │
└──────────────────────────────────────────┘
```

---

## STEP 3: Verify Admin User Created

### 3A. Create Verification Query
```
Di SQL Editor → [New Query]
```

### 3B. Copy-Paste Verification
```
SELECT 
  user_id,
  role,
  is_active,
  created_at
FROM admin_users
WHERE role = 'super_admin';
```

### 3C. Run & Check Results
```
[Run]

Expected hasil:
┌──────────────────────────────┬─────────────┬───────────┬──────────────────┐
│ user_id                      │ role        │ is_active │ created_at       │
├──────────────────────────────┼─────────────┼───────────┼──────────────────┤
│ 550e8400-e29b-41d4-a716-...  │ super_admin │ true      │ 2026-09-23 ...   │
└──────────────────────────────┴─────────────┴───────────┴──────────────────┘

✅ JIKA ADA 1 ROW DENGAN role='super_admin' = SUCCESS!
```

---

## STEP 4: Commit & Push ke GitHub

### 4A. Open Terminal
```
Terminal / Cmd / PowerShell di project folder:
cd c:\Projects\daffarezky.github.io
```

### 4B. Git Add & Commit
```
git add .
git commit -m "Portfolio V2: Database + Admin control 100% setup"
```

### 4C. Git Push
```
git push origin main

Output akan terlihat:
Counting objects: X
Delta compression: X%
remote: Validating objects: 100%
remote: Triggering deployment...
To github.com:daffarezky/daffarezky.github.io.git
   xxxx xxx..xxxxxx main -> main

(Deployment triggered di Vercel!)
```

---

## STEP 5: Vercel Deployment

### 5A. Check Deployment Status
```
→ Pergi ke https://vercel.com/dashboard
→ Cari project "daffarezky.github.io"
→ Lihat deployment status

Status progression:
🔄 Queued
🔄 Building
🔄 Ready
✅ Ready (dengan link)
```

### 5B. Wait for Completion
```
Biasanya 2-5 menit:
[████████████████████] 100%
✅ Deployment successful!
```

---

## STEP 6: Test Live Admin Access

### 6A. Open Live Portfolio
```
→ Buka: https://daffarezky.github.io (atau custom domain kamu)
→ Verify homepage load ✅
```

### 6B. Go to Admin Panel
```
→ Buka: https://daffarezky.github.io/admin
→ Login page akan muncul

┌──────────────────────────────────────────┐
│        Admin Login                       │
├──────────────────────────────────────────┤
│ Email:    [________________]              │
│ Password: [________________]              │
│           [Login]                        │
└──────────────────────────────────────────┘
```

### 6C. Login dengan Credentials
```
Email: (Supabase user email kamu)
Password: (password yang sudah di-setup)

→ Click Login
→ Expected: Redirect ke admin dashboard ✅
```

### 6D. Verify Admin Dashboard
```
Dashboard akan menampilkan:

┌──────────────────────────────────────┐
│ 📊 Admin Dashboard                   │
├──────────────────────────────────────┤
│ ├── Profile                          │
│ ├── Projects                         │
│ ├── Skills                           │
│ ├── Blog                             │
│ ├── Messages                         │
│ ├── Settings                         │
│ └── ... (20+ pages)                  │
└──────────────────────────────────────┘

✅ Jika melihat semua ini = Kontrol 100% aktif!
```

---

## ✅ Verification Checklist

Setelah setiap step, checklist:

| Step | Task | ✅ Done? |
|------|------|---------|
| 1 | UUID copied dari Supabase | ☐ |
| 2 | Admin user query executed | ☐ |
| 3 | Verification query menunjukkan 1 row | ☐ |
| 4 | Git push ke main successful | ☐ |
| 5 | Vercel deployment complete | ☐ |
| 6 | Admin login works di production | ☐ |
| 7 | Admin dashboard visible | ☐ |

Jika semua ✅ = **Portfolio V2 dengan kontrol 100% admin LIVE!** 🎊

---

## 🎬 Video-like Flow (Text Version)

```
START
  ↓
[1] Supabase → Auth → Users → Copy UUID
  ↓
[2] SQL Editor → New Query → Paste admin query → Run
  ↓
[3] New Query → Paste verification → Run → Check results
  ↓
[4] Terminal → git add . → git commit → git push
  ↓
[5] Vercel Dashboard → Wait for ✅ Ready
  ↓
[6] Browser → https://portfolio.com/admin → Login
  ↓
[7] Dashboard loads → Can CRUD content → Kontrol 100% ✅
  ↓
END - Portfolio V2 Live! 🚀
```

---

## 📞 Troubleshooting Visual

### ❌ "Admin users table not found"
```
❌ Error message:
   ERROR: relation "admin_users" does not exist

✅ Solution:
   → SIMPLE_SETUP.sql belum dijalankan
   → Go back ke supabase/SIMPLE_SETUP.sql
   → Run di SQL Editor dulu
   → Baru run ADMIN_USER_SETUP.sql
```

### ❌ Login tidak bekerja
```
❌ Redirect ke login terus menerus

✅ Troubleshooting:
   1. Clear browser cache (Ctrl+Shift+Delete)
   2. Try incognito mode (Ctrl+Shift+N)
   3. Check .env.local has correct Supabase keys
   4. Check admin_users table: query verify
   5. Check middleware.ts auth check
```

### ❌ Deployment stuck
```
❌ Vercel showing "Building..." untuk lama

✅ Solution:
   1. Check console output di Vercel
   2. Look for build errors
   3. If error, fix locally:
      npm run build
   4. Re-push ke main
```

---

## 🎉 Success Indicators

✅ **Kamu berhasil jika:**
- UUID copied (can paste anytime)
- Admin user query ran → "Success. 1 row(s) affected"
- Verification query menunjukkan role='super_admin'
- Git push berhasil (no errors)
- Vercel deployed (status: Ready ✅)
- Admin login works dengan credentials
- Dashboard pages accessible

---

## 📞 Need Help?

Jika stuck di salah satu step:
1. Screenshot error message
2. Check files:
   - `ADMIN_SETUP_GUIDE.md` — Detailed version
   - `DEPLOYMENT_CHECKLIST.md` — Complete checklist
   - `QUICKSTART_ADMIN_SETUP.md` — Super quick version
3. Message Kiro dengan screenshot!

---

**Total waktu:** ~15 menit  
**Difficulty:** ⭐ Easy (copy-paste + click)  
**Result:** Portfolio V2 live + 100% kontrol admin ✅

**Siap? Let's go! 🚀**
