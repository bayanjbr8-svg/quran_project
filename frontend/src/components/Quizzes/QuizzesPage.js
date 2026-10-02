/**
 * QuizzesPage - صفحة الاختبارات
 * المنارة القرآنية
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizzesPage = () => {
  const navigate = useNavigate();
  const [completedQuizzes, setCompletedQuizzes] = useState(() => {
    return JSON.parse(localStorage.getItem('completed_quizzes') || '[]');
  });
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [wrongAnswerIndex, setWrongAnswerIndex] = useState(null);

  const quizzes = [
    {
      id: 1,
      title: 'اختبار تقييم المستوى الأول',
      description: 'أسئلة أساسية في القرآن والتجويد',
      questions: [
        { question: 'ما هي السورة الأولى في المصحف؟', options: ['البقرة', 'الفاتحة', 'الإخلاص', 'الناس'], correctAnswer: 1 },
        { question: 'كم عدد آيات سورة الفاتحة؟', options: ['5', '6', '7', '8'], correctAnswer: 2 },
        { question: 'ما معنى كلمة "الفاتحة"؟', options: ['الخاتمة', 'البداية', 'الوسط', 'النهاية'], correctAnswer: 1 }
      ]
    },
    {
      id: 2,
      title: 'اختبار تقييم المستوى الثاني',
      description: 'أسئلة متقدمة في أحكام التلاوة',
      questions: [
        { question: 'ما حكم النون الساكنة إذا جاء بعدها حرف باء؟', options: ['إظهار', 'إدغام', 'إقلاب', 'إخفاء'], correctAnswer: 2 },
        { question: 'ما هو المد اللازم؟', options: ['مد بمقدار حركتين', 'مد بمقدار أربع حركات', 'مد بمقدار ست حركات', 'مد بمقدار ثلاث حركات'], correctAnswer: 2 }
      ]
    },
    {
      id: 3,
      title: 'اختبار تقييم المستوى الثالث',
      description: 'أسئلة شاملة في التفسير وعلوم القرآن',
      questions: [
        { question: 'ما هي أطول سورة في القرآن؟', options: ['آل عمران', 'النساء', 'البقرة', 'الأعراف'], correctAnswer: 2 },
        { question: 'من هو النبي الذي كلمه الله تكليمًا؟', options: ['عيسى', 'موسى', 'إبراهيم', 'نوح'], correctAnswer: 1 }
      ]
    },
    {
      id: 4,
      title: 'اختبار تقييم المستوى الرابع',
      description: 'أسئلة في أحكام التجويد المتقدمة',
      questions: [
        { question: 'ما حكم الميم الساكنة إذا جاء بعدها حرف باء؟', options: ['إخفاء شفوي', 'إدغام شفوي', 'إظهار شفوي', 'إقلاب'], correctAnswer: 0 },
        { question: 'ما هو التفخيم؟', options: ['ترقيق الصوت', 'تضخيم الصوت في الحرف', 'إخفاء الحرف', 'إدغام الحرف'], correctAnswer: 1 }
      ]
    },
    {
      id: 5,
      title: 'اختبار تقييم المستوى الخامس',
      description: 'أسئلة في مخارج الحروف وصفاتها',
      questions: [
        { question: 'كم عدد مخارج الحروف عند الجمهور؟', options: ['14', '16', '17', '15'], correctAnswer: 2 },
        { question: 'من أي مخرج يخرج حرف العين؟', options: ['الجوف', 'الحلق', 'اللسان', 'الشفتان'], correctAnswer: 1 }
      ]
    },
    {
      id: 6,
      title: 'اختبار تقييم المستوى السادس',
      description: 'أسئلة في الوقف والابتداء',
      questions: [
        { question: 'ما هو الوقف التام؟', options: ['الوقف على كلمة تام المعنى', 'الوقف في منتصف الجملة', 'الوقف على حرف', 'الوقف بلا تنفس'], correctAnswer: 0 },
        { question: 'ما علامة الوقف اللازم في المصحف؟', options: ['صلي', 'قلي', 'لا', 'م'], correctAnswer: 3 }
      ]
    },
    {
      id: 7,
      title: 'اختبار تقييم المستوى السابع',
      description: 'أسئلة في أحكام المدود',
      questions: [
        { question: 'كم مقدار المد الطبيعي؟', options: ['حركتان', 'أربع حركات', 'ست حركات', 'ثلاث حركات'], correctAnswer: 0 },
        { question: 'ما هو المد المتصل؟', options: ['مد يأتي بعد همز', 'مد يأتي بعد سكون', 'مد يأتي قبل همز', 'مد لا يمد'], correctAnswer: 0 }
      ]
    },
    {
      id: 8,
      title: 'اختبار تقييم المستوى الثامن',
      description: 'أسئلة في الرسم القرآني',
      questions: [
        { question: 'ما نوع الخط المستخدم في المصحف؟', options: ['الرقعة', 'النسخ', 'الكوفي', 'الديواني'], correctAnswer: 1 },
        { question: 'ما اسم السورة التي تبدأ بغير بسملة؟', options: ['الفاتحة', 'التوبة', 'النمل', 'الأنفال'], correctAnswer: 1 }
      ]
    },
    {
      id: 9,
      title: 'اختبار تقييم المستوى التاسع',
      description: 'أسئلة في فضائل القرآن',
      questions: [
        { question: 'ما السورة التي تعدل ثلث القرآن؟', options: ['الإخلاص', 'الفاتحة', 'الكوثر', 'النصر'], correctAnswer: 0 },
        { question: 'ما هي أعظم آية في القرآن؟', options: ['آية الكرسي', 'آخر البقرة', 'أول الفاتحة', 'آية الدين'], correctAnswer: 0 }
      ]
    },
    {
      id: 10,
      title: 'اختبار تقييم المستوى العاشر',
      description: 'اختبار شامل في علوم القرآن',
      questions: [
        { question: 'كم عدد سور القرآن؟', options: ['110', '112', '114', '116'], correctAnswer: 2 },
        { question: 'ما هي السورة التي تسمى قلب القرآن؟', options: ['الفاتحة', 'يس', 'الرحمن', 'الملك'], correctAnswer: 1 }
      ]
    }
  ];

  const isQuizUnlocked = (quizId) => {
    if (quizId === 1) return true;
    return completedQuizzes.includes(quizId - 1);
  };

  const handleQuizClick = (quiz) => {
    if (!isQuizUnlocked(quiz.id)) {
      setAlertMessage('يجب اجتياز الاختبار السابق أولاً');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
      return;
    }
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (optionIndex) => {
    const quiz = activeQuiz;
    const question = quiz.questions[currentQuestionIndex];

    if (optionIndex === question.correctAnswer) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);

      setTimeout(() => {
        if (currentQuestionIndex + 1 < quiz.questions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          const newCompleted = [...completedQuizzes, quiz.id];
          setCompletedQuizzes(newCompleted);
          localStorage.setItem('completed_quizzes', JSON.stringify(newCompleted));
          setActiveQuiz(null);
        }
      }, 1500);
    } else {
      setWrongAnswerIndex(optionIndex);
      setAlertMessage('إجابة خاطئة، حاول مرة أخرى');
      setShowAlert(true);
      setTimeout(() => {
        setWrongAnswerIndex(null);
        setShowAlert(false);
      }, 1200);
    }
  };

  const handleBackToList = () => {
    setActiveQuiz(null);
  };

  if (activeQuiz) {
    const question = activeQuiz.questions[currentQuestionIndex];
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8eaf6 0%, #f5f5f5 100%)', position: 'relative', overflow: 'hidden' }}>
        {confetti && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 999 }}>
            <style>{`
              @keyframes confettiLeft {
                0% { transform: translateX(0) translateY(-10vh) rotate(0); opacity: 1; }
                100% { transform: translateX(-100vw) translateY(100vh) rotate(720deg); opacity: 0; }
              }
              @keyframes confettiRight {
                0% { transform: translateX(0) translateY(-10vh) rotate(0); opacity: 1; }
                100% { transform: translateX(100vw) translateY(100vh) rotate(-720deg); opacity: 0; }
              }
              .confetti-piece {
                position: absolute;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(255,215,0,0.8);
              }
            `}</style>
            {[...Array(50)].map((_, i) => (
              <div key={`left-${i}`} className="confetti-piece" style={{
                left: 0,
                top: '50%',
                background: ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3', '#f368e0', '#ff9f43'][i % 7],
                animation: `confettiLeft ${1.2 + Math.random() * 1.5}s ease-in forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                marginLeft: `${Math.random() * 120}px`,
                width: `${8 + Math.random() * 12}px`,
                height: `${8 + Math.random() * 12}px`,
              }} />
            ))}
            {[...Array(50)].map((_, i) => (
              <div key={`right-${i}`} className="confetti-piece" style={{
                right: 0,
                top: '50%',
                background: ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3', '#f368e0', '#ff9f43'][i % 7],
                animation: `confettiRight ${1.2 + Math.random() * 1.5}s ease-in forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                marginRight: `${Math.random() * 120}px`,
                width: `${8 + Math.random() * 12}px`,
                height: `${8 + Math.random() * 12}px`,
              }} />
            ))}
          </div>
        )}

        <nav style={{ display: 'flex', alignItems: 'center', padding: '15px 30px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '2px solid rgba(26,35,126,0.1)' }}>
          <button onClick={handleBackToList} style={{ padding: '10px 18px', borderRadius: '25px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #1a237e, #0d47a1)', color: 'white', fontWeight: 600 }}>→ رجوع للقائمة</button>
          <div style={{ flex: 1, textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#1a237e' }}>🕌 المنارة القرآنية</div>
        </nav>

        <div style={{ maxWidth: '700px', margin: '50px auto', padding: '0 20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 8px 25px rgba(26,35,126,0.1)' }}>
            <h2 style={{ color: '#1a237e', marginBottom: '10px' }}>{activeQuiz.title}</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>السؤال {currentQuestionIndex + 1} من {activeQuiz.questions.length}</p>
            <h3 style={{ color: '#1a237e', fontSize: '1.5rem', marginBottom: '30px', lineHeight: 1.6 }}>{question.question}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {question.options.map((option, idx) => (
                <button key={idx} onClick={() => handleAnswer(idx)} style={{
                  padding: '15px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${wrongAnswerIndex === idx ? '#ff6b6b' : '#e0e0e0'}`,
                  background: wrongAnswerIndex === idx ? '#ffe0e0' : 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  textAlign: 'right',
                  transition: 'all 0.3s',
                  fontWeight: 500,
                  animation: wrongAnswerIndex === idx ? 'shake 0.4s ease' : 'none'
                }}
                onMouseEnter={(e) => { if (wrongAnswerIndex !== idx) { e.currentTarget.style.borderColor = '#42a5f5'; e.currentTarget.style.background = '#f5f9ff'; } }}
                onMouseLeave={(e) => { if (wrongAnswerIndex !== idx) { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = 'white'; } }}
                >{option}</button>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8eaf6 0%, #f5f5f5 100%)', position: 'relative', overflowX: 'hidden' }}>
      {showAlert && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ff6b6b', color: 'white', padding: '15px 30px', borderRadius: '50px', zIndex: 1000, boxShadow: '0 8px 25px rgba(255,107,107,0.4)', fontWeight: 600 }}>
          {alertMessage}
        </div>
      )}

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 30px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '2px solid rgba(26,35,126,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 18px', borderRadius: '25px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #1a237e, #0d47a1)', color: 'white', fontWeight: 600 }}>→ العودة للقائمة</button>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a237e' }}>🕌 المنارة القرآنية</div>
        <div style={{ width: 120 }}></div>
      </nav>

      <header style={{ textAlign: 'center', padding: '50px 20px 30px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#1a237e', fontFamily: "'Amiri', serif" }}>الاختبارات</h1>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>قيم مستواك واجتز الاختبارات بالتتابع</p>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 30px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
          {quizzes.map((quiz) => {
            const unlocked = isQuizUnlocked(quiz.id);
            const completed = completedQuizzes.includes(quiz.id);
            return (
              <div key={quiz.id} onClick={() => handleQuizClick(quiz)} style={{ background: 'white', borderRadius: '20px', padding: '30px 20px', textAlign: 'center', cursor: unlocked ? 'pointer' : 'not-allowed', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', border: '2px solid transparent', opacity: unlocked ? 1 : 0.6, position: 'relative' }}
                onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(26,35,126,0.2)'; e.currentTarget.style.borderColor = '#42a5f5'; } }}
                onMouseLeave={(e) => { if (unlocked) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'transparent'; } }}
              >
                <div style={{ width: '50px', height: '50px', margin: '0 auto 15px', borderRadius: '50%', background: completed ? '#4caf50' : (unlocked ? 'linear-gradient(135deg, #1a237e, #0d47a1)' : '#bdbdbd'), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                  {completed ? '✓' : quiz.id}
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#1a237e', margin: '0 0 10px' }}>{quiz.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6 }}>{quiz.description}</p>
                {!unlocked && <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '1.5rem' }}>🔒</div>}
                {completed && <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5rem', color: '#4caf50' }}>✓</div>}
              </div>
            );
          })}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '30px', background: 'rgba(26,35,126,0.05)' }}>
        <p style={{ color: '#1a237e' }}>المنارة القرآنية © 2026</p>
      </footer>
    </div>
  );
};

export default QuizzesPage;
