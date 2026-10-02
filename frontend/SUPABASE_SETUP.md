# دليل إعداد Supabase - المنارة القرآنية
## خطوات الربط مع Backend

---

## الخطوة 1: إنشاء مشروع Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. سجل دخول أو أنشئ حساب جديد
3. اضغط على **New Project**
4. اختر اسم للمشروع (مثل: `quran-platform`)
5. انسخ **Project URL** و **API Key** من Settings > API

---

## الخطوة 2: نسخ بيانات الاعتماد

1. اذهب إلى **Settings** > **API**
2. انسخ:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: المفتاح المجهول

---

## الخطوة 3: إنشاء ملف .env

في مجلد المشروع، أنشئ ملف `.env`:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

استبدل القيم بالقيم من Supabase.

---

## الخطوة 4: تشغيل SQL Schema

1. في Supabase Dashboard، اذهب إلى **SQL Editor**
2. افتح ملف `supabase/schema.sql`
3. انسخ المحتوى والصقه
4. اضغط **Run** لتنفيذ

هذا سيقوم بـ:
- إنشاء جدول `students`
- إضافة الفهارس
- تفعيل Row Level Security
- إنشاء Trigger لتحديث آخر زيارة

---

## الخطوة 5: إعادة البناء

```bash
npm run build
npm run deploy
```

---

## هيكل جدول Students

| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | UUID | المفتاح الأساسي |
| email | TEXT | البريد الإلكتروني (فريد) |
| name | TEXT | اسم الطالب |
| avatar_url | TEXT | رابط صورة الملف الشخصي |
| created_at | TIMESTAMP | تاريخ التسجيل |
| last_visit | TIMESTAMP | آخر زيارة |

---

## ملفات الربط المُنشأة

```
src/services/
├── api.js          # API الرئيسي مع Supabase
└── supabase.js     # إعدادات Supabase

supabase/
└── schema.sql      # مخطط قاعدة البيانات

.env.example        # مثال لملف البيئة
```

---

## ملاحظة مهمة

**حالياً يعمل النظام بـ localStorage كـ fallback**

هذا يعني:
- ✅ النظام يعمل الآن بدون Supabase
- ✅ البيانات تُحفظ في المتصفح
- ✅ عند إضافة Supabase، البيانات ستُحفظ في قاعدة البيانات

---

## للتواصل مع فريق Backend

عند جاهزية الباك اند الحقيقي،文件中已经准备好:

1. **API URLs** في `api.js`
2. **Endpoints** المطلوبة:
   - `POST /students` - تسجيل طالب
   - `GET /students/:email` - التحقق من الطالب
   - `PUT /students/:email` - تحديث البيانات
   - `GET /students/current` - الطالب الحالي

---

## المساعدة

إذا واجهت أي مشكلة، تأكد من:
- ✅ نسخ مفتاح API الصحيح
- ✅ تشغيل schema.sql بنجاح
- ✅ إعادة تشغيل التطبيق بعد التعديل
