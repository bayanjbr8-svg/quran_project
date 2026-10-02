# المنارة القرآنية — Quran Platform

> منصة قرآنية متكاملة مبنية بـ React، تهدف إلى تسهيل الوصول إلى القرآن الكريم والعلوم الإسلامية.

---

## 📁 Project Structure

```
quran-platform/
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Home/
│   │   │   ├── HomePage.js          # الصفحة الرئيسية
│   │   │   └── index.js
│   │   │
│   │   ├── Login/
│   │   │   └── LoginPage.js         # تسجيل الدخول
│   │   │
│   │   ├── Dashboard/
│   │   │   └── DashboardPage.js     # القائمة الرئيسية (6 أقسام)
│   │   │
│   │   └── QuranLessons/
│   │       ├── QuranLessonsPage.js  # صفحة القرآن (تلاوة + تصفح)
│   │       └── index.js
│   │
│   ├── services/
│   │   ├── api.js                   # API الرئيسي + Supabase
│   │   └── supabase.js              # إعدادات Supabase
│   │
│   ├── styles/
│   │   ├── Home.css
│   │   ├── Login.css
│   │   ├── Dashboard.css
│   │   └── QuranLessons.css
│   │
│   ├── App.js                       # Routing الرئيسي
│   ├── index.js                     # Entry point
│   └── index.css                    # الأنماط العامة
│
├── supabase/
│   └── schema.sql                   # مخطط جدول students
│
├── .env.example                     # نموذج لملف البيئة
├── package.json
├── README.md                        # هذا الملف
├── SUPABASE_SETUP.md                # خطوات إعداد Supabase
└── AGENTS.md                        # مرجع للمطوّرين والـ Agents
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment (optional)

The app works out-of-the-box with `localStorage` fallback.
To enable real Supabase backend, see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

### 3. Run the app

```bash
npm start
```

Opens on `http://localhost:3000`.

### 4. Open in VS Code

```bash
code .
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run dev server (port 3000) |
| `npm run build` | Build for production → `build/` |
| `npm test` | Run tests |
| `npm run eject` | Eject CRA config (irreversible!) |

---

## 🗺️ Routes

| Path | Component | Status |
|------|-----------|--------|
| `/` | `HomePage` | ✅ Ready |
| `/login` | `LoginPage` | ✅ Ready |
| `/dashboard` | `DashboardPage` | ✅ Ready |
| `/quran-lessons` | `QuranLessonsPage` | ✅ Ready |
| `/quran-lessons/:surahId` | `QuranLessonsPage` | ✅ Ready |

---

## ✨ Features

### Home Page
- Islamic animated background (crescent moon, stars, mosque silhouette, particles)
- Hero section with Quran verse
- Features grid (6 features)
- Email-based registration CTA
- Footer with contact info

### Dashboard
- 6 colorful section cards: Quran Lessons, Tajweed, Quizzes, Tafsir, References, Records
- Animated background (clouds, rainbows, sparkles)

### Quran Lessons
- All 114 surahs listed
- Font size controls (20px - 48px)
- Audio UI: volume, speed (0.5x - 1.5x), reader selection (6 reciters)
- Favorites
- Page navigation (1-604)
- Two view modes: text / Quranic image
- Selected surahs list (localStorage)

### Login
- Username + email form
- Form validation
- Back to home link

---

## 🔌 Backend Integration

The app uses **Supabase** with **localStorage fallback**:

| Layer | Status |
|-------|--------|
| Frontend UI | ✅ Complete |
| Supabase schema | ✅ Defined in `supabase/schema.sql` |
| `students` table API | ✅ Implemented |
| Quran text API | ⚠️ Mocked (Al-Fatiha only) |
| Audio playback | ⚠️ UI only (no real audio source yet) |
| localStorage fallback | ✅ Active |

See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for setup details.

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Gold | `#C9A227` | Headings, decorations |
| Dark Blue | `#1A1A2E` | Backgrounds |
| Teal | `#0D7377` | Buttons, accents |
| Cream | `#F5F0E1` | Body text |

**Fonts:** `Amiri` (Arabic), `Traditional Arabic`

**Animations:** `fadeIn`, `slideUp`, `glow`, `slowZoom`

---

## 🗄️ Database Schema

```sql
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_visit TIMESTAMPTZ DEFAULT NOW()
);
```

See `supabase/schema.sql` for the complete schema with RLS policies and triggers.

---

## 👥 Team

- **Frontend:** Bayan
- **Backend:** External team
- **AI Assistant:** Mavis (MiniMax Code)

---

## 📝 License

Private project — All rights reserved.

---

**Created:** 2026-05-05
**Last updated:** 2026-09-03
