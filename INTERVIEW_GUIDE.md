# 📚 AlumniConnect – Interview Guide

> Simple, clear answers for common interview questions about this project.
> Every answer is based on the **actual code** in this project.

---

## 🎤 Part 1: About the Project

---

### "Tell me about your project."

> "I built **AlumniConnect**, a full-stack Alumni Management and Networking Platform.
> It connects alumni, students, and administrators of a college.
>
> **What it does:**
> - Alumni can maintain professional profiles, post jobs, and register for events
> - Students can browse the alumni directory, apply for jobs, and attend events
> - Admins can manage events, post announcements, and view platform statistics
>
> **Tech Stack:** Java 21 + Spring Boot + REST APIs + JPA/Hibernate + MySQL on the backend, and React + JavaScript + CSS on the frontend.
>
> I chose this stack because it's the industry-standard Java Full Stack combination used in most companies."

---

### "What problem does it solve?"

> "Most college alumni associations still use spreadsheets, WhatsApp groups, and email chains.
> AlumniConnect replaces that with a centralized platform where everything is searchable,
> filterable, and real-time. Students can directly connect with relevant alumni, apply
> for jobs they post, and register for events — all in one place."

---

### "Walk me through the architecture."

> "The architecture is a classic 3-tier web application:
>
> **Frontend (React)** → runs at port 5173, handles UI
> **Backend (Spring Boot)** → runs at port 8080, handles business logic + REST APIs
> **Database (MySQL)** → stores all data in 7 tables
>
> React calls the Spring Boot REST APIs using the Fetch API.
> Spring Boot processes the request through Controller → Service → Repository layers.
> The Repository uses JPA/Hibernate to run SQL queries on MySQL automatically."

---

## ☕ Part 2: Spring Boot Questions

---

### "What is Spring Boot?"

> "Spring Boot is a framework that makes it easy to build production-ready Java applications.
> It provides auto-configuration, an embedded web server (Tomcat), and opinionated defaults —
> so I don't have to manually configure every dependency.
>
> For example, just adding `spring-boot-starter-data-jpa` to `pom.xml` automatically
> configures Hibernate, JPA, and the database connection pool."

---

### "What is Dependency Injection?"

> "Dependency Injection means that instead of creating objects manually with `new`,
> Spring creates and manages them for us.
>
> In my code:
> ```java
> @Service
> public class AuthService {
>     @Autowired
>     private UserRepository userRepository; // Spring injects this automatically
> }
> ```
> I declared `UserRepository` with `@Autowired`. Spring sees this and automatically
> creates a `UserRepository` object and injects it. I never wrote `new UserRepository()`."

---

### "What is @RestController?"

> "@RestController is a combination of @Controller and @ResponseBody.
>
> - `@Controller` → marks the class as a Spring MVC controller (handles HTTP requests)
> - `@ResponseBody` → automatically converts the return value to JSON
>
> So when my `EventController.getAllEvents()` returns a `List<EventDTO>`,
> Spring automatically converts it to a JSON array and sends it as the HTTP response."

---

### "What is the difference between @Service and @Repository?"

> "Both are Spring stereotype annotations — they tell Spring to manage these classes as beans.
>
> - `@Repository` → used for data access layer (database operations). Spring also adds
>   automatic exception translation (converts database exceptions to Spring exceptions).
> - `@Service` → used for the business logic layer. Sits between Controller and Repository.
>
> In my project:
> - `UserRepository` has `@Repository` — it extends JpaRepository and talks to MySQL
> - `AuthService` has `@Service` — it checks if email exists, validates passwords, creates users"

---

### "Explain the complete request flow for login."

