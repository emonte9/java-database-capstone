/*
  This script handles the admin dashboard functionality for managing doctors:
  - Loads all doctor cards
  - Filters doctors by name, time, or specialty
  - Adds a new doctor via modal form


  Attach a click listener to the "Add Doctor" button
  When clicked, it opens a modal form using openModal('addDoctor')


  When the DOM is fully loaded:
    - Call loadDoctorCards() to fetch and display all doctors


  Function: loadDoctorCards
  Purpose: Fetch all doctors and display them as cards

    Call getDoctors() from the service layer
    Clear the current content area
    For each doctor returned:
    - Create a doctor card using createDoctorCard()
    - Append it to the content div

    Handle any fetch errors by logging them


  Attach 'input' and 'change' event listeners to the search bar and filter dropdowns
  On any input change, call filterDoctorsOnChange()


  Function: filterDoctorsOnChange
  Purpose: Filter doctors based on name, available time, and specialty

    Read values from the search bar and filters
    Normalize empty values to null
    Call filterDoctors(name, time, specialty) from the service

    If doctors are found:
    - Render them using createDoctorCard()
    If no doctors match the filter:
    - Show a message: "No doctors found with the given filters."

    Catch and display any errors with an alert


  Function: renderDoctorCards
  Purpose: A helper function to render a list of doctors passed to it

    Clear the content area
    Loop through the doctors and append each card to the content area


  Function: adminAddDoctor
  Purpose: Collect form data and add a new doctor to the system

    Collect input values from the modal form
    - Includes name, email, phone, password, specialty, and available times

    Retrieve the authentication token from localStorage
    - If no token is found, show an alert and stop execution

    Build a doctor object with the form values

    Call saveDoctor(doctor, token) from the service

    If save is successful:
    - Show a success message
    - Close the modal and reload the page

    If saving fails, show an error message
*/


// adminDashboard.js


// // Import necessary modules
// import { openModal } from './components/modals.js';
// // import { API_BASE_URL } from '../config/config.js';
// // import { API_BASE_URL } from '/js/config/config.js';
// import { API_BASE_URL } from '/js/config/config.js';
// import { selectRole } from './render.js'; // Optional, if selectRole is defined there

// // API endpoints
// const ADMIN_API = `${API_BASE_URL}/admin`;
// const DOCTOR_API = `${API_BASE_URL}/doctor/login`;

// // Attach event listeners after page load
// window.onload = function () {
//   const adminBtn = document.getElementById('admin-btn');  
//   const doctorBtn = document.getElementById('doctor-btn');


//   if (adminBtn) {
//     adminBtn.addEventListener('click', () => openModal('adminLogin'));
//   }

//   if (doctorBtn) {
//     doctorBtn.addEventListener('click', () => openModal('doctorLogin'));
//   }
// };

// // Admin login handler (make it globally accessible)
// window.adminLoginHandler = async function () {
//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;
  
//   const admin = { username, password };

//   try {
//     const response = await fetch(ADMIN_API + '/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(admin),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       localStorage.setItem("token", data.token);
//       selectRole("admin");
//     } else {
//       alert("Invalid admin credentials!");
//     }
//   } catch (error) {
//     alert("Error during admin login: " + error.message);
//   }
// };

// // Doctor login handler
// window.doctorLoginHandler = async function () {
//   const email = document.getElementById("doctorEmail").value;
//   const password = document.getElementById("doctorPassword").value;

//   const doctor = { email, password };

//   try {
//     const response = await fetch(DOCTOR_API, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(doctor),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       localStorage.setItem("token", data.token);
//       selectRole("doctor");
//     } else {
//       alert("Invalid doctor credentials!");
//     }
//   } catch (error) {
//     alert("Error during doctor login: " + error.message);
//   }
// };



// adminDashboard.js

// Imports
import { openModal } from './components/modals.js';
import { createDoctorCard } from './components/doctorCard.js';
import { getDoctors, filterDoctors, saveDoctor } from './services/doctorServices.js';
import { API_BASE_URL } from '/js/config/config.js';
// import { API_BASE_URL } from '/js/config/config.js';
import { selectRole } from './render.js';

// // DOMContentLoaded ensures event handlers are bound after DOM is ready
// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('addDocBtn')?.addEventListener('click', () => openModal('addDoctor'));

//   document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
//   document.getElementById("filterTime").addEventListener("change", filterDoctorsOnChange);
//   document.getElementById("filterSpecialty").addEventListener("change", filterDoctorsOnChange);

//   loadDoctorCards();
// });


// document.addEventListener('DOMContentLoaded', () => {
//   const btn = document.getElementById('addDocBtn');
//   btn?.addEventListener('click', () => openModal('addDoctor'));
  
//   const search = document.getElementById('searchBar');
//   search?.addEventListener('input', filterDoctorsOnChange);
//   document.getElementById('filterTime')?.addEventListener('change', filterDoctorsOnChange);
//   document.getElementById('filterSpecialty')?.addEventListener('change', filterDoctorsOnChange);

