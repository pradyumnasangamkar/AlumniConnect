package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * LoginResponse DTO - What we send back to the client after successful login.
 *
 * Instead of sending the full User entity (which contains the password hash),
 * we send only the safe data the frontend needs.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String message;
    private boolean success;
}
