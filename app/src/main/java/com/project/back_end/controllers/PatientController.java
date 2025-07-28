package com.project.back_end.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Patient;
import com.project.back_end.services.CentralService;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.TokenService;

// @RestController
// @RequestMapping("/patient")
// @RestController
// @RequestMapping("${api.path}/patient")
@RestController
@RequestMapping("${api.path}patient")
public class PatientController {

    private final TokenService tokenService;

// 1. Set Up the Controller Class:
//    - Annotate the class with `@RestController` to define it as a REST API controller for patient-related operations.
//    - Use `@RequestMapping("/patient")` to prefix all endpoints with `/patient`, grouping all patient functionalities under a common route.


// 2. Autowire Dependencies:
//    - Inject `PatientService` to handle patient-specific logic such as creation, retrieval, and appointments.
//    - Inject the shared `Service` class for tasks like token validation and login authentication.


// 3. Define the `getPatient` Method:
//    - Handles HTTP GET requests to retrieve patient details using a token.
//    - Validates the token for the `"patient"` role using the shared service.
//    - If the token is valid, returns patient information; otherwise, returns an appropriate error message.


// 4. Define the `createPatient` Method:
//    - Handles HTTP POST requests for patient registration.
//    - Accepts a validated `Patient` object in the request body.
//    - First checks if the patient already exists using the shared service.
//    - If validation passes, attempts to create the patient and returns success or error messages based on the outcome.


// 5. Define the `login` Method:
//    - Handles HTTP POST requests for patient login.
//    - Accepts a `Login` DTO containing email/username and password.
//    - Delegates authentication to the `validatePatientLogin` method in the shared service.
//    - Returns a response with a token or an error message depending on login success.


// 6. Define the `getPatientAppointment` Method:
//    - Handles HTTP GET requests to fetch appointment details for a specific patient.
//    - Requires the patient ID, token, and user role as path variables.
//    - Validates the token using the shared service.
//    - If valid, retrieves the patient's appointment data from `PatientService`; otherwise, returns a validation error.


// 7. Define the `filterPatientAppointment` Method:
//    - Handles HTTP GET requests to filter a patient's appointments based on specific conditions.
//    - Accepts filtering parameters: `condition`, `name`, and a token.
//    - Token must be valid for a `"patient"` role.
//    - If valid, delegates filtering logic to the shared service and returns the filtered result.

    @Autowired
    private PatientService patientService;

    @Autowired
    private CentralService centralService;


    PatientController(TokenService tokenService) {
        this.tokenService = tokenService;
    }


    // 1. Get Patient Details
    @GetMapping("/{token}")
    public ResponseEntity<?> getPatientDetails(@PathVariable String token) {
        return patientService.getPatientDetails(token);
    }


    // 2. Create a New Patient
    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        try {
            boolean valid = centralService.validatePatient(patient);
            if (!valid) {
                return ResponseEntity.status(409)
                        .body(java.util.Map.of("error", "Patient with email id or phone no already exist"));
            }

                int created = patientService.createPatient(patient);
                if (created == 1) {
                    return ResponseEntity.status(201)
                            .body(Map.of("message", "Signup successful"));
                } else {
                    return ResponseEntity.status(500)
                            .body(Map.of("error", "Internal server error"));
                }
            } catch (Exception e) {
                return ResponseEntity.status(500)
                        .body(Map.of("error", "Internal server error"));
            }
    }



    // 3. Patient Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        return centralService.validatePatientLogin(login);
    }

    // 4. Get Patient Appointments
    @GetMapping("/{id}/{token}")
    public ResponseEntity<?> getPatientAppointments(
            @PathVariable Long id,
            @PathVariable String token) {

        ResponseEntity<java.util.Map<String, String>> validation = centralService.validateToken(token, "patient");

        if (!validation.getStatusCode().is2xxSuccessful()) {
            return validation;
        }

        return patientService.getPatientAppointment(id, token);
    }

    // 5. Filter Patient Appointments
    @GetMapping("/filter/{condition}/{name}/{token}")
    public ResponseEntity<?> filterAppointments(
            @PathVariable String condition,
            @PathVariable String name,
            @PathVariable String token) {

        if (!tokenService.validateToken(token, "patient")) {
            Map<String, String> result = new HashMap<>();
            result.put("error", "Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
            
        return centralService.filterPatient(condition, name, token);
    }








}


