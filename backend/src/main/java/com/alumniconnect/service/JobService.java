package com.alumniconnect.service;

import com.alumniconnect.dto.JobDTO;
import com.alumniconnect.entity.Job;
import com.alumniconnect.entity.JobApplication;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.repository.JobApplicationRepository;
import com.alumniconnect.repository.JobRepository;
import com.alumniconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JobService - Business logic for Job postings and applications.
 *
 * Handles:
 * - Alumni posting jobs
 * - Listing all jobs
 * - Searching and filtering jobs
 * - Users applying for jobs
 * - Alumni managing their job postings
 */
@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all jobs (sorted by most recent).
     */
    public List<JobDTO> getAllJobs(Long currentUserId) {
        List<Job> jobs = jobRepository.findAllByOrderByPostedDateDesc();
        return jobs.stream()
                .map(job -> convertToDTO(job, currentUserId))
                .collect(Collectors.toList());
    }

    /**
     * Get a single job by ID.
     */
    public JobDTO getJobById(Long id, Long currentUserId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        return convertToDTO(job, currentUserId);
    }

    /**
     * Get all jobs posted by a specific alumni.
     */
    public List<JobDTO> getJobsByAlumni(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        List<Job> jobs = jobRepository.findByPostedBy(user);
        return jobs.stream()
                .map(job -> convertToDTO(job, userId))
                .collect(Collectors.toList());
    }

    /**
     * Post a new job (Alumni only).
     */
    public JobDTO createJob(JobDTO dto, Long alumniUserId) {
        User alumni = userRepository.findById(alumniUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", alumniUserId));

        if (!alumni.getRole().equals("ALUMNI")) {
            throw new IllegalArgumentException("Only alumni can post jobs");
        }

        Job job = new Job();
        job.setJobTitle(dto.getJobTitle());
        job.setCompanyName(dto.getCompanyName());
        job.setLocation(dto.getLocation());
        job.setJobType(dto.getJobType());
        job.setExperienceRequired(dto.getExperienceRequired());
        job.setDescription(dto.getDescription());
        job.setSkills(dto.getSkills());
        job.setPostedDate(LocalDate.now());
        job.setApplicationDeadline(dto.getApplicationDeadline());
        job.setPostedBy(alumni);

        Job saved = jobRepository.save(job);
        return convertToDTO(saved, alumniUserId);
    }

    /**
     * Update a job posting (only the alumni who posted it can update).
     */
    public JobDTO updateJob(Long id, JobDTO dto, Long userId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        // Verify ownership
        if (!job.getPostedBy().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only edit your own job postings");
        }

        job.setJobTitle(dto.getJobTitle());
        job.setCompanyName(dto.getCompanyName());
        job.setLocation(dto.getLocation());
        job.setJobType(dto.getJobType());
        job.setExperienceRequired(dto.getExperienceRequired());
        job.setDescription(dto.getDescription());
        job.setSkills(dto.getSkills());
        job.setApplicationDeadline(dto.getApplicationDeadline());

        Job updated = jobRepository.save(job);
        return convertToDTO(updated, userId);
    }

    /**
     * Delete a job posting.
     */
    public void deleteJob(Long id, Long userId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Admin can delete any job; Alumni can only delete their own
        if (!user.getRole().equals("ADMIN") && !job.getPostedBy().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own job postings");
        }

        jobRepository.delete(job);
    }

    /**
     * Apply for a job.
     */
    public String applyForJob(Long jobId, Long userId, String coverNote) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Prevent applying to own job (alumni can't apply to their own postings)
        if (job.getPostedBy().getId().equals(userId)) {
            throw new IllegalArgumentException("You cannot apply to your own job posting!");
        }

        // Check if already applied
        if (applicationRepository.existsByUserAndJob(user, job)) {
            throw new IllegalArgumentException("You have already applied for this job!");
        }

        JobApplication application = new JobApplication();
        application.setUser(user);
        application.setJob(job);
        application.setAppliedDate(LocalDate.now());
        application.setCoverNote(coverNote);
        application.setStatus("PENDING");

        applicationRepository.save(application);
        return "Application submitted successfully for " + job.getJobTitle();
    }

    /**
     * Search jobs.
     */
    public List<JobDTO> searchJobs(String searchTerm, Long currentUserId) {
        List<Job> jobs = jobRepository.searchJobs(searchTerm);
        return jobs.stream()
                .map(job -> convertToDTO(job, currentUserId))
                .collect(Collectors.toList());
    }

    /**
     * Get jobs a user has applied to.
     */
    public List<JobDTO> getUserApplications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        List<JobApplication> applications = applicationRepository.findByUser(user);
        return applications.stream()
                .map(app -> convertToDTO(app.getJob(), userId))
                .collect(Collectors.toList());
    }

    /**
     * Convert Job entity to JobDTO.
     */
    private JobDTO convertToDTO(Job job, Long currentUserId) {
        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setJobTitle(job.getJobTitle());
        dto.setCompanyName(job.getCompanyName());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setExperienceRequired(job.getExperienceRequired());
        dto.setDescription(job.getDescription());
        dto.setSkills(job.getSkills());
        dto.setPostedDate(job.getPostedDate());
        dto.setApplicationDeadline(job.getApplicationDeadline());
        dto.setApplicationCount(applicationRepository.countByJob(job));

        if (job.getPostedBy() != null) {
            dto.setPostedBy(job.getPostedBy().getId());
            dto.setPostedByName(job.getPostedBy().getFirstName()
                    + " " + job.getPostedBy().getLastName());
        }

        // Check if current user has applied
        if (currentUserId != null) {
            userRepository.findById(currentUserId).ifPresent(user -> {
                dto.setHasApplied(applicationRepository.existsByUserAndJob(user, job));
            });
        }

        return dto;
    }
}
