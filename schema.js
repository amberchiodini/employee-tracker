var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Password",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});

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
      .then (function(answer) {
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
      });
    }

function viewAllDepts() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    function(err, res) {
        if (err) throw err
        console.table(res)
        runSearch()
  })

}

function viewAllRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
    function(err, res) {
        if (err) throw err
        console.table(res)
        runSearch()
  })
}

function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    function(err, res) {
        if (err) throw err
        console.table(res)
        runSearch()
    })
}

function addDept() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What department would you like to add?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ?",
            {
                name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                runSearch();
            }
        )
    })
}

function addRole() {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the title for this role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO role SET ? ",
            {
                title: res.title,
                salary: res.salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                runSearch();
            }
        )
    })
}

function addEmployee() {
    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "What is the first name of the employee?"
        },
        {
          name: "lastname",
          type: "input",
          message: "What is the last name of the employee? "
        },
        {
          name: "role",
          type: "list",
          message: "What is their role?",
          choices: [
              "Technical Sales Consultant",
              "Software Engineer", 
              "Technical Recruiter", 
              "Finance Analyst",
              "Corporate Lawyer"
          ]
        },
        {
            name: "manager",
            type: "list",
            message: "Who is their manager?",
            choices: [
                "Jean-Pierre Polnareff",
                "Noriaki Kakyoin",
                "Joseph Joestar",
                "Jotaro Kujo",
                "Mohammed Avdol"
            ]
        }
    ]).then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1
      var managerId = selectManager().indexOf(val.manager) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          runSearch()
      })

  })
}