> "Here's what happens when a user logs in:
>
> 1. **React** sends `POST /api/auth/login` with JSON body `{email, password}`
> 2. **Vite proxy** forwards the request to Spring Boot on port 8080
> 3. **AuthController.login()** receives the request with `@RequestBody LoginRequest`
> 4. **AuthController** calls `AuthService.login(request)`
> 5. **AuthService**:
>    - Calls `userRepository.findByEmail(email)` — runs `SELECT * FROM users WHERE email=?`
>    - If not found, throws `IllegalArgumentException`
>    - Compares password
>    - Creates and returns a `LoginResponse` with userId, name, email, role
> 6. **AuthController** wraps it in `ResponseEntity.ok()` → sends `200 OK` JSON response
> 7. **React** receives the JSON, calls `login(userData)` in AuthContext
> 8. `login()` stores user in `localStorage` and React state
> 9. React Router navigates to the appropriate dashboard based on role"

---

## 🔌 Part 3: REST API Questions

---

### "What is REST?"

> "REST (Representational State Transfer) is an architectural style for building web APIs.
> It uses standard HTTP methods — GET, POST, PUT, DELETE — to perform operations.
>
> Key principles I followed:
> - Resources are identified by URLs (e.g., `/api/events/5`)
> - HTTP methods define the operation (GET=read, POST=create, PUT=update, DELETE=delete)
> - Responses are JSON
> - It's stateless — each request contains all needed information"

---

### "What HTTP status codes do you use?"

> "In my project:
> - `200 OK` → Successful GET, PUT
> - `201 Created` → Successful POST (register user, create event)
> - `400 Bad Request` → Validation errors, duplicate email
> - `404 Not Found` → Alumni/Event/Job with that ID doesn't exist
> - `500 Internal Server Error` → Unexpected server errors
>
> I return proper status codes using `ResponseEntity`:
> ```java
> return ResponseEntity.status(HttpStatus.CREATED).body(savedData);
> ```"

---

### "What happens when 'Register for Event' is clicked?"

> "1. React calls `POST /api/events/{id}/register` with `{userId: 3}` in the body
> 2. `EventController.registerForEvent()` reads `eventId` from `@PathVariable` and `userId` from `@RequestBody`
> 3. `EventService.registerForEvent()` runs:
>    - Finds event by ID
>    - Finds user by ID
>    - Checks if `EventRegistration` already exists for this user+event combo (prevents duplicates)
>    - Checks if max participants limit is reached
>    - Creates a new `EventRegistration` entity with today's date
>    - Saves it via `eventRegistrationRepository.save(registration)`
> 4. Returns success message, React updates the button to 'Registered ✓'"

---

## 💾 Part 4: JPA / Hibernate Questions

---

### "What is ORM? What is JPA? What is Hibernate?"

> "**ORM (Object-Relational Mapping):** A technique that automatically maps Java objects
> to database tables. Instead of writing SQL, you work with Java objects.
>
> **JPA (Java Persistence API):** A specification (a set of rules and interfaces) for ORM in Java.
> It defines annotations like `@Entity`, `@Id`, `@OneToMany`, etc.
>
> **Hibernate:** The most popular *implementation* of JPA. It's the actual library that
> generates and executes SQL based on your JPA annotations.
>
> Relationship: **JPA is the interface, Hibernate is the implementation.**
>
> I use JPA annotations in my Entity classes. Spring Boot configures Hibernate
> automatically to implement those annotations."

---

### "What is @Entity?"

> "`@Entity` marks a Java class as a JPA entity — meaning it maps to a database table.
>
> In my project, `Event.java` has `@Entity` and `@Table(name = 'events')`.
> Hibernate reads this and creates/maps to the `events` table in MySQL.
>
> The fields in the class become columns in the table.
> `@Column(nullable = false)` means the column has a NOT NULL constraint."

---

### "What is JpaRepository?"

> "`JpaRepository<T, ID>` is a Spring Data JPA interface that provides ready-made CRUD methods.
> By extending it, I get these for free without writing any code:
>
> ```java
> public interface EventRepository extends JpaRepository<Event, Long> {
>     // These methods are auto-provided by Spring:
>     // save(event)       → INSERT or UPDATE
>     // findById(id)      → SELECT by primary key
>     // findAll()         → SELECT all
>     // deleteById(id)    → DELETE
>     // count()           → COUNT(*)
> }
> ```
>
> I also define custom methods:
> ```java
> List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDate date);
> ```
> Spring Data JPA reads the method name and auto-generates the SQL query:
> `SELECT * FROM events WHERE event_date > ? ORDER BY event_date ASC`"

