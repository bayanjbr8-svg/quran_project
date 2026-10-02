/**
 * HomePage Component - المنارة القرآنية
 * الصفحة الرئيسية للمنصة مع الخلفيات الإسلامية المتحركة
 *
 * @author Matrix Agent
 * @date 2026-06-07
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Home.css';
import api from '../../services/api';

/**
 * Navigation Component
 * شريط التنقل
 */
const Navigation = ({ currentStudent, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="/" className="logo">
        <span className="logo-icon">☪</span>
        <span>المنارة القرآنية</span>
      </a>
      <ul className="nav-links">
        <li><a href="#home">الرئيسية</a></li>
        <li><a href="#features">المميزات</a></li>
        <li><a href="#about">عن المنصة</a></li>
        <li><a href="#contact">تواصل معنا</a></li>
      </ul>
      
      {/* معلومات الطالب المسجل */}
      {currentStudent && (
        <div className="nav-user-info">
          <img 
            src={currentStudent.avatar} 
            alt={currentStudent.name || currentStudent.email}
            className="nav-user-avatar"
          />
          <div className="nav-user-details">
            <span className="nav-user-name">
              {currentStudent.name || currentStudent.email.split('@')[0]}
            </span>
            <button className="nav-logout-btn" onClick={onLogout}>
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

/**
 * Islamic Background Component
 * خلفية إسلامية متحركة مع الهلال والنجوم والأشكال الهندسية
 */
const IslamicBackground = () => {
  return (
    <div className="wave-background">
      {/* Animated Wave Shapes - التموجات */}
      <div className="wave wave1"></div>
      <div className="wave wave2"></div>
      <div className="wave wave3"></div>
      
      {/* Islamic Pattern - النمط الهندسي الإسلامي المتحرك */}
      <div className="islamic-pattern"></div>
      
      {/* Crescent Moon - الهلال المتحرك */}
      <div className="crescent-moon"></div>
      
      {/* Islamic Stars - النجوم الإسلامية المتلألئة */}
      <div className="islamic-stars">
        <span className="islamic-star star-1">✦</span>
        <span className="islamic-star star-2">✧</span>
        <span className="islamic-star star-3">✦</span>
        <span className="islamic-star star-4">✧</span>
        <span className="islamic-star star-5">✦</span>
        <span className="islamic-star star-6">✧</span>
        <span className="islamic-star star-7">✦</span>
        <span className="islamic-star star-8">✧</span>
        <span className="islamic-star star-9">✦</span>
        <span className="islamic-star star-10">✧</span>
      </div>
      
      {/* Mosque Silhouette - صورة المسجد */}
      <div className="mosque-silhouette">
        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          {/* قبة المركز */}
          <ellipse cx="100" cy="40" rx="35" ry="40"/>
          {/* المئذنة */}
          <rect x="160" y="20" width="8" height="80"/>
          <ellipse cx="164" cy="15" rx="12" ry="8"/>
          <rect x="162" y="5" width="4" height="15"/>
          {/* المبنى الرئيسي */}
          <rect x="40" y="60" width="120" height="50"/>
          <rect x="50" y="45" width="30" height="20"/>
          <rect x="120" y="45" width="30" height="20"/>
          {/* الأقواس */}
          <ellipse cx="75" cy="85" rx="15" ry="25" fill="none" stroke="currentColor" strokeWidth="2"/>
          <ellipse cx="100" cy="85" rx="15" ry="25" fill="none" stroke="currentColor" strokeWidth="2"/>
          <ellipse cx="125" cy="85" rx="15" ry="25" fill="none" stroke="currentColor" strokeWidth="2"/>
          {/* القبة الثانية */}
          <ellipse cx="65" cy="55" rx="18" ry="15"/>
          <ellipse cx="135" cy="55" rx="18" ry="15"/>
        </svg>
      </div>
      
      {/* Dust Particles - جسيمات الغبار الذهبية */}
      <div className="dust-particles">
        <div className="dust"></div>
        <div className="dust"></div>
        <div className="dust"></div>
        <div className="dust"></div>
        <div className="dust"></div>
        <div className="dust"></div>
        <div className="dust"></div>
        <div className="dust"></div>
      </div>
      
      {/* Floating Bubbles */}
      <div className="bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>
      
      {/* Sparkle Effects */}
      <div className="sparkles">
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
      </div>
    </div>
  );
};

/**
 * Hero Section Component
 * قسم البطل - المحتوى الرئيسي
 */
const HeroSection = ({ platformInfo, currentStudent, onStartReading }) => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        {/* ترحيب الطالب المسجل */}
        {currentStudent && (
          <div className="welcome-banner slide-up">
            <img 
              src={currentStudent.avatar} 
              alt={currentStudent.name || 'مستخدم'}
              className="welcome-avatar"
            />
            <div className="welcome-text">
              <h2 className="welcome-title">
                أهلاً بك {currentStudent.name || currentStudent.email.split('@')[0]}
              </h2>
              <p className="welcome-message">
                سعيدون بعودتك! استمتع بقراءة القرآن الكريم
              </p>
            </div>
          </div>
        )}

        {/* العنوان الرئيسي */}
        <h1 className="main-title fade-in">
          {platformInfo.name}
        </h1>

        {/* الشعار */}
        <p className="tagline slide-up">
          {platformInfo.tagline}
        </p>

        {/* الآية القرآنية */}
        <div className="quranic-verse slide-up">
          ﴿{platformInfo.verse}﴾
          <span className="verse-source">{platformInfo.verseSource}</span>
        </div>

        {/* الوصف */}
        <p className="description slide-up">
          {platformInfo.description}
        </p>

        {/* زر الدعوة */}
        {currentStudent ? (
          /* الطالب المسجل - ينقل مباشرة للقائمة */
          <button onClick={onStartReading} className="cta-button slide-up glow">
            ابدأ القراءة
          </button>
        ) : (
          <a href="#features" className="cta-button slide-up glow">
            اكتشف المزيد
          </a>
        )}
      </div>
    </section>
  );
};

/**
 * Features Section Component
 * قسم المميزات
 */
const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: '📖',
      title: 'القرآن الكريم',
      description: 'قراءة القرآن الكريم بخط واضح ومريح للعين مع إمكانية الاستماع للتلاوات المختلفة'
    },
    {
      id: 2,
      icon: '🎧',
      title: 'التلاوات المرئية',
      description: 'مشاهدة تلاوات مشاهير القراء مع إمكانية التحكم في سرعة التشغيل'
    },
    {
      id: 3,
      icon: '🔍',
      title: 'البحث المتقدم',
      description: 'البحث في القرآن الكريم بكلمات أو آيات مع إمكانية البحث في التفسير'
    },
    {
      id: 4,
      icon: '⭐',
      title: 'المفضلة',
      description: 'حفظ الآيات المفضلة والعودة إليها في أي وقت مع إمكانية إضافة ملاحظات'
    },
    {
      id: 5,
      icon: '📊',
      title: 'تتبع القراءة',
      description: 'متابعة تقدمك في قراءة القرآن الكريم يومياً مع إحصائيات شاملة'
    },
    {
      id: 6,
      icon: '👥',
      title: 'المجتمع',
      description: 'التفاعل مع المسلمين حول العالم ومشاركة التجارب والخبرات القرآنية'
    }
  ];

  return (
    <section className="features-section" id="features">
      <h2 className="section-title">مميزات المنصة</h2>
      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.id} className="feature-card slide-up">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * CTA Section Component
 * قسم الدعوة للعمل - يُظهر دعوة للتسجيل للطلاب غير المسجلين
 * التسجيل يتم عبر صفحة /signup المنفصلة
 */
