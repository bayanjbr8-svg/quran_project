/**
 * Supabase Client Configuration
 * إعدادات اتصال Supabase
 * 
 * يتم تخزين البيانات في متغيرات البيئة
 */

import { createClient } from '@supabase/supabase-js';

// Supabase URL و Anonymous Key
// هذه البيانات ستأتي من Supabase Dashboard
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

/**
 * التحقق من وجود بيانات Supabase
 */
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

/**
 * إنشاء عميل Supabase
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * إعدادات Supabase للاستخدام مع Student API
 */
export const SUPABASE_CONFIG = {
  /**
   * جدول الطلاب
   */
  STUDENTS_TABLE: 'students',
  
  /**
   * أعمدة جدول الطلاب
   */
  STUDENTS_COLUMNS: {
    id: 'id',
    email: 'email',
    name: 'name',
    avatar_url: 'avatar_url',
    created_at: 'created_at',
    last_visit: 'last_visit'
  },
  
  /**
   * سياسات الأمان (RLS Policies)
   * يجب تطبيقها في Supabase Dashboard
   */
  POLICIES: {
    // يمكن للجميع القراءة
    SELECT: 'allow students select',
    // يمكن للطلاب إضافة بياناتهم الخاصة فقط
    INSERT: 'allow students insert own data',
    // يمكن تحديث بياناتهم الخاصة فقط
    UPDATE: 'allow students update own data'
  }
};

export default supabase;
