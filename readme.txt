# Lexora Project

## Prerequisites

*   Java Development Kit (JDK) version 17 or later installed. You can check your version with `java -version`.
*   Node.js and npm (The `frontend-maven-plugin` can install these automatically during the build, but for separate frontend development, you might want them installed globally).

## How to Run The Combined Application (Backend + Built Frontend)

This command builds both the backend and the frontend (using `npm run build`) and runs the Spring Boot application, which typically serves the built frontend assets.

1.  Make sure you are in the main project directory (`c:\Users\youssef elalem\Desktop\lexora`).
2.  Open a terminal or command prompt in this directory.
3.  Run the application using the Maven wrapper:

    *   On Windows:
        ```bash
        mvnw.cmd spring-boot:run
        ```
    *   On Linux/macOS:
        ```bash
        ./mvnw spring-boot:run
        ```
    *(Note: The first time you run this, Maven might download dependencies and Node/npm, which can take a few minutes).*

4.  The application should start, and you can typically access it at `http://localhost:8080` (or another port if configured differently in `application.properties`).

## Frontend Development (Running Separately)

To run the frontend with a development server (for features like hot-reloading) while developing, you typically run it separately from the backend.

**Note:** Your current `package.json` does not have a standard `start` script. You might need to add one depending on the frontend framework/tools you are using (e.g., for React, Vue, Angular).

1.  **Start the Backend:** Open a terminal and run the backend as described in the section above:
    *   Windows: `mvnw.cmd spring-boot:run`
    *   Linux/macOS: `./mvnw spring-boot:run`
2.  **Start the Frontend:** Open a *second* terminal in the project root (`c:\Users\youssef elalem\Desktop\lexora\frontend`).
    *   Install frontend dependencies (if not already done):
        ```bash
        npm install
        ```
    *   Run the frontend development server (assuming you add a `start` script to `package.json`):
        ```bash
        npm start
        ```
    *   The frontend development server will likely run on a different port (e.g., `http://localhost:3000`). You will also need to configure proxying for API requests to the backend running on port 8080 (this setup depends on your frontend framework).

