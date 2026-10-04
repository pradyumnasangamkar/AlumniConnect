package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * EventDTO - Used to create/update events and return event data to the client.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {

    private Long id;
    private String eventName;
    private LocalDate eventDate;
    private String eventTime; // String for easy JSON handling
    private String location;
    private String description;
    private String category;
    private Integer maxParticipants;
    private Long createdBy; // userId of admin who created it
    private String createdByName; // admin's name (for display)
    private Long registrationCount; // how many registered
    private Boolean registered; // has the current user registered?
}
