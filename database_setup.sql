-- ============================================================
-- AlumniConnect Database Setup Script
-- Run this in MySQL Workbench or MySQL CLI before starting
-- the Spring Boot application for the first time.
-- ============================================================

-- 1. Create the database (Spring Boot can also auto-create it)
CREATE DATABASE IF NOT EXISTS alumniconnect
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE alumniconnect;

-- ============================================================
-- NOTE: Spring Boot with ddl-auto=update will automatically
-- create all tables from the JPA entity classes.
-- This file is only for manual setup or seed data.
-- ============================================================

-- ============================================================
-- SEED DATA: Create sample Admin, Alumni, and Student users
-- IMPORTANT: Passwords are plain text for demo purposes.
-- In production, use BCrypt hashed passwords.
-- ============================================================

-- Insert Admin user
INSERT INTO users (first_name, last_name, email, password, role, gender, graduation_year, department)
VALUES ('Admin', 'User', 'admin@college.edu', 'admin123', 'ADMIN', 'Male', NULL, 'Administration')
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample Alumni users
INSERT INTO users (first_name, last_name, email, password, role, gender, graduation_year, department)
VALUES
('Rahul', 'Sharma', 'rahul@example.com', 'password123', 'ALUMNI', 'Male', 2022, 'Computer Science'),
('Priya', 'Patel', 'priya@example.com', 'password123', 'ALUMNI', 'Female', 2021, 'Information Technology'),
('Amit', 'Verma', 'amit@example.com', 'password123', 'ALUMNI', 'Male', 2020, 'Electronics and Communication'),
('Sneha', 'Joshi', 'sneha@example.com', 'password123', 'ALUMNI', 'Female', 2023, 'Computer Science')
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample Student users
INSERT INTO users (first_name, last_name, email, password, role, gender, graduation_year, department)
VALUES
('Arjun', 'Singh', 'arjun@student.edu', 'student123', 'STUDENT', 'Male', 2025, 'Computer Science'),
('Kavya', 'Reddy', 'kavya@student.edu', 'student123', 'STUDENT', 'Female', 2026, 'Information Technology')
ON DUPLICATE KEY UPDATE id=id;

-- Insert Alumni Profiles (one per alumni user)
-- We use a subquery to get the user_id from the email
INSERT INTO alumni_profiles (user_id, company_name, job_role, location, phone, bio, skills, linkedin_url, graduation_year, department)
SELECT u.id, 'Infosys', 'Software Engineer', 'Bangalore, India',
       '+91-9876543210',
       'B.Tech CSE graduate working as a Software Engineer at Infosys. Passionate about Java and web development.',
       'Java, Spring Boot, MySQL, React, Git',
       'https://linkedin.com/in/rahulsharma',
       2022, 'Computer Science'
FROM users u WHERE u.email = 'rahul@example.com'
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO alumni_profiles (user_id, company_name, job_role, location, phone, bio, skills, linkedin_url, graduation_year, department)
SELECT u.id, 'TCS', 'System Analyst', 'Pune, India',
       '+91-9123456789',
       'IT graduate with 3 years experience at TCS. Expert in Java backend development and cloud technologies.',
       'Java, Python, AWS, Spring Boot, Microservices',
       'https://linkedin.com/in/priyapatel',
       2021, 'Information Technology'
FROM users u WHERE u.email = 'priya@example.com'
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO alumni_profiles (user_id, company_name, job_role, location, phone, bio, skills, linkedin_url, graduation_year, department)
SELECT u.id, 'Wipro', 'Senior Engineer', 'Hyderabad, India',
       '+91-9988776655',
       'Embedded systems engineer with experience in IoT and hardware programming.',
       'C, C++, Embedded C, RTOS, Python',
       'https://linkedin.com/in/amitverma',
       2020, 'Electronics and Communication'
FROM users u WHERE u.email = 'amit@example.com'
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO alumni_profiles (user_id, company_name, job_role, location, phone, bio, skills, linkedin_url, graduation_year, department)
SELECT u.id, 'Google', 'Junior SDE', 'Bangalore, India',
       '+91-8765432109',
       'Recent grad at Google working on frontend applications. Loves React and JavaScript.',
       'React, JavaScript, TypeScript, Node.js, Python',
       'https://linkedin.com/in/snehajoshi',
       2023, 'Computer Science'
FROM users u WHERE u.email = 'sneha@example.com'
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample Events (created by admin)
INSERT INTO events (event_name, event_date, event_time, location, description, category, max_participants, created_by)
SELECT 'Annual Alumni Meet 2025', '2025-12-15', '10:00:00', 'Main Auditorium, Pune',
       'The annual gathering of all alumni. Network with 500+ professionals, attend panel discussions on career growth, and reconnect with old friends.',
       'ALUMNI_MEET', 500, u.id
