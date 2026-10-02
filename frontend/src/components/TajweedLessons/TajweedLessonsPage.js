/**
 * TajweedLessonsPage - صفحة دروس التجويد
 * المنارة القرآنية
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const TajweedLessonsPage = () => {
  const navigate = useNavigate();

  const tempLessons = [
    { id: 1, title: 'الدرس الأول', description: 'مقدمة في علم التجويد' },
    { id: 2, title: 'الدرس الثاني', description: 'مخارج الحروف' },
    { id: 3, title: 'الدرس الثالث', description: 'أحكام النون الساكنة والتنوين' },
    { id: 4, title: 'الدرس الرابع', description: 'أحكام الميم الساكنة' },
    { id: 5, title: 'الدرس الخامس', description: 'المدود وأنواعها' },
    { id: 6, title: 'الدرس السادس', description: 'القلقلة' },
    { id: 7, title: 'الدرس السابع', description: 'أحكام الراءات' },
    { id: 8, title: 'الدرس الثامن', description: 'الوقف والابتداء' },
    { id: 9, title: 'الدرس التاسع', description: 'التفخيم والترقيق' },
    { id: 10, title: 'الدرس العاشر', description: 'مراجعة شاملة' },
    { id: 11, title: 'الدرس الحادي عشر', description: 'تدريبات عملية' },
    { id: 12, title: 'الدرس الثاني عشر', description: 'اختبار نهائي' }
  ];

  return (
    <div className="tajweed-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8eaf6 0%, #f5f5f5 100%)', position: 'relative', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 300, background: 'rgba(66, 165, 245, 0.1)', borderRadius: '50%', animation: 'waveMove 8s ease-in-out infinite' }}></div>
        <div style={{ position: 'absolute', top: 80, right: 50, width: 80, height: 80, borderRadius: '50%', boxShadow: '15px 15px 0 0 rgba(212, 175, 55, 0.3)', animation: 'float 6s ease-in-out infinite' }}></div>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 30px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '2px solid rgba(26,35,126,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 18px', borderRadius: '25px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #1a237e, #0d47a1)', color: 'white', fontWeight: 600 }}>→ العودة للقائمة</button>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a237e' }}>🕌 المنارة القرآنية</div>
        <div style={{ width: 120 }}></div>
      </nav>

      <header style={{ textAlign: 'center', padding: '50px 20px 30px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#1a237e', fontFamily: "'Amiri', serif" }}>دروس التجويد</h1>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>تعلم أحكام التجويد خطوة بخطوة</p>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 30px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
          {tempLessons.map((lesson) => (
            <div key={lesson.id} style={{ background: 'white', borderRadius: '20px', padding: '30px 20px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', border: '2px solid transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(26,35,126,0.2)'; e.currentTarget.style.borderColor = '#42a5f5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <div style={{ width: '50px', height: '50px', margin: '0 auto 15px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a237e, #0d47a1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700 }}>{lesson.id}</div>
              <h3 style={{ fontSize: '1.3rem', color: '#1a237e', margin: '0 0 10px' }}>{lesson.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6 }}>{lesson.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '30px', background: 'rgba(26,35,126,0.05)' }}>
        <p style={{ color: '#1a237e' }}>المنارة القرآنية © 2026</p>
      </footer>

      <style>{`
        @keyframes waveMove { 0%,100%{transform:translateX(0);} 50%{transform:translateX(-25%);} }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-20px);} }
      `}</style>
    </div>
  );
};

export default TajweedLessonsPage;