const CTASection = ({ currentStudent }) => {
  const navigate = useNavigate();

  if (currentStudent) {
    // الطالب المسجل - لا نعرض هذا القسم
    return null;
  }

  return (
    <section className="cta-section" id="about">
      <h2 className="cta-title">ابدأ رحلتك القرآنية اليوم</h2>
      <p className="cta-description">
        أنشئ حساباً جديداً لتبدأ رحلتك مع القرآن الكريم
      </p>

      <button
        type="button"
        className="cta-button"
        onClick={() => navigate('/signup')}
      >
        ✨ إنشاء حساب جديد
      </button>

      {/* رابط لتسجيل الدخول للطلاب المسجلين */}
      <p className="registered-hint">
        لديك حساب بالفعل؟{' '}
        <a href="/login" style={{ color: '#1a237e', fontWeight: 600, textDecoration: 'none' }}>
          تسجيل الدخول
        </a>
      </p>
    </section>
  );
};

/**
 * Login Section Component
 * قسم تسجيل الدخول - للطالب غير المسجل فقط
 * ينقل مباشرة لصفحة /signup
 */
const LoginSection = ({ currentStudent }) => {
  const navigate = useNavigate();

  // إذا كان الطالب مسجل، لا نعرض شيئاً
  if (currentStudent) {
    return null;
  }

  const handleLogin = () => {
    // الانتقال المباشر لصفحة التسجيل الجديدة
    navigate('/signup');
  };

  return (
    <section className="login-section" id="login">
      <button className="login-button" onClick={handleLogin}>
        <span className="login-icon">✨</span>
        <span className="login-text">سجل الآن</span>
      </button>
    </section>
  );
};

