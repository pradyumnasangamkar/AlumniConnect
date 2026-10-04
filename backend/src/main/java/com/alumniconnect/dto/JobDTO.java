package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * JobDTO - Used to create/update jobs and return job data to the client.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobDTO {

    private Long id;
    private String jobTitle;
    private String companyName;
    private String location;
    private String jobType;
    private String experienceRequired;
    private String description;
    private String skills;
    private LocalDate postedDate;
    private LocalDate applicationDeadline;
    private Long postedBy;        // userId of alumni who posted
    private String postedByName;  // alumni's name
    private Long applicationCount; // how many applied
    private Boolean hasApplied;   // has the current user applied?
}
