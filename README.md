# 🎓 AlumniConnect – Alumni Management & Networking Platform

> A professional Java Full Stack web application connecting alumni, students, and administration.

![Java](https://img.shields.io/badge/Java-21-orange?logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8-blue?logo=mysql)
![Maven](https://img.shields.io/badge/Maven-3.9-red?logo=apachemaven)

---

## 📌 Project Overview

**AlumniConnect** is a full-stack Alumni Management & Networking Platform that bridges the gap between graduates, students, and institutional administration.

The platform allows:
- **Alumni** to maintain professional profiles, post job opportunities, and register for events
- **Students** to browse the alumni directory, apply for jobs, and discover events
- **Admins** to manage events, announcements, and monitor platform activity

---

## 🎯 Problem Statement

Traditional alumni associations rely on manual processes — spreadsheets, email chains, and physical notice boards. AlumniConnect digitizes and streamlines this:
- Searchable alumni directory replaces static spreadsheets
- Online event registration replaces physical sign-up sheets
- Digital job board connects students with alumni-posted opportunities
- Centralized announcements replace fragmented email communication

---

## ✨ Features

| Feature | Admin | Alumni | Student |
|---|---|---|---|
| View Alumni Directory | ✅ | ✅ | ✅ |
| Edit Own Profile | ❌ | ✅ | ❌ |
| Post Jobs | ❌ | ✅ | ❌ |
| Apply for Jobs | ❌ | ✅ | ✅ |
| Create Events | ✅ | ❌ | ❌ |
| Register for Events | ❌ | ✅ | ✅ |
| Create Announcements | ✅ | ❌ | ❌ |
| View Announcements | ✅ | ✅ | ✅ |
| Admin Dashboard | ✅ | ❌ | ❌ |

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose |
|---|---|
| **Java 21** | Primary programming language |
| **Spring Boot 3.2** | Application framework |
| **Spring MVC** | REST API layer |
| **Spring Data JPA** | Database abstraction layer |
| **Hibernate** | ORM — maps Java objects to MySQL tables |
| **MySQL 8** | Relational database |
| **Maven** | Build and dependency management |
| **Lombok** | Reduces boilerplate (getters/setters) |
| **Bean Validation** | Input validation (`@NotBlank`, `@Email`) |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI component framework |
| **JavaScript (ES6+)** | Programming language |
| **JSX** | HTML-in-JavaScript syntax |
| **CSS3** | Styling (no frameworks — pure CSS) |
| **React Router v6** | Client-side routing |
| **useState / useEffect** | State and side-effect management |
| **Fetch API** | HTTP calls to Spring Boot backend |
| **Vite** | Frontend build tool and dev server |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                 React Frontend                    │
│         (Vite + React Router + Pure CSS)          │
│              http://localhost:5173                │
└──────────────────┬───────────────────────────────┘
                   │  HTTP REST API (JSON)
                   │  Fetch API calls to /api/*
                   ↓
┌──────────────────────────────────────────────────┐
│              Spring Boot Backend                  │
│                 http://localhost:8080             │
│                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ Controller │→ │  Service   │→ │ Repository │ │
│  │ @RestCtrl  │  │ @Service   │  │ @Repository│ │
│  └────────────┘  └────────────┘  └────────────┘ │
│                                       │          │
│                                Spring Data JPA   │
│                                   Hibernate      │
└──────────────────────────────────┬───────────────┘
                                   │  JDBC / SQL
                                   ↓
┌──────────────────────────────────────────────────┐
│                  MySQL Database                   │
│                    Port: 3306                     │
│              Database: alumniconnect              │
└──────────────────────────────────────────────────┘
```

### Request Flow Example (Register for Event)
```
1. User clicks "Register" in React
2. React calls: POST /api/events/5/register (JSON body: {userId: 3})
3. Vite proxies request to Spring Boot (port 8080)
4. EventController.registerForEvent() receives the request
5. EventService.registerForEvent() runs business logic:
   - Finds Event by ID (EventRepository)
   - Finds User by ID (UserRepository)
   - Checks if already registered (EventRegistrationRepository)
   - Creates new EventRegistration record
   - Saves to database via JPA
6. Returns success message as JSON
7. React updates UI to show "Registered ✓"
```

---

## 🗄️ Database Design

```
users
├── id (PK, AUTO_INCREMENT)
├── first_name
├── last_name
├── email (UNIQUE)
├── password
├── role (ADMIN/ALUMNI/STUDENT)
├── gender
├── graduation_year
└── department

alumni_profiles
├── id (PK)
├── user_id (FK → users.id, UNIQUE)
├── company_name
├── job_role
├── location
├── phone
├── bio (TEXT)
├── skills (TEXT)
├── linkedin_url
├── profile_photo_url
├── graduation_year
└── department

events
├── id (PK)
├── event_name
├── event_date
├── event_time
├── location
├── description (TEXT)
├── category
├── max_participants
└── created_by (FK → users.id)

event_registrations
├── id (PK)
├── user_id (FK → users.id)
├── event_id (FK → events.id)
├── registration_date
└── UNIQUE(user_id, event_id)

jobs
├── id (PK)
├── job_title
├── company_name
├── location
├── job_type
├── experience_required
├── description (TEXT)
├── skills (TEXT)
├── posted_date
├── application_deadline
└── posted_by (FK → users.id)

job_applications
├── id (PK)
├── user_id (FK → users.id)
├── job_id (FK → jobs.id)
├── applied_date
├── cover_note (TEXT)
├── status
└── UNIQUE(user_id, job_id)

announcements
├── id (PK)
├── title
├── content (TEXT)
├── category
├── created_at
└── created_by (FK → users.id)
```

### Entity Relationships
- `User` ←→ `AlumniProfile`: **One-to-One** (one alumni has one profile)
- `User` → `Event`: **Many-to-One** (many events can be created by one admin)
- `User` ↔ `Event` via `EventRegistration`: **Many-to-Many** (users register for events)
- `User` → `Job`: **Many-to-One** (many jobs can be posted by one alumni)
- `User` ↔ `Job` via `JobApplication`: **Many-to-Many** (users apply to jobs)
- `User` → `Announcement`: **Many-to-One** (many announcements created by one admin)

---

## 🌐 REST API Reference

### Authentication
```
POST   /api/auth/register    Register a new user
POST   /api/auth/login       Login and get user data
```

### Alumni
```
GET    /api/alumni                          Get all alumni
GET    /api/alumni/{id}                     Get alumni by profile ID
GET    /api/alumni/user/{userId}            Get alumni by user ID
PUT    /api/alumni/user/{userId}            Update alumni profile
GET    /api/alumni/search?q=term           Search alumni
GET    /api/alumni/filter?year=&department= Filter alumni
```

### Events
```
GET    /api/events                          Get all events
GET    /api/events/upcoming                 Get upcoming events
GET    /api/events/{id}                     Get event by ID
POST   /api/events?adminUserId=1            Create event (Admin)
PUT    /api/events/{id}                     Update event
DELETE /api/events/{id}                     Delete event
POST   /api/events/{id}/register            Register for event
DELETE /api/events/{id}/register?userId=1   Cancel registration
```

### Jobs
```
GET    /api/jobs                            Get all jobs
GET    /api/jobs/{id}                       Get job by ID
GET    /api/jobs/alumni/{userId}            Jobs by alumni
POST   /api/jobs?alumniUserId=1             Post a job (Alumni)
PUT    /api/jobs/{id}?userId=1              Update job
DELETE /api/jobs/{id}?userId=1              Delete job
GET    /api/jobs/search?q=term             Search jobs
POST   /api/jobs/{id}/apply                Apply for job
GET    /api/jobs/user/{userId}/applications User's applications
```

### Announcements
```
GET    /api/announcements                   Get all announcements
GET    /api/announcements/{id}              Get by ID
POST   /api/announcements?adminUserId=1     Create announcement (Admin)
PUT    /api/announcements/{id}              Update announcement
DELETE /api/announcements/{id}              Delete announcement
```

### Admin
```
GET    /api/admin/stats                     Platform statistics
```

---

## 📁 Project Structure

```
AlumniConnect/
├── backend/                         # Spring Boot Application
│   ├── pom.xml                      # Maven dependencies
│   └── src/main/
│       ├── java/com/alumniconnect/
│       │   ├── AlumniConnectApplication.java
│       │   ├── config/
│       │   │   └── WebConfig.java   # CORS configuration
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   ├── AlumniController.java
│       │   │   ├── EventController.java
│       │   │   ├── JobController.java
│       │   │   ├── AnnouncementController.java
│       │   │   └── AdminController.java
│       │   ├── service/
│       │   │   ├── AuthService.java
│       │   │   ├── AlumniService.java
│       │   │   ├── EventService.java
│       │   │   ├── JobService.java
│       │   │   └── AnnouncementService.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   ├── AlumniProfileRepository.java
│       │   │   ├── EventRepository.java
│       │   │   ├── EventRegistrationRepository.java
│       │   │   ├── JobRepository.java
│       │   │   ├── JobApplicationRepository.java
│       │   │   └── AnnouncementRepository.java
│       │   ├── entity/
│       │   │   ├── User.java
│       │   │   ├── AlumniProfile.java
│       │   │   ├── Event.java
│       │   │   ├── EventRegistration.java
│       │   │   ├── Job.java
│       │   │   ├── JobApplication.java
│       │   │   └── Announcement.java
│       │   ├── dto/
│       │   │   ├── RegisterRequest.java
│       │   │   ├── LoginRequest.java
│       │   │   ├── LoginResponse.java
│       │   │   ├── AlumniProfileDTO.java
│       │   │   ├── EventDTO.java
│       │   │   ├── JobDTO.java
│       │   │   └── AnnouncementDTO.java
│       │   └── exception/
│       │       ├── ResourceNotFoundException.java
│       │       └── GlobalExceptionHandler.java
│       └── resources/
│           └── application.properties
│
├── frontend/                        # React Application
│   ├── package.json
│   ├── vite.config.js               # Vite + API proxy config
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                  # Routes + ProtectedRoute
│       ├── index.css                # Global CSS design system
│       ├── api/
│       │   └── api.js               # Centralized API layer
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state
│       ├── components/
│       │   └── DashboardLayout.jsx  # Sidebar + topbar layout
│       └── pages/
│           ├── LandingPage.jsx
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── admin/
│           │   ├── AdminDashboard.jsx
│           │   ├── ManageEvents.jsx
│           │   └── ManageAnnouncements.jsx
│           ├── alumni/
│           │   ├── AlumniDashboard.jsx
│           │   ├── AlumniProfile.jsx
│           │   ├── EditProfile.jsx
│           │   └── PostJob.jsx
│           ├── student/
│           │   └── StudentDashboard.jsx
│           └── shared/
│               ├── AlumniDirectory.jsx
│               ├── EventsList.jsx
│               ├── EventDetail.jsx
│               ├── JobsList.jsx
│               ├── JobDetail.jsx
│               └── Announcements.jsx
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 21** or higher
- **Maven 3.6+**
- **Node.js 18+** and **npm**
- **MySQL 8** running locally

---

### 1. MySQL Database Setup

Open MySQL Workbench or MySQL CLI and run:

```sql
CREATE DATABASE alumniconnect;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON alumniconnect.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

> **Note:** Tables are created automatically by Hibernate (`ddl-auto=update`). No SQL scripts needed.

---

### 2. Backend Setup

1. Open `backend/src/main/resources/application.properties`
2. Update MySQL credentials if different from default:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```
3. Run the Spring Boot application:

```bash
cd AlumniConnect/backend
mvn spring-boot:run
```

The backend starts at **http://localhost:8080**

---

### 3. Frontend Setup

```bash
cd AlumniConnect/frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:5173**

---

### 4. Create Your First Admin Account

1. Open http://localhost:5173
2. Click "Get Started" → Register
3. Since the Register page only allows ALUMNI and STUDENT, create an admin via Postman:

```json
POST http://localhost:8080/api/auth/register
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@college.edu",
  "password": "admin123",
  "role": "ADMIN",
  "department": "Computer Science"
}
```

Then login with these credentials.

---

## 🧪 Testing the APIs with Postman

### Register Alumni
```json
POST http://localhost:8080/api/auth/register
Content-Type: application/json
{
  "firstName": "Rahul",
  "lastName": "Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "ALUMNI",
  "graduationYear": 2022,
  "department": "Computer Science"
}
```

### Login
```json
POST http://localhost:8080/api/auth/login
Content-Type: application/json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

### Get All Alumni
```
GET http://localhost:8080/api/alumni
```

### Create Event (Admin)
```json
POST http://localhost:8080/api/events?adminUserId=1
Content-Type: application/json
{
  "eventName": "Annual Alumni Meet 2025",
  "eventDate": "2025-12-15",
  "eventTime": "10:00",
  "location": "Main Auditorium, Pune",
  "description": "Annual gathering of all alumni",
  "category": "ALUMNI_MEET"
}
```

---

## 🔮 Future Improvements

- [ ] BCrypt password hashing (security)
- [ ] JWT-based authentication and authorization
- [ ] Email notifications for event registration
- [ ] Image/photo upload to Cloudinary
- [ ] Alumni mentorship matching
- [ ] Pagination for large data sets
- [ ] Search suggestions (autocomplete)
- [ ] Admin approval workflow for alumni registration
- [ ] Docker containerization
- [ ] Deployment to AWS / Railway / Render

---

## 👨‍💻 Developer

Built with ❤️ as a B.Tech CSE Capstone Project demonstrating Java Full Stack Development skills.

**Tech Stack:** Java 21 · Spring Boot 3 · Spring Data JPA · Hibernate · MySQL · React 18 · JavaScript · CSS3 · Maven · Vite