/**
 * Footer Component with Contact Info
 * الذيل مع معلومات التواصل والأرقام
 */
const Footer = () => {
  const contactInfo = [
    {
      icon: '📞',
      label: 'اتصل بنا',
      value: '0938604447'
    },
    {
      icon: '✉️',
      label: 'البريد الإلكتروني',
      value: 'info@quran-platform.com'
    },
    {
      icon: '📍',
      label: 'الموقع',
      value: 'حلب، سوريا'
    }
  ];

  return (
    <footer className="footer" id="contact">
      {/* معلومات التواصل */}
      <div className="contact-info">
        {contactInfo.map((item, index) => (
          <div key={index} className="contact-item">
            <span className="contact-icon">{item.icon}</span>
            <div>
              <div className="contact-label">{item.label}</div>
              <div className="contact-value">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="footer-text">
        © 2026 المنارة القرآنية - جميع الحقوق محفوظة
      </p>
    </footer>
  );
};

/**
 * Main HomePage Component
 * الصفحة الرئيسية
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [platformInfo, setPlatformInfo] = useState({
    name: 'المنارة القرآنية',
    tagline: 'نورٌ يضيء دربك',
    description: 'منصة قرآنية متكاملة تهدف إلى تسهيل الوصول إلى القرآن الكريم وعلومه، ونشر النور والهداية لكل Muslims في جميع أنحاء العالم',
    verse: 'إِنَّ هَذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا',
    verseSource: 'الإسراء - الآية 9'
  });

  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState(null);

  /**
   * تحميل معلومات المنصة والطالب الحالي
   * (تم تعطيل التحويل التلقائي مؤقتاً - للسماح بالمعاينة)
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // التحقق من الطالب (بدون تحويل تلقائي)
        const student = await api.getCurrentStudent();

        // طالب جديد → يحمّل الصفحة الرئيسية
        const data = await api.getPlatformInfo();
        setPlatformInfo({
          ...platformInfo,
          ...data
        });

        setCurrentStudent(student);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * بدء القراءة - ينقل الطالب لواجهة القائمة
   */
  const handleStartReading = () => {
    // التحقق إذا كان الطالب مسجل
    if (currentStudent) {
      // الطالب المسجل - ينقل مباشرة للقائمة
      window.location.href = '/dashboard';
    } else {
      // الطالب غير المسجل - ينقل لقسم التسجيل
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * تسجيل الخروج
   */
  const handleLogout = () => {
    api.logout();
    setCurrentStudent(null);
  };

  if (loading) {
    return (
      <div className="home-page loading">
        <div className="loading-spinner">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* الخلفية الإسلامية المتحركة */}
      <IslamicBackground />

      {/* شريط التنقل */}
      <Navigation currentStudent={currentStudent} onLogout={handleLogout} />

      {/* المحتوى الرئيسي */}
      <HeroSection 
        platformInfo={platformInfo} 
        currentStudent={currentStudent}
        onStartReading={handleStartReading}
      />

      {/* قسم المميزات */}
      <FeaturesSection />

      {/* قسم الدعوة للعمل */}
      <CTASection 
        currentStudent={currentStudent}
      />

      {/* قسم تسجيل الدخول */}
      <LoginSection currentStudent={currentStudent} />

      {/* الذيل مع معلومات التواصل */}
      <Footer />
    </div>
  );
};

export default HomePage;