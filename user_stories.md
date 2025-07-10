# User Story Template
**Title:**
_As a [user role], I want [feature/goal], so that [reason]._


**Acceptance Criteria:**
1. [Criteria 1]
2. [Criteria 2]
3. [Criteria 3]


## Admin

**Priority:** [High/Medium/Low]
**Story Points:** [Estimated Effort in Points]
**Notes:**
- [Additional information or edge cases]


Title: User Story 1: Admin Login #1
_As an admin, I want to log into the portal, so that I can securely manage the platform
Acceptance Criteria:

Admin enters valid credentials and is authenticated
Failed login shows a descriptive error message
Session persists across views until logout
Priority: [High]
Story Points: [3]
Notes:
[Additional information or edge cases]
Consider hashing passwords in the backend
Track failed login attempts for auditing



Title: User Story 2: Admin Logout #2
_As an admin, I want to log out of the protal, so that I can prevent unauthorized access to sensitive data
Acceptance Criteria:

Logout button is accessible from all dashboard views
Session is destroyed on logout
User is redirected to login screen
Priority: [High]
Story Points: [ 2 points]
Notes:
[Additional information or edge cases]
Invalidate session tokens and cookies



Title:User Story 3: Add Doctor Profile #3
_As an admin, I want to add doctors to the portal, so that new practitioners can be registered and made available for appointments.
Acceptance Criteria:

Admin can access a form to create a doctor profile
Form includes name, specialization, contact, and availability
New profile is persisted in MySQL and confirmed via a success message
Priority: [Medium]
Story Points: [3 points]
Notes:
[Additional information or edge cases]
Validate inputs to prevent duplicates
Optionally send welcome emails



Title:User Story 4: Delete Doctor Profile #4
_As an admin, I want to delete a doctor's profile from the portal, so that I can remove outdated or invalid entries.
Acceptance Criteria:

Admin can select a doctor and delete their profile
System prompts for confirmation before deletion
Deleted records are removed or archived for auditing
Priority: [Medium]
Story Points: [3]
Notes:
[Additional information or edge cases]
Check for dependencies like appointments before deletion



Title:User Story 5: Run Stored Procedure for Appointment Stats #5
As an admin, I want to run a stored procedure from the MySQL CLI to get monthly appointment stats, so that I can monitor clinic usage over time.
Acceptance Criteria:

Stored procedure accepts month/year parameters
Outputs count of appointments per doctor or department
Results are structured and easy to export
Priority: [Low]
Story Points: [2 poitns]
Notes:
[Additional information or edge cases]
Consider automating the report via cron job
Optimize query performance for large datasets



## Doctors


Title:User Story 1: View Doctors Without Logging In #6
As a patient, I want to view a list of doctors without logging in, so that I can explore my options before registering.
Acceptance Criteria:

Doctor list is publicly accessible on the landing page
Displays name, specialization, and availability
Navigation prompts user to register or log in for bookings
Priority: [Medium]
Story Points: [2]
Notes:
[Additional information or edge cases]
Consider adding search and filter options



Title:User Story 2: Patient Signup #7
As a patient, I want to sign up using my email and password, so that I can book appointments through the portal.
Acceptance Criteria:

Signup form validates email and strong password
Successful signup creates a patient profile
Confirmation message or redirect to dashboard
Priority: [High]
Story Points: [3]
Notes:
[Additional information or edge cases]
Hash passwords and check for duplicates


Title: User Story 3: Patient Login and Booking Management #8
As a patient, I want to log into the portal, so that I can manage my upcoming bookings.
Acceptance Criteria:

Login screen accepts valid credentials
Redirects to dashboard showing appointments
Invalid login shows error message
Priority: [High]
Story Points: [2]
Notes:
[Additional information or edge cases]
Track session state across different pages




Title: User Story 4: Patient Logout #9
As a patient, I want to log out of the portal, so that I can secure my account after managing appointments.
Acceptance Criteria:

Logout button is available from all views
2.Session is invalidated after logout
Redirect to login or public home page
Priority: [Medium]
Story Points: [1]
Notes:
[Additional information or edge cases]
Support auto-logout on timeout for extra security


Title: User Story 5: Book Hour-Long Appointment #10
As a patient, I want to book an hour-long appointment with a doctor, so that I can consult effectively about my health.
Acceptance Criteria:

Appointment form allows selecting duration and doctor
Conflicts with existing bookings are prevented
Booking is saved and confirmed with timestamp
Priority: [High]
Story Points: [3]
Notes:
[Additional information or edge cases]
Optionally send confirmation email or SMS



......
