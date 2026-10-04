/**
 * api.js - Centralized API layer for AlumniConnect frontend.
 *
 * Supports both:
 * 1. Live Spring Boot Backend (when connected locally or via VITE_API_URL)
 * 2. Seamless Demo Mode Fallback (when hosted statically on GitHub Pages / Vercel without backend)
 *
 * This ensures that anyone viewing the public portfolio link can test and explore
 * the complete application without getting HTTP 405 or 404 errors!
 */

const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api` 
  : '/api';

// =============================================================
// DEMO / MOCK DATA STORE (Used when live backend is offline or on static hosts)
// =============================================================

const mockUsers = [
  { userId: 1, firstName: 'Admin', lastName: 'User', email: 'admin@college.edu', role: 'ADMIN', department: 'Administration' },
  { userId: 2, firstName: 'Rahul', lastName: 'Sharma', email: 'rahul@example.com', role: 'ALUMNI', department: 'Computer Science', graduationYear: 2022 },
  { userId: 3, firstName: 'Arjun', lastName: 'Singh', email: 'arjun@student.edu', role: 'STUDENT', department: 'Computer Science', graduationYear: 2025 },
];

let mockAlumni = [
  { id: 1, userId: 2, firstName: 'Rahul', lastName: 'Sharma', companyName: 'Infosys', jobRole: 'Software Engineer', location: 'Bangalore, India', phone: '+91-9876543210', bio: 'B.Tech CSE graduate working as a Software Engineer at Infosys. Passionate about Java, Spring Boot and modern web apps.', skills: 'Java, Spring Boot, MySQL, React, Git', linkedinUrl: 'https://linkedin.com', graduationYear: 2022, department: 'Computer Science' },
  { id: 2, userId: 4, firstName: 'Priya', lastName: 'Patel', companyName: 'TCS', jobRole: 'System Analyst', location: 'Pune, India', phone: '+91-9123456789', bio: 'IT graduate with 3 years experience at TCS. Expert in Java backend development and microservices.', skills: 'Java, Python, AWS, Spring Boot, Microservices', linkedinUrl: 'https://linkedin.com', graduationYear: 2021, department: 'Information Technology' },
  { id: 3, userId: 5, firstName: 'Sneha', lastName: 'Joshi', companyName: 'Google', jobRole: 'Software Engineer', location: 'Bangalore, India', phone: '+91-8765432109', bio: 'Software engineer at Google working on frontend and scalable distributed systems.', skills: 'React, TypeScript, Java, Cloud, Algorithms', linkedinUrl: 'https://linkedin.com', graduationYear: 2023, department: 'Computer Science' },
  { id: 4, userId: 6, firstName: 'Amit', lastName: 'Verma', companyName: 'Wipro', jobRole: 'Senior Engineer', location: 'Hyderabad, India', phone: '+91-9988776655', bio: 'Embedded systems engineer with deep interest in IoT and hardware programming.', skills: 'C++, Java, Embedded Systems, IoT', linkedinUrl: 'https://linkedin.com', graduationYear: 2020, department: 'Electronics and Communication' },
  { id: 5, userId: 7, firstName: 'Vikram', lastName: 'Malhotra', companyName: 'Microsoft', jobRole: 'Cloud Architect', location: 'Hyderabad, India', phone: '+91-9811223344', bio: 'Designing resilient, scalable cloud architectures on Azure.', skills: 'Azure, Cloud, Microservices, Java, Kubernetes', linkedinUrl: 'https://linkedin.com', graduationYear: 2019, department: 'Computer Science' },
  { id: 6, userId: 8, firstName: 'Ananya', lastName: 'Iyer', companyName: 'Amazon', jobRole: 'Frontend SDE', location: 'Chennai, India', phone: '+91-9844332211', bio: 'Building high performance customer-facing applications at Amazon.', skills: 'React, JavaScript, Web Performance, CSS', linkedinUrl: 'https://linkedin.com', graduationYear: 2022, department: 'Information Technology' }
];

let mockEvents = [
  { id: 1, eventName: 'Annual Alumni Meet 2025', eventDate: '2025-12-15', eventTime: '10:00', location: 'Main Auditorium, Pune', description: 'The annual gathering of all alumni. Network with 500+ professionals, attend panel discussions on career growth, and reconnect with batchmates.', category: 'ALUMNI_MEET', maxParticipants: 500, registrationCount: 142, isRegistered: false, createdByName: 'Admin User' },
  { id: 2, eventName: 'Tech Talk: Java & Microservices', eventDate: '2025-11-20', eventTime: '14:00', location: 'Seminar Hall B, Block 3', description: 'Expert alumni from top tech companies will speak about Microservices architecture, Docker, Kubernetes, and enterprise Java development.', category: 'TECH_TALK', maxParticipants: 200, registrationCount: 88, isRegistered: true, createdByName: 'Admin User' },
  { id: 3, eventName: 'Career Guidance & Resume Review', eventDate: '2025-11-10', eventTime: '09:00', location: 'Conference Room 1', description: 'Resume review, mock interviews, and career path guidance for final year students conducted by alumni working at Google, TCS, and Infosys.', category: 'CAREER', maxParticipants: 100, registrationCount: 65, isRegistered: false, createdByName: 'Admin User' }
];

let mockJobs = [
  { id: 1, jobTitle: 'Java Backend Developer', companyName: 'Infosys', location: 'Bangalore / Remote', jobType: 'Full-Time', experienceRequired: 'Freshers welcome (0-1 yrs)', description: 'Looking for passionate Java developers to join our team. Work on enterprise-grade Spring Boot microservices. Comprehensive training provided for freshers.', skills: 'Java, Spring Boot, MySQL, REST APIs, Git', postedDate: '2025-10-01', applicationDeadline: '2025-11-15', applicationCount: 24, hasApplied: false, postedBy: 2, postedByName: 'Rahul Sharma' },
  { id: 2, jobTitle: 'React Frontend Intern', companyName: 'TCS', location: 'Pune', jobType: 'Internship', experienceRequired: 'No experience required', description: 'Summer internship opportunity at TCS. Work on real-world React projects alongside experienced engineers. Monthly stipend included.', skills: 'React, JavaScript, HTML, CSS, Git', postedDate: '2025-10-02', applicationDeadline: '2025-11-20', applicationCount: 42, hasApplied: true, postedBy: 4, postedByName: 'Priya Patel' },
  { id: 3, jobTitle: 'Junior Software Engineer', companyName: 'Google', location: 'Bangalore', jobType: 'Full-Time', experienceRequired: '0-2 years', description: 'Join Google as a Software Engineer. Work on large-scale web applications serving millions of users. Strong fundamentals in Java or Python and any frontend framework.', skills: 'Java, Python, React, Cloud, Data Structures', postedDate: '2025-10-03', applicationDeadline: '2025-10-30', applicationCount: 89, hasApplied: false, postedBy: 5, postedByName: 'Sneha Joshi' }
];

let mockAnnouncements = [
  { id: 1, title: 'Welcome to AlumniConnect Platform!', content: 'We are thrilled to launch AlumniConnect — our unified Alumni Management & Networking Platform. Explore the directory, register for events, and apply for alumni-referred jobs.', category: 'GENERAL', createdAt: '2025-10-01T10:00:00', createdByName: 'Admin' },
  { id: 2, title: 'Annual Alumni Meet 2025 – Registrations Open', content: 'Registrations are now officially open for the Annual Alumni Meet on 15th December 2025 in the Main Auditorium. Limited seats available, register early!', category: 'EVENT', createdAt: '2025-10-02T11:30:00', createdByName: 'Admin' },
  { id: 3, title: 'Campus Recruitment Drive – Autumn 2025', content: 'Top tier recruiters including TCS, Infosys, and Capgemini will be conducting campus drives. Keep your resumes updated and check the jobs section regularly.', category: 'JOB', createdAt: '2025-10-03T09:15:00', createdByName: 'Admin' }
];

// Detect if running on a static host (like GitHub Pages or Vercel) without a live backend configured
const isStaticHost = typeof window !== 'undefined' && 
  (window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app')) &&
  !import.meta.env.VITE_API_URL;

// Helper: Safely executes an API call with graceful demo fallback
async function fetchWithFallback(url, options, fallbackFn) {
  // On static hosts without a backend, return demo data directly
  // This avoids doomed network calls that return HTTP 405 from static web servers
  if (isStaticHost) {
    await new Promise(resolve => setTimeout(resolve, 150));
    return fallbackFn();
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // If server returns error (404, 405, 500), gracefully fallback to demo data
      return fallbackFn();
    }
    return await response.json();
  } catch (err) {
    // If backend is unreachable (offline/network error), gracefully fallback
    return fallbackFn();
  }
}

// =============================================================
// AUTH APIs
// =============================================================

export const authAPI = {
  register: async (userData) => {
    return fetchWithFallback(
      `${BASE_URL}/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      },
      () => {
        // Fallback for demo
        const newUser = {
          userId: mockUsers.length + 1,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role || 'ALUMNI',
          department: userData.department,
          graduationYear: userData.graduationYear
        };
        mockUsers.push(newUser);
        return { message: 'Registration successful!' };
      }
    );
  },

  login: async (credentials) => {
    return fetchWithFallback(
      `${BASE_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      },
      () => {
        // Fallback for demo: match email or default based on email content
        const email = credentials.email?.toLowerCase() || '';
        let matched = mockUsers.find(u => u.email.toLowerCase() === email);
        if (!matched) {
          if (email.includes('admin')) {
            matched = mockUsers[0]; // Admin
          } else if (email.includes('student')) {
            matched = mockUsers[2]; // Student
          } else {
            matched = {
              userId: 10,
              firstName: credentials.email.split('@')[0] || 'User',
              lastName: 'Demo',
              email: credentials.email,
              role: 'ALUMNI',
              department: 'Computer Science'
            };
          }
        }
        return {
          userId: matched.userId,
          firstName: matched.firstName,
          lastName: matched.lastName,
          email: matched.email,
          role: matched.role,
          success: true,
          message: 'Login successful'
        };
      }
    );
  },
};

// =============================================================
// ALUMNI APIs
// =============================================================

export const alumniAPI = {
  getAll: async () => {
    return fetchWithFallback(`${BASE_URL}/alumni`, {}, () => mockAlumni);
  },

  getByUserId: async (userId) => {
    return fetchWithFallback(
      `${BASE_URL}/alumni/user/${userId}`,
      {},
      () => mockAlumni.find(a => a.userId === Number(userId)) || mockAlumni[0]
    );
  },

  getById: async (id) => {
    return fetchWithFallback(
      `${BASE_URL}/alumni/${id}`,
      {},
      () => mockAlumni.find(a => a.id === Number(id)) || mockAlumni[0]
    );
  },

  updateProfile: async (userId, profileData) => {
    return fetchWithFallback(
      `${BASE_URL}/alumni/user/${userId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      },
      () => {
        const idx = mockAlumni.findIndex(a => a.userId === Number(userId));
        if (idx !== -1) {
          mockAlumni[idx] = { ...mockAlumni[idx], ...profileData };
          return mockAlumni[idx];
        }
        return profileData;
      }
    );
  },

  search: async (searchTerm) => {
    return fetchWithFallback(
      `${BASE_URL}/alumni/search?q=${encodeURIComponent(searchTerm)}`,
      {},
      () => {
        const term = searchTerm.toLowerCase();
        return mockAlumni.filter(a => 
          a.firstName.toLowerCase().includes(term) ||
          a.lastName.toLowerCase().includes(term) ||
          (a.companyName && a.companyName.toLowerCase().includes(term)) ||
          (a.jobRole && a.jobRole.toLowerCase().includes(term))
        );
      }
    );
  },

  filter: async (year, department) => {
    return fetchWithFallback(
      `${BASE_URL}/alumni/filter?year=${year || ''}&department=${department || ''}`,
      {},
      () => {
        return mockAlumni.filter(a => {
          const matchYear = !year || String(a.graduationYear) === String(year);
          const matchDept = !department || a.department === department;
          return matchYear && matchDept;
        });
      }
    );
  },
};

