package com.alumniconnect.repository;

import com.alumniconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * UserRepository - Data access layer for the User entity.
 *
 * @Repository marks this as a Spring Data repository.
 *
 * JpaRepository<User, Long> provides ready-made CRUD methods:
 *   - save(user)          → INSERT or UPDATE
 *   - findById(id)        → SELECT by primary key
 *   - findAll()           → SELECT all rows
 *   - deleteById(id)      → DELETE by primary key
 *   - count()             → COUNT rows
 *
 * We can also define custom query methods by following Spring Data naming conventions.
 * Spring Data JPA automatically generates the SQL query from the method name.
 *
 * Interview explanation:
 *   "I didn't write any SQL. Spring Data JPA generates the queries automatically.
 *    For example, findByEmail(email) generates: SELECT * FROM users WHERE email = ?
 *    This is the power of Spring Data JPA."
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data generates: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Check if email already exists (for registration validation)
    boolean existsByEmail(String email);

    // Find all users by role (e.g., find all ALUMNI users)
    // Spring Data generates: SELECT * FROM users WHERE role = ?
    List<User> findByRole(String role);

    // Count users by role (for admin dashboard stats)
    long countByRole(String role);
}
