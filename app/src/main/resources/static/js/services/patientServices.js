// // patientServices

import { API_BASE_URL } from "../config/config.js";

// const PATIENT_API = `${API_BASE_URL}/patient`;
// const PATIENT_API = `${API_BASE_URL}/api/patient/me`;
// const PATIENT_API = `${API_BASE_URL}/api/patient/me`;
// const PATIENT_API = `${API_BASE_URL}/api/patient/me`;
const PATIENT_API = `${API_BASE_URL}/patient`; // => http://localhost:8080/patient





/**
 * Patient signup
 * @param {Object} data - name, email, password, etc.
 */
export async function patientSignup(data) {
  try {
    const response = await fetch(`${PATIENT_API}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error || result?.message || "❌ Signup failed.");
    }

    return {
      success: true,
      message: result?.message || "✅ Signup successful",
    };
  } catch (error) {
    console.error("Error :: patientSignup ::", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

/**
 * Patient login
 * @param {Object} data - { email, password }
 */
export async function patientLogin(data) {
  try {
    console.log("Login URL:", `${PATIENT_API}/login`);
    console.log("Login data:", data);
    const response = await fetch(`${PATIENT_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error || result?.message || "Login failed");
    }

    return {
      success: true,
      token: result.token,
    };

    // return {
    //   success: true,
    //   token: data.token  // whatever your backend returns
    // };
  } catch (error) {
    
    console.error("Login failed:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

// /**
//  * Get logged-in patient data (used for profile, appointment booking)
//  * @param {string} token
//  */
// export async function getPatientData(token) {
//   try {

//     // console.log("Fetching patient data with token:", token);
//     // const response = await fetch(`${PATIENT_API}/`, {
//     //   headers: {
//     //     "Authorization": `Bearer ${token}`,
//     //   },
//     // });
//     const response = await fetch(PATIENT_API, {
//     headers: {
//       "Authorization": `Bearer ${token}`,
//       "Content-Type": "application/json"
//     }
//   });
//   if (!response.ok) throw new Error("Failed to fetch patient data");
//   console.log("Patient object:", patient);
//   console.log("Patient ID used:", patientId);
//   return patient;
//   // return data.patient;
//   // return (await response.json()).data;

//     const data = await response.json();
//     if (response.ok) return data.patient;
//     console.warn("Backend returned error fetching patient data:", data);
//     return null;
//   } catch (error) {
//     console.error("Error fetching patient data:", error);
//     return null;
  
//   }


export async function getPatientData(token) {
  try {
    const response = await fetch(PATIENT_API, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch patient data");

    const result = await response.json();

    const patient = result?.data || result?.patient || null;

    if (!patient) throw new Error("No patient data found in response");

    console.log("✅ Patient object:", patient);
    return patient;

  } catch (error) {
    console.error("Error fetching patient data:", error);
    return null;
  }
}

// export async function getPatientData(token) {
//   try {
//     const response = await fetch(PATIENT_API, {
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     });

//     if (!response.ok) throw new Error("Failed to fetch patient data");

//     const result = await response.json();

//     const patient = result?.data || result?.patient || null;

//     if (!patient) throw new Error("No patient data found in response");

//     return patient;

//   } catch (error) {
//     console.error("Error fetching patient data:", error);
//     return null;
//   }
// }

// export async function getPatientData(token) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/patient`, {
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     });

//     if (!response.ok) throw new Error("Failed to fetch patient data");

//     const result = await response.json();

//     const patient = result?.data || result?.patient || null;

//     if (!patient) throw new Error("No patient data found in response");

//     return patient;

//   } catch (error) {
//     console.error("Error fetching patient data:", error);
//     return null;
//   }
// }


  // const response = await fetch(PATIENT_API, {
  //   headers: {
  //     "Authorization": `Bearer ${token}`,
  //     "Content-Type": "application/json"
  //   }
  // });
  // if (!response.ok) throw new Error("Failed to fetch patient data");
  // return (await response.json()).data;
// }

/**
 * Get appointments for patient or doctor
 * @param {string} id - patient or doctor ID
 * @param {string} token - JWT token
 * @param {string} user - "patient" or "doctor"
 */
// export async function getPatientAppointments(id, token, user) {
//   try {
//     const response = await fetch(`${PATIENT_API}/appointments/${user}/${id}`, {
//       headers: {
//         "Authorization": `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();
//     if (response.ok) return data.appointments || [];
//     return [];
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     return [];
//   }
// }

export async function getPatientAppointments(patientId, token, user) {
  try {
    const response = await fetch(`${PATIENT_API}/appointments/${user}/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok) {
      console.log("🎯 API returned:", data);
      return data.data || [];  // ✅ access data inside "data" key
    }

    console.warn("⚠️ Failed to fetch appointments:", data);
    return [];
  } catch (error) {
    console.error("❌ Error in getPatientAppointments:", error);
    return [];
  }
}

/**
 * Filter appointments by condition and patient/doctor name
 * @param {string} condition - "pending", "consulted", etc.
 * @param {string} name
 * @param {string} token
 */
export async function filterAppointments(condition = "", name = "", token) {
  try {
    const params = new URLSearchParams();
    if (condition) params.append("condition", condition);
    if (name) params.append("name", name);

    const response = await fetch(`${PATIENT_API}/appointments/filter?${params.toString()}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return { appointments: data.appointments || [] };
    } else {
      console.error("Filter request failed:", response.statusText);
      return { appointments: [] };
    }
  } catch (error) {
    console.error("Error filtering appointments:", error);
    alert("Something went wrong!");
    return { appointments: [] };
  }
}

// export async function filterAppointments(condition = "", name = "", token) {
//   try {
//     const params = new URLSearchParams({
//       condition,
//       name,
//     });

//     const response = await fetch(`${PATIENT_API}/appointments/filter?${params.toString()}`, {
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await response.json();
//     if (response.ok) {
//       return { appointments: data.appointments || [] };
//     } else {
//       console.error("Filter request failed:", response.statusText);
//       return { appointments: [] };
//     }
//   } catch (error) {
//     console.error("Error filtering appointments:", error);
//     alert("Something went wrong!");
//     return { appointments: [] };
//   }
// }