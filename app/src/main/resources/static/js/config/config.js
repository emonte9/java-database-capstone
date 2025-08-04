// config.js

/**
 * Configuration file for defining global constants and environment-specific settings.
 * 
 * API_BASE_URL:
 * - Base URL for all API requests made from the frontend.
 * - Easily switchable for different environments (development, staging, production).
 * 
 * Example usage:
 *   fetch(`${API_BASE_URL}/api/appointments`)
 */

export const API_BASE_URL = "http://localhost:8080";

// export const API_BASE_URL = "http://localhost:8080/api";
// "http://localhost:8080/api";



// curl -X POST http://localhost:8080/patient/login \
//   -H "Content-Type: application/json" \
//   -d '{"email":"jane.doe@example.com","password":"passJane1"}'


// curl -X POST http://localhost:8080/patient/login \
//   -H "Content-Type: application/json" \
//   -d '{"email":"emily.rose@example.com","password":"emilyPass99"}'


// curl -X POST http://localhost:8080/patient/login \
//   -H "Content-Type: application/json" \
//   -d '{"email":"emily.rose@example.com","password":"emilyPass99"}'


//   emily.rose@example.com