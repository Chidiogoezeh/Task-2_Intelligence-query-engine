CREATE DATABASE IF NOT EXISTS profile_db;
USE profile_db;

CREATE TABLE IF NOT EXISTS profiles (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    gender VARCHAR(50),
    gender_probability FLOAT,
    sample_size INT,
    age INT,
    age_group VARCHAR(20),
    country_id VARCHAR(10),
    country_probability FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);