//   loadDoctorCards();
// });


document.addEventListener('DOMContentLoaded', () => {
  // const contentDiv = document.getElementById('content');
  // if (!contentDiv) {
  //   console.warn("Not on admin dashboard page skipping doctor card logic.");
  //   return;
  // }

  document.getElementById('addDocBtn')?.addEventListener('click', () => openModal('addDoctor'));
  document.getElementById("searchBar")?.addEventListener("input", filterDoctorsOnChange);
  document.getElementById("filterTime")?.addEventListener("change", filterDoctorsOnChange);
  document.getElementById("filterSpecialty")?.addEventListener("change", filterDoctorsOnChange);

  loadDoctorCards();
});





// Load and render doctor cards
async function loadDoctorCards() {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) {
    console.warn("⚠️ #content element not found. Skipping doctor rendering.");
    return;
  }

  try {
    const doctors = await getDoctors();
    if (!doctors || doctors.length === 0) {
      contentDiv.innerHTML = "<p>No doctors available.</p>";
      return;
    }

    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
  }
}

// async function loadDoctorCards() {
//   const contentDiv = document.getElementById("content");
//   // contentDiv.innerHTML = "<p>Loading doctors...</p>";

//   try {
//     const doctors = await getDoctors();
//     if (doctors.length === 0) {
//       contentDiv.innerHTML = "<p>No doctors available.</p>";
//       return;
//     }

//     renderDoctorCards(doctors);
//   } catch (error) {
//     // contentDiv.innerHTML = "<p>Error loading doctors.</p>";
//     console.error("Failed to load doctors:", error);
//   }
// }

// Utility function to render cards
function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) {
    console.warn("⚠️ #content not found during render.");
    return;
  }

  contentDiv.innerHTML = "";

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// function renderDoctorCards(doctors) {
//   const contentDiv = document.getElementById("content");
//   contentDiv.innerHTML = "";

//   doctors.forEach(doctor => {
//     const card = createDoctorCard(doctor);
//     contentDiv.appendChild(card);
//   });
// }


// async function loadDoctorCards() {
//   const contentDiv = document.getElementById("content");
//   if (!contentDiv) {
//     console.warn("⚠️ #content element not found. Skipping doctor rendering.");
//     return;
//   }

//   try {
//     const doctors = await getDoctors();
//     if (doctors.length === 0) {
//       contentDiv.innerHTML = "<p>No doctors available.</p>";
//       return;
//     }

//     renderDoctorCards(doctors);
//   } catch (error) {
//     contentDiv.innerHTML = "<p>Error loading doctors.</p>";
//     console.error("Failed to load doctors:", error);
//   }
// }


// Filter handler for search and dropdowns
function filterDoctorsOnChange() {

  const contentDiv = document.getElementById("content");
  console.log("contentDiv:", document.getElementById("content"));
  if (!contentDiv) {
    console.warn("⚠️ #content element not found. Skipping filter rendering.");
    return;
  }
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

// Admin adds a new doctor (called from modal form submission)
// window.adminAddDoctor = async function () {
//   const name = document.getElementById("docName").value;
//   const email = document.getElementById("docEmail").value;
//   const password = document.getElementById("docPassword").value;
//   const phone = document.getElementById("docPhone").value;
//   const specialty = document.getElementById("docSpecialty").value;
//   const timeInputs = document.querySelectorAll('input[name="availability"]:checked');
//   const availableTimes = Array.from(timeInputs).map(input => input.value);

//   const token = localStorage.getItem("token");
//   if (!token) {
//     alert("Admin is not authenticated. Please login.");
//     return;
//   }

//   const doctor = {
//     name,
//     email,
//     password,
//     phone,
//     specialty,
//     availableTimes
//   };

//   const result = await saveDoctor(doctor, token);

//   if (result.success) {
//     alert("Doctor added successfully!");
//     document.getElementById("addDoctorModal").style.display = "none"; // or use closeModal() if you have one
//     loadDoctorCards(); // reload doctor list
//   } else {
//     alert("Failed to add doctor: " + result.message);
//   }
// };



export async function adminAddDoctor() {
  const name = document.getElementById("docName").value;
  const email = document.getElementById("docEmail").value;
  const password = document.getElementById("docPassword").value;
  const phone = document.getElementById("docPhone").value;
  const specialty = document.getElementById("docSpecialty").value;
  const timeInputs = document.querySelectorAll('input[name="availability"]:checked');
  const availableTimes = Array.from(timeInputs).map(input => input.value);

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Admin is not authenticated. Please login.");
    return;
  }

  const doctor = {
    name,
    email,
    password,
    phone,
    specialty,
    availableTimes
  };

  const result = await saveDoctor(doctor, token);

  if (result.success) {
    alert("Doctor added successfully!");
    document.getElementById("addDoctorModal").style.display = "none"; // or use closeModal() if you have one
    loadDoctorCards(); // reload doctor list
  } else {
    alert("Failed to add doctor: " + result.message);
  }
}