/**
 * QuranLessonsPage - صفحة القرآن الكريم
 * المنارة القرآنية
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/QuranLessons.css';
import api from '../../services/api';

const SAMPLE_QURAN_TEXT = {
  surah: {
    id: 1,
    name: 'الفاتحة',
    arabicName: 'الفاتحة',
    meaning: 'البداية',
    versesCount: 7,
    revelationType: 'مكية'
  },
  verses: [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    'الرَّحْمَٰنِ الرَّحِيمِ',
    'مَالِكِ يَوْمِ الدِّينِ',
    'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ'
  ],
  bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
};

const READERS = [
  { id: 'abdulbasit', name: 'عبد الباسط عبد الصمد', country: 'مصر' },
  { id: 'husary', name: 'محمد صديق المنشاوي', country: 'مصر' },
  { id: 'maher', name: 'ماهر المعيقلي', country: 'السعودية' },
  { id: 'shuraym', name: 'سعود الشريم', country: 'السعودية' },
  { id: 'minshawi', name: 'محمد صديق المنشاوي', country: 'مصر' },
  { id: 'afasy', name: 'خالد العفاسي', country: 'الكويت' }
];

const ALL_SURAH = [
  { id: 1, name: 'الفاتحة', verses: 7 },
  { id: 2, name: 'البقرة', verses: 286 },
  { id: 3, name: 'آل عمران', verses: 200 },
  { id: 4, name: 'النساء', verses: 176 },
  { id: 5, name: 'المائدة', verses: 120 },
  { id: 6, name: 'الأنعام', verses: 165 },
  { id: 7, name: 'الأعراف', verses: 206 },
  { id: 8, name: 'الأنفال', verses: 75 },
  { id: 9, name: 'التوبة', verses: 129 },
  { id: 10, name: 'يونس', verses: 109 },
  { id: 11, name: 'هود', verses: 123 },
  { id: 12, name: 'يوسف', verses: 111 },
  { id: 13, name: 'الرعد', verses: 43 },
  { id: 14, name: 'إبراهيم', verses: 52 },
  { id: 15, name: 'الحجر', verses: 99 },
  { id: 16, name: 'النحل', verses: 128 },
  { id: 17, name: 'الإسراء', verses: 111 },
  { id: 18, name: 'الكهف', verses: 110 },
  { id: 19, name: 'مريم', verses: 98 },
  { id: 20, name: 'طه', verses: 135 },
  { id: 21, name: 'الأنبياء', verses: 112 },
  { id: 22, name: 'الحج', verses: 78 },
  { id: 23, name: 'المؤمنون', verses: 118 },
  { id: 24, name: 'النور', verses: 64 },
  { id: 25, name: 'الفرقان', verses: 77 },
  { id: 26, name: 'الشعراء', verses: 227 },
  { id: 27, name: 'النمل', verses: 93 },
  { id: 28, name: 'القصص', verses: 88 },
  { id: 29, name: 'العنكبوت', verses: 69 },
  { id: 30, name: 'الروم', verses: 60 },
  { id: 31, name: 'لقمان', verses: 34 },
  { id: 32, name: 'السجدة', verses: 30 },
  { id: 33, name: 'الأحزاب', verses: 73 },
  { id: 34, name: 'سبأ', verses: 54 },
  { id: 35, name: 'فاطر', verses: 45 },
  { id: 36, name: 'يس', verses: 83 },
  { id: 37, name: 'الصافات', verses: 182 },
  { id: 38, name: 'ص', verses: 88 },
  { id: 39, name: 'زمر', verses: 75 },
  { id: 40, name: 'غافر', verses: 85 },
  { id: 41, name: 'فصلت', verses: 54 },
  { id: 42, name: 'الشورى', verses: 53 },
  { id: 43, name: 'الزخرف', verses: 89 },
  { id: 44, name: 'الدخان', verses: 59 },
  { id: 45, name: 'الجاثية', verses: 37 },
  { id: 46, name: 'الأحقاف', verses: 35 },
  { id: 47, name: 'محمد', verses: 38 },
  { id: 48, name: 'الفتح', verses: 29 },
  { id: 49, name: 'الحجرات', verses: 18 },
  { id: 50, name: 'ق', verses: 45 },
  { id: 51, name: 'الذاريات', verses: 60 },
  { id: 52, name: 'الطور', verses: 49 },
  { id: 53, name: 'النجم', verses: 62 },
  { id: 54, name: 'القمر', verses: 55 },
  { id: 55, name: 'الرحمن', verses: 78 },
  { id: 56, name: 'الواقعة', verses: 96 },
  { id: 57, name: 'الحديد', verses: 29 },
  { id: 58, name: 'المجادلة', verses: 22 },
  { id: 59, name: 'الحشر', verses: 24 },
  { id: 60, name: 'الممتحنة', verses: 13 },
  { id: 61, name: 'الصف', verses: 14 },
  { id: 62, name: 'الجمعة', verses: 11 },
  { id: 63, name: 'المنافقون', verses: 11 },
  { id: 64, name: 'التغابن', verses: 18 },
  { id: 65, name: 'الطلاق', verses: 12 },
  { id: 66, name: 'التحريم', verses: 12 },
  { id: 67, name: 'الملك', verses: 30 },
  { id: 68, name: 'القلم', verses: 52 },
  { id: 69, name: 'الحاقة', verses: 52 },
  { id: 70, name: 'المعارج', verses: 44 },
  { id: 71, name: 'نوح', verses: 28 },
  { id: 72, name: 'الجن', verses: 28 },
  { id: 73, name: 'المزمل', verses: 20 },
  { id: 74, name: 'المدثر', verses: 56 },
  { id: 75, name: 'القيامة', verses: 40 },
  { id: 76, name: 'الإنسان', verses: 31 },
  { id: 77, name: 'المرسلات', verses: 50 },
  { id: 78, name: 'النبأ', verses: 40 },
  { id: 79, name: 'النازعات', verses: 46 },
  { id: 80, name: 'عبس', verses: 42 },
  { id: 81, name: 'التكوير', verses: 29 },
  { id: 82, name: 'الإنفطار', verses: 19 },
  { id: 83, name: 'المطففين', verses: 36 },
  { id: 84, name: 'الإنشقاق', verses: 25 },
  { id: 85, name: 'البروج', verses: 22 },
  { id: 86, name: 'الطارق', verses: 17 },
  { id: 87, name: 'الأعلى', verses: 19 },
  { id: 88, name: 'الغاشية', verses: 26 },
  { id: 89, name: 'الفجر', verses: 30 },
  { id: 90, name: 'البلد', verses: 20 },
  { id: 91, name: 'الشمس', verses: 15 },
  { id: 92, name: 'الليل', verses: 21 },
  { id: 93, name: 'الضحى', verses: 11 },
  { id: 94, name: 'الشرح', verses: 8 },
  { id: 95, name: 'التين', verses: 8 },
  { id: 96, name: 'العلق', verses: 19 },
  { id: 97, name: 'القدر', verses: 5 },
  { id: 98, name: 'البينة', verses: 8 },
  { id: 99, name: 'الزلزلة', verses: 8 },
  { id: 100, name: 'العاديات', verses: 11 },
  { id: 101, name: 'القارعة', verses: 11 },
  { id: 102, name: 'التكاثر', verses: 8 },
  { id: 103, name: 'العصر', verses: 3 },
  { id: 104, name: 'الهمزة', verses: 9 },
  { id: 105, name: 'الفيل', verses: 5 },
  { id: 106, name: 'قريش', verses: 4 },
  { id: 107, name: 'الماعون', verses: 7 },
  { id: 108, name: 'الكوثر', verses: 3 },
  { id: 109, name: 'الكافرون', verses: 6 },
  { id: 110, name: 'النصر', verses: 3 },
  { id: 111, name: 'المسد', verses: 5 },
  { id: 112, name: 'الإخلاص', verses: 4 },
  { id: 113, name: 'الفلق', verses: 5 },
  { id: 114, name: 'الناس', verses: 6 }
];

const SideButtons = ({ fontSize, onFontSizeChange, isPlaying, onPlayPause, reader, onReaderChange, volume, onVolumeChange, speed, onSpeedChange, isFavorite, onToggleFavorite, showFavorites, onToggleFavorites, selectedSurahs, onRemoveSurah }) => {
  return (
    <div className="side-buttons">
      <div className="left-side-controls">
        <div className="control-group">
          <span className="control-label">حجم الخط</span>
          <div className="font-buttons-row">
            <button className="side-btn font-btn" onClick={() => onFontSizeChange(Math.max(20, fontSize - 2))}>−</button>
            <button className="side-btn font-btn" onClick={() => onFontSizeChange(Math.min(48, fontSize + 2))}>+</button>
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">الصوت</span>
          <input type="range" min="0" max="100" value={volume} onChange={(e) => onVolumeChange(Number(e.target.value))} className="volume-slider" />
          <select value={speed} onChange={(e) => onSpeedChange(Number(e.target.value))} className="speed-select">
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
          </select>
        </div>
        <button className={`side-btn play-btn ${isPlaying ? 'playing' : ''}`} onClick={onPlayPause}>{isPlaying ? '❚❚' : '▶'}</button>
      </div>
      <div className="right-side-controls">
        <div className="control-group">
          <span className="control-label">القارئ</span>
          <select value={reader} onChange={(e) => onReaderChange(e.target.value)} className="reader-select">
            {READERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <button className={`side-btn favorite-btn ${isFavorite ? 'active' : ''}`} onClick={onToggleFavorite}>❤</button>
        <button className={`side-btn favorites-list-btn ${showFavorites ? 'active' : ''}`} onClick={onToggleFavorites}>☰ <span className="badge">{selectedSurahs.length}</span></button>
      </div>
    </div>
  );
};

const Navbar = ({ onBack, currentStudent, onAddSurah }) => (
  <nav className="quran-navbar">
    <div className="navbar-right">
      <button className="nav-btn back-btn" onClick={onBack}>← العودة</button>
      <button className="nav-btn add-surah-btn" onClick={onAddSurah}>☰ قائمة السور</button>
    </div>
    <div className="navbar-center">🕌 المنارة القرآنية</div>
    <div className="navbar-left">{currentStudent && <span className="user-name">{currentStudent.name || currentStudent.email?.split('@')[0]}</span>}</div>
  </nav>
);

const InfoBar = ({ pageInfo }) => (
  <div className="info-bar">
    <div className="info-item">📖 السورة: {pageInfo.surahName}</div>
    <div className="info-item">📄 الصفحة: {pageInfo.page}</div>
    <div className="info-item">📚 الجزء: {pageInfo.juz}</div>
  </div>
);

const QuranPage = ({ surah, fontSize, onVerseClick }) => (
  <div className="quran-page">
    {surah.id !== 9 && <div className="bismillah"><h2>{surah.bismillah}</h2></div>}
    <div className="surah-header"><h1 className="surah-title">{surah.name}</h1></div>
    <div className="verses-container" style={{ fontSize: `${fontSize}px` }}>
      {surah.verses.map((verse, index) => (
        <div key={index} className="verse-item" onClick={() => onVerseClick(index)}>
          <span className="verse-text" dir="rtl">{verse}</span>
          <span className="verse-number">{index + 1}</span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * VoiceRecorder Component - زر التسجيل الصوتي مع تحليل AI
 * يستخدم MediaRecorder API + api.uploadRecitation للباك
 */
