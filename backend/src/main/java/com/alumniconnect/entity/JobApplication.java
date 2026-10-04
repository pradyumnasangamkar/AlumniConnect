package com.alumniconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * JobApplication Entity - Junction table for Job and User Many-to-Many relationship.
 *
 * When a student/alumni applies for a job, a JobApplication record is created.
 *
 * Similar to EventRegistration, this implements the Many-to-Many pattern:
 * - One user can apply to many jobs
 * - One job can have many applications
 *
 * UNIQUE constraint prevents duplicate applications for the same job.
 */
@Entity
@Table(
    name = "job_applications",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "job_id"})
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who applied (can be STUDENT or ALUMNI)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The job being applied for
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    // Date of application
    @Column(name = "applied_date", nullable = false)
    private LocalDate appliedDate;

    // Optional cover note / message from applicant
    @Column(name = "cover_note", columnDefinition = "TEXT")
    private String coverNote;

    // Application status: PENDING, REVIEWED, SHORTLISTED, REJECTED
    @Column(length = 20)
    private String status = "PENDING";
}
