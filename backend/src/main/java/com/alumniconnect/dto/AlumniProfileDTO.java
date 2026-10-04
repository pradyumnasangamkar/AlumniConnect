package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AlumniProfileDTO - Used for both creating and returning alumni profile data.
 *
 * This DTO is sent from React frontend → Spring Boot when updating a profile,
 * and also returned from Spring Boot → React when fetching a profile.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlumniProfileDTO {

    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private Integer graduationYear;
    private String companyName;
    private String jobRole;
    private String location;
    private String phone;
    private String bio;
    private String skills;
    private String linkedinUrl;
    private String profilePhotoUrl;
}
