package com.alumniconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * RegisterRequest DTO - Data Transfer Object for registration.
 *
 * DTO (Data Transfer Object) is used to receive data from the client.
 * It's separate from the Entity to control what data comes in/out.
 *
 * @NotBlank, @Email, @Size are validation annotations.
 * They validate incoming request data before it reaches the service.
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Role is required")
    private String role; // ADMIN / ALUMNI / STUDENT

    private String gender;

    private Integer graduationYear;

    private String department;
}
