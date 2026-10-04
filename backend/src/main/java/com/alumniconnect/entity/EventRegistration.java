package com.alumniconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * EventRegistration Entity - Junction table for Event and User Many-to-Many relationship.
 *
 * This implements the "junction table" pattern for Many-to-Many.
 *
 * Interview explanation:
 *   "An alumni/student can register for many events, and an event can have many registrations.
 *    This is a Many-to-Many relationship. I implemented it using a separate EventRegistration
 *    table (junction table) with foreign keys to both events and users.
 *    I also added a UNIQUE constraint on (user_id, event_id) to prevent duplicate registrations."
 *
 * Database: event_registrations table
 * Columns: id, user_id (FK), event_id (FK), registration_date
 * Constraint: UNIQUE(user_id, event_id) - prevents duplicate registrations
 */
@Entity
@Table(
    name = "event_registrations",
    uniqueConstraints = {
        // This ensures one user cannot register for the same event twice
        @UniqueConstraint(columnNames = {"user_id", "event_id"})
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @ManyToOne: Many registrations belong to one User
     * FetchType.LAZY: Don't load User data unless explicitly accessed (performance)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * @ManyToOne: Many registrations belong to one Event
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // Date when the registration happened
    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;
}
