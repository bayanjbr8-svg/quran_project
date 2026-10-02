/**
 * API Service - Django Backend Integration
 * المنارة القرآنية
 *
 * Base URL: http://127.0.0.1:8000
 *
 * Endpoints:
 * - POST /api/users/register/             تسجيل طالب جديد
 * - POST /api/users/login/                تسجيل دخول
 * - POST /api/token/                      JWT Token
 * - POST /api/token/refresh/              تجديد التوكن
 *
 * - GET  /api/surah/                      قائمة السور
 * - GET  /api/verse/                      قائمة الآيات
 * - GET  /api/surah-audio/                تسجيلات السور الصوتية
 *
 * - POST /api/upload-recitation/          رفع تلاوة + تحليل AI
 * - GET  /api/my-recitations/             سجل تلاواتي
 * - GET  /api/my-statistics/              إحصائياتي
 * - GET  /api/teacher/dashboard/          لوحة الأستاذ
 */

import apiRequest, {
  apiUpload,
  setTokens,
  clearTokens,
  getRefreshToken,
  isLoggedIn,
} from './apiClient';

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

// ============================================
// Auth API
// ============================================
const AuthAPI = {
  register: async (username, email, password) => {
    const data = await apiRequest('/api/users/register/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    return Array.isArray(data) ? data[0] : data;
  },

  /**
   * تسجيل دخول عبر /api/users/login/ (يرجع tokens + user info)
   * identifier = username أو email (نرسل الاثنين)
   */
  login: async (identifier, password) => {
    const isEmail = String(identifier).includes('@');
    const body = {
      username: identifier,
      email: identifier,
      password,
    };

    // 1) /api/users/login/
    try {
      const data = await apiRequest('/api/users/login/', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (data.access) setTokens(data.access, data.refresh);
      return data;
    } catch (err1) {
      // 2) Fallback: /api/token/ (Django Simple JWT)
      try {
        const data = await apiRequest('/api/token/', {
          method: 'POST',
          body: JSON.stringify({ username: identifier, password }),
        });
        setTokens(data.access, data.refresh);
        return data;
      } catch (err2) {
        // أظهر الخطأ الفعلي من السيرفر (مهم للتشخيص)
        const realError = err2?.message || err1?.message || 'خطأ غير معروف';
        throw new Error(realError);
      }
    }
  },

  refresh: async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error('لا يوجد refresh token');
    const data = await apiRequest('/api/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });
    setTokens(data.access, data.refresh || refresh);
    return data;
  },

  logout: () => {
    clearTokens();
    return Promise.resolve();
  },

  isAuthenticated: isLoggedIn,
};

// ============================================
// Quran API (عام - بدون auth)
// ============================================
const QuranAPI = {
  /**
   * قائمة السور من الباك
   * @returns {Promise<Array<{id, number, name}>>}
   */
  getSurahs: async () => {
    return apiRequest('/api/surah/');
  },

  /**
   * قائمة الآيات
   * @returns {Promise<Array<{id, number, text}>>}
   */
  getVerses: async () => {
    return apiRequest('/api/verse/');
  },

  /**
   * التسجيلات الصوتية للسور
   * @returns {Promise<Array<{id, surah, reciter_ar, reciter_en, rewaya_ar, rewaya_en, audio_url}>>}
   */
  getSurahAudios: async () => {
    return apiRequest('/api/surah-audio/');
  },

  /**
   * معلومات المنصة (محلي - للتطوير)
   */
  getInfo: () =>
    Promise.resolve({
      name: 'المنارة القرآنية',
      tagline: 'نورٌ يضيء دربك',
      description: 'منصة قرآنية متكاملة للقرآن الكريم والعلوم الإسلامية',
      verse:
        'إِنَّ هَذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا',
      verseSource: 'الإسراء - الآية 9',
      version: '1.0.0',
    }),
};

// ============================================
// Recitations API (يحتاج Auth)
// ============================================
const RecitationsAPI = {
  /**
   * رفع تلاوة - الـ AI يحللها ويصححها
   * @param {number|string} verseId - ID الآية
   * @param {Blob} audioBlob - التسجيل الصوتي
   * @returns {Promise<{recognized_text, correct_text, score, wrong_words, comparison, statistics, is_correct}>}
   */
  uploadRecitation: async (verseId, audioBlob) => {
    const formData = new FormData();
    const filename = `recitation_${Date.now()}.webm`;
    formData.append('audio_file', audioBlob, filename);
    formData.append('verse', String(verseId));
    return apiUpload('/api/upload-recitation/', formData);
  },

  /**
   * سجل تلاوات الطالب الحالي
   */
  getMyRecitations: async () => {
    return apiRequest('/api/my-recitations/');
  },

  /**
   * إحصائيات الطالب الحالي
   */
  getMyStatistics: async () => {
    return apiRequest('/api/my-statistics/');
  },
};

// ============================================
// Teacher API
// ============================================
const TeacherAPI = {
  /**
   * لوحة تحكم الأستاذ
   */
  getDashboard: async () => {
    return apiRequest('/api/teacher/dashboard/');
  },
};

// ============================================
// Courses API - الدورات والدروس
// ============================================
const CoursesAPI = {
  /**
   * إنشاء درس/دورة جديدة (الأستاذ)
   * @param {object} data { title, description }
   * @param {File|null} materialFile - ملف المادة (اختياري)
   */
  create: async (data, materialFile = null) => {
    if (materialFile) {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('material', materialFile);
      return apiUpload('/courses/create/', formData);
    }
    return apiRequest('/courses/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * قائمة الدروس (الأستاذ أو الطالب)
   */
  list: async () => {
    return apiRequest('/courses/list/');
  },

  /**
   * إضافة تعليق على درس (الطالب)
   * @param {number} lessonId
   * @param {string} text
   */
  addComment: async (lessonId, text) => {
    return apiRequest(`/courses/lessons/${lessonId}/comments/`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  /**
   * رد الأستاذ على تعليق (الأستاذ فقط)
   * @param {number} commentId
   * @param {string} teacherReply
   */
  replyToComment: async (commentId, teacherReply) => {
    return apiRequest(`/courses/comments/${commentId}/reply/`, {
      method: 'PATCH',
      body: JSON.stringify({ teacher_reply: teacherReply }),
    });
  },

  /**
   * تقييم درس (الطالب)
   * @param {number} lessonId
   * @param {number} rating - من 1 إلى 5
   */
  rateLesson: async (lessonId, rating) => {
    return apiRequest(`/courses/lessons/${lessonId}/rate/`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  },

  /**
   * تسجيل إكمال درس (الطالب)
   * @param {number} lessonId
   */
  completeLesson: async (lessonId) => {
    return apiRequest(`/courses/lessons/${lessonId}/complete/`, {
      method: 'POST',
    });
  },

  /**
   * قائمة الطلاب الذين أكملوا الدرس (الأستاذ أو الطالب)
   */
  getLessonProgress: async (lessonId) => {
    return apiRequest(`/courses/lessons/${lessonId}/progress/`);
  },

  /**
   * الطلاب الذين لم يكملوا الدرس (الأستاذ)
   */
  getMissingStudents: async (lessonId) => {
    return apiRequest(`/courses/lessons/${lessonId}/missing_students/`);
  },

  /**
   * تقدم الطالب الحالي (الطالب)
   */
  getMyProgress: async () => {
    return apiRequest('/courses/progress/');
  },
};

// ============================================
// Quizzes API - الاختبارات (Backend)
// ============================================
const BackendQuizzesAPI = {
  /**
   * إنشاء اختبار (الأستاذ)
   * @param {object} quizData
   */
  create: async (quizData) => {
    return apiRequest('/api/quizzes/create_quiz/', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },

  /**
   * حل الاختبار (الطالب يرسل إجاباته)
   * @param {number} quizId
   * @param {Array} answers - [{ question, choice }]
   */
  submit: async (quizId, answers) => {
    return apiRequest(`/api/quizzes/${quizId}/submit/`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  /**
   * نتيجة اختبار معين
   */
  getResult: async (quizId) => {
    return apiRequest(`/api/quizzes/${quizId}/result/`);
  },

  /**
   * كل نتائج الطلاب (الأستاذ)
   */
  getAllResults: async () => {
    return apiRequest('/api/quizzes/all_results/');
  },

  /**
   * لوحة تحكم الأستاذ للاختبارات
   */
  getTeacherDashboard: async () => {
    return apiRequest('/api/quizzes/teacher_dashboard/');
  },

  /**
   * ترتيب الطلاب (Leaderboard)
   */
  getLeaderboard: async () => {
    return apiRequest('/api/quizzes/leaderboard/');
  },

  /**
   * الطلاب الذين لم يحلوا اختبار معين (الأستاذ)
   */
  getQuizMissingStudents: async (quizId) => {
    return apiRequest(`/api/quizzes/${quizId}/missing_students/`);
  },
};

// ============================================
// Notifications API - الإشعارات
// ============================================
const NotificationsAPI = {
  /**
   * قائمة الإشعارات للمستخدم الحالي
   */
  list: async () => {
    return apiRequest('/notifications/');
  },

  /**
   * تحديد إشعار كمقروء
   */
  markRead: async (id) => {
    return apiRequest(`/notifications/${id}/read/`, {
      method: 'POST',
    });
  },

  /**
   * تحديد الكل كمقروء
   */
  markAllRead: async () => {
    return apiRequest('/notifications/mark-all-read/', {
      method: 'POST',
    });
  },
};

// ============================================
// AI API - المساعد الذكي
// ============================================
const AIAPI = {
  /**
   * محادثة مع المساعد الذكي عن درس
   * @param {string} message - سؤال الطالب
   * @param {number} lessonId - ID الدرس
   */
  chat: async (message, lessonId) => {
    return apiRequest('/ai/chat/', {
      method: 'POST',
      body: JSON.stringify({ message, lesson_id: lessonId }),
    });
  },

  /**
   * توصية ذكية بناءً على أداء الطالب
   */
  getRecommendation: async () => {
    return apiRequest('/ai/recommendation/');
  },
};

// ============================================
// References API - المراجع والكتب
// ============================================
const ReferencesAPI = {
  /**
   * قائمة المراجع والكتب الإسلامية
   */
  list: async () => {
    return apiRequest('/api/references/');
  },

  /**
   * تفاصيل مرجع واحد
   */
  get: async (id) => {
    return apiRequest(`/api/references/${id}/`);
  },
};

// ============================================
// Records API - سجلات الطلاب (للمعلم)
// ============================================
const RecordsAPI = {
  /**
   * قائمة كل الطلاب (المعلم)
   */
  listStudents: async () => {
    return apiRequest('/api/users/students/');
  },

  /**
   * تفاصيل طالب معيّن
   */
  getStudent: async (studentId) => {
    return apiRequest(`/api/users/students/${studentId}/`);
  },

  /**
   * تلاوات طالب معيّن
   */
  getStudentRecitations: async (studentId) => {
    return apiRequest(`/api/users/students/${studentId}/recitations/`);
  },

  /**
   * إحصائيات طالب معيّن (تقدّم + اختبارات)
   */
  getStudentStatistics: async (studentId) => {
    return apiRequest(`/api/users/students/${studentId}/statistics/`);
  },

  /**
   * تحديث بيانات طالب (المعلم فقط)
   */
  updateStudent: async (studentId, data) => {
    return apiRequest(`/api/users/students/${studentId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * حذف طالب (المعلم فقط)
   */
  deleteStudent: async (studentId) => {
    return apiRequest(`/api/users/students/${studentId}/`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// Voice Fallback API (محلي)
// ============================================
const VoiceAPI = {
  saveVoiceRecording: async (audioBlob, surahId, verseIndex = null) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const recordings = JSON.parse(
            localStorage.getItem('voice_recordings') || '[]'
          );
          const rec = {
            id: Date.now().toString(),
            dataUrl: reader.result,
            surahId,
            verseIndex,
            duration: audioBlob.size,
            createdAt: new Date().toISOString(),
          };
          recordings.push(rec);
          localStorage.setItem('voice_recordings', JSON.stringify(recordings));
          resolve(rec);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  },
  getRecordings: async () =>
    Promise.resolve(
      JSON.parse(localStorage.getItem('voice_recordings') || '[]')
    ),
  deleteRecording: async (recordingId) => {
    const recs = JSON.parse(localStorage.getItem('voice_recordings') || '[]');
    localStorage.setItem(
      'voice_recordings',
      JSON.stringify(recs.filter((r) => r.id !== recordingId))
    );
    return Promise.resolve({ success: true });
  },
};

// ============================================
// Main Export
// ============================================
const api = {
  // معلومات المنصة
  getPlatformInfo: QuranAPI.getInfo,

  // المصادقة
  register: AuthAPI.register,
  login: AuthAPI.login,
  refreshToken: AuthAPI.refresh,
  logout: AuthAPI.logout,
  isAuthenticated: AuthAPI.isAuthenticated,

  // بيانات القرآن
  getSurahs: QuranAPI.getSurahs,
  getSurah: (id) =>
    QuranAPI.getSurahs().then((list) => list.find((s) => s.id === id || s.number === id)),
  getVerses: QuranAPI.getVerses,
  getSurahAudios: QuranAPI.getSurahAudios,

  // التلاوات
  uploadRecitation: RecitationsAPI.uploadRecitation,
  getMyRecitations: RecitationsAPI.getMyRecitations,
  getMyStatistics: RecitationsAPI.getMyStatistics,

  // الأستاذ
  getTeacherDashboard: TeacherAPI.getDashboard,

  // المراجع والكتب
  getReferences: ReferencesAPI.list,
  getReference: ReferencesAPI.get,

  // الدورات والدروس
  createCourse: CoursesAPI.create,
  listCourses: CoursesAPI.list,
  addCourseComment: CoursesAPI.addComment,
  replyToCourseComment: CoursesAPI.replyToComment,
  rateLesson: CoursesAPI.rateLesson,
  completeLesson: CoursesAPI.completeLesson,
  getLessonProgress: CoursesAPI.getLessonProgress,
  getLessonMissingStudents: CoursesAPI.getMissingStudents,
  getMyCourseProgress: CoursesAPI.getMyProgress,

  // الاختبارات (Backend)
  createQuiz: BackendQuizzesAPI.create,
  submitQuiz: BackendQuizzesAPI.submit,
  getQuizResult: BackendQuizzesAPI.getResult,
  getAllQuizResults: BackendQuizzesAPI.getAllResults,
  getQuizzesTeacherDashboard: BackendQuizzesAPI.getTeacherDashboard,
  getQuizzesLeaderboard: BackendQuizzesAPI.getLeaderboard,
  getQuizMissingStudents: BackendQuizzesAPI.getQuizMissingStudents,

  // الإشعارات
  getNotifications: NotificationsAPI.list,
  markNotificationRead: NotificationsAPI.markRead,
  markAllNotificationsRead: NotificationsAPI.markAllRead,

  // المساعد الذكي
  aiChat: AIAPI.chat,
  getAIRecommendation: AIAPI.getRecommendation,

  // سجلات الطلاب (Records)
  listStudents: RecordsAPI.listStudents,
  getStudent: RecordsAPI.getStudent,
  getStudentRecitations: RecordsAPI.getStudentRecitations,
  getStudentStatistics: RecordsAPI.getStudentStatistics,
  updateStudent: RecordsAPI.updateStudent,
  deleteStudent: RecordsAPI.deleteStudent,

  // تخزين صوتي محلي (fallback)
  saveVoiceRecording: VoiceAPI.saveVoiceRecording,
  getVoiceRecordings: VoiceAPI.getRecordings,
  deleteVoiceRecording: VoiceAPI.deleteRecording,
};

export default api;
