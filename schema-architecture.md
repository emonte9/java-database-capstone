## Section 1: Architecture Summary
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




## Section 2: Flow of Data and Control
1. A user action—like loading the AdminDashboard page or calling an API endpoint (e.g. Appointments)—originates in the browser or mobile client.

2. The incoming HTTP request is dispatched to the matching Spring controller: a Thymeleaf controller for server-rendered views or a REST controller for JSON APIs.

3. Within the controller, input is validated and then handed off to a service class that encapsulates the business rules (e.g. checking doctor availability, enforcing booking constraints).

4. The service invokes one or more repository interfaces: Spring Data JPA repositories talk to MySQL for structured entities, and Spring Data MongoDB repositories handle document collections.

5. The repository layer executes queries against the appropriate database engine—MySQL for relational tables and MongoDB for flexible documents—and returns raw data.

6. Returned data is bound to Java model objects: JPA entities for MySQL records and document‐annotated classes for MongoDB data.

7. Finally, the controller uses those model objects to produce the response—Thymeleaf templates render dynamic HTML, or REST endpoints serialize the models (or DTOs) into JSON—and sends it back to the client.
