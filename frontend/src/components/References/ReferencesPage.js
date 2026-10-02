/**
 * ReferencesPage - المراجع والكتب الإسلامية
 * المنارة القرآنية
 *
 * شبكة كتب وأيقونات بأغلفة SVG مخصصة
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/References.css';

const ReferencesPage = () => {
  const navigate = useNavigate();

  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [selectedRef, setSelectedRef] = useState(null);
  const [category, setCategory] = useState('all');

  // بيانات وهمية للكتب الإسلامية الكلاسيكية
  const MOCK_REFS = [
    {
      id: 1,
      title: 'المصحف المصور',
      title_en: 'Illustrated Mushaf',
      author: 'none',
      category: 'mushaf',
      description: 'مصحف مزخرف بألوان إسلامية لإبراز مواضع الآيات والسور',
      color1: '#1a237e',
      color2: '#0d47a1',
      icon: '📖',
      pages: 604,
      year: 2010,
    },
    {
      id: 2,
      title: 'النور المبين',
      title_en: 'Al-Nour Al-Mubeen',
      author: 'الشيخ أحمد الجمل',
      category: 'tafsir',
      description: 'تفسير القرآن الكريم بأسلوب سهل وميسر',
      color1: '#00695c',
      color2: '#004d40',
      icon: '✨',
      pages: 850,
      year: 2005,
    },
    {
      id: 3,
      title: 'تجويد القرآن',
      title_en: 'Tajweed Quran',
      author: 'الشيخ علي الضباع',
      category: 'tajweed',
      description: 'أحكام تجويد القرآن الكريم للمبتدئين والمتقدمين',
      color1: '#c62828',
      color2: '#8e0000',
      icon: '🎯',
      pages: 320,
      year: 1998,
    },
    {
      id: 4,
      title: 'التفسير الميسر',
      title_en: 'Al-Tafsir Al-Muyassar',
      author: 'نخبة من العلماء',
      category: 'tafsir',
      description: 'تفسير مختصر للقرآن بأسلوب عصري',
      color1: '#4527a0',
      color2: '#311b92',
      icon: '🌙',
      pages: 1200,
      year: 2015,
    },
    {
      id: 5,
      title: 'أسباب النزول',
      title_en: 'Asbab Al-Nuzul',
      author: 'الواحدي',
      category: 'ulum',
      description: 'كتاب في أسباب نزول الآيات والسور القرآنية',
      color1: '#bf360c',
      color2: '#870000',
      icon: '📜',
      pages: 480,
      year: 1990,
    },
    {
      id: 6,
      title: 'إعراب القرآن',
      title_en: 'Irab Al-Quran',
      author: 'الزجاج',
      category: 'ulum',
      description: 'إعراب كلمات القرآن الكريم وشرح معانيها النحوية',
      color1: '#283593',
      color2: '#1a237e',
      icon: '🔤',
      pages: 920,
      year: 1988,
    },
    {
      id: 7,
      title: 'القراءات العشر',
      title_en: 'Al-Qira\'at Al-Ashra',
      author: 'ابن الجزري',
      category: 'qiraat',
      description: 'النشر في القراءات العشر مع أسانيدها ورواتها',
      color1: '#d4af37',
      color2: '#b8860b',
      icon: '📿',
      pages: 1100,
      year: 1980,
    },
    {
      id: 8,
      title: 'علوم القرآن',
      title_en: 'Ulum Al-Quran',
      author: 'الزركشي',
      category: 'ulum',
      description: 'المرجع الشامل في علوم القرآن الكريم ومباحثه',
      color1: '#37474f',
      color2: '#263238',
      icon: '🕌',
      pages: 1500,
      year: 1975,
    },
    {
      id: 9,
      title: 'الجامع لأحكام القرآن',
      title_en: 'Al-Jami li-Ahkam Al-Quran',
      author: 'الإمام القرطبي',
      category: 'tafsir',
      description: 'من أعظم كتب التفسير بالمأثور والمعقول',
      color1: '#5d4037',
      color2: '#3e2723',
      icon: '📚',
      pages: 2200,
      year: 1965,
    },
  ];

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getReferences();
      const list = Array.isArray(data) ? data : data.results || [];
      setReferences(list);
      setIsPreview(false);
    } catch (err) {
      console.warn('API not available, showing preview mode:', err);
      setReferences(MOCK_REFS);
      setIsPreview(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = [
    { id: 'all', label: 'الكل', icon: '📚' },
    { id: 'mushaf', label: 'المصاحف', icon: '📖' },
    { id: 'tafsir', label: 'التفسير', icon: '🌙' },
    { id: 'tajweed', label: 'التجويد', icon: '🎯' },
    { id: 'qiraat', label: 'القراءات', icon: '📿' },
    { id: 'ulum', label: 'علوم القرآن', icon: '🕌' },
  ];

  const filtered = category === 'all'
    ? references
    : references.filter((r) => r.category === category);

  return (
    <div className="references-page">
      <div className="references-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* الشريط العلوي */}
      <nav className="references-nav">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <span>العودة</span>
        </button>
        <div className="references-nav-title">
          <span className="ref-icon">📚</span>
          <span>المراجع والكتب</span>
        </div>
        <button className="refresh-btn" onClick={load} title="تحديث">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>
      </nav>

      {/* العنوان */}
      <header className="references-header">
        <h1 className="references-title">📚 مكتبة المراجع الإسلامية</h1>
        <p className="references-subtitle">
          مراجع وكتب مختارة بعناية في علوم القرآن والتجويد والتفسير
        </p>
        {isPreview && (
          <div className="preview-banner">
            👁️ <strong>وضع المعاينة</strong> — البيانات تجريبية.
          </div>
        )}
      </header>

      {/* فلتر التصنيفات */}
      <div className="categories-bar">
        {categories.map((c) => (
          <button
            key={c.id}
            className={`category-pill ${category === c.id ? 'active' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
            <span className="count">
              {c.id === 'all'
                ? references.length
                : references.filter((r) => r.category === c.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* شبكة الكتب */}
      {loading ? (
        <div className="references-loading">
          <div className="spinner"></div>
          <p>جاري تحميل المراجع...</p>
        </div>
      ) : (
        <section className="books-grid">
          {filtered.map((book) => (
            <article
              key={book.id}
              className="book-card"
              onClick={() => setSelectedRef(book)}
            >
              {/* غلاف SVG */}
              <div
                className="book-cover"
                style={{
                  background: `linear-gradient(135deg, ${book.color1 || '#1a237e'}, ${book.color2 || '#0d47a1'})`,
                }}
              >
                <div className="book-spine"></div>
                <div className="book-emblem">{book.icon || '📖'}</div>
                <div className="book-title-on-cover">{book.title}</div>
                <div className="book-pattern">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <pattern id={`p-${book.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.15)" />
                    </pattern>
                    <rect width="100" height="100" fill={`url(#p-${book.id})`} />
                  </svg>
                </div>
                <div className="book-band"></div>
              </div>

              {/* معلومات الكتاب */}
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                {book.author && book.author !== 'none' && (
                  <p className="book-author">✍️ {book.author}</p>
                )}
                <p className="book-desc">{book.description}</p>
                <div className="book-meta">
                  {book.pages && (
                    <span className="meta-tag">📄 {book.pages} صفحة</span>
                  )}
                  {book.year && (
                    <span className="meta-tag">📅 {book.year}</span>
                  )}
                </div>
                <button className="open-book-btn">
                  📖 فتح الكتاب
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Modal تفاصيل الكتاب */}
      {selectedRef && (
        <div className="book-modal-overlay" onClick={() => setSelectedRef(null)}>
          <div className="book-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedRef(null)}>×</button>

            <div className="modal-cover"
              style={{
                background: `linear-gradient(135deg, ${selectedRef.color1}, ${selectedRef.color2})`,
              }}
            >
              <span className="modal-emoji">{selectedRef.icon}</span>
              <h2 className="modal-title">{selectedRef.title}</h2>
            </div>

            <div className="modal-body">
              {selectedRef.title_en && (
                <p className="modal-title-en">{selectedRef.title_en}</p>
              )}
              {selectedRef.author && selectedRef.author !== 'none' && (
                <p className="modal-author">
                  <strong>المؤلف:</strong> {selectedRef.author}
                </p>
              )}
              <p className="modal-desc">{selectedRef.description}</p>

              <div className="modal-meta-grid">
                {selectedRef.pages && (
                  <div className="modal-meta-item">
                    <span>📄</span>
                    <strong>{selectedRef.pages}</strong>
                    <span>صفحة</span>
                  </div>
                )}
                {selectedRef.year && (
                  <div className="modal-meta-item">
                    <span>📅</span>
                    <strong>{selectedRef.year}</strong>
                    <span>سنة</span>
                  </div>
                )}
                {selectedRef.category && (
                  <div className="modal-meta-item">
                    <span>📂</span>
                    <strong>{categories.find((c) => c.id === selectedRef.category)?.label}</strong>
                    <span>التصنيف</span>
                  </div>
                )}
              </div>

              <button className="read-btn">📖 ابدأ القراءة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferencesPage;
