package com.project.back_end.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.project.back_end.DTO.DoctorDTO;
import com.project.back_end.DTO.Login;
import com.project.back_end.models.Doctor;
import com.project.back_end.services.CentralService;
import com.project.back_end.services.DoctorService;
import com.project.back_end.services.TokenService;


// @RequestMapping("/api/doctor")
// @RequestMapping("${api.path}doctor")
@RestController
@RequestMapping("${api.path}doctor")
public class DoctorController {

// 1. Set Up the Controller Class:
//    - Annotate the class with `@RestController` to define it as a REST controller that serves JSON responses.
//    - Use `@RequestMapping("${api.path}doctor")` to prefix all endpoints with a configurable API path followed by "doctor".
//    - This class manages doctor-related functionalities such as registration, login, updates, and availability.


// 2. Autowire Dependencies:
//    - Inject `DoctorService` for handling the core logic related to doctors (e.g., CRUD operations, authentication).
//    - Inject the shared `Service` class for general-purpose features like token validation and filtering.


// 3. Define the `getDoctorAvailability` Method:
//    - Handles HTTP GET requests to check a specific doctor’s availability on a given date.
//    - Requires `user` type, `doctorId`, `date`, and `token` as path variables.
//    - First validates the token against the user type.
//    - If the token is invalid, returns an error response; otherwise, returns the availability status for the doctor.


// 4. Define the `getDoctor` Method:
//    - Handles HTTP GET requests to retrieve a list of all doctors.
//    - Returns the list within a response map under the key `"doctors"` with HTTP 200 OK status.


// 5. Define the `saveDoctor` Method:
//    - Handles HTTP POST requests to register a new doctor.
//    - Accepts a validated `Doctor` object in the request body and a token for authorization.
//    - Validates the token for the `"admin"` role before proceeding.
//    - If the doctor already exists, returns a conflict response; otherwise, adds the doctor and returns a success message.


// 6. Define the `doctorLogin` Method:
//    - Handles HTTP POST requests for doctor login.
//    - Accepts a validated `Login` DTO containing credentials.
//    - Delegates authentication to the `DoctorService` and returns login status and token information.


// 7. Define the `updateDoctor` Method:
//    - Handles HTTP PUT requests to update an existing doctor's information.
//    - Accepts a validated `Doctor` object and a token for authorization.
//    - Token must belong to an `"admin"`.
//    - If the doctor exists, updates the record and returns success; otherwise, returns not found or error messages.


// 8. Define the `deleteDoctor` Method:
//    - Handles HTTP DELETE requests to remove a doctor by ID.
//    - Requires both doctor ID and an admin token as path variables.
//    - If the doctor exists, deletes the record and returns a success message; otherwise, responds with a not found or error message.


// 9. Define the `filter` Method:
//    - Handles HTTP GET requests to filter doctors based on name, time, and specialty.
//    - Accepts `name`, `time`, and `speciality` as path variables.
//    - Calls the shared `Service` to perform filtering logic and returns matching doctors in the response.

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private CentralService centralService;

    @Autowired
    private TokenService tokenService;

// 1. Get Doctor Availability
    @GetMapping("/availability/{user}/{doctorId}/{date}/{token}")
    public ResponseEntity<?> getDoctorAvailability(
            @PathVariable String user,
            @PathVariable Long doctorId,
            @PathVariable String date,
            @PathVariable String token) {
       ResponseEntity<Map<String, String>> validationResponse = centralService.validateToken(token, user);
    
        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return validationResponse;
        }

        try {
            LocalDate localDate = LocalDate.parse(date);
            List<String> availability = doctorService.getDoctorAvailability(doctorId, localDate);
            return ResponseEntity.ok(availability);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid request or date format"));
        }
    }

    // 2. Get List of Doctors
    @GetMapping
    public ResponseEntity<?> getDoctors() {
        List<Doctor> doctors = doctorService.getDoctors();
        return ResponseEntity.ok(Map.of("doctors", doctors));
    }

    // 3. Add New Doctor
    @PostMapping("/{token}")
    public ResponseEntity<?> saveDoctor(@RequestBody Doctor doctor, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validationResponse = centralService.validateToken(token, "admin");

        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return validationResponse; // 401 Unauthorized
        }

       
        // Step 2: Try to save the doctor
        int result = doctorService.saveDoctor(doctor);

        // Step 3: Return response based on result
        if (result == 1) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Doctor added to db"));
        } else if (result == 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Doctor already exists"));
        } else {
            // Catch-all case for unexpected result codes
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Some internal error occurred"));
        }
        
    }

    // 4. Doctor Login
    @PostMapping("/login")
    public ResponseEntity<?> doctorLogin(@RequestBody Login login) {
        return doctorService.validateDoctor(login);
    }


