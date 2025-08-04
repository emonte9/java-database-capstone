// patientDashboard.js
import { selectRole } from './render.js'; 
import { getDoctors } from './services/doctorServices.js';
import { openModal } from './components/modals.js';
import { createDoctorCard } from './components/doctorCard.js';
import { filterDoctors } from './services/doctorServices.js';//call the same function to avoid duplication coz the functionality was same
// import { patientSignup, patientLogin } from './services/patientServices.js';
import { patientSignup, patientLogin } from './services/patientServices.js';



document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("patientSignup");
  if (btn) {
    btn.addEventListener("click", () => openModal("patientSignup"));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("patientLogin")
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      // loginBtn
      openModal("patientLogin")
      // openModal("loginBtn")
    })
  }
})

// function loadDoctorCards() {
//   getDoctors()
//     .then(doctors => {
//       const contentDiv = document.getElementById("content");
//       contentDiv.innerHTML = "";

//       doctors.forEach(doctor => {
//         const card = createDoctorCard(doctor);
//         contentDiv.appendChild(card);
//       });
//     })
//     .catch(error => {
//       console.error("Failed to load doctors:", error);
//     });
// }

// function loadDoctorCards() {
//   getDoctors()
//     .then(response => {
//       const doctors = response.doctors; // ✅ extract the array from the object
//       const contentDiv = document.getElementById("content");
//       contentDiv.innerHTML = "";

//       doctors.forEach(doctor => {
//         const card = createDoctorCard(doctor);
//         contentDiv.appendChild(card);
//       });
//     })
//     .catch(error => {
//       console.error("Failed to load doctors:", error);
//     });
// }



function loadDoctorCards() {
  // getDoctors()
  //   .then(response => {
  //     console.log("getDoctors() response:", response); // Add this line for debugging

  //     const doctors = Array.isArray(response.doctors) ? response.doctors : [];

  //     const contentDiv = document.getElementById("content");
  //     contentDiv.innerHTML = "";

  //     if (doctors.length > 0) {
  //       doctors.forEach(doctor => {
  //         const card = createDoctorCard(doctor);
  //         contentDiv.appendChild(card);
  //       });
  //     } else {
  //       contentDiv.innerHTML = "<p>No doctors found.</p>";
  //     }
  //   })

  getDoctors()
  .then(doctors => {
    console.log("Loaded doctors:", doctors);
    if (!Array.isArray(doctors)) {
      throw new Error("Expected an array of doctors but got: " + typeof doctors);
    }

    // Now just work with `doctors`, no redeclaration
    const displayDoctors = doctors; // or rename if needed
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (displayDoctors.length > 0) {
      displayDoctors.forEach(doc => {
        const card = createDoctorCard(doc);
        contentDiv.appendChild(card);
      });
    } else {
      contentDiv.innerHTML = "<p>No doctors found.</p>";
    }
  })
    .catch(error => {
      console.error("Failed to load doctors:", error);
    });
}


// Filter Input
document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
document.getElementById("filterTime").addEventListener("change", filterDoctorsOnChange);
document.getElementById("filterSpecialty").addEventListener("change", filterDoctorsOnChange);



// function filterDoctorsOnChange() {
//   const searchBar = document.getElementById("searchBar").value.trim();
//   const filterTime = document.getElementById("filterTime").value;
//   const filterSpecialty = document.getElementById("filterSpecialty").value;


//   const name = searchBar.length > 0 ? searchBar : null;
//   const time = filterTime.length > 0 ? filterTime : null;
//   const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;

//   filterDoctors(name, time, specialty)
//     .then(response => {
//       const doctors = response.doctors;
//       const contentDiv = document.getElementById("content");
//       contentDiv.innerHTML = "";

//       if (doctors.length > 0) {
//         console.log(doctors);
//         doctors.forEach(doctor => {
//           const card = createDoctorCard(doctor);
//           contentDiv.appendChild(card);
//         });
//       } else {
//         contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
//         console.log("Nothing");
//       }
//     })
//     .catch(error => {
//       console.error("Failed to filter doctors:", error);
//       alert("❌ An error occurred while filtering doctors.");
//     });
// }

