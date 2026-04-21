Profile Intelligence Query Engine
A real-time, high-performance RESTful application built with Node.js, Express, and MySQL. This service functions as an enrichment engine that takes a simple name and transforms it into a detailed demographic profile using multiple external intelligence APIs.

Context
The Profile Intelligence Service is designed for systems requiring automated user profiling and data enrichment for Insighta Labs.

The Input: A simple user-provided name.

The Engine: Simultaneously queries Genderize, Agify, and Nationalize APIs to aggregate demographic data.

The Result: A structured, persistent profile featuring gender probability, age classification, and country of origin.

Features
Data Enrichment and Logic
- Multi-API Aggregation: Integrated with three third-party services to fetch real-time intelligence.

- Age Classification: Automatic categorization into life stages: child (0-12), teenager (13-19), adult (20-59), or senior (60+).

- National Identity: Intelligent selection of the highest-probability country code from geographic data.

Persistence & Reliability
- Idempotency Handling: If a name has already been processed, the system returns the existing record instead of re-calling external APIs.

- UUID v7 Integration: Uses time-sortable Version 7 UUIDs for primary keys to ensure optimal database indexing.

- Data Integrity: Upstream validation triggers a 502 Bad Gateway error if external APIs return insufficient data.

System Design
- Advanced Filtering: Support for 7+ combined filters including probability thresholds and age ranges.

- Natural Language Query: Interpret plain English queries into structured database filters.

- CORS Enabled: Configured with Access-Control-Allow-Origin: * for seamless integration.

Tech Stack
- Runtime: Node.js (ES6 Modules)

- Framework: Express.js

- Database: MySQL 8.0+

- HTTP Client: Axios

- Utilities: uuid, dotenv, cors, mysql2

Installation & Setup
Clone the repository
    - git clone https://github.com/Chidiogoezeh/Task-2_Intelligence-query-engine.git
    - cd profile-intelligence-service

Install dependencies
    - npm install

Database Setup
    - Run the provided schema.sql script in your MySQL instance to generate the profiles table.

Environment Variables
Create a .env file:

- Code snippet
- PORT=3000
- DB_HOST=localhost
- DB_USER=your_user
- DB_PASSWORD=your_password
- DB_NAME=profile_db

Run the application
    - npm run dev

Natural Language Parsing Approach.
Our system uses a Rule-Based Parsing Engine to convert plain English into structured SQL filters. This ensures deterministic results without the latency of an LLM.

Supported Keywords & Mappings
- Gender: "males" or "females" maps to the gender filter.

- Age Groups: "teenager", "adult", "senior" maps to the age_group column.

- "Young" Keyword: Strictly interpreted as ages 16–24 (Rule-based parsing).

- Comparison: "above [number]" maps to min_age.

- Location: Detects country names (e.g., "Nigeria", "Kenya") and maps them to ISO codes (NG, KE).

Parsing Limitations
The parser does not support complex negation (e.g., "not from Nigeria").

Multiple conflicting age ranges in one string may result in the last detected range being applied.

If a query contains no recognizable keywords from our rules, it returns a 400 error: Unable to interpret query.

API Documentation
1. Create Profile
Endpoint: POST /api/profiles

Payload: { "name": "ella" }

Logic: Fetches data from external APIs and stores it.

2. Get All Profiles (Advanced Query)
Endpoint: GET /api/profiles

Filters: gender, age_group, country_id, min_age, max_age, min_gender_probability, min_country_probability

Sorting: sort_by (age, created_at, gender_probability), order (asc, desc)

Pagination: page (default 1), limit (default 10, max 50)

Example: /api/profiles?gender=male&country_id=NG&min_age=25&sort_by=age&order=desc

3. Natural Language Search
Endpoint: GET /api/profiles/search

Query Param: q (The English string)

Example: /api/profiles/search?q=young males from nigeria

4. Delete Profile
Endpoint: DELETE /api/profiles/:id

Response: 204 No Content.

Error Handling
The service returns consistent error objects:

JSON
{ "status": "error", "message": "<detailed message>" }
400: Missing or empty parameter / Unable to interpret query.

422: Invalid parameter type (e.g., passing a string where a number is expected).

404: Profile not found.

502: Upstream API failure.