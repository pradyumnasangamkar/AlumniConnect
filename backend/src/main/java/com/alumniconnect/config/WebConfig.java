package com.alumniconnect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebConfig - CORS (Cross-Origin Resource Sharing) Configuration.
 *
 * CORS is needed because:
 * - React frontend runs on: http://localhost:5173
 * - Spring Boot backend runs on: http://localhost:8080
 *
 * Without CORS configuration, the browser will block API calls from the React app.
 *
 * This configuration allows the React frontend to call the Spring Boot REST APIs.
 *
 * Interview explanation:
 *   "CORS is a security policy in browsers that blocks requests from a different
 *    origin (domain/port). Since my React app (port 5173) calls the Spring Boot API
 *    (port 8080), I configured CORS to allow these cross-origin requests."
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")           // Apply to all /api routes
                .allowedOriginPatterns("*")              // Allow local and hosted frontend domains
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);                   // Cache preflight for 1 hour
    }
}
