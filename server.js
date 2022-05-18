const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const primary = [
    {
        name: 'primaryOption',
        type: 'list',
        message: `
        ==================
        Choose an Option
        ==================
        
        `,
        choices: [
            'View All Departments',
            'View All Roles', 
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update Employee Role',
            // 'Update Employee Manager',
            // 'View Employees by Manager',
            // 'View Employees by Department',
            // 'Delete Department',
            // 'Delete Role',
            // 'Delete Employee',
            // 'View Department Budget',
            'Exit'
        ]
    }
]

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Welcome@123',
  database: 'employees_db'
});

// db.execute('SELECT * FROM employee;', function(err, results) {
//     console.table(results);
// });

function primaryPrompt(){
    inquirer.prompt(primary)
        .then(answerFunction);
};

function answerFunction (answer) {
    if (answer.primaryOption === 'View All Employees') {
        viewEmployees();
    }
};

function viewEmployees () {
    db.execute(
        `SELECT a.full_name AS NAME, role.title AS TITLE, department.name AS DEPARTMENT, b.full_name AS MANAGER
        FROM employee a
        LEFT JOIN role
        ON a.role_id = role.id
        LEFT JOIN department
        ON role.department_id = department.id
        LEFT JOIN employee b
        ON a.manager_id = b.id;`, function(err, results) {
            if (err) {
                console.log(err);
            }
            console.table(`
            
            `, results);
        });
        primaryPrompt();
};

primaryPrompt();