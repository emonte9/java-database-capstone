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


// Import necessary modules
import { openModal } from '../components/modals.js';
import { API_BASE_URL } from '../config/config.js';
import { selectRole } from '../render.js'; // Optional, if selectRole is defined there

// API endpoints
const ADMIN_API = `${API_BASE_URL}/admin`;
const DOCTOR_API = `${API_BASE_URL}/doctor/login`;

// Attach event listeners after page load
window.onload = function () {
  const adminBtn = document.getElementById('admin-btn');  
  const doctorBtn = document.getElementById('doctor-btn');


  if (adminBtn) {
    adminBtn.addEventListener('click', () => openModal('adminLogin'));
  }

  if (doctorBtn) {
    doctorBtn.addEventListener('click', () => openModal('doctorLogin'));
  }
};

// Admin login handler (make it globally accessible)
window.adminLoginHandler = async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  
  const admin = { username, password };

  try {
    const response = await fetch(ADMIN_API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      selectRole("admin");
    } else {
      alert("Invalid admin credentials!");
    }
  } catch (error) {
    alert("Error during admin login: " + error.message);
  }
};

// Doctor login handler
window.doctorLoginHandler = async function () {
  const email = document.getElementById("doctorEmail").value;
  const password = document.getElementById("doctorPassword").value;

  const doctor = { email, password };

  try {
    const response = await fetch(DOCTOR_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      selectRole("doctor");
    } else {
      alert("Invalid doctor credentials!");
    }
  } catch (error) {
    alert("Error during doctor login: " + error.message);
  }
};
