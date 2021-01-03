// Node modules
var mysql = require("mysql");
var inquirer = require("inquirer");

// Establish a connection
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password & database
    password: "Password",
    database: "employee_trackerDB"
});

// Initialize runSearch() if connection is established
connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

// Launch the prompt interface with switch statements
function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add a new department",
                "Add a new role",
                "Add a new employee",
                "View all departments",
                "View all roles",
                "View all employees",
                "Update employee info",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add a new department":
                    addDept();
                    break;

                case "Add a new role":
                    addRole();
                    break;

                case "Add a new employee":
                    addEmployee();
                    break;

                case "View all departments":
                    viewAllDepts();
                    break;

                case "View all roles":
                    viewAllRoles();
                    break;

                case "View all employees":
                    viewAllEmployees();
                    break;

                case "Update employee info":
                    updateEmployeeInfo();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        })
}

// View all departments
function viewAllDepts() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            runSearch()
        })

}

// View all roles 
function viewAllRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            runSearch()
        })
}

// View all employees
function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            runSearch()
        })
}

// Add a new department
function addDept() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What department would you like to add?"
        }
    ]).then(function (res) {
        var query = connection.query(
            "INSERT INTO department SET ?",
            {
                name: res.name

            },
            function (err) {
                if (err) throw err
                console.table(res);
                runSearch();
            }
        )
    })
}

// Add a new role
function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function (err, res) {
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary for the new role?"

            }
        ]).then(function (res) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: res.title,
                    salary: res.salary,
                },
                function (err) {
                    if (err) throw err
                    console.table(res);
                    runSearch();
                }
            )
        })
    })
}

// Create an array for role & manager queries
var roleArr = [];
function selectRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

    })
    return roleArr;
}

var managersArr = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }

    })
    return managersArr;
}

// Add a new employee
function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "What is the first name of the new employee?"
        },
        {
            name: "lastname",
            type: "input",
            message: "What is the last name of the new employee?"
        },
        {
            name: "role",
            type: "list",
            message: "What is their role? ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Who is their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
        var roleId = selectRole().indexOf(val.role) + 1
        var managerId = selectManager().indexOf(val.choice) + 1
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: val.firstName,
                last_name: val.lastName,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(val)
                runSearch()
            })
    })
}

// Update current employee's info 
function updateEmployeeInfo() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function (err, res) {
        if (err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: "lastName",
                type: "rawlist",
                choices: function () {
                    var lastName = [];
                    for (var i = 0; i < res.length; i++) {
                        lastName.push(res[i].last_name);
                    }
                    return lastName;
                },
                message: "What is the employee's last name? ",
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is the employee's new title? ",
                choices: selectRole()
            },
        ]).then(function (val) {
            var roleId = selectRole().indexOf(val.role) + 1
            connection.query("UPDATE employee SET WHERE ?",
                {
                    last_name: val.lastName
                },
                {
                    role_id: roleId
                },
                function (err) {
                    if (err) throw err
                    console.table(val)
                    runSearch()
                })
        })
    })
}