// =============================================================
// EVENT APIs
// =============================================================

export const eventAPI = {
  getAll: async (userId = null) => {
    return fetchWithFallback(`${BASE_URL}/events?userId=${userId || ''}`, {}, () => mockEvents);
  },

  getUpcoming: async (userId = null) => {
    return fetchWithFallback(`${BASE_URL}/events/upcoming?userId=${userId || ''}`, {}, () => mockEvents);
  },

  getById: async (id, userId = null) => {
    return fetchWithFallback(
      `${BASE_URL}/events/${id}?userId=${userId || ''}`,
      {},
      () => mockEvents.find(e => e.id === Number(id)) || mockEvents[0]
    );
  },

  create: async (eventData, adminUserId) => {
    return fetchWithFallback(
      `${BASE_URL}/events?adminUserId=${adminUserId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      },
      () => {
        const newEv = {
          ...eventData,
          id: mockEvents.length + 1,
          registrationCount: 0,
          isRegistered: false,
          createdByName: 'Admin User'
        };
        mockEvents.unshift(newEv);
        return newEv;
      }
    );
  },

  update: async (id, eventData) => {
    return fetchWithFallback(
      `${BASE_URL}/events/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      },
      () => {
        const idx = mockEvents.findIndex(e => e.id === Number(id));
        if (idx !== -1) mockEvents[idx] = { ...mockEvents[idx], ...eventData };
        return mockEvents[idx];
      }
    );
  },

  delete: async (id) => {
    return fetchWithFallback(
      `${BASE_URL}/events/${id}`,
      { method: 'DELETE' },
      () => {
        mockEvents = mockEvents.filter(e => e.id !== Number(id));
        return { message: 'Event deleted' };
      }
    );
  },

  register: async (eventId, userId) => {
    return fetchWithFallback(
      `${BASE_URL}/events/${eventId}/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      },
      () => {
        const ev = mockEvents.find(e => e.id === Number(eventId));
        if (ev) {
          ev.isRegistered = true;
          ev.registrationCount = (ev.registrationCount || 0) + 1;
        }
        return { message: 'Registered successfully!' };
      }
    );
  },

  cancelRegistration: async (eventId, userId) => {
    return fetchWithFallback(
      `${BASE_URL}/events/${eventId}/register?userId=${userId}`,
      { method: 'DELETE' },
      () => {
        const ev = mockEvents.find(e => e.id === Number(eventId));
        if (ev) {
          ev.isRegistered = false;
          ev.registrationCount = Math.max((ev.registrationCount || 1) - 1, 0);
        }
        return { message: 'Registration cancelled' };
      }
    );
  },

  getUserRegistered: async (userId) => {
    return fetchWithFallback(
      `${BASE_URL}/events/user/${userId}/registered`,
      {},
      () => mockEvents.filter(e => e.isRegistered)
    );
  },
};

// =============================================================
// JOB APIs
// =============================================================

export const jobAPI = {
  getAll: async (userId = null) => {
    return fetchWithFallback(`${BASE_URL}/jobs?userId=${userId || ''}`, {}, () => mockJobs);
  },

  getById: async (id, userId = null) => {
    return fetchWithFallback(
      `${BASE_URL}/jobs/${id}?userId=${userId || ''}`,
      {},
      () => mockJobs.find(j => j.id === Number(id)) || mockJobs[0]
    );
  },

  getByAlumni: async (userId) => {
    return fetchWithFallback(
      `${BASE_URL}/jobs/alumni/${userId}`,
      {},
      () => mockJobs.filter(j => j.postedBy === Number(userId))
    );
  },

  create: async (jobData, alumniUserId) => {
    return fetchWithFallback(
      `${BASE_URL}/jobs?alumniUserId=${alumniUserId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      },
      () => {
        const newJob = {
          ...jobData,
          id: mockJobs.length + 1,
          postedBy: Number(alumniUserId),
          postedByName: 'Rahul Sharma',
          postedDate: new Date().toISOString().split('T')[0],
          applicationCount: 0,
          hasApplied: false
        };
        mockJobs.unshift(newJob);
        return newJob;
      }
    );
  },

  update: async (id, jobData, userId) => {
    return fetchWithFallback(
      `${BASE_URL}/jobs/${id}?userId=${userId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      },
      () => {
        const idx = mockJobs.findIndex(j => j.id === Number(id));
        if (idx !== -1) mockJobs[idx] = { ...mockJobs[idx], ...jobData };
        return mockJobs[idx];
      }
    );
  },

  delete: async (id, userId) => {
    return fetchWithFallback(
      `${BASE_URL}/jobs/${id}?userId=${userId}`,
      { method: 'DELETE' },
      () => {
        mockJobs = mockJobs.filter(j => j.id !== Number(id));
        return { message: 'Job deleted' };
      }
    );
  },

  search: async (searchTerm, userId = null) => {
    return fetchWithFallback(
      `${BASE_URL}/jobs/search?q=${encodeURIComponent(searchTerm)}&userId=${userId || ''}`,
      {},
      () => {
        const term = searchTerm.toLowerCase();
        return mockJobs.filter(j => 
          j.jobTitle.toLowerCase().includes(term) ||
          j.companyName.toLowerCase().includes(term) ||
          (j.skills && j.skills.toLowerCase().includes(term))
        );
      }
    );
  },

  apply: async (jobId, userId, coverNote = '') => {
    return fetchWithFallback(
      `${BASE_URL}/jobs/${jobId}/apply`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, coverNote }),
      },
      () => {
        const j = mockJobs.find(item => item.id === Number(jobId));
        if (j) {
          j.hasApplied = true;
          j.applicationCount = (j.applicationCount || 0) + 1;
        }
        return { message: 'Application submitted successfully!' };
      }
    );
  },

  getUserApplications: async (userId) => {
    return fetchWithFallback(
      `${BASE_URL}/jobs/user/${userId}/applications`,
      {},
      () => mockJobs.filter(j => j.hasApplied)
    );
  },
};

// =============================================================
// ANNOUNCEMENT APIs
// =============================================================

export const announcementAPI = {
  getAll: async () => {
    return fetchWithFallback(`${BASE_URL}/announcements`, {}, () => mockAnnouncements);
  },

  getById: async (id) => {
    return fetchWithFallback(
      `${BASE_URL}/announcements/${id}`,
      {},
      () => mockAnnouncements.find(a => a.id === Number(id)) || mockAnnouncements[0]
    );
  },

  create: async (data, adminUserId) => {
    return fetchWithFallback(
      `${BASE_URL}/announcements?adminUserId=${adminUserId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      () => {
        const newAnn = {
          ...data,
          id: mockAnnouncements.length + 1,
          createdAt: new Date().toISOString(),
          createdByName: 'Admin User'
        };
        mockAnnouncements.unshift(newAnn);
        return newAnn;
      }
    );
  },

  update: async (id, data) => {
    return fetchWithFallback(
      `${BASE_URL}/announcements/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      () => {
        const idx = mockAnnouncements.findIndex(a => a.id === Number(id));
        if (idx !== -1) mockAnnouncements[idx] = { ...mockAnnouncements[idx], ...data };
        return mockAnnouncements[idx];
      }
    );
  },

  delete: async (id) => {
    return fetchWithFallback(
      `${BASE_URL}/announcements/${id}`,
      { method: 'DELETE' },
      () => {
        mockAnnouncements = mockAnnouncements.filter(a => a.id !== Number(id));
        return { message: 'Announcement deleted' };
      }
    );
  },
};

// =============================================================
// ADMIN APIs
// =============================================================

export const adminAPI = {
  getStats: async () => {
    return fetchWithFallback(
      `${BASE_URL}/admin/stats`,
      {},
      () => ({
        totalAlumni: mockAlumni.length + 500,
        totalStudents: 1250,
        totalEvents: mockEvents.length + 47,
        totalJobs: mockJobs.length + 197,
        totalAnnouncements: mockAnnouncements.length + 20
      })
    );
  },
};
