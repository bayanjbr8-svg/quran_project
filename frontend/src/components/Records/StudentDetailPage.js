/**
 * StudentDetailPage - تفاصيل سجل الطالب
 * المنارة القرآنية
 *
 * عرض شامل لتقدم الطالب:
 * - معلومات شخصية
 * - إحصائيات التقدم (تلاوات، اختبارات، معدل)
 * - سجل التلاوات مع النتائج
 * - تحرير البيانات (للمعلم)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/Records.css';

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [recitations, setRecitations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', username: '', email: '' });

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');
      const [studentData, recs, stats] = await Promise.all([
        api.getStudent(studentId),
        api.getStudentRecitations(studentId).catch(() => []),
        api.getStudentStatistics(studentId).catch(() => null),
      ]);

      setStudent(studentData);
      setEditData({
        name: studentData.name || '',
        username: studentData.username || '',
        email: studentData.email || '',
      });
      setRecitations(Array.isArray(recs) ? recs : recs.results || []);
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading student:', err);
      setError(err.message || 'فشل تحميل بيانات الطالب');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) loadAll();
  }, [studentId]);

  const handleSaveEdit = async () => {
    try {
      await api.updateStudent(studentId, editData);
      setIsEditing(false);
      await loadAll();
    } catch (err) {
      alert(`فشل التحديث: ${err.message}`);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="records-page loading-state">
        <div className="spinner"></div>
        <p>جاري تحميل بيانات الطالب...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="records-page">
        <div className="records-error">
          <p>⚠️ {error}</p>
          <button onClick={() => navigate('/records')}>العودة للقائمة</button>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="student-detail-page">
      <div className="records-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
      </div>

      {/* الشريط العلوي */}
      <nav className="records-nav">
        <button className="back-btn" onClick={() => navigate('/records')}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <span>العودة للسجلات</span>
        </button>
        <div className="records-nav-title">
          <span className="records-icon">👤</span>
          <span>ملف الطالب</span>
        </div>
        <button
          className="refresh-btn"
          onClick={loadAll}
          title="تحديث"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>
      </nav>

      {/* بطاقة الطالب الرئيسية */}
      <header className="student-hero">
        <img
          src={
            student.avatar_url ||
            student.avatar ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.email || student.username || '')}`
          }
          alt={student.name}
          className="hero-avatar"
        />
        <div className="hero-info">
          <h1 className="hero-name">{student.name || student.username}</h1>
          <p className="hero-username">@{student.username}</p>
          <p className="hero-email">{student.email}</p>
          <p className="hero-meta">
            📅 مسجل منذ: {formatDate(student.created_at || student.date_joined)}
          </p>
        </div>
        <div className="hero-actions">
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            ✏️ تعديل البيانات
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="detail-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 نظرة عامة
        </button>
        <button
          className={`tab ${activeTab === 'recitations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recitations')}
        >
          🎙️ التلاوات ({recitations.length})
        </button>
        <button
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📈 النشاط
        </button>
      </nav>

      {/* محتوى الـ Tab */}
      {activeTab === 'overview' && (
        <section className="overview-grid">
          <div className="overview-card">
            <h3>إحصائيات التلاوات</h3>
            {statistics ? (
              <div className="stats-list">
                <div className="stat-row">
                  <span>إجمالي التلاوات</span>
                  <strong>{statistics.total_recitations ?? recitations.length}</strong>
                </div>
                <div className="stat-row">
                  <span>متوسط النتائج</span>
                  <strong>{Math.round(statistics.average_score ?? 0)}%</strong>
                </div>
                <div className="stat-row">
                  <span>أفضل نتيجة</span>
                  <strong>{Math.round(statistics.best_score ?? 0)}%</strong>
                </div>
                <div className="stat-row">
                  <span>آخر نتيجة</span>
                  <strong>{Math.round(statistics.last_score ?? 0)}%</strong>
                </div>
              </div>
            ) : (
              <p className="no-data">لا توجد إحصائيات متاحة بعد</p>
            )}
          </div>

          <div className="overview-card">
            <h3>آخر النشاط</h3>
            <div className="activity-summary">
              <div className="activity-item">
                <span className="activity-icon">🕐</span>
                <div>
                  <span className="activity-label">آخر زيارة</span>
                  <span className="activity-value">{formatDate(student.last_visit)}</span>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">🎙️</span>
                <div>
                  <span className="activity-label">آخر تلاوة</span>
                  <span className="activity-value">
                    {recitations[0] ? formatDate(recitations[0].created_at) : 'لا يوجد'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="overview-card progress-card">
            <h3>شريط التقدم</h3>
            <div className="progress-bar-wrap">
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${statistics?.average_score ?? 0}%`,
                  }}
                >
                  {Math.round(statistics?.average_score ?? 0)}%
                </div>
              </div>
              <p className="progress-caption">متوسط أداء الطالب</p>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'recitations' && (
        <section className="recitations-list">
          {recitations.length === 0 ? (
            <div className="empty-state">
              <p>🎙️ لا توجد تلاوات لهذا الطالب بعد</p>
            </div>
          ) : (
            <table className="recitations-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>الآية</th>
                  <th>النتيجة</th>
                  <th>ما تعرف عليه AI</th>
                  <th>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recitations.map((rec, i) => (
                  <tr key={rec.id || i}>
                    <td>{recitations.length - i}</td>
                    <td className="verse-cell">{rec.verse || '—'}</td>
                    <td>
                      <span
                        className={`score-pill ${
                          rec.score >= 80 ? 'high' : rec.score >= 50 ? 'mid' : 'low'
                        }`}
                      >
                        {Math.round(rec.score || 0)}%
                      </span>
                    </td>
                    <td className="recognized-cell">{rec.recognized_text || '—'}</td>
                    <td>{formatDate(rec.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {activeTab === 'activity' && (
        <section className="activity-section">
          <div className="activity-timeline">
            {recitations.slice(0, 20).map((rec, i) => (
              <div key={rec.id || i} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>تسجيل تلاوة</strong>
                    <span className="timeline-score">{Math.round(rec.score || 0)}%</span>
                  </div>
                  <p className="timeline-verse">{rec.verse}</p>
                  <span className="timeline-date">{formatDate(rec.created_at)}</span>
                </div>
              </div>
            ))}
            {recitations.length === 0 && (
              <p className="empty-state">لا يوجد نشاط بعد</p>
            )}
          </div>
        </section>
      )}

      {/* Modal التعديل */}
      {isEditing && (
        <div className="edit-modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2>تعديل بيانات الطالب</h2>
            <div className="form-group">
              <label>الاسم</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>اسم المستخدم</label>
              <input
                type="text"
                value={editData.username}
                onChange={(e) =>
                  setEditData({ ...editData, username: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                إلغاء
              </button>
              <button className="save-btn" onClick={handleSaveEdit}>
                💾 حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetailPage;
