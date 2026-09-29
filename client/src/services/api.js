// API Client for DevAlmanac

const API_BASE = '/api';

// Manage persistent User ID for progress tracking without requiring auth sign-up
export const getUserId = () => {
  let uid = localStorage.getItem('devalmanac_user_id');
  if (!uid) {
    uid = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem('devalmanac_user_id', uid);
  }
  return uid;
};

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-user-id': getUserId(),
  };
};

export const api = {
  // Fetch all language tracks
  async getTracks() {
    const res = await fetch(`${API_BASE}/tracks`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch tracks: ${res.statusText}`);
    return await res.json();
  },

  // Fetch single track with modules & lesson tree
  async getTrack(slug) {
    const res = await fetch(`${API_BASE}/tracks/${slug}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch track ${slug}: ${res.statusText}`);
    return await res.json();
  },

  // Fetch single lesson
  async getLesson(trackSlug, lessonSlug) {
    const res = await fetch(`${API_BASE}/lessons/${trackSlug}/${lessonSlug}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch lesson ${lessonSlug}: ${res.statusText}`);
    return await res.json();
  },

  // Search curriculum
  async search(query, track = '') {
    if (!query || !query.trim()) return { data: [] };
    const params = new URLSearchParams({ q: query.trim() });
    if (track) params.append('track', track);

    const res = await fetch(`${API_BASE}/search?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
    return await res.json();
  },

  // Toggle lesson completion
  async toggleProgress(lessonId, trackId) {
    const userId = getUserId();
    const res = await fetch(`${API_BASE}/progress/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ lessonId, trackId, userId }),
    });
    if (!res.ok) throw new Error(`Failed to toggle progress: ${res.statusText}`);
    return await res.json();
  },

  // Get user track completion progress
  async getProgress(trackId) {
    const userId = getUserId();
    const res = await fetch(`${API_BASE}/progress/${trackId}?userId=${encodeURIComponent(userId)}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch progress: ${res.statusText}`);
    return await res.json();
  },
};
