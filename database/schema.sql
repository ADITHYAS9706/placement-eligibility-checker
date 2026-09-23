CREATE DATABASE IF NOT EXISTS placement1_checker;

USE placement1_checker;

CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    cgpa DOUBLE,
    backlogs INT,
    branch VARCHAR(50),
    graduation_year INT
);

CREATE TABLE IF NOT EXISTS companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100),
    minimum_cgpa DOUBLE,
    maximum_backlogs INT,
    eligible_branch VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS eligibility_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    company_id INT,
    result VARCHAR(30),
    reason VARCHAR(255),
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

INSERT INTO companies
(company_name, minimum_cgpa, maximum_backlogs, eligible_branch)
VALUES
('TCS', 7.0, 0, 'CSE,ISE,AIML,CSDS,CE,CS'),
('Infosys', 6.5, 1, 'CSE,ISE,AIML,CSDS,CE,CS'),
('Wipro', 6.0, 2, 'CSE,ISE,AIML,CSDS,CE,CS');