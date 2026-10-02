-- ============================================
-- Supabase Schema for Quran Platform
-- المنارة القرآنية - مخطط قاعدة البيانات
-- ============================================

-- 1. إنشاء جدول الطلاب (Students)
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس لتسريع البحث بالبريد الإلكتروني
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- 2. إضافة قيد لمنع تكرار البريد الإلكتروني
-- ============================================
ALTER TABLE students ADD CONSTRAINT students_email_unique 
UNIQUE (email);

-- 3. تفعيل Row Level Security (RLS)
-- ============================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 4. سياسات الأمان (Security Policies)
-- ============================================

--_policy: يمكن للجميع رؤية جميع البيانات (للقراءة فقط)
CREATE POLICY "Allow public read access"
ON students
FOR SELECT
USING (true);

-- _policy: يمكن للجميع إضافة طلاب جدد
CREATE POLICY "Allow public insert"
ON students
FOR INSERT
WITH CHECK (true);

-- _policy: يمكن للطلاب تحديث بياناتهم الخاصة فقط
CREATE POLICY "Allow users to update own data"
ON students
FOR UPDATE
USING (auth.email() = email);

-- 5. إنشاء Trigger لتحديث last_visit تلقائياً
-- ============================================
CREATE OR REPLACE FUNCTION update_last_visit()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_visit = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_visit
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_last_visit();

-- 6. عرض الجدول للتحقق
-- ============================================
-- SELECT * FROM students;
