import { PROGRESS_API, BADGES_API, AUTH_CHECK_API, STORAGE_PREFIX } from '../config/constants.js';

function getAuthToken() {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'auth-token');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function buildHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: buildHeaders(options.headers)
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}${errorBody ? ' — ' + errorBody : ''}`
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Превышено время ожидания запроса');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function sendProgress(lessonNumber, completed) {
  return request(PROGRESS_API, {
    method: 'POST',
    body: JSON.stringify({ lesson: lessonNumber, completed })
  });
}

export async function fetchProgress() {
  return request(PROGRESS_API);
}

export async function sendBatchProgress(updates) {
  return request(PROGRESS_API, {
    method: 'PUT',
    body: JSON.stringify({ updates })
  });
}

export async function fetchBadges() {
  return request(BADGES_API);
}

export async function sendBadgeUnlock(badgeId) {
  return request(BADGES_API, {
    method: 'POST',
    body: JSON.stringify({ badge_id: badgeId })
  });
}

export async function checkAuth() {
  try {
    return await request(AUTH_CHECK_API);
  } catch {
    return { authenticated: false };
  }
}

export { request, getAuthToken };
