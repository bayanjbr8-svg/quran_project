/**
 * RecordsPage - سجلات الطلاب
 * المنارة القرآنية
 *
 * لوحة المعلم لإدارة الطلاب:
 * - عرض كل الطلاب
 * - إحصائيات سريعة (التقدم، التلاوات، الاختبارات)
 * - البحث
 * - الدخول للتفاصيل + التعديل/الحذف
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/Records.css';

const RecordsPage = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRecitations: 0,
    avgScore: 0,
    activeToday: 0,
  });

  // تحميل البيانات
  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.listStudents();
      const list = Array.isArray(data) ? data : data.results || [];
      setStudents(list);
      setIsPreview(false);

      // حساب إحصائيات سريعة
      const totalStudents = list.length;
      const totalRecitations = list.reduce(
        (sum, s) => sum + (s.recitations_count || 0),
        0
      );
      const avgScore = list.length
        ? Math.round(
            list.reduce((sum, s) => sum + (s.average_score || 0), 0) / list.length
          )
        : 0;
      const today = new Date().toDateString();
      const activeToday = list.filter(
        (s) => s.last_visit && new Date(s.last_visit).toDateString() === today
      ).length;

      setStats({ totalStudents, totalRecitations, avgScore, activeToday });
    } catch (err) {
      console.warn('API not available, showing preview mode:', err);
      // وضع المعاينة: اعرض بيانات تجريبية
      const mockList = [
        { id: 1, name: 'أحمد محمد', username: 'ahmad', email: 'ahmad@example.com', recitations_count: 12, quizzes_count: 8, average_score: 87, last_visit: new Date(Date.now() - 3600000).toISOString(), created_at: '2026-08-15T10:00:00Z', avatar_url: '' },
        { id: 2, name: 'فاطمة علي', username: 'fatima', email: 'fatima@example.com', recitations_count: 18, quizzes_count: 12, average_score: 92, last_visit: new Date(Date.now() - 1800000).toISOString(), created_at: '2026-07-20T08:30:00Z', avatar_url: '' },
        { id: 3, name: 'يوسف إبراهيم', username: 'yousef', email: 'yousef@example.com', recitations_count: 7, quizzes_count: 5, average_score: 74, last_visit: new Date(Date.now() - 86400000).toISOString(), created_at: '2026-09-01T14:20:00Z', avatar_url: '' },
        { id: 4, name: 'مريم حسن', username: 'mariam', email: 'mariam@example.com', recitations_count: 22, quizzes_count: 15, average_score: 95, last_visit: new Date().toISOString(), created_at: '2026-06-10T09:15:00Z', avatar_url: '' },
        { id: 5, name: 'عمر خالد', username: 'omar', email: 'omar@example.com', recitations_count: 9, quizzes_count: 6, average_score: 81, last_visit: new Date(Date.now() - 7200000).toISOString(), created_at: '2026-08-25T11:45:00Z', avatar_url: '' },
        { id: 6, name: 'زينب أحمد', username: 'zeinab', email: 'zeinab@example.com', recitations_count: 15, quizzes_count: 10, average_score: 88, last_visit: new Date(Date.now() - 259200000).toISOString(), created_at: '2026-07-05T13:30:00Z', avatar_url: '' },
      ];
      setStudents(mockList);
      setIsPreview(true);
      setStats({
        totalStudents: mockList.length,
        totalRecitations: mockList.reduce((s, x) => s + x.recitations_count, 0),
        avgScore: Math.round(mockList.reduce((s, x) => s + x.average_score, 0) / mockList.length),
        activeToday: mockList.filter(x => new Date(x.last_visit).toDateString() === new Date().toDateString()).length,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // حذف طالب
  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`هل أنت متأكد من حذف سجل الطالب "${studentName}"؟`)) return;
    try {
      await api.deleteStudent(studentId);
      await loadStudents();
    } catch (err) {
      alert(`فشل الحذف: ${err.message}`);
    }
  };

  // فلترة البحث
  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.username && s.username.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  });

  // تنسيق التاريخ
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // تنسيق "آخر زيارة"
  const formatLastVisit = (dateStr) => {
    if (!dateStr) return 'لم يزر بعد';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'الآن';
    if (diff < 3600) return `قبل ${Math.floor(diff / 60)} د`;
    if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} س`;
    if (diff < 604800) return `قبل ${Math.floor(diff / 86400)} ي`;
    return formatDate(dateStr);
  };

  return (
    <div className="records-page">
      <div className="records-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* الشريط العلوي */}
      <nav className="records-nav">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <span>العودة للقائمة</span>
        </button>
        <div className="records-nav-title">
          <span className="records-icon">📊</span>
          <span>سجلات الطلاب</span>
        </div>
        <button className="refresh-btn" onClick={loadStudents} title="تحديث">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>
      </nav>

      {/* العنوان والوصف */}
      <header className="records-header">
        <h1 className="records-title">سجلات الطلاب</h1>
        <p className="records-subtitle">
          متابعة تقدم الطلاب، مراجعة التلاوات، وإدارة الحسابات
        </p>
        {isPreview && (
          <div className="preview-banner">
            👁️ <strong>وضع المعاينة</strong> — البيانات تجريبية. للبيانات الحقيقية، سجّل دخول كأستاذ.
          </div>
        )}
      </header>

      {/* بطاقات الإحصائيات */}
      <section className="records-stats">
        <div className="stat-card stat-total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalStudents}</span>
            <span className="stat-label">إجمالي الطلاب</span>
          </div>
        </div>
        <div className="stat-card stat-recitations">
          <div className="stat-icon">🎙️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalRecitations}</span>
            <span className="stat-label">إجمالي التلاوات</span>
          </div>
        </div>
        <div className="stat-card stat-score">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <span className="stat-value">{stats.avgScore}%</span>
            <span className="stat-label">متوسط النتائج</span>
          </div>
        </div>
        <div className="stat-card stat-active">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <span className="stat-value">{stats.activeToday}</span>
            <span className="stat-label">نشط اليوم</span>
          </div>
        </div>
      </section>

      {/* شريط البحث */}
      <div className="records-toolbar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="ابحث بالاسم، اسم المستخدم، أو البريد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span className="result-count">
          {filtered.length} من {students.length}
        </span>
      </div>

      {/* قائمة الطلاب */}
      {loading ? (
        <div className="records-loading">
          <div className="spinner"></div>
          <p>جاري تحميل السجلات...</p>
        </div>
      ) : error ? (
        <div className="records-error">
          <p>⚠️ {error}</p>
          <button onClick={loadStudents}>إعادة المحاولة</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="records-empty">
          <div className="empty-icon">📭</div>
          <p>لا يوجد طلاب {searchQuery && 'يطابقون البحث'}</p>
        </div>
      ) : (
        <section className="students-grid">
          {filtered.map((student) => (
            <article key={student.id} className="student-card">
              <div className="student-card-header">
                <img
                  src={
                    student.avatar_url ||
                    student.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.email || student.username || '')}`
                  }
                  alt={student.name || student.username}
                  className="student-avatar"
                />
                <div className="student-basic-info">
                  <h3 className="student-name">
                    {student.name || student.username || 'بدون اسم'}
                  </h3>
                  <span className="student-username">@{student.username}</span>
                  <span className="student-email">{student.email}</span>
                </div>
              </div>

              <div className="student-card-stats">
                <div className="mini-stat">
                  <span className="mini-stat-value">
                    {student.recitations_count ?? 0}
                  </span>
                  <span className="mini-stat-label">تلاوة</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">
                    {student.quizzes_count ?? 0}
                  </span>
                  <span className="mini-stat-label">اختبار</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">
                    {student.average_score ? `${Math.round(student.average_score)}%` : '—'}
                  </span>
                  <span className="mini-stat-label">المعدل</span>
                </div>
              </div>

              <div className="student-card-footer">
                <span className="last-visit">
                  🕐 {formatLastVisit(student.last_visit)}
                </span>
                <div className="student-actions">
                  <button
                    className="action-btn view"
                    onClick={() => navigate(`/records/${student.id}`)}
                    title="عرض التفاصيل"
                  >
                    👁️ عرض
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() =>
                      handleDelete(
                        student.id,
                        student.name || student.username
                      )
                    }
                    title="حذف السجل"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default RecordsPage;
