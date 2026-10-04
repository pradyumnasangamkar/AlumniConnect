package com.alumniconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AlumniProfile Entity - Extended profile information for alumni users.
 *
 * This is separate from the User entity to keep the users table clean.
 * Every ALUMNI user gets one AlumniProfile record.
 *
 * @OneToOne relationship: One User has exactly one AlumniProfile.
 * @JoinColumn: The alumni_profiles table has a 'user_id' column (foreign key)
 *              that references the users.id column.
 *
 * Interview explanation:
 *   "I used @OneToOne because each alumni has exactly one profile.
 *    The foreign key user_id in alumni_profiles points back to the users table."
 */
@Entity
@Table(name = "alumni_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumniProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @OneToOne: One User maps to one AlumniProfile (and vice versa)
     * @JoinColumn: Creates a 'user_id' column in alumni_profiles table
     *              This is the FOREIGN KEY referencing users.id
     */
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Professional details
    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(name = "job_role", length = 100)
    private String jobRole;

    @Column(length = 100)
    private String location;

    @Column(length = 15)
    private String phone;

    // Short bio - TEXT type allows longer content than VARCHAR
    @Column(columnDefinition = "TEXT")
    private String bio;

    // Comma-separated skills (e.g., "Java, Spring Boot, MySQL")
    @Column(columnDefinition = "TEXT")
    private String skills;

    // LinkedIn profile URL
    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    // Profile photo URL (can link to Cloudinary or just store a URL)
    @Column(name = "profile_photo_url", length = 500)
    private String profilePhotoUrl;

    // Graduation year for filtering
    @Column(name = "graduation_year")
    private Integer graduationYear;

    // Department for filtering
    @Column(length = 100)
    private String department;
}
