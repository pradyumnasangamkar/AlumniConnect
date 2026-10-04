package com.alumniconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Announcement Entity - Announcements created by Admin.
 *
 * Admins create announcements that are visible to all users.
 * Examples:
 * - "Registration open for Annual Alumni Meet 2025"
 * - "Scholarship applications are now being accepted"
 * - "New alumni batch of 2024 - Welcome!"
 */
@Entity
@Table(name = "announcements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Title of the announcement
    @Column(nullable = false, length = 255)
    private String title;

    // Full announcement content
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // Category: GENERAL, EVENT, JOB, SCHOLARSHIP, IMPORTANT
    @Column(length = 50)
    private String category;

    // When the announcement was created
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Admin who created this announcement
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Auto-set the creation time before saving
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
