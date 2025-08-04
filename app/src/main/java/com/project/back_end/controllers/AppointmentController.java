package com.project.back_end.controllers;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.TokenService;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

// 1. Set Up the Controller Class:
//    - Annotate the class with `@RestController` to define it as a REST API controller.
//    - Use `@RequestMapping("/appointments")` to set a base path for all appointment-related endpoints.
//    - This centralizes all routes that deal with booking, updating, retrieving, and canceling appointments.


// 2. Autowire Dependencies:
//    - Inject `AppointmentService` for handling the business logic specific to appointments.
//    - Inject the general `Service` class, which provides shared functionality like token validation and appointment checks.


// 3. Define the `getAppointments` Method:
//    - Handles HTTP GET requests to fetch appointments based on date and patient name.
//    - Takes the appointment date, patient name, and token as path variables.
//    - First validates the token for role `"doctor"` using the `Service`.
//    - If the token is valid, returns appointments for the given patient on the specified date.
//    - If the token is invalid or expired, responds with the appropriate message and status code.


// 4. Define the `bookAppointment` Method:
//    - Handles HTTP POST requests to create a new appointment.
//    - Accepts a validated `Appointment` object in the request body and a token as a path variable.
//    - Validates the token for the `"patient"` role.
//    - Uses service logic to validate the appointment data (e.g., check for doctor availability and time conflicts).
//    - Returns success if booked, or appropriate error messages if the doctor ID is invalid or the slot is already taken.


// 5. Define the `updateAppointment` Method:
//    - Handles HTTP PUT requests to modify an existing appointment.
//    - Accepts a validated `Appointment` object and a token as input.
//    - Validates the token for `"patient"` role.
//    - Delegates the update logic to the `AppointmentService`.
//    - Returns an appropriate success or failure response based on the update result.


// 6. Define the `cancelAppointment` Method:
//    - Handles HTTP DELETE requests to cancel a specific appointment.
//    - Accepts the appointment ID and a token as path variables.
//    - Validates the token for `"patient"` role to ensure the user is authorized to cancel the appointment.
//    - Calls `AppointmentService` to handle the cancellation process and returns the result.
    private final AppointmentService appointmentService;
    private final TokenService tokenService;

    
    public AppointmentController(AppointmentService appointmentService, TokenService tokenService) {
        this.appointmentService = appointmentService;
        this.tokenService = tokenService;
    }

    // 3. Get Appointments (doctor-only)
    @GetMapping("/{date}/{patientName}/{token}")
    public ResponseEntity<?> getAppointments(
            @PathVariable String date,
            @PathVariable String patientName,
            @PathVariable String token) {

        if (!tokenService.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized access: Invalid doctor token"));
        }

        try {
            LocalDate localDate = LocalDate.parse(date);
            Map<String, Object> result = appointmentService.getAppointment(patientName, localDate, token);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid date format or fetch error"));
        }
    }

    // 4. Book Appointment (patient-only)
    @PostMapping("/{token}")
    public ResponseEntity<?> bookAppointment(
            @RequestBody Appointment appointment,
            @PathVariable String token) {

        if (!tokenService.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized access: Invalid patient token"));
        }

        // int validationResult = tokenService.validateAppointment(appointment);
        int validationResult = appointmentService.bookAppointment(appointment);
        // int validationResult = tokenService.validateAppointment(appointment);

        if (validationResult == -1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Doctor does not exist"));
        } else if (validationResult == 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Time slot not available or save failed"));
        }

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("message", "Appointment booked successfully"));
    }

    // 5. Update Appointment (patient-only)
// @PutMapping("/{token}")
// public ResponseEntity<?> updateAppointment(
//         @RequestBody Appointment appointment,
//         @PathVariable String token) {

//         if (!tokenService.validateToken(token, "patient")) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body(Map.of("error", "Unauthorized access: Invalid patient token"));
//         }

//         return appointmentService.updateAppointment(appointment);
//     }
        @PutMapping("/{token}")
        public ResponseEntity<?> updateAppointment(
                @RequestBody Appointment appointment,
                @PathVariable String token) {

            if (!tokenService.validateToken(token, "patient")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized access: Invalid patient token"));
            }

            try {
                System.out.println("Incoming update request: " + appointment);
                System.out.println("Appointment ID: " + appointment.getId());
                
                return appointmentService.updateAppointment(appointment);
            } catch (Exception e) {
                e.printStackTrace(); // or use a logger
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal error during update"));
            }
        }

    // 6. Cancel Appointment (patient-only)
    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable Long id,
            @PathVariable String token) {

        if (!tokenService.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized access: Invalid patient token"));
        }

        return appointmentService.cancelAppointment(id, token);
       
    }



}