---

### "Explain your database relationships."

> "I have three types of relationships:
>
> **1. One-to-One (User ↔ AlumniProfile)**
> One user has exactly one alumni profile. I used `@OneToOne` with a `user_id` foreign key
> in the `alumni_profiles` table.
>
> **2. Many-to-One (Job → User)**
> Many jobs can be posted by one alumni user. I used `@ManyToOne` in `Job.java`:
> ```java
> @ManyToOne
> @JoinColumn(name = 'posted_by')
> private User postedBy;
> ```
> This creates a `posted_by` column in the `jobs` table as a foreign key.
>
> **3. Many-to-Many (User ↔ Event via EventRegistration)**
> Users can register for many events. Events can have many users registered.
> I implemented this with a junction table `event_registrations` instead of `@ManyToMany`
> because I can add extra data (like `registration_date`) to the junction table."

---

### "What is the difference between JDBC and JPA?"

> "**JDBC (Java Database Connectivity):** Low-level approach. You write raw SQL queries
> and manually map ResultSet rows to Java objects.
>
> ```java
> // JDBC approach (manual and tedious):
> PreparedStatement ps = conn.prepareStatement('SELECT * FROM users WHERE email=?');
> ps.setString(1, email);
> ResultSet rs = ps.executeQuery();
> // manually map rs to User object...
> ```
>
> **JPA (Hibernate):** High-level ORM approach. No SQL needed for CRUD.
> ```java
> // JPA approach (simple):
> Optional<User> user = userRepository.findByEmail(email);
> ```
>
> Spring Data JPA generates the SQL automatically. For complex queries, I use `@Query` with JPQL."

---

## ⚛️ Part 5: React Questions

---

### "What is React?"

> "React is a JavaScript library for building user interfaces using reusable components.
> Instead of manipulating the DOM directly, React uses a 'virtual DOM' to efficiently update
> only the parts of the UI that changed.
>
> In AlumniConnect, every page is a React component — `LandingPage`, `AlumniDashboard`,
> `EventsList` are all functional components that return JSX."

---

### "What is useState?"

> "`useState` is a React hook that adds state to functional components.
> When state changes, React re-renders the component automatically.
>
> In my `LoginPage.jsx`:
> ```javascript
> const [form, setForm] = useState({ email: '', password: '' });
> // form = current state value
> // setForm = function to update state
> ```
> When user types in the email input, `setForm` updates the state,
> and React re-renders the form with the new value."

---

### "What is useEffect?"

> "`useEffect` runs code after a component renders. It's used for:
> - Fetching data from APIs
> - Setting up event listeners
>
> In my `AlumniDirectory.jsx`:
> ```javascript
> useEffect(() => {
>     alumniAPI.getAll().then(data => setAlumni(data));
> }, []); // [] means this runs only once, when component first mounts
> ```
> The `[]` dependency array means the effect runs only once (on mount).
> If I put `[searchTerm]`, it would re-run every time `searchTerm` changes."

---

### "How does React call the Spring Boot backend?"

> "I use the **Fetch API** in a centralized `api.js` file.
>
> ```javascript
> // In api.js:
> export const eventAPI = {
>   getAll: async () => {
>     const response = await fetch('/api/events');
>     return response.json();
>   }
> };
>
> // In EventsList.jsx:
> const events = await eventAPI.getAll(userId);
> setEvents(events);
> ```
>
> In development, **Vite proxies** `/api` calls to `http://localhost:8080`,
> so I don't have CORS issues during development."

---

### "What is React Context? Why did you use it?"

> "React Context is a way to share data across components without passing props
> through every level of the component tree.
>
> I used it for **authentication state** — the logged-in user's data (id, name, role)
> needs to be accessible in the Navbar, Dashboard, Sidebar, and every page.
>
> Without Context, I'd have to pass user as props from App → Layout → Navbar → every component.
> With Context, any component can just call `useAuth()` and get the user directly.
>
> I also persist the user in `localStorage` so the user stays logged in after page refresh."

