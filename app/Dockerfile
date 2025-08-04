# Step 1: Build with Maven + JDK 17
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy Maven project files
COPY pom.xml .
COPY src ./src

# Build the Spring Boot JAR file, skipping tests
RUN mvn clean package -DskipTests

# Step 2: Run with lightweight JRE 17
FROM eclipse-temurin:17.0.15_6-jre
WORKDIR /app

# Copy only the built JAR from the builder stage
COPY --from=builder /app/target/back-end-0.0.1-SNAPSHOT.jar app.jar

# Expose port used by Spring Boot
EXPOSE 8080

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
