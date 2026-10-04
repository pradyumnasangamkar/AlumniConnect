package com.alumniconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Event Entity - Represents events created by Admin.
 *
 * Events can be:
 * - Annual Alumni Meets
 * - Career Guidance Workshops
 * - Hackathons
 * - Tech Talks
 * etc.
 *
 * Alumni and Students can register for events.
 * The many-to-many relationship is handled via EventRegistration.
 */
@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Event title (e.g., "Annual Alumni Meet 2025")
    @Column(name = "event_name", nullable = false, length = 200)
    private String eventName;

    // Date of the event
    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    // Time of the event
    @Column(name = "event_time")
    private LocalTime eventTime;

    // Location (physical or online)
    @Column(nullable = false, length = 200)
    private String location;

    // Detailed description of the event
    @Column(columnDefinition = "TEXT")
    private String description;

    // Category: ALUMNI_MEET, TECH_TALK, CAREER, HACKATHON, CULTURAL, OTHER
    @Column(length = 50)
    private String category;

    // Maximum participants (optional limit)
    @Column(name = "max_participants")
    private Integer maxParticipants;

    // Who created this event (Admin user)
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
}