FROM users u WHERE u.email = 'admin@college.edu'
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO events (event_name, event_date, event_time, location, description, category, max_participants, created_by)
SELECT 'Tech Talk: Java & Microservices', '2025-11-20', '14:00:00', 'Seminar Hall B, Block 3',
       'Expert alumni from top tech companies will speak about Microservices architecture, Docker, Kubernetes, and modern Java development.',
       'TECH_TALK', 200, u.id
FROM users u WHERE u.email = 'admin@college.edu'
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO events (event_name, event_date, event_time, location, description, category, max_participants, created_by)
SELECT 'Career Guidance Workshop', '2025-11-10', '09:00:00', 'Conference Room 1',
       'Resume review, mock interviews, and career path guidance for final year students by alumni from companies like Google, TCS, and Infosys.',
       'CAREER', 100, u.id
FROM users u WHERE u.email = 'admin@college.edu'
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample Jobs (posted by alumni)
INSERT INTO jobs (job_title, company_name, location, job_type, experience_required, description, skills, posted_date, application_deadline, posted_by)
SELECT 'Java Backend Developer', 'Infosys', 'Bangalore / Remote',
       'Full-Time', 'Freshers welcome (0-1 years)',
       'Looking for passionate Java developers to join our growing team. You will work on enterprise-grade Spring Boot microservices. Strong problem-solving skills required. Training provided for freshers.',
       'Java, Spring Boot, MySQL, REST APIs, Git',
       CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY),
       u.id
FROM users u WHERE u.email = 'rahul@example.com'
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO jobs (job_title, company_name, location, job_type, experience_required, description, skills, posted_date, application_deadline, posted_by)
SELECT 'React Frontend Intern', 'TCS', 'Pune',
       'Internship', 'No experience required',
       'Summer internship opportunity at TCS. Work on real-world React projects alongside experienced engineers. Stipend: 15,000/month. Duration: 3 months.',
       'React, JavaScript, HTML, CSS, Git',
       CURDATE(), DATE_ADD(CURDATE(), INTERVAL 45 DAY),
       u.id
FROM users u WHERE u.email = 'priya@example.com'
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO jobs (job_title, company_name, location, job_type, experience_required, description, skills, posted_date, application_deadline, posted_by)
SELECT 'Full Stack Developer', 'Google', 'Bangalore',
       'Full-Time', '0-2 years',
       'Join Google as a Full Stack Developer. Work on large-scale web applications serving millions of users. Strong fundamentals in Java or Python and any frontend framework required.',
       'Java, Python, React, TypeScript, Cloud (GCP), Algorithms',
       CURDATE(), DATE_ADD(CURDATE(), INTERVAL 20 DAY),
       u.id
FROM users u WHERE u.email = 'sneha@example.com'
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample Announcements
INSERT INTO announcements (title, content, category, created_at, created_by)
SELECT 'Welcome to AlumniConnect!',
       'We are excited to launch AlumniConnect — our new Alumni Management & Networking Platform. You can now browse the alumni directory, register for events, apply for jobs posted by alumni, and stay updated with announcements. Update your profile to help students connect with you!',
       'GENERAL', NOW(), u.id
FROM users u WHERE u.email = 'admin@college.edu'
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO announcements (title, content, category, created_at, created_by)
SELECT 'Annual Alumni Meet 2025 – Registration Open',
       'Registration for the Annual Alumni Meet 2025 is now open! The event will be held on 15th December 2025 at the Main Auditorium. Register through the Events section. Limited seats available — register early!',
       'EVENT', NOW(), u.id
FROM users u WHERE u.email = 'admin@college.edu'
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO announcements (title, content, category, created_at, created_by)
SELECT 'Campus Recruitment Drive – December 2025',
       'Multiple companies including TCS, Infosys, Wipro, and Capgemini will be conducting campus recruitment drives in December 2025. Final year students should keep their resume ready and watch this space for updates.',
       'JOB', NOW(), u.id
FROM users u WHERE u.email = 'admin@college.edu'
ON DUPLICATE KEY UPDATE id=id;

-- Done!
SELECT 'AlumniConnect database setup complete!' AS status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_alumni_profiles FROM alumni_profiles;
SELECT COUNT(*) AS total_events FROM events;
SELECT COUNT(*) AS total_jobs FROM jobs;
SELECT COUNT(*) AS total_announcements FROM announcements;
