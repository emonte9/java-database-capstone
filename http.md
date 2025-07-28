

curl http://localhost:8080/doctor

curl -X POST http://localhost:8080/patient \
-H "Content-Type: application/json" \
-d '{"name":"John Doe","email":"john@example.com","phone":"1234567890","password":"password123","age":30,"address":"123 Main St","gender":"male"}'

{"message":"Signup successful"}





<!--  -->



curl -X POST http://localhost:8080/patient/login \
-H "Content-Type: application/json" \
-d '{"identifier":"john@example.com","password":"password123"}'


curl -X POST http://localhost:8080/patient/login \
-H "Content-Type: application/json" \
-d '{"identifier":"john.smith@example.com","password":"smithSecure"}'


curl -X POST http://localhost:8080/patient/login \
-H "Content-Type: application/json" \
-d '{"identifier":"emily.rose@example.com","password":"emilyPass99"}'



curl -X POST http://localhost:8080/patient/login \
-H "Content-Type: application/json" \
-d '{"identifier":"jane.doe@example.com","password":"passJane1"}'



curl -X POST http://localhost:8080/patient/login \
-H "Content-Type: application/json" \
-d '{"identifier":"michael.j@example.com","password":"airmj23"}'


{"token":"<JWT_TOKEN>"}



<!--  -->


curl -X GET http://localhost:8080/patient/<JWT_TOKEN>


curl -X GET http://localhost:8080/patient/eyJhbGciOiJIUzI1NiJ9...




{
  "patient": {
    "id": 26,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St"
  }
}




<!--  -->


curl -X GET http://localhost:8080/doctor/filter/null/10:00-11:00/Neurologist



{
  "doctors": [
    {
      "id": 22,
      "name": "Dr. Henry Evans",
      "specialty": "Neurologist",
      "email": "dr.evans@example.com",
      "phone": "555-222-3334",
      "availableTimes": ["10:00-11:00", "11:00-12:00", "14:00-15:00", "16:00-17:00"]
    }
  ]
}



curl -X POST http://localhost:8080/patient/login \
-H "Content-Type: application/json" \
-d '{"identifier":"john@example.com","password":"password123"}'

curl -X GET http://localhost:8080/patient/<your_jwt_token_here>

curl -X GET http://localhost:8080/doctor/filter/null/10:00-11:00/Neurologist


