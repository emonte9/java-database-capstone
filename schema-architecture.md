Section 1: Architecture Summary
This project uses the Spring Framework, which follows the Model-View-Controller (MVC) design pattern.

The presentation layer utilizes Thymeleaf for rendering AdminDashboard and DoctorDashboard HTML pages on the server.

Additional client interfaces such as Appointments, PatientDashboard, and PatientRecord interact with the backend using HTTP requests and JSON responses.

Thymeleaf controllers serve HTML views, while REST controllers handle form submissions and process JSON-based HTTP requests and responses.

The service layer contains business logic. It:

Validates incoming data,

Separates controller responsibilities from data access operations.

The data layer uses:

MySQL to store structured records for patients, doctors, appointments, and admins.

MongoDB for document-oriented data such as prescriptions.




Section 2: Flow of Data and Control
The user navigates to AdminDashboard or interacts with pages like Appointments.

The request is routed to the appropriate Thymeleaf or REST controller.

The controller invokes a service class to validate input and process logic.

The service communicates with MySQL or MongoDB through repository interfaces.

The database returns the requested data, which is then sent back to the user as a rendered page or JSON response.
