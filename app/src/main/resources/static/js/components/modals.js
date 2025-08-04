
import { 
  adminLoginHandler, 
  doctorLoginHandler 
} from '../services/index.js';  // adjust the path if needed


import { patientSignup, patientLogin } from '../services/patientServices.js';

import { patientSignup as signupPatient, patientLogin as loginPatient } from '../services/patientServices.js';
// app/src/main/resources/static/js/adminDashboard.js

import { adminAddDoctor } from '../adminDashboard.js'

// import { adminAddDoctor } from '../services/adminServices.js'; // adjust the path as needed
// import { adminLoginHandler, doctorLoginHandler } from '../services/index.js'; // if they're grouped

// import { 
//   adminLoginHandler, 
//   doctorLoginHandler, 
//   signupPatient, 
//   loginPatient, 
//   adminAddDoctor 
// } from '../services/index.js';


// modals.js
export function openModal(type) {
  let modalContent = '';
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('closeModal');

  if (!modal || !modalBody || !closeBtn) {
    console.warn("❌ Modal elements not found in DOM");
    return;
  }

  modalBody.innerHTML = modalContent;
  modal.style.display = 'block';

  closeBtn.onclick = () => {
    modal.style.display = 'none';
  }; // added this

  console.log("hello world")
  // let modalContent = '';
  if (type === 'addDoctor') {
    modalContent = `
         <h2>Add Doctor</h2>
         <input type="text" id="doctorName" placeholder="Doctor Name" class="input-field">
         <select id="specialization" class="input-field select-dropdown">
             <option value="">Specialization</option>
                        <option value="cardiologist">Cardiologist</option>
                        <option value="dermatologist">Dermatologist</option>
                        <option value="neurologist">Neurologist</option>
                        <option value="pediatrician">Pediatrician</option>
                        <option value="orthopedic">Orthopedic</option>
                        <option value="gynecologist">Gynecologist</option>
                        <option value="psychiatrist">Psychiatrist</option>
                        <option value="dentist">Dentist</option>
                        <option value="ophthalmologist">Ophthalmologist</option>
                        <option value="ent">ENT Specialist</option>
                        <option value="urologist">Urologist</option>
                        <option value="oncologist">Oncologist</option>
                        <option value="gastroenterologist">Gastroenterologist</option>
                        <option value="general">General Physician</option>

        </select>
        <input type="email" id="doctorEmail" placeholder="Email" class="input-field">
        <input type="password" id="doctorPassword" placeholder="Password" class="input-field">
        <input type="text" id="doctorPhone" placeholder="Mobile No." class="input-field">
        <div class="availability-container">
        <label class="availabilityLabel">Select Availability:</label>
          <div class="checkbox-group">
              <label><input type="checkbox" name="availability" value="09:00-10:00"> 9:00 AM - 10:00 AM</label>
              <label><input type="checkbox" name="availability" value="10:00-11:00"> 10:00 AM - 11:00 AM</label>
              <label><input type="checkbox" name="availability" value="11:00-12:00"> 11:00 AM - 12:00 PM</label>
              <label><input type="checkbox" name="availability" value="12:00-13:00"> 12:00 PM - 1:00 PM</label>
          </div>
        </div>
        <button class="dashboard-btn" id="saveDoctorBtn">Save</button>
      `;
  } else if (type === 'patientLogin') {
    modalContent = `
        <h2>Patient Login</h2>
        <input type="text" id="email" placeholder="Email" class="input-field">
        <input type="password" id="password" placeholder="Password" class="input-field">
        <button class="dashboard-btn" id="loginBtn">Login</button>
      `;
  }
  else if (type === "patientSignup") {
    modalContent = `
      <h2>Patient Signup</h2>
      <input type="text" id="name" placeholder="Name" class="input-field">
      <input type="email" id="email" placeholder="Email" class="input-field">
      <input type="password" id="password" placeholder="Password" class="input-field">
      <input type="text" id="phone" placeholder="Phone" class="input-field">
      <input type="text" id="address" placeholder="Address" class="input-field">
      <button class="dashboard-btn" id="signupBtn">Signup</button>
    `;

  } else if (type === 'adminLogin') {
    modalContent = `
        <h2>Admin Login</h2>
        <input type="text" id="username" name="username" placeholder="Username" class="input-field">
        <input type="password" id="password" name="password" placeholder="Password" class="input-field">
        <button class="dashboard-btn" id="adminLoginBtn" >Login</button>
      `;
  } else if (type === 'doctorLogin') {
    modalContent = `
        <h2>Doctor Login</h2>
        <input type="text" id="email" placeholder="Email" class="input-field">
        <input type="password" id="password" placeholder="Password" class="input-field">
        <button class="dashboard-btn" id="doctorLoginBtn" >Login</button>
      `;
  }

  document.getElementById('modal-body').innerHTML = modalContent;
  document.getElementById('modal').style.display = 'block';

  document.getElementById('closeModal').onclick = () => {
    document.getElementById('modal').style.display = 'none';
  };

  if (type === "patientSignup") {
    document.getElementById("signupBtn").addEventListener("click", signupPatient);
  }

  // if (type === "patientLogin") {
  //   document.getElementById("loginBtn").addEventListener("click", loginPatient);
  // }


//   if (type === "patientLogin") {
//   document.getElementById("loginBtn").addEventListener("click", () => {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     loginPatient({ email, password });
//   });
//   document.getElementById("loginBtn").addEventListener("click", async () => {
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   const result = await loginPatient({ email, password });

//   // if (result.success) {
//   //   alert("✅ Login successful!");
//   //   document.getElementById('modal').style.display = 'none';
//   // } 
  
  
//   if (result.success) {
//   localStorage.setItem("userRole", "loggedPatient");
//   localStorage.setItem("token", result.token); // make sure result.token is returned from backend
//   alert("✅ Login successful!");
//   document.getElementById('modal').style.display = 'none';
  
//   // Navigate based on role
//   import("../render.js").then(({ selectRole }) => {
//     selectRole("loggedPatient");
//   });
// }else {
//     alert("❌ Login failed: " + result.message);
//   }
// });
// }

if (type === "patientLogin") {
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const result = await loginPatient({ email, password });

    if (result.success) {
      localStorage.setItem("userRole", "loggedPatient");
      localStorage.setItem("token", result.token); // make sure result.token is correct
      // alert("✅ Login successful!");
      document.getElementById('modal').style.display = 'none';

      // 🧠 Dynamic import after login success
      import("../render.js").then(({ selectRole }) => {
        selectRole("loggedPatient");
      });
    } else {
      alert("❌ Login failed: " + result.message);
    }
  });
}

  
  if (type === 'addDoctor') {
    document.getElementById('saveDoctorBtn').addEventListener('click', adminAddDoctor);
  }

  if (type === 'adminLogin') {
    document.getElementById('adminLoginBtn').addEventListener('click', adminLoginHandler);
  }

  if (type === 'doctorLogin') {
    document.getElementById('doctorLoginBtn').addEventListener('click', doctorLoginHandler);
  }
}
