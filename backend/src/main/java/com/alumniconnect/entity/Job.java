package com.alumniconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Job Entity - Job postings created by Alumni.
 *
 * Alumni can post job opportunities at their companies.
 * Students and other alumni can then apply for these jobs.
 *
 * @ManyToOne relationship with User (the alumni who posted the job):
 *   Many jobs can be posted by one alumni user.
 *
 * Interview explanation:
 *   "One alumni can post many jobs - this is a One-to-Many relationship
 *    from User to Job. I used @ManyToOne on the Job side with a foreign
 *    key 'posted_by' referencing the users table."
 */
@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Job title (e.g., "Software Engineer", "Java Developer")
    @Column(name = "job_title", nullable = false, length = 150)
    private String jobTitle;

    // Company offering the job
    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    // Job location (city or "Remote")
    @Column(length = 100)
    private String location;

    // Job type: Full-Time, Part-Time, Internship, Contract
    @Column(name = "job_type", length = 50)
    private String jobType;

    // Experience required (e.g., "0-2 years", "Freshers welcome")
    @Column(name = "experience_required", length = 50)
    private String experienceRequired;

    // Detailed job description
    @Column(columnDefinition = "TEXT")
    private String description;

    // Required skills (comma-separated, e.g., "Java, Spring Boot, MySQL")
    @Column(columnDefinition = "TEXT")
    private String skills;

    // Date when job was posted
    @Column(name = "posted_date", nullable = false)
    private LocalDate postedDate;

    // Application deadline
    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    /**
     * @ManyToOne: Many jobs belong to one User (the alumni who posted it)
     * This creates a 'posted_by' column in the jobs table (foreign key to users.id)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by", nullable = false)
    private User postedBy;
}
