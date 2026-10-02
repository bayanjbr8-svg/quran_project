/**
 * DashboardPage Component - المنارة القرآنية
 * صفحة القائمة الرئيسية للأطفال
 * تصميم مرح وملون
 */

import React from 'react';
import '../../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 1,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      title: 'الدروس القرآنية',
      description: 'تعلم وحفظ القرآن الكريم',
      color: '#FF6B6B',
      emoji: '📖',
      path: '/quran-lessons'
    },
    {
      id: 2,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/>
        </svg>
      ),
      title: 'دروس التجويد',
      description: 'تعلم أحكام التجويد',
      color: '#4ECDC4',
      emoji: '🎯',
      path: '/tajweed-lessons'
    },
    {
      id: 3,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
      ),
      title: 'الاختبارات',
      description: 'اختبر معلوماتك القرآنية',
      color: '#FFE66D',
      emoji: '⭐',
      path: '/quizzes'
    },
    {
      id: 5,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: 'المراجع',
      description: 'مراجع إضافية للدراسة',
      color: '#F472B6',
      emoji: '📚',
      path: '/references'
    },
    {
      id: 6,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
      ),
      title: 'السجلات',
      description: 'تتبع تقدمك وبياناتك',
      color: '#60A5FA',
      emoji: '🏆',
      path: '/records'
    }
  ];

  const handleSectionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-page">
      {/* خلفية متحركة ملونة */}
      <div className="dashboard-background">
        {/* سحب ملونة */}
        <div className="colorful-clouds">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
          <div className="cloud cloud-5"></div>
        </div>
        
        {/* نجوم متلألئة */}
        <div className="sparkle-stars">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`sparkle sparkle-${i + 1}`}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          ))}
        </div>
        
        {/* فقاعات ملونة */}
<div className="floating-bubbles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`bubble bubble-${i + 1}`}></div>
          ))}
        </div>
        
        {/* أقواس قزح */}
        <div className="rainbow-container">
          <div className="rainbow rainbow-1"></div>
          <div className="rainbow rainbow-2"></div>
        </div>
        
        {/* أشكال كرتونية */}
        <div className="cartoon-shapes">
          <div className="shape triangle shape-1"></div>
          <div className="shape diamond shape-2"></div>
          <div className="shape circle shape-3"></div>
          <div className="shape heart shape-4"></div>
          <div className="shape star shape-5"></div>
        </div>
        
        {/* غيوم صغيرة */}
        <div className="mini-clouds">
          <div className="mini-cloud mc-1">☁️</div>
          <div className="mini-cloud mc-2">☁️</div>
          <div className="mini-cloud mc-3">☁️</div>
        </div>
      </div>

      {/* شريط التنقل */}
      <nav className="dashboard-navbar">
        <a href="/" className="dashboard-logo">
          <span className="logo-icon">🕌</span>
          <span>المنارة القرآنية</span>
        </a>
        <div className="nav-actions">
          <a href="/" className="nav-link">🏠 الرئيسية</a>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <div className="dashboard-content">
        {/* العنوان */}
        <div className="dashboard-header">
          <div className="title-decoration">
            <span className="deco-star">✨</span>
            <span className="deco-star">🌟</span>
            <span className="deco-star">✨</span>
          </div>
          <h1 className="dashboard-title">القائمة الرئيسية</h1>
          <p className="dashboard-subtitle">اختر ما تريد تعلمه اليوم!</p>
        </div>

        {/* شبكة الأقسام */}
        <div className="sections-grid">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`section-card section-card-${index + 1}`}
              onClick={() => handleSectionClick(section.path)}
              style={{ 
                '--card-color': section.color,
                '--card-delay': `${index * 0.1}s`
              }}
            >
              {/* إيموجي كبير في الخلفية */}
              <div className="card-bg-emoji">{section.emoji}</div>
              
              <div className="section-icon" style={{ 
                background: `linear-gradient(135deg, ${section.color}, ${section.color}88)`
              }}>
                {section.icon}
              </div>
              
              <h3 className="section-title">{section.title}</h3>
              <p className="section-description">{section.description}</p>
              
              {/* زر الدائرة */}
              <div className="go-button">
                <span>▶</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-icons">
          <span>🌙</span>
          <span>⭐</span>
          <span>☪</span>
          <span>🌙</span>
        </div>
        <p>© 2026 المنارة القرآنية - رحلة ممتعة في عالم القرآن ✨</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
