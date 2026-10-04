/**
 * api.js - Centralized API layer for AlumniConnect frontend.
 *
 * All fetch calls to the Spring Boot backend are defined here.
 * This keeps API logic in one place instead of scattered across components.
 *
 * Interview explanation:
 *   "I created a centralized API file so that if the backend URL changes,
 *    I only need to update it in one place. Each function corresponds to
 *    a REST API endpoint in the Spring Boot backend."
 */

// Base URL for the Spring Boot backend
// In development, Vite proxies /api calls to http://localhost:8080
const BASE_URL = '/api';

// Helper function to handle fetch responses consistently
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }
  return response.json();
}

// =============================================================
// AUTH APIs
// =============================================================

export const authAPI = {
  /**
   * POST /api/auth/register
   * Registers a new user.
   */
  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  /**
   * POST /api/auth/login
   * Logs in a user.
   */
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
};

// =============================================================
// ALUMNI APIs
// =============================================================

export const alumniAPI = {
  /**
   * GET /api/alumni
   * Get all alumni for directory.
   */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/alumni`);
    return handleResponse(response);
  },

  /**
   * GET /api/alumni/user/{userId}
   */
  getByUserId: async (userId) => {
    const response = await fetch(`${BASE_URL}/alumni/user/${userId}`);
    return handleResponse(response);
  },

  /**
   * GET /api/alumni/{id}
   */
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/alumni/${id}`);
    return handleResponse(response);
  },

  /**
   * PUT /api/alumni/user/{userId}
   */
  updateProfile: async (userId, profileData) => {
    const response = await fetch(`${BASE_URL}/alumni/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  /**
   * GET /api/alumni/search?q=searchTerm
   */
  search: async (searchTerm) => {
    const response = await fetch(`${BASE_URL}/alumni/search?q=${encodeURIComponent(searchTerm)}`);
    return handleResponse(response);
  },

  /**
   * GET /api/alumni/filter?year=2022&department=CS
   */
  filter: async (year, department) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (department) params.append('department', department);
    const response = await fetch(`${BASE_URL}/alumni/filter?${params}`);
    return handleResponse(response);
  },
};

// =============================================================
// EVENT APIs
// =============================================================

export const eventAPI = {
  /**
   * GET /api/events?userId=1
   */
  getAll: async (userId = null) => {
    const url = userId ? `${BASE_URL}/events?userId=${userId}` : `${BASE_URL}/events`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * GET /api/events/upcoming?userId=1
   */
  getUpcoming: async (userId = null) => {
    const url = userId
      ? `${BASE_URL}/events/upcoming?userId=${userId}`
      : `${BASE_URL}/events/upcoming`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * GET /api/events/{id}?userId=1
   */
  getById: async (id, userId = null) => {
    const url = userId
      ? `${BASE_URL}/events/${id}?userId=${userId}`
      : `${BASE_URL}/events/${id}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * POST /api/events?adminUserId=1
   */
  create: async (eventData, adminUserId) => {
    const response = await fetch(`${BASE_URL}/events?adminUserId=${adminUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  /**
   * PUT /api/events/{id}
   */
  update: async (id, eventData) => {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  /**
   * DELETE /api/events/{id}
   */
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/events/${id}`, { method: 'DELETE' });
    return handleResponse(response);
  },

  /**
   * POST /api/events/{id}/register
   */
  register: async (eventId, userId) => {
    const response = await fetch(`${BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
  },

  /**
   * DELETE /api/events/{id}/register?userId=1
   */
  cancelRegistration: async (eventId, userId) => {
    const response = await fetch(
      `${BASE_URL}/events/${eventId}/register?userId=${userId}`,
      { method: 'DELETE' }
    );
    return handleResponse(response);
  },

  /**
   * GET /api/events/user/{userId}/registered
   */
  getUserRegistered: async (userId) => {
    const response = await fetch(`${BASE_URL}/events/user/${userId}/registered`);
    return handleResponse(response);
  },
};

// =============================================================
// JOB APIs
// =============================================================

export const jobAPI = {
  /**
   * GET /api/jobs?userId=1
   */
  getAll: async (userId = null) => {
    const url = userId ? `${BASE_URL}/jobs?userId=${userId}` : `${BASE_URL}/jobs`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * GET /api/jobs/{id}?userId=1
   */
  getById: async (id, userId = null) => {
    const url = userId ? `${BASE_URL}/jobs/${id}?userId=${userId}` : `${BASE_URL}/jobs/${id}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * GET /api/jobs/alumni/{userId}
   */
  getByAlumni: async (userId) => {
    const response = await fetch(`${BASE_URL}/jobs/alumni/${userId}`);
    return handleResponse(response);
  },

  /**
   * POST /api/jobs?alumniUserId=1
   */
  create: async (jobData, alumniUserId) => {
    const response = await fetch(`${BASE_URL}/jobs?alumniUserId=${alumniUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    return handleResponse(response);
  },

  /**
   * PUT /api/jobs/{id}?userId=1
   */
  update: async (id, jobData, userId) => {
    const response = await fetch(`${BASE_URL}/jobs/${id}?userId=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    return handleResponse(response);
  },

  /**
   * DELETE /api/jobs/{id}?userId=1
   */
  delete: async (id, userId) => {
    const response = await fetch(`${BASE_URL}/jobs/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  /**
   * GET /api/jobs/search?q=java
   */
  search: async (searchTerm, userId = null) => {
    const params = new URLSearchParams({ q: searchTerm });
    if (userId) params.append('userId', userId);
    const response = await fetch(`${BASE_URL}/jobs/search?${params}`);
    return handleResponse(response);
  },

  /**
   * POST /api/jobs/{id}/apply
   */
  apply: async (jobId, userId, coverNote = '') => {
    const response = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, coverNote }),
    });
    return handleResponse(response);
  },

  /**
   * GET /api/jobs/user/{userId}/applications
   */
  getUserApplications: async (userId) => {
    const response = await fetch(`${BASE_URL}/jobs/user/${userId}/applications`);
    return handleResponse(response);
  },
};

// =============================================================
// ANNOUNCEMENT APIs
// =============================================================

export const announcementAPI = {
  /**
   * GET /api/announcements
   */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/announcements`);
    return handleResponse(response);
  },

  /**
   * GET /api/announcements/{id}
   */
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/announcements/${id}`);
    return handleResponse(response);
  },

  /**
   * POST /api/announcements?adminUserId=1
   */
  create: async (data, adminUserId) => {
    const response = await fetch(`${BASE_URL}/announcements?adminUserId=${adminUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * PUT /api/announcements/{id}
   */
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/announcements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * DELETE /api/announcements/{id}
   */
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/announcements/${id}`, { method: 'DELETE' });
    return handleResponse(response);
  },
};

// =============================================================
// ADMIN APIs
// =============================================================

export const adminAPI = {
  /**
   * GET /api/admin/stats
   */
  getStats: async () => {
    const response = await fetch(`${BASE_URL}/admin/stats`);
    return handleResponse(response);
  },
};
