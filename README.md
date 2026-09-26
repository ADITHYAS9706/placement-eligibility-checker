# Placement Eligibility Checker

A web-based Student Placement Management System that helps manage students, companies, and placement eligibility based on company-specific criteria.

## Overview

The Placement Eligibility Checker allows placement administrators to:

- Register and manage students
- Register and manage companies
- Define company eligibility criteria
- Check whether a student is eligible for a company
- Store eligibility results
- View placement results
- Generate placement-related reports
- Manage the system through an administrator interface

The system uses a React frontend, Spring Boot backend, and MySQL database.

---

## Features

### Student Management

- Add student records
- Store student name
- Store CGPA
- Store number of backlogs
- Store branch
- Store graduation year
- View registered students
- Edit student information
- Delete student records

### Company Management

- Add companies
- Define minimum CGPA
- Define maximum allowed backlogs
- Define eligible branch
- Define graduation year
- View registered companies
- Edit company information
- Delete company records

### Eligibility Checking

The system checks a student's eligibility using company-specific criteria such as:

- Minimum CGPA
- Maximum number of backlogs
- Eligible branch
- Graduation year

The result is displayed as either:

- Eligible
- Not Eligible

### Dashboard

The dashboard provides an overview of the placement system, including:

- Total students
- Total companies
- Eligible students
- Not eligible students
- Pending / not checked students

### Results

Eligibility results can be stored and viewed after performing eligibility checks.

### Reports

The system provides placement-related reporting functionality through the Reports section.

---

## Technology Stack

### Frontend

- React
- JavaScript
- HTML
- CSS
- Vite

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Hibernate

### Database

- MySQL

### Development Tools

- Visual Studio Code
- Git
- GitHub
- MySQL Workbench
- Maven

---

## Project Structure

```text
placement-eligibility-checker/
│
├── backend/
│   └── src/
│       └── main/
│           ├── java/
│           └── resources/
│               └── application.properties
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── database/
│
├── lib/
│   └── mysql-connector-j-9.7.0.jar
│
├── src/
│   ├── Company.java
│   ├── CompanyDAO.java
│   ├── DatabaseConnection.java
│   ├── EligibilityChecker.java
│   ├── Main.java
│   ├── Student.java
│   └── StudentDAO.java
│
├── .gitignore
└── README.md