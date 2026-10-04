package com.alumniconnect.repository;

import com.alumniconnect.entity.Job;
import com.alumniconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JobRepository - Data access layer for Job entity.
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // Find all jobs posted by a specific alumni
    List<Job> findByPostedBy(User postedBy);

    // Find jobs by job type (Full-Time, Internship, etc.)
    List<Job> findByJobType(String jobType);

    // Find jobs by location
    List<Job> findByLocationContainingIgnoreCase(String location);

    // Count total jobs (for admin dashboard)
    long count();

    /**
     * Search jobs across title, company, and skills
     */
    @Query("SELECT j FROM Job j WHERE " +
           "LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(j.companyName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(j.skills) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Job> searchJobs(@Param("searchTerm") String searchTerm);

    // Get all jobs ordered by posted date (most recent first)
    List<Job> findAllByOrderByPostedDateDesc();
}
