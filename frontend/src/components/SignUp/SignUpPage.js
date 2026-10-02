/**
 * SignUpPage Component - المنارة القرآنية
 * صفحة التسجيل للطلاب الجدد (أول مرة)
 *
 * الحقول: الاسم + البريد + كلمة المرور + تأكيد كلمة المرور
 * الحفظ: localStorage (يُستبدل بـ Supabase لاحقاً)
 */

import React, { useState } from 'react';
import '../../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SignUpPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // التحقق من البريد
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // الاسم 3 أحرف على الأقل
  const validateName = (n) => n.trim().length >= 3;
  // كلمة المرور 6 أحرف على الأقل
  const validatePassword = (pw) => pw.length >= 6;

  const handleNameChange = (e) => {
    const v = e.target.value;
    setName(v);
    setNameError(v && !validateName(v) ? 'يجب أن يكون الاسم 3 أحرف على الأقل' : '');
  };

  const handleEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    setEmailError(v && !validateEmail(v) ? 'الرجاء إدخال بريد إلكتروني صحيح' : '');
  };

  const handlePasswordChange = (e) => {
    const v = e.target.value;
    setPassword(v);
    setPasswordError(v && !validatePassword(v) ? 'كلمة المرور 6 أحرف على الأقل' : '');
    if (confirmPassword && v !== confirmPassword) {
      setConfirmError('كلمة المرور غير متطابقة');
    } else {
      setConfirmError('');
    }
  };

  const handleConfirmChange = (e) => {
    const v = e.target.value;
    setConfirmPassword(v);
    setConfirmError(v && v !== password ? 'كلمة المرور غير متطابقة' : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!validateName(name)) { setNameError('الرجاء إدخال الاسم'); isValid = false; }
    if (!validateEmail(email)) { setEmailError('الرجاء إدخال بريد إلكتروني صحيح'); isValid = false; }
    if (!validatePassword(password)) { setPasswordError('كلمة المرور 6 أحرف على الأقل'); isValid = false; }
    if (password !== confirmPassword) { setConfirmError('كلمة المرور غير متطابقة'); isValid = false; }

    if (!isValid) return;

    setSuccessMessage('');
    setEmailError('');
    setNameError('');

    try {
      // 1) تسجيل عبر الـ Backend
      const username = name.trim().replace(/\s+/g, '_').toLowerCase();
      const user = await api.register(username, email, password);

      // حفظ بيانات المستخدم محلياً للعرض
      const newStudent = {
        id: user.id,
        email,
        username,
        name: name.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('quran_current_student', JSON.stringify(newStudent));

      // 2) محاولة تسجيل دخول تلقائي للحصول على tokens
      try {
        await api.login(username, password);
      } catch (_) {
        // لو الـ auto-login فشل، الـ user ممكن يسجل دخول يدوياً
      }

      setSuccessMessage('تم التسجيل بنجاح! جاري التحويل...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.message || '';
      if (msg.includes('username') || msg.includes('Username')) {
        setEmailError('اسم المستخدم أو البريد مستخدم بالفعل');
      } else if (msg.includes('email') || msg.includes('Email')) {
        setEmailError('البريد مستخدم بالفعل');
      } else {
        setEmailError(`فشل التسجيل: ${msg.slice(0, 80)}`);
      }
    }
  };

  return (
    <div className="login-page">
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

      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <span className="login-logo-icon">☪</span>
            <h1>المنارة القرآنية</h1>
          </div>

          <h2 className="login-title">إنشاء حساب جديد</h2>
          <p className="login-subtitle">سجل الآن للبدء رحلتك القرآنية</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👤</span>
                الاسم الكامل
              </label>
              <input
                type="text"
                className={`form-input ${nameError ? 'input-error' : ''}`}
                placeholder="أدخل اسمك الكامل"
                value={name}
                onChange={handleNameChange}
                dir="rtl"
              />
              {nameError && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {nameError}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">✉️</span>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                className={`form-input ${emailError ? 'input-error' : ''}`}
                placeholder="example@domain.com"
                value={email}
                onChange={handleEmailChange}
                dir="ltr"
              />
              {emailError && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {emailError}
                </span>
              )}
            </div>

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
                onChange={handlePasswordChange}
                dir="ltr"
              />
              {passwordError && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {passwordError}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔐</span>
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                className={`form-input ${confirmError ? 'input-error' : ''}`}
                placeholder="أعد إدخال كلمة المرور"
                value={confirmPassword}
                onChange={handleConfirmChange}
                dir="ltr"
              />
              {confirmError && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {confirmError}
                </span>
              )}
            </div>

            <button type="submit" className="login-submit-btn">
              <span className="btn-icon">✨</span>
              <span className="btn-text">إنشاء الحساب</span>
            </button>

            {successMessage && (
              <p className="success-message" style={{ color: '#4caf50', textAlign: 'center', marginTop: '15px', fontWeight: 600 }}>
                ✓ {successMessage}
              </p>
            )}
          </form>

          <div className="back-link" style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>لديك حساب بالفعل؟ </span>
            <a href="/login" className="back-link-text" style={{ color: '#1a237e', fontWeight: 600, textDecoration: 'none' }}>
              تسجيل الدخول
            </a>
          </div>

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

export default SignUpPage;
