/**
 * LoginPage Component - المنارة القرآنية
 * صفحة تسجيل الدخول
 *
 * @author Matrix Agent
 * @date 2026-06-08
 */

import React, { useState } from 'react';
import '../../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

/**
 * Login Page Component
 * صفحة تسجيل الدخول الرئيسية
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // التحقق من اسم المستخدم
  const validateUsername = (username) => {
    return username.length >= 3;
  };

  const validatePassword = (pw) => pw.length >= 6;

  // معالج تغيير البريد الإلكتروني
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailError('الرجاء إدخال بريد إلكتروني صحيح');
    } else {
      setEmailError('');
    }
  };

  // معالج تغيير اسم المستخدم
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    
    if (value && !validateUsername(value)) {
      setUsernameError('يجب أن يكون الاسم 3 أحرف على الأقل');
    } else {
      setUsernameError('');
    }
  };

  // معالج تسجيل الدخول كمعلم
  const handleTeacherLogin = () => {
    window.location.href = '/teacher-register';
  };

  // معالج تسجيل الدخول
  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!validateUsername(username)) {
      setUsernameError('يجب أن يكون اسم المستخدم 3 أحرف على الأقل');
      isValid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError('كلمة المرور 6 أحرف على الأقل');
      isValid = false;
    }

    if (!isValid) return;

    setSubmitting(true);
    setPasswordError('');

    try {
      // لو حقل الإيميل فيه قيمة، استخدمه. وإلا استخدم اسم المستخدم
      const identifier = (email && email.includes('@')) ? email : username;
      await api.login(identifier, password);

      // حفظ بيانات المستخدم للعرض
      const cached = localStorage.getItem('quran_current_student');
      const student = cached ? JSON.parse(cached) : {
        username,
        email,
        name: username,
      };
      localStorage.setItem('quran_current_student', JSON.stringify(student));

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setPasswordError('اسم المستخدم أو كلمة المرور غير صحيحة');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      {/* الخلفية المتحركة */}
      <div className="login-background">
        <div className="login-wave"></div>
        <div className="login-wave login-wave2"></div>
        <div className="login-wave login-wave3"></div>
        <div className="login-bubbles">
          <div className="login-bubble"></div>
          <div className="login-bubble"></div>
          <div className="login-bubble"></div>
          <div className="login-bubble"></div>
        </div>
        <div className="login-sparkles">
          <span className="login-sparkle"></span>
          <span className="login-sparkle"></span>
          <span className="login-sparkle"></span>
          <span className="login-sparkle"></span>
          <span className="login-sparkle"></span>
        </div>
        <div className="islamic-stars-login">
          <span className="star-login">✦</span>
          <span className="star-login">✧</span>
          <span className="star-login">✦</span>
          <span className="star-login">✧</span>
          <span className="star-login">✦</span>
        </div>
        <div className="crescent-moon-login"></div>
      </div>

      {/* بطاقة تسجيل الدخول */}
      <div className="login-container">
        <div className="login-card">
          {/* الشعار */}
          <div className="login-logo">
            <span className="login-logo-icon">☪</span>
            <h1>المنارة القرآنية</h1>
          </div>

          {/* العنوان */}
          <h2 className="login-title">تسجيل الدخول</h2>
          <p className="login-subtitle">مرحباً بك في المنارة القرآنية</p>

          {/* نموذج تسجيل الدخول */}
          <form className="login-form" onSubmit={handleSubmit}>
            
            {/* حقل اسم المستخدم */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👤</span>
                اسم المستخدم
              </label>
              <input
                type="text"
                className={`form-input ${usernameError ? 'input-error' : ''}`}
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={handleUsernameChange}
              />
              {usernameError && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {usernameError}
                </span>
              )}
            </div>

            {/* حقل البريد الإلكتروني */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">✉️</span>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                className={`form-input ${emailError ? 'input-error' : ''}`}
                placeholder="أدخل البريد الإلكتروني"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {emailError}
                </span>
              )}
            </div>

            {/* حقل كلمة المرور */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔒</span>
                كلمة المرور
              </label>
              <input
                type="password"
                className={`form-input ${passwordError ? 'input-error' : ''}`}
                placeholder="6 أحرف على الأقل"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                dir="ltr"
              />
              {passwordError && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {passwordError}
                </span>
              )}
            </div>

            {/* زر تسجيل الدخول */}
            <button type="submit" className="login-submit-btn" disabled={submitting}>
              <span className="btn-icon">{submitting ? '⏳' : '🔑'}</span>
              <span className="btn-text">{submitting ? 'جاري الدخول...' : 'تسجيل الدخول'}</span>
            </button>

          </form>

          {/* رابط إنشاء حساب جديد */}
          <div className="back-link" style={{ marginTop: '15px', textAlign: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>ليس لديك حساب؟ </span>
            <a href="/signup" className="back-link-text" style={{ color: '#1a237e', fontWeight: 600, textDecoration: 'none' }}>
              إنشاء حساب جديد
            </a>
          </div>

          {/* رابط العودة للصفحة الرئيسية */}
          <div className="back-link">
            <a href="/" className="back-link-text">
              <span>←</span>
              العودة للصفحة الرئيسية
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;