function filterDoctorsOnChange() {
  const searchBarInput = document.getElementById("searchBar");
  const filterTimeInput = document.getElementById("filterTime");
  const filterSpecialtyInput = document.getElementById("filterSpecialty");

  const name = searchBarInput && searchBarInput.value.trim() !== "" ? searchBarInput.value : "all";
  const time = filterTimeInput && filterTimeInput.value.trim() !== "" ? filterTimeInput.value : "all";
  const specialty = filterSpecialtyInput && filterSpecialtyInput.value.trim() !== "" ? filterSpecialtyInput.value : "all";

  filterDoctors(name, time, specialty)
    .then(response => {
      const doctors = response.doctors || response || [];  // defensive fix if response is array or object with doctors

      const contentDiv = document.getElementById("content");
      contentDiv.innerHTML = "";

      if (doctors.length > 0) {
        doctors.forEach(doctor => {
          const card = createDoctorCard(doctor);
          contentDiv.appendChild(card);
        });
      } else {
        contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
      }
    })
    .catch(error => {
      console.error("Failed to filter doctors:", error);
      alert("❌ An error occurred while filtering doctors.");
    });
}



// function filterDoctorsOnChange() {
//   const name = document.getElementById("searchBar").value.trim();
//   const time = document.getElementById("filterTime").value;
//   const specialty = document.getElementById("filterSpecialty").value;

//   filterDoctors(name || null, time || null, specialty || null)
//     .then(response => {
//       console.log("filterDoctors() response:", response); // Helpful debug

//       const doctors = Array.isArray(response?.doctors) ? response.doctors : [];

//       const contentDiv = document.getElementById("content");
//       contentDiv.innerHTML = "";

//       if (doctors.length > 0) {
//         doctors.forEach(doctor => {
//           const card = createDoctorCard(doctor);
//           contentDiv.appendChild(card);
//         });
//       } else {
//         contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
//       }
//     })
//     .catch(error => {
//       console.error("Failed to filter doctors:", error);
//       alert("❌ An error occurred while filtering doctors.");
//     });
// }

// function filterDoctorsOnChange() {
//   const searchBar = document.getElementById("searchBar").value.trim();
//   const filterTime = document.getElementById("filterTime").value;
//   const filterSpecialty = document.getElementById("filterSpecialty").value;

//   const name = searchBar.length > 0 ? searchBar : null;
//   const time = filterTime.length > 0 ? filterTime : null;
//   const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;

//   filterDoctors(name, time, specialty)
//     .then(response => {
//       console.log("🧪 filterDoctors response:", response); // Debugging

//       // ✅ Safely extract doctors list
//       const doctors = Array.isArray(response?.doctors) ? response.doctors : [];

//       const contentDiv = document.getElementById("content");
//       contentDiv.innerHTML = "";

//       if (doctors.length > 0) {
//         doctors.forEach(doctor => {
//           const card = createDoctorCard(doctor);
//           contentDiv.appendChild(card);
//         });
//       } else {
//         contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
//       }
//     })
//     .catch(error => {
//       console.error("❌ Failed to filter doctors:", error);
//       alert("❌ An error occurred while filtering doctors.");
//     });
// }



window.signupPatient = async function () {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };
    const { success, message } = await patientSignup(data);
    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    }
    else alert(message);
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};

// window.loginPatient = async function () {
//   try {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     const data = {
//       email,
//       password
//     }
//     console.log("loginPatient :: ", data)
//     const response = await patientLogin(data);
//     console.log("Status Code:", response.status);
//     console.log("Response OK:", response.ok);
//     if (response.ok) {
//       const result = await response.json();
//       console.log(result);
//       // selectRole('loggedPatient');
//       // localStorage.setItem('token', result.token)
//       // window.location.href = '/pages/loggedPatientDashboard.html';
//       localStorage.setItem('role', 'loggedPatient');
//       localStorage.setItem('token', result.token);
//       window.location.href = '/pages/loggedPatientDashboard.html';
//     } else {
//       alert('❌ Invalid credentials!');
//     }
//   }
//   catch (error) {
//     alert("❌ Failed to Login : ", error);
//     console.log("Error :: loginPatient :: ", error)
//   }


// }



window.signupPatient = async function () {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };
    const { success, message } = await patientSignup(data);

    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};

