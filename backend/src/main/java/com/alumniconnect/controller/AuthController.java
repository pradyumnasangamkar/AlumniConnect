package com.alumniconnect.controller;

import com.alumniconnect.dto.LoginRequest;
import com.alumniconnect.dto.LoginResponse;
import com.alumniconnect.dto.RegisterRequest;
import com.alumniconnect.entity.User;
import com.alumniconnect.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AuthController - Handles HTTP requests for authentication.
 *
 * @RestController: Combines @Controller and @ResponseBody
 *   - @Controller: Registers this class as a Spring MVC controller
 *   - @ResponseBody: Automatically converts return values to JSON
 *
 * @RequestMapping("/api/auth"): All routes in this controller start with /api/auth
 *
 * Interview explanation:
 *   "When the React frontend sends a POST request to /api/auth/login,
 *    Spring MVC routes it to the postLogin() method in this controller.
 *    The controller calls the AuthService which contains the business logic.
 *    The service returns data, and the controller wraps it in a ResponseEntity
 *    and sends it back as JSON."
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Registers a new user (ADMIN / ALUMNI / STUDENT).
     *
     * @RequestBody: Spring reads the JSON request body and converts it to RegisterRequest object
     * @Valid: Triggers Bean Validation on the RegisterRequest fields
     * ResponseEntity<?>: Allows us to set both the response body and HTTP status code
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)  // 201 Created
                .body(Map.of(
                        "success", true,
                        "message", "Registration successful!",
                        "userId", user.getId(),
                        "role", user.getRole()
                ));
    }

    /**
     * POST /api/auth/login
     * Logs in a user and returns user data for frontend storage.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);  // 200 OK
    }
}
