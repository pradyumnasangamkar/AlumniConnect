package com.alumniconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User Entity - Represents all users in the AlumniConnect system.
 *
 * A single 'users' table handles ADMIN, ALUMNI, and STUDENT roles.
 * This is simpler and cleaner than having separate tables per role.
 *
 * @Entity  - Marks this class as a JPA entity (maps to a database table)
 * @Table   - Specifies the database table name
 * @Id     - Marks the primary key field
 * @GeneratedValue - Auto-increments the ID (strategy = IDENTITY uses MySQL AUTO_INCREMENT)
 * @Column  - Configures column-level properties (nullable, unique, length)
 *
 * @Data           (Lombok) - Generates getters, setters, equals, hashCode, toString
 * @NoArgsConstructor (Lombok) - Generates a no-argument constructor
 * @AllArgsConstructor (Lombok) - Generates a constructor with all fields
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    // Primary Key - Auto-incremented by MySQL
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User's first name - cannot be null
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    // User's last name - cannot be null
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    // Email is unique - no two users can have the same email
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    // Password stored as plain text for simplicity (in real world, use BCrypt)
    @Column(nullable = false)
    private String password;

    /**
     * Role determines what the user can do:
     * - ADMIN   : Can manage events, announcements, view all data
     * - ALUMNI  : Can edit profile, post jobs, register for events
     * - STUDENT : Can browse directory, apply to jobs, register for events
     */
    @Column(nullable = false, length = 20)
    private String role; // ADMIN / ALUMNI / STUDENT

    // Additional fields
    @Column(length = 10)
    private String gender;

    // Year of graduation (relevant for alumni and students)
    @Column(name = "graduation_year")
    private Integer graduationYear;

    // Department/field of study
    @Column(name = "department", length = 100)
    private String department;
}