---

## 🗄️ Part 6: SQL Questions

---

### "Write a SQL query to get all alumni who graduated in 2022."
```sql
SELECT u.first_name, u.last_name, u.email, ap.company_name, ap.job_role
FROM users u
JOIN alumni_profiles ap ON u.id = ap.user_id
WHERE ap.graduation_year = 2022
  AND u.role = 'ALUMNI';
```

---

### "Write a SQL query to count registrations per event."
```sql
SELECT e.event_name, COUNT(er.id) AS registration_count
FROM events e
LEFT JOIN event_registrations er ON e.id = er.event_id
GROUP BY e.id, e.event_name
ORDER BY registration_count DESC;
```

---

### "What is a foreign key? Give an example from your project."
> "A foreign key is a column in one table that references the primary key of another table.
> It enforces referential integrity.
>
> In my `jobs` table, `posted_by` is a foreign key referencing `users.id`.
> This means you cannot insert a job with a `posted_by` value that doesn't exist in `users.id`.
>
> JPA creates this with:
> ```java
> @ManyToOne
> @JoinColumn(name = 'posted_by')
> private User postedBy;
> ```"

---

### "What is a primary key?"
> "A primary key uniquely identifies each row in a table.
> In all my entities, I use `id` as the primary key:
> ```java
> @Id
> @GeneratedValue(strategy = GenerationType.IDENTITY)
> private Long id;
> ```
> `IDENTITY` strategy means MySQL auto-increments the id (1, 2, 3...)"

---

## 🔒 Part 7: Authentication Questions

---

### "How does authentication work in your project?"

> "I implemented simple session-like authentication without JWT:
>
> 1. User sends email and password to `POST /api/auth/login`
> 2. Backend verifies credentials by querying the database
> 3. If valid, backend returns `{userId, firstName, lastName, email, role}` as JSON
> 4. React stores this in `localStorage` using `AuthContext.login(userData)`
> 5. On every request that needs the user's ID, React sends it as a request parameter or in the body
> 6. To logout, React calls `AuthContext.logout()` which clears localStorage
>
> **For production**, I would add JWT tokens, which would be sent in the `Authorization` header
> with every request. But for this project, this approach is simple and explainable."

---

### "What is the difference between Authentication and Authorization?"

> "**Authentication:** Verifying who you are (Login — email + password)
>
> **Authorization:** Verifying what you're allowed to do (Role-based access)
>
> In AlumniConnect:
> - Authentication: The login endpoint checks email and password
> - Authorization: Only ADMIN can create events. Only ALUMNI can post jobs.
>   In React, `ProtectedRoute` checks the user's role and redirects if unauthorized.
>   On the backend, the services check roles before performing sensitive operations."

---

## 📋 Quick Reference Card

| Concept | Class in Project |
|---|---|
| `@Entity` | `User.java`, `Event.java`, `Job.java`, etc. |
| `@RestController` | `AuthController`, `EventController`, etc. |
| `@Service` | `AuthService`, `EventService`, etc. |
| `@Repository` | `UserRepository`, `EventRepository`, etc. |
| `JpaRepository` | All repository interfaces |
| `@OneToOne` | `AlumniProfile.java` → `User` |
| `@ManyToOne` | `Job.java` → `User`, `Event.java` → `User` |
| Junction Table | `EventRegistration.java`, `JobApplication.java` |
| `@RequestBody` | Used in all POST/PUT controllers |
| `@PathVariable` | Used in `/{id}` endpoints |
| `@RequestParam` | Used for query parameters like `?q=java` |
| `useState` | Form state, data lists, loading states |
| `useEffect` | Fetching data on component mount |
| `React Context` | `AuthContext.jsx` — global user state |
| `React Router` | Route definitions in `App.jsx` |
| CORS Config | `WebConfig.java` |
