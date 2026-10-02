# AGENTS.md - المنارة القرآنية

> هذا الملف هو المرجع لأي Agent (ذكاء اصطناعي أو مطوّر جديد) يدخل على المشروع. اقرأه كامل قبل أي تعديل.

## 📍 Canonical Project Path

**المسار الرسمي للمشروع (لا تعدّل خارج هذا المسار):**
```
C:/Users/leent/.minimax-agent/projects/quran-platform
```

كل الملفات تُكتب هنا فقط. لو فتحت VS Code، افتح **هذا المجلد بالذات** عبر `File → Open Folder`.

## 📌 Project Overview

**اسم المشروع:** المنارة القرآنية (The Quran Lighthouse)
**الوصف:** منصة قرآنية متكاملة لتلاوة ودراسة القرآن الكريم.
**الفريق:**
- **Frontend:** Bayan
- **Backend:** فريق آخر (Supabase مهيّأ كـ BaaS حالياً)
- **AI Assistant:** Mavis (MiniMax Code)

---

## 🛠️ Tech Stack

| الطبقة | التقنية | ملاحظات |
|--------|---------|---------|
| UI Framework | **React 18.2** | Create React App (`react-scripts`) |
| Routing | **react-router-dom 7** | `BrowserRouter`, `Routes` |
| Backend | **Supabase 2.108** | BaaS — جدول `students` + RLS |
| Styling | **CSS خام** | بدون framework — كل صفحة لها ملف مستقل |
| Storage Fallback | **localStorage** | للنظام اللي بدون Supabase |

---

## 📁 Project Structure

```
quran-platform/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Home/
│   │   │   ├── HomePage.js        # الصفحة الرئيسية
│   │   │   └── index.js
│   │   ├── Login/
│   │   │   └── LoginPage.js       # تسجيل الدخول (طالب موجود)
│   │   ├── SignUp/
│   │   │   ├── SignUpPage.js      # إنشاء حساب جديد (بريد + كلمة مرور)
│   │   │   └── index.js
│   │   ├── Dashboard/
│   │   │   └── DashboardPage.js   # القائمة الرئيسية (5 أقسام)
│   │   ├── QuranLessons/
│   │   │   ├── QuranLessonsPage.js # صفحة القرآن (تلاوة + تصفح) - 27KB
│   │   │   └── index.js
│   │   ├── TajweedLessons/
│   │   │   ├── TajweedLessonsPage.js # دروس التجويد
│   │   │   └── index.js
│   │   └── Quizzes/
│   │       ├── QuizzesPage.js     # الاختبارات التفاعلية
│   │       └── index.js
│   ├── services/
│   │   ├── api.js                 # API service + Supabase
│   │   └── supabase.js            # إعدادات Supabase
│   ├── styles/
│   │   ├── Home.css
│   │   ├── Login.css
│   │   ├── Dashboard.css
│   │   └── QuranLessons.css
│   ├── App.js                     # Routing
│   ├── index.js                   # Entry point
│   └── index.css
├── supabase/
│   └── schema.sql                 # مخطط DB
├── .env.example                   # نموذج لملف البيئة
├── package.json
├── README.md
├── SUPABASE_SETUP.md
└── AGENTS.md                      # هذا الملف
```

---

## 🚀 Build / Run

```bash
# التثبيت
npm install

# تشغيل dev server (http://localhost:3000)
npm start

# بناء production
npm run build

# اختبارات
npm test
```

---

## ⚠️ CRITICAL RULES — قواعد صارمة

### 1. **التصميم البصري (UI) من مسؤولية Bayan فقط**
- ❌ **لا تلمس أي ملف `.css`** بدون إذن صريح
- ❌ لا تغيّر animation, layout, colors, fonts
- ✅ التعديل مسموح فقط على: `.js` logic, routing, services, schema, docs
- لو احتجت تعديل CSS، **اسأل أول**.

