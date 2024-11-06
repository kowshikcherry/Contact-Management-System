# Contact Management System API

## Overview

This project is a comprehensive RESTful API for a contact management system developed using Next.js. It focuses on user authentication, contact management features, data validation, date-time handling with timezones, file handling, and CSV/Excel parsing.

## Objective

The objective of this assignment is to create a robust backend system that allows users to manage contacts efficiently while ensuring security and data integrity.

## Features

1. **User Authentication**

   - User registration and login functionality using JWT (JSON Web Tokens).
   - Email verification upon registration.
   - Password reset functionality via one-time code.

2. **Contact Management**

   - Endpoints for:
     - Adding new contacts (name, email, phone number, address, timezone).
     - Retrieving contacts with filtering (by name, email, timezone) and sorting.
     - Updating contact details.
     - Deleting contacts (soft delete).
     - Batch processing for adding/updating multiple contacts.

3. **Data Validation**

   - validation for user input using libraries like Yup.
   - Unique constraints on emails in the user and contact tables.

4. **Date-Time Handling**

   - Store timestamps in UTC and convert to the user’s timezone upon retrieval.
   - Feature to retrieve contacts created within a specific date range.

5. **File Handling**

   - CSV and Excel file upload functionality for bulk contact creation/updates.
   - Data validation against existing constraints before saving to the database.
   - Download endpoint for CSV/Excel files of all contacts.

6. **Database**

   - SQL database (PostgreSQL/MySQL) for user and contact information storage.
   - Normalized database schema with necessary relationships.
   - Transactions for batch processing and file uploads to ensure data integrity.

7. **Security**
   - Rate limiting on sensitive endpoints (**login**, **registration**, **Retrieving contacts**, **Adding new contacts**, **Updating contact details**, **Deleting contacts**, **file uploading and file downloading**).
   - Proper hashing and secure storage of sensitive information (passwords).

## Requirements

- Node.js
- Next.js
- SQL Database (MySQL)
- Libraries: bcryptjs, csv-parse, csv-parser, dayjs, dotenv, fast-csv, joi, jsonwebtoken, multer, mysql2, next, nodemailer, react, react-dom, sequelize, xlsx, yup

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kowshikcherry/Contact-Management-System
   cd Contact-Management-System
   ```
2. Install dependencies:**npm install**
3. Set up the database:
   **Create a database in your SQL server.
   Run the migrations to set up the tables.**
4. Environment Variables:
   **Once recheck the environment Variables**
5. Run the backend server:
   **npm run dev**

## API Documentation

1. **The API documentation is available using Postman.**
