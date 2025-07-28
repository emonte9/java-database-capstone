// patientServices
import { API_BASE_URL } from "../config/config.js";
const PATIENT_API = `${API_BASE_URL}/patient`;
// const PATIENT_API = API_BASE_URL + '/patient'


//For creating a patient in db
// export async function patientSignup(data) {
//   try {
//     const response = await fetch(`${PATIENT_API}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-type": "application/json"
//         },
//         body: JSON.stringify(data)
//       }
//     );
//     // const result = await response.json();
//     // if (!response.ok) {
//     //   throw new Error(result.message);
//     // }
//     if (!response.ok) {
//       const errorMsg = result.error || "❌ Signup failed.";
//       throw new Error(errorMsg);
//     }
//     const successMsg = result.message || "✅ Signup successful.";
//     return { success: true, message: successMsg };

//     // return { success: response.ok, message: result.message }
//   }
//   catch (error) {
//     console.error("Error :: patientSignup :: ", error)
//     return { success: false, message: error.message }
//   }
// }



export async function patientSignup(data) {
  try {
    const response = await fetch(`${PATIENT_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.error || result?.message || "❌ Signup failed.";
      throw new Error(errorMsg);
    }

    return {
      success: true,
      message: result?.message || "✅ Signup successful"
    };
  } catch (error) {
    console.error("Error :: patientSignup :: ", error);
    return {
      success: false,
      message: error.message || "Something went wrong"
    };
  }
}

//For logging in patient
// export async function patientLogin(data) {
//   console.log("patientLogin :: ", data)
//   return await fetch(`${PATIENT_API}/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });


// }



export async function patientLogin(data) {
  try {
    const response = await fetch(`${PATIENT_API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.error || result?.message || "Login failed";
      throw new Error(errorMsg);
    }

    return {
      success: true,
      token: result.token
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      message: error.message
    };
  }
}

// For getting patient data (name ,id , etc ). Used in booking appointments
export async function getPatientData(token) {
  try {
    const response = await fetch(`${PATIENT_API}/${token}`);
    const data = await response.json();
    if (response.ok) return data.patient;
    return null;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

// the Backend API for fetching the patient record(visible in Doctor Dashboard) and Appointments (visible in Patient Dashboard) are same based on user(patient/doctor).
export async function getPatientAppointments(id, token, user) {
  try {
    const response = await fetch(`${PATIENT_API}/${id}/${user}/${token}`);
    const data = await response.json();
    console.log(data.appointments)
    if (response.ok) {
      return data.appointments;
    }
    return null;
  }
  catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

export async function filterAppointments(condition, name, token) {
  console.log("hello")
  try {
    const response = await fetch(`${PATIENT_API}/filter/${condition}/${name}/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;

    } else {
      console.error("Failed to fetch doctors:", response.statusText);
      return { appointments: [] };

    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
    return { appointments: [] };
  }
}