### 2. **Branch / Commit hygiene**
- الفرع الرئيسي: `main`
- أي ميزة جديدة: فرع جديد (`feature/...`)
- الـ commits يجب أن تكون واضحة ومختصرة

### 3. **Environment Variables**
- ملف `.env` **مستبعد** من Git (فيه secrets)
- للمتغيرات الجديدة: أضف في `.env.example` + وثّقها هنا

### 4. **الـ Auth Flow**
- حالياً: localStorage فقط (fallback)
- الواجهة `LoginPage` **ما تحفظ فعلياً** — قيد العمل
- الـ student model مبني على **email** (مش username)

---

## 📊 Current State — الحالة الراهنة

### ✅ Pages مكتملة
| Route | File | Status |
|-------|------|--------|
| `/` | `HomePage.js` | ✅ جاهز |
| `/login` | `LoginPage.js` | ⚠️ UI جاهز، المنطق ناقص |
| `/dashboard` | `DashboardPage.js` | ✅ جاهز |
| `/quran-lessons/:id` | `QuranLessonsPage.js` | ✅ جاهز |

### ❌ Routes مكسورة (في Dashboard لكن ما في صفحات)
- `/tajweed-lessons`
- `/quizzes`
- `/tafsir`
- `/references`
- `/records`
- `/teacher-register` (من LoginPage)

### 🔧 المهام القادمة
- [ ] إصلاح منطق `LoginPage` (ربطها بـ `api.saveStudent`)
- [ ] إنشاء صفحات الـ routes المكسورة
- [ ] ربط Supabase فعلياً (يحتاج credentials في `.env`)
- [ ] مصدر صوت حقيقي للقرآن (حالياً UI بس)
- [ ] `QuranAPI.getSurahs` — حالياً يرجع `[]` (TODO)
- [ ] `handleVerseClick` — يطبع console.log بس
- [ ] اختبارات (Tests)

---

## 🗄️ Database Schema (Supabase)

ملف: `supabase/schema.sql`

**جدول `students`:**
| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | UUID | PK |
| `email` | TEXT UNIQUE | البريد الإلكتروني |
| `name` | TEXT | اسم الطالب |
| `avatar_url` | TEXT | رابط الصورة |
| `created_at` | TIMESTAMPTZ | تاريخ التسجيل |
| `last_visit` | TIMESTAMPTZ | آخر زيارة |

**RLS Policies:**
- ✅ Public SELECT
- ✅ Public INSERT
- ✅ UPDATE فقط للـ owner

**Trigger:** تحديث `last_visit` تلقائياً عند UPDATE

---

## 🔌 API Services

ملف: `src/services/api.js`

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `api.getPlatformInfo()` | GET | معلومات المنصة (static) |
| `api.getSurahs()` | GET | قائمة السور — **TODO: mock** |
| `api.getSurah(id)` | GET | سورة واحدة — **TODO: mock** |
| `api.checkStudentByEmail(email)` | GET | التحقق من طالب |
| `api.saveStudent(email, name)` | POST/PUT | حفظ/تحديث طالب |
| `api.getCurrentStudent()` | GET | الطالب الحالي من الجلسة |
| `api.logout()` | - | تسجيل خروج |

كل الـ endpoints لها **Supabase + localStorage fallback**.

---

## 📚 Key Documents

- `README.md` — وصف عام (يحتاج تحديث)
- `SUPABASE_SETUP.md` — خطوات إعداد Supabase
- `AGENTS.md` — هذا الملف (للمستقبل)

---

## 🆘 When You're Stuck

1. اقرأ الكود كامل قبل ما تعدل
2. لو لقيت console.log بدون implementation، اسأل Bayan عن المطلوب
3. لو فيه ملف CSS تحتاج تعدله، **اسأل Bayan مباشرة**
4. لا تخمّن — اقرأ `schema.sql` و `api.js` للحقيقة
5. بعد التعديل، اعمل `npm run build` للتأكد ما فيه أخطاء

---

**آخر تحديث:** 2026-09-03 by Mavis