const VoiceRecorder = ({ surahId, verseId = 1 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    setError('');
    setResult(null);
    setAudioBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
        }

        // رفع للـ Backend لتحليل AI
        setIsAnalyzing(true);
        try {
          const analysis = await api.uploadRecitation(verseId, blob);
          setResult(analysis);
        } catch (err) {
          console.error('Upload/Analysis error:', err);
          setError(`فشل التحليل: ${err.message || 'خطأ غير معروف'}`);
        } finally {
          setIsAnalyzing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('يجب السماح بالوصول للميكروفون');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // ألوان حسب الحالة
  const STATUS_COLORS = {
    correct: '#4caf50',
    wrong: '#f44336',
    missing: '#ff9800',
    extra: '#9c27b0',
  };

  return (
    <>
      <div className="voice-recorder-fixed">
        <button
          className={`voice-record-btn ${isRecording ? 'recording' : ''} ${isAnalyzing ? 'analyzing' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          title={isRecording ? 'إيقاف التسجيل' : isAnalyzing ? 'جاري التحليل...' : 'بدء التسجيل'}
        >
          {isAnalyzing ? '⏳' : isRecording ? (
            <span className="rec-dot">●</span>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
            </svg>
          )}
        </button>
        {error && <div className="voice-recorder-error">{error}</div>}
        {audioBlob && !result && (
          <audio controls src={URL.createObjectURL(audioBlob)} className="voice-recorder-preview" />
        )}
      </div>

      {/* Modal لعرض نتيجة التحليل */}
      {result && (
        <div className="recitation-result-modal" onClick={() => setResult(null)}>
          <div className="recitation-result-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-result-btn" onClick={() => setResult(null)}>×</button>

            <h2 className="result-title">📊 نتيجة التحليل</h2>

            {/* Score */}
            <div className="result-score" style={{ background: result.is_correct ? '#4caf50' : '#ff9800' }}>
              <span className="score-value">{Math.round(result.score || 0)}%</span>
              <span className="score-label">
                {result.is_correct ? '✓ تلاوة صحيحة' : 'يحتاج تحسين'}
              </span>
            </div>

            {/* مقارنة الكلمات */}
            {result.comparison && result.comparison.length > 0 && (
              <div className="result-comparison">
                <h3>تحليل الكلمات</h3>
                <div className="words-list" dir="rtl">
                  {result.comparison.map((w, i) => (
                    <span
                      key={i}
                      className={`word word-${w.status}`}
                      style={{
                        background: STATUS_COLORS[w.status] || '#999',
                        color: 'white',
                      }}
                      title={w.said ? `قيلت: ${w.said}` : ''}
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* النصوص */}
            <div className="result-texts">
              <div className="text-block">
                <span className="text-label">الصحيح:</span>
                <p className="text-content" dir="rtl">{result.correct_text}</p>
              </div>
              <div className="text-block">
                <span className="text-label">ما قلته:</span>
                <p className="text-content" dir="rtl">{result.recognized_text}</p>
              </div>
            </div>

            {/* إحصائيات */}
            {result.statistics && (
              <div className="result-stats">
                <div className="stat-item stat-correct">
                  <span className="stat-num">{result.statistics.correct || 0}</span>
                  <span className="stat-label">صحيحة</span>
                </div>
                <div className="stat-item stat-wrong">
                  <span className="stat-num">{result.statistics.wrong || 0}</span>
                  <span className="stat-label">خاطئة</span>
                </div>
                <div className="stat-item stat-missing">
                  <span className="stat-num">{result.statistics.missing || 0}</span>
                  <span className="stat-label">ناقصة</span>
                </div>
                <div className="stat-item stat-extra">
                  <span className="stat-num">{result.statistics.extra || 0}</span>
                  <span className="stat-label">زائدة</span>
                </div>
              </div>
            )}

            <button className="try-again-btn" onClick={() => { setResult(null); setAudioBlob(null); }}>
              🎤 إعادة المحاولة
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const QuranLessonsPage = () => {
  const navigate = useNavigate();
  const { surahId } = useParams();
  const [currentSurah, setCurrentSurah] = useState(parseInt(surahId) || 1);
  const [currentPage, setCurrentPage] = useState(1);
  const [surahData, setSurahData] = useState(SAMPLE_QURAN_TEXT);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [showSelectedSurahs, setShowSelectedSurahs] = useState(false);
  const [showSurahSelector, setShowSurahSelector] = useState(false);
  const [selectedSurahs, setSelectedSurahs] = useState([]);
  const [fontSize, setFontSize] = useState(32);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reader, setReader] = useState('abdulbasit');
  const [volume, setVolume] = useState(80);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('text');

  const pageInfo = { surahName: surahData.surah.name, page: currentPage, juz: `الجزء ${Math.ceil(currentPage / 20)}` };

  useEffect(() => {
    api.getCurrentStudent().then(setCurrentStudent);
    setSelectedSurahs(JSON.parse(localStorage.getItem('selected_surahs') || '[]'));
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => { setSurahData(SAMPLE_QURAN_TEXT); setLoading(false); }, 300);
  }, [currentSurah]);

  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const goToNextPage = () => { if (currentPage < 604) setCurrentPage(currentPage + 1); };
  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleBack = () => navigate('/dashboard');
  const handleAddSurah = () => setShowSurahSelector(true);
  const handleSelectSurah = (surah) => {
    if (!selectedSurahs.some(s => s.id === surah.id)) {
      const newList = [...selectedSurahs, surah];
      setSelectedSurahs(newList);
      localStorage.setItem('selected_surahs', JSON.stringify(newList));
    }
  };
  const handleRemoveSurah = (surahId) => {
    const newList = selectedSurahs.filter(s => s.id !== surahId);
    setSelectedSurahs(newList);
    localStorage.setItem('selected_surahs', JSON.stringify(newList));
  };

  if (loading) return <div className="quran-lessons-page loading"><div className="loading-spinner"><div className="spinner"></div><p>جاري التحميل...</p></div></div>;

  return (
    <div className="quran-lessons-page">
      <div className="quran-background"><div className="pattern-overlay"></div></div>
      <Navbar onBack={handleBack} currentStudent={currentStudent} onAddSurah={handleAddSurah} />
      <InfoBar pageInfo={pageInfo} />

      {/* زر التسجيل الصوتي */}
      <VoiceRecorder surahId={currentSurah} verseId={currentSurah} />
      <SideButtons
        fontSize={fontSize} onFontSizeChange={setFontSize} isPlaying={isPlaying} onPlayPause={togglePlay}
        reader={reader} onReaderChange={setReader} volume={volume} onVolumeChange={setVolume}
        speed={speed} onSpeedChange={setSpeed} isFavorite={isFavorite} onToggleFavorite={() => setIsFavorite(!isFavorite)}
        showFavorites={showSelectedSurahs} onToggleFavorites={() => setShowSelectedSurahs(!showSelectedSurahs)}
        selectedSurahs={selectedSurahs} onRemoveSurah={handleRemoveSurah}
      />
      <div className="page-nav-fixed">
        <button className={`page-nav-btn prev-btn ${currentPage <= 1 ? 'disabled' : ''}`} onClick={goToPrevPage} disabled={currentPage <= 1}>السابقة</button>
        <button className={`page-nav-btn next-btn ${currentPage >= 604 ? 'disabled' : ''}`} onClick={goToNextPage} disabled={currentPage >= 604}>التالية</button>
      </div>
      {/* تم حذف أزرار النص/المصحف - يُعرض الوضع النصي افتراضياً */}
      <main className="quran-content">
        {viewMode === 'quranic' ? (
          <div className="quran-image-container"><img src={`https://www.quranfacile.com/quran_api_api/quran_pages/${String(currentPage).padStart(3, '0')}.png`} alt={`صفحة ${currentPage}`} className="quran-page-image" /></div>
        ) : (
          <QuranPage surah={surahData} fontSize={fontSize} onVerseClick={(i) => console.log(`آية رقم ${i + 1}`)} />
        )}
      </main>
      <footer className="quran-footer"><p>المنارة القرآنية © 2026</p></footer>
    </div>
  );
};

export default QuranLessonsPage;