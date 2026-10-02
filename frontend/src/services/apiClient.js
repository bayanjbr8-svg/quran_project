/**
 * API Client - HTTP Client for Django Backend
 * المنارة القرآنية
 *
 * @author Mavis
 * @date 2026-09-20
 *
 * المميزات:
 * - Bearer token تلقائي على كل request
 * - Auto-refresh للتوكن لما ينتهي (401)
 * - Multipart upload للصوت
 * - Error handling موحّد
 */

// CRA proxy mode: نخلي requests تروح لنفس الـ origin
// package.json فيه proxy = "http://127.0.0.1:8000"
// يعني لو فشل الـ proxy، بنرجع للرابط المباشر
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || '';  // فاضي = نفس الـ origin

const TOKEN_KEY = 'quran_access_token';
const REFRESH_KEY = 'quran_refresh_token';

// ============================================
// Token Storage
// ============================================
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setTokens = (access, refresh) => {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const isLoggedIn = () => !!getAccessToken();

// ============================================
// Refresh Token Logic
// ============================================
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('لا يوجد refresh token');

  const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error('انتهت صلاحية الجلسة، سجّل دخول مرة ثانية');
  }

  const data = await response.json();
  setTokens(data.access, data.refresh || refresh);
  return data.access;
};

// ============================================
// Main Request Function
// ============================================
export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const buildHeaders = (token) => {
    const headers = { ...options.headers };
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  let response = await fetch(url, {
    ...options,
    headers: buildHeaders(getAccessToken()),
  });

  // Auto-refresh on 401
  if (response.status === 401 && getRefreshToken() && !options._isRetry) {
    try {
      const newToken = await isRefreshing
        ? new Promise((resolve) => subscribeTokenRefresh(resolve))
        : await (async () => {
            isRefreshing = true;
            try {
              const t = await refreshAccessToken();
              onTokenRefreshed(t);
              return t;
            } finally {
              isRefreshing = false;
            }
          })();

      response = await fetch(url, {
        ...options,
        headers: buildHeaders(newToken),
        _isRetry: true,
      });
    } catch (err) {
      clearTokens();
      throw err;
    }
  }

  // لو الرد 204 (No Content)
  if (response.status === 204) return null;

  // قراءة body مرة واحدة فقط (JSON أو نص)
  let data;
  const contentType = response.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  } catch (parseErr) {
    data = null;
  }

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`;
    if (data) {
      if (typeof data === 'string') {
        errorMsg = data;
      } else {
        errorMsg = data.detail || data.message || JSON.stringify(data);
      }
    }
    throw new Error(errorMsg);
  }

  return data;
};

// ============================================
// Multipart Upload (للصوت)
// ============================================
export const apiUpload = async (endpoint, formData) => {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  // Auto-refresh on 401
  if (response.status === 401 && getRefreshToken()) {
    try {
      const newToken = await refreshAccessToken();
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, { method: 'POST', headers, body: formData });
    } catch (err) {
      clearTokens();
      throw err;
    }
  }

  if (!response.ok) {
    let errorMsg = `Upload failed: ${response.status}`;
    try {
      const errBody = await response.json();
      errorMsg = errBody.detail || JSON.stringify(errBody);
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
};

export default apiRequest;
