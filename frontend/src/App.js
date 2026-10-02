/**
 * App Component - المنارة القرآنية
 * المكون الرئيسي للتطبيق
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import LoginPage from './components/Login/LoginPage';
import SignUpPage from './components/SignUp';
import DashboardPage from './components/Dashboard/DashboardPage';
import QuranLessonsPage from './components/QuranLessons';
import TajweedLessonsPage from './components/TajweedLessons';
import QuizzesPage from './components/Quizzes';
import RecordsPage from './components/Records/RecordsPage';
import StudentDetailPage from './components/Records/StudentDetailPage';
import ReferencesPage from './components/References';
import './styles/Home.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/quran-lessons" element={<QuranLessonsPage />} />
          <Route path="/quran-lessons/:surahId" element={<QuranLessonsPage />} />
          <Route path="/tajweed-lessons" element={<TajweedLessonsPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/records/:studentId" element={<StudentDetailPage />} />
          <Route path="/references" element={<ReferencesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
