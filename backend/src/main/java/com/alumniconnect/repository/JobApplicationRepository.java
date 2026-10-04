package com.alumniconnect.repository;

import com.alumniconnect.entity.Job;
import com.alumniconnect.entity.JobApplication;
import com.alumniconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JobApplicationRepository - Data access for JobApplication (junction table).
 */
@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Find all applications for a specific job
    List<JobApplication> findByJob(Job job);

    // Find all jobs a user has applied to
    List<JobApplication> findByUser(User user);

    // Check if user already applied (prevent duplicates)
    boolean existsByUserAndJob(User user, Job job);

    // Find specific application
    Optional<JobApplication> findByUserAndJob(User user, Job job);

    // Count applications for a job
    long countByJob(Job job);
}
