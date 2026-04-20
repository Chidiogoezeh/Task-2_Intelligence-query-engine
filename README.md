Data Persistence and API Design Task

A real-time RESTful application built with Node.js, Express, and MySQL. This service functions as an enrichment engine that takes a simple name and transforms it into a detailed demographic profile using multiple external intelligence APIs.

Context
The Profile Intelligence Service is designed for systems requiring automated user profiling and data enrichment.

The Input: A simple user-provided name.

The Engine: Simultaneously queries Genderize, Agify, and Nationalize APIs to aggregate demographic data.

The Result: A structured, persistent profile featuring gender probability, age classification, and country of origin.

Below is a professional, high-quality README.md tailored specifically for your Profile Intelligence Service, following the exact structure and style you requested.

Profile Intelligence Service
A real-time, high-performance RESTful application built with Node.js, Express, and MySQL. This service functions as an enrichment engine that takes a simple name and transforms it into a detailed demographic profile using multiple external intelligence APIs.

Context
The Profile Intelligence Service is designed for systems requiring automated user profiling and data enrichment.

The Input: A simple user-provided name.

The Engine: Simultaneously queries Genderize, Agify, and Nationalize APIs to aggregate demographic data.

The Result: A structured, persistent profile featuring gender probability, age classification, and country of origin.

Features
-- Data Enrichment & Logic
Multi-API Aggregation: Integrated with three third-party services to fetch real-time intelligence.

Age Classification: Automatic categorization into life stages: child (0-12), teenager (13-19), adult (20-59), or senior (60+).

National Identity: Intelligent selection of the highest-probability country code from geographic data.

-- Persistence & Reliability
Idempotency Handling: Intelligent duplicate detection. If a name has already been processed, the system returns the existing record instead of creating a new one or re-calling external APIs.

UUID v7 Integration: Uses time-sortable Version 7 UUIDs for primary keys, ensuring better database indexing performance.

Data Integrity: Upstream validation ensures that if an external API returns null or insufficient data, the system triggers a 502 Bad Gateway error to prevent corrupted records.

-- System Design
Case-Insensitive Filtering: Search through profiles by gender, country_id, or age_group without worrying about casing.

Standardized Responses: Clean, consistent JSON formatting for all success and error states.

CORS Enabled: Configured with Access-Control-Allow-Origin: * for seamless frontend or grading script integration.

Tech Stack
Runtime: Node.js (ES6 Modules)

Framework: Express.js

Database: MySQL 8.0+

Drivers: mysql2/promise (Connection Pooling)

HTTP Client: Axios

Utilities: uuid, dotenv, cors

Project Architecture (MVC-S)
The project follows a modular architecture to separate concerns between routing, business logic, and data persistence:

- Entry Point: server.js (Server initialization)

- Application Setup: src/app.js (Express configuration & Middleware)

- Controllers: src/controllers/ (Request/Response handling)

- Services: src/services/ (Business logic, API aggregation & external wrappers)

- Models: src/models/ (SQL query abstraction)

- Utilities: src/utils/ (Response formatting & UUID generation)

Installation & Setup
1. Clone the repository
git clone https://github.com/Chidiogoezeh/Task-1_Data-Persistence---API-Design.git

2. Install dependencies
npm install

Below is a professional, high-quality README.md tailored specifically for your Profile Intelligence Service, following the exact structure and style you requested.

Profile Intelligence Service
A real-time, high-performance RESTful application built with Node.js, Express, and MySQL. This service functions as an enrichment engine that takes a simple name and transforms it into a detailed demographic profile using multiple external intelligence APIs.

Context
The Profile Intelligence Service is designed for systems requiring automated user profiling and data enrichment.

The Input: A simple user-provided name.

The Engine: Simultaneously queries Genderize, Agify, and Nationalize APIs to aggregate demographic data.

The Result: A structured, persistent profile featuring gender probability, age classification, and country of origin.

Features
-- Data Enrichment & Logic
Multi-API Aggregation: Integrated with three third-party services to fetch real-time intelligence.

Age Classification: Automatic categorization into life stages: child (0-12), teenager (13-19), adult (20-59), or senior (60+).

National Identity: Intelligent selection of the highest-probability country code from geographic data.

-- Persistence & Reliability
Idempotency Handling: Intelligent duplicate detection. If a name has already been processed, the system returns the existing record instead of creating a new one or re-calling external APIs.

UUID v7 Integration: Uses time-sortable Version 7 UUIDs for primary keys, ensuring better database indexing performance.

Data Integrity: Upstream validation ensures that if an external API returns null or insufficient data, the system triggers a 502 Bad Gateway error to prevent corrupted records.

-- System Design
Case-Insensitive Filtering: Search through profiles by gender, country_id, or age_group without worrying about casing.

Standardized Responses: Clean, consistent JSON formatting for all success and error states.

CORS Enabled: Configured with Access-Control-Allow-Origin: * for seamless frontend or grading script integration.

Tech Stack
Runtime: Node.js (ES6 Modules)

Framework: Express.js

Database: MySQL 8.0+

Drivers: mysql2/promise (Connection Pooling)

HTTP Client: Axios

Utilities: uuid, dotenv, cors

Project Architecture (MVC-S)
The project follows a modular architecture to separate concerns between routing, business logic, and data persistence:

Entry Point: server.js (Server initialization)

Application Setup: src/app.js (Express configuration & Middleware)

Controllers: src/controllers/ (Request/Response handling)

Services: src/services/ (Business logic, API aggregation & external wrappers)

Models: src/models/ (SQL query abstraction)

Utilities: src/utils/ (Response formatting & UUID generation)

Installation & Setup
1. Clone the repository
Bash
git clone https://github.com/Chidiogoezeh/Third-semester-month-1.git
cd profile-intelligence-service
2. Install dependencies
Bash
npm install
3. Database Setup
Create a MySQL database and run the provided schema.sql script to generate the profiles table.

4. Environment Variables
Create a .env file in the root directory:
PORT=3000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=profile_db

5. Run the application
- Development mode
npm run dev

- Production mode
node server.js

The server will run on http://localhost:3000.

API Documentation
1. Create Profile
Endpoint: POST /api/profiles

Payload: { "name": "ella" }

Logic: Calls external APIs, classifies age, and stores data. Returns existing data if the name already exists.

2. Get All Profiles
Endpoint: GET /api/profiles

Query Params (Optional): gender, country_id, age_group

Example: /api/profiles?gender=male&country_id=NG

3. Get Single Profile
Endpoint: GET /api/profiles/:id

Response: Full demographic breakdown of the specific UUID.

4. Delete Profile
Endpoint: DELETE /api/profiles/:id

Response: 204 No Content.

Error Handling
The service uses standard HTTP status codes and a consistent error object:
{ "status": "error", "message": "<detailed message>" }

400: Missing or empty name.

404: Profile not found.

422: Invalid data types.

502: Upstream API failure (Genderize/Agify/Nationalize returned null or 0 results).