DROP DATABASE IF EXISTS employee_trackerDB;

CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30), 
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT NULL, 
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    PRIMARY KEY (id)
);

/*Departments*/
INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Human Resources");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Legal");

/*Roles*/
INSERT INTO role (title, salary, department_id)
VALUES ("Technical Sales Consultant", 90000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 100000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Technical Recruiter", 70000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Finance Analyst", 150000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Corporate Lawyer", 200000, 5);

/*Employees*/
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Jean-Pierre", "Polnareff", null, 2);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Noriaki", "Kakyoin", null, 1);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Joseph", "Joestar", null, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Jotaro", "Kujo", null, 5);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Mohammed", "Avdol", null, 3);

SELECT * FROM department; 
SELECT * FROM role;
SELECT * FROM employee;