//     @PostMapping("/login")
// public ResponseEntity<?> doctorLogin(@RequestBody Login login) {
//     return doctorService.validateDoctor(login);
// }

    @PutMapping("/{token}")
    public ResponseEntity<?> updateDoctor(@RequestBody Doctor doctor, @PathVariable String token) {
        ResponseEntity<Map<String, String>> validationResponse = centralService.validateToken(token, "admin");

        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return validationResponse; // 401 Unauthorized
        }

        int result = doctorService.updateDoctor(doctor);

        if (result == 1) {
            return ResponseEntity.ok(Map.of("message", "Doctor updated"));
        } else if (result == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Doctor not found"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Some internal error occurred"));
        }
    }

    // 6. Delete Doctor
    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id, @PathVariable String token) {
       ResponseEntity<Map<String, String>> validationResponse = centralService.validateToken(token, "admin");

        if (!validationResponse.getStatusCode().is2xxSuccessful()) {
            return validationResponse; // 401 Unauthorized
        }

        int result = doctorService.deleteDoctor(id);

        if (result == 1) {
            return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
        } else if (result == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Doctor not found with id: " + id));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Some internal error occurred"));
        }

        
    }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<?> deleteDoctor(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
    //     if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
    //     }
    //     String token = authHeader.substring(7);

    //     // validate and delete
    //     // doctorService.deleteDoctorById(id);
    //     doctorService.deleteDoctor(id);
    //     return ResponseEntity.ok(Map.of("success", true));
    // }
    // // 7. Filter Doctors
    // @GetMapping("/filter/{name}/{time}/{speciality}")
    // public ResponseEntity<?> filterDoctors(
    //         @PathVariable String name,
    //         @PathVariable String time,
    //         @PathVariable String speciality) {
    //     Map<String, Object> result = new HashMap<>();
    //     try {
    //         Map<String, Object> filtered = centralService.filterDoctor(name, time, speciality);
    //         return ResponseEntity.ok(filtered);
    //         // List<Doctor> doctors = doctorService.filterDoctorsByNameSpecialtyAndTime(name, speciality, time);
    //         // result.put("doctors", filtered);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                 .body(Map.of("error", "Failed to filter doctors"));
    //     }
    // }


    // @GetMapping("/filter/{name}/{time}/{speciality}")
    // public ResponseEntity<?> filterDoctors(
    //         @PathVariable String name,
    //         @PathVariable String time,
    //         @PathVariable String speciality) {
    //     try {
    //         Map<String, Object> filtered = centralService.filterDoctor(name, speciality, time); // ✅ param order
    //         return ResponseEntity.ok(filtered);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                 .body(Map.of("error", "Failed to filter doctors"));
    //     }
    // }

    // @GetMapping("/filter/{name}/{time}/{speciality}")
    // public Map<String, Object> filterDoctor(String name, String specialty, String time) {
    // try {
    //     return doctorService.filterDoctorsByNameSpecialtyAndTime(name, specialty, time);
    // } catch (Exception e) {
    //     return Map.of("doctors", List.of(), "error", "Failed to filter doctors");
    // }
    // }


    // @GetMapping("/filter/{name}/{time}/{speciality}")
    // public Map<String, Object> filterDoctor(
    //     @PathVariable String name,
    //     @PathVariable String time,
    //     @PathVariable String speciality) {
    // try {
    //     return doctorService.filterDoctorsByNameSpecialtyAndTime(
    //         "null".equalsIgnoreCase(name) ? "" : name,
    //         "null".equalsIgnoreCase(speciality) ? "" : speciality,
    //         "null".equalsIgnoreCase(time) ? "" : time
    //     );
    // } catch (Exception e) {
    //     return Map.of("doctors", List.of(), "error", "Failed to filter doctors");
    // }
    // }



//     @GetMapping("/filter/{name}/{time}/{speciality}")
//     public Map<String, Object> filterDoctor(String name, String specialty, String time) {
//     Map<String, Object> result = new HashMap<>();
//     try {
//         List<Doctor> doctors = doctorService.filterDoctorsByNameSpecialtyAndTime(name, specialty, time);
//         result.put("doctors", doctors);
//         return result;
//     } catch (Exception e) {
//         result.put("error", "Failed to filter doctors");
//         return result;
//     }
// }



// @GetMapping("/filter/{name}/{time}/{speciality}")
// public Map<String, Object> filterDoctor(
//     @PathVariable String name,
//     @PathVariable String time,
//     @PathVariable String speciality) {
//     try {
//         // Convert 'all' to empty strings (i.e., no filtering on that field)
//         String filteredName = "all".equalsIgnoreCase(name) ? "" : name;
//         String filteredTime = "all".equalsIgnoreCase(time) ? "" : time;
//         String filteredSpeciality = "all".equalsIgnoreCase(speciality) ? "" : speciality;

//         return centralService.filterDoctor(filteredName, filteredSpeciality, filteredTime);
//     } catch (Exception e) {
//         return Map.of("doctors", List.of(), "error", "Failed to filter doctors");
//     }
// }


// @GetMapping("/filter/{name}/{time}/{speciality}")
// public Map<String, Object> filterDoctor(
//         @PathVariable String name,
//         @PathVariable String specialty,
//         @PathVariable String time) {

//     List<Doctor> allDoctors = doctorService.getDoctors();

//     List<DoctorDTO> filteredDoctorDTOs = allDoctors.stream()
//         .filter(doc -> name.isEmpty() || doc.getName().toLowerCase().contains(name.toLowerCase()))
//         .filter(doc -> specialty.isEmpty() || doc.getSpecialty().equalsIgnoreCase(specialty))
//         .filter(doc -> {
//             if (time.isEmpty() || "all".equalsIgnoreCase(time)) return true;
//             for (String t : doc.getAvailableTimes()) {
//                 int hour = Integer.parseInt(t.split("-")[0].split(":")[0]);
//                 if ("AM".equalsIgnoreCase(time) && hour >= 0 && hour < 12) return true;
//                 if ("PM".equalsIgnoreCase(time) && hour >= 12 && hour < 24) return true;
//             }
//             return false;
//         })
//         .map(doc -> {
//             List<String> filteredTimes = doc.getAvailableTimes();

//             if (!time.isEmpty() && !"all".equalsIgnoreCase(time)) {
//                 filteredTimes = doc.getAvailableTimes().stream()
//                     .filter(t -> {
//                         int hour = Integer.parseInt(t.split("-")[0].split(":")[0]);
//                         return "AM".equalsIgnoreCase(time) ? hour < 12 : hour >= 12;
//                     })
//                     .collect(Collectors.toList());
//             }

//             // Create DTO with filtered times
//             DoctorDTO dto = new DoctorDTO(doc);
//             dto.setAvailableTimes(filteredTimes);
//             return dto;
//         })
//         .collect(Collectors.toList());

//     return Map.of("doctors", filteredDoctorDTOs);
// }



@GetMapping("/filter/{name}/{time}/{speciality}")
public Map<String, Object> filterDoctor(
        @PathVariable String name,
        @PathVariable String specialty,
        @PathVariable String time) {

    List<Doctor> allDoctors = doctorService.getDoctors();

    List<DoctorDTO> filteredDoctorDTOs = allDoctors.stream()
        .filter(doc -> name.isEmpty() || doc.getName().toLowerCase().contains(name.toLowerCase()))
        .filter(doc -> specialty.isEmpty() || doc.getSpecialty().equalsIgnoreCase(specialty))
        .filter(doc -> {
            if (time.isEmpty() || "all".equalsIgnoreCase(time)) return true;
            for (String t : doc.getAvailableTimes()) {
                int hour = Integer.parseInt(t.split("-")[0].split(":")[0]);
                if ("AM".equalsIgnoreCase(time) && hour >= 0 && hour < 12) return true;
                if ("PM".equalsIgnoreCase(time) && hour >= 12 && hour < 24) return true;
            }
            return false;
        })
        .map(doc -> {
            List<String> filteredTimes = doc.getAvailableTimes();

            if (!time.isEmpty() && !"all".equalsIgnoreCase(time)) {
                filteredTimes = doc.getAvailableTimes().stream()
                    .filter(t -> {
                        int hour = Integer.parseInt(t.split("-")[0].split(":")[0]);
                        return "AM".equalsIgnoreCase(time) ? hour < 12 : hour >= 12;
                    })
                    .collect(Collectors.toList());
            }

            // Create DTO with filtered times
            DoctorDTO dto = new DoctorDTO(doc);
            dto.setAvailableTimes(filteredTimes);
            return dto;
        })
        .collect(Collectors.toList());

    return Map.of("doctors", filteredDoctorDTOs);
}

// public Map<String, Object> filterDoctor(String name, String specialty, String time) {
//     List<Doctor> allDoctors = doctorService.getAllDoctors(); // assuming this is how you get all

//     List<Doctor> filteredDoctors = allDoctors.stream()
//         .filter(doc -> name.isEmpty() || doc.getName().toLowerCase().contains(name.toLowerCase()))
//         .filter(doc -> specialty.isEmpty() || doc.getSpecialty().equalsIgnoreCase(specialty))
//         // filter doctors who have at least one available time matching AM/PM or all
//         .filter(doc -> {
//             if (time.isEmpty() || "all".equalsIgnoreCase(time)) return true;
//             for (String t : doc.getAvailableTimes()) {
//                 int hour = Integer.parseInt(t.split("-")[0].split(":")[0]);
//                 if ("AM".equalsIgnoreCase(time) && hour >= 0 && hour < 12) return true;
//                 if ("PM".equalsIgnoreCase(time) && hour >= 12 && hour < 24) return true;
//             }
//             return false;
//         })
//         .map(doc -> {
//             if (time.isEmpty() || "all".equalsIgnoreCase(time)) {
//                 return doc; // no filtering of times needed
//             }

//             // Filter available times inside each doctor object
//             List<String> filteredTimes = doc.getAvailableTimes().stream()
//                 .filter(t -> {
//                     int hour = Integer.parseInt(t.split("-")[0].split(":")[0]);
//                     if ("AM".equalsIgnoreCase(time)) return hour >= 0 && hour < 12;
//                     else if ("PM".equalsIgnoreCase(time)) return hour >= 12 && hour < 24;
//                     else return true;
//                 })
//                 .collect(Collectors.toList());

//             // Create a new Doctor object or clone with filtered times
//             Doctor filteredDoc = new Doctor(doc); // assuming you have a copy constructor
//             filteredDoc.setAvailableTimes(filteredTimes);
//             return filteredDoc;
//         })
//         .collect(Collectors.toList());

//     return Map.of("doctors", filteredDoctors);
// }



// public Map<String, Object> filterDoctor(String name, String specialty, String time) {
//     List<Doctor> allDoctors = doctorService.getDoctors();

//     List<Doctor> filtered = allDoctors.stream()
//         .filter(doc -> name == null || name.equalsIgnoreCase("all") || name.isBlank() || doc.getName().toLowerCase().contains(name.toLowerCase()))
//         .filter(doc -> specialty == null || specialty.equalsIgnoreCase("all") || specialty.isBlank() || doc.getSpecialty().equalsIgnoreCase(specialty))
//         .peek(doc -> {
//             if (time != null && !time.equalsIgnoreCase("all")) {
//                 List<String> filteredSlots = doc.getAvailableTimes().stream()
//                     .filter(slot -> {
//                         try {
//                             String[] parts = slot.split("-")[0].split(":");
//                             int hour = Integer.parseInt(parts[0]);
//                             if ("AM".equalsIgnoreCase(time)) return hour < 12;
//                             if ("PM".equalsIgnoreCase(time)) return hour >= 12;
//                         } catch (Exception ignored) {}
//                         return false;
//                     })
//                     .collect(Collectors.toList());
//                 doc.setAvailableTimes(filteredSlots);
//             }
//         })
//         .filter(doc -> !doc.getAvailableTimes().isEmpty()) // ensure doctor has slots after filtering
//         .collect(Collectors.toList());

//     return Map.of("doctors", filtered);
// }

    // public Map<String, Object> filterDoctor(
    //     @PathVariable String name,
    //     @PathVariable String time,
    //     @PathVariable String speciality) {
    // try {
    //     // Convert 'all' to empty strings (i.e., no filtering on that field)
    //     String filteredName = "all".equalsIgnoreCase(name) ? "" : name;
    //     String filteredTime = "all".equalsIgnoreCase(time) ? "" : time;
    //     String filteredSpeciality = "all".equalsIgnoreCase(speciality) ? "" : speciality;

    //     return doctorService.filterDoctorsByNameSpecialtyAndTime(
    //             filteredName, filteredSpeciality, filteredTime);
    // } catch (Exception e) {
    //     return Map.of("doctors", List.of(), "error", "Failed to filter doctors");
    // }
    // }

}
