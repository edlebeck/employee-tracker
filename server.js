const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Welcome@123',
  database: 'employees_db',
});
// questions for primary inquirer node
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
//start of questions for adding a department
const departmentQuery = [
    {
        name: 'departmentAdd',
        type: 'input',
        message: 'Enter Department name:',
        validate: departmentInput => {
            if (departmentInput && departmentInput.length <50) {
                return true;
            } else {
                console.log('Please enter a valid department name(requires input and less than 50 characters)');
                return false;
            }
        }
    }
]
// placeholder array for spreading arrays
const holder = []
// questions for adding role
const roleQuery = [
    {
        name: 'title',
        type: 'input',
        message: 'Enter Title:',
        validate: titleInput => {
            if (titleInput && titleInput.length < 30) {
                return true;
            } else {
                console.log('Please enter valid title(requires input and less than 30 characters)');
                return false;
            }
        }
    },
    {
        name: 'salary',
        type: 'number',
        message: 'Enter Salary:',
        validate: salaryInput => {
            if (salaryInput && salaryInput.toString().length < 12) {
                return true;
            } else {
                console.log('Please enter valid salary (requires input, is a number, and less than 12 digits)');
                return false;
            }
        }
    }
]
// questions for adding employee
const employeeQuery = [
    {
        name: 'first_name',
        type: 'input',
        message: "Enter employee's first name",
        validate: firstInput => {
            if (firstInput && firstInput.length < 30) {
                return true;
            } else {
                console.log('Please enter valid first name(requires input and less than 30 characters)');
                return false;
            }
        }
    },
    {
        name: 'last_name',
        type: 'input',
        message: "Enter employee's first name",
        validate: lastInput => {
            if (lastInput && lastInput.length < 30) {
                return true;
            } else {
                console.log('Please enter valid last name(requires input and less than 30 characters)');
                return false;
            }
        }
    }
]
// function to return to primary node
function primaryPrompt(){
    inquirer.prompt(primary)
        .then(answerFunction);
};
// function to run chosen option
function answerFunction (answer) {
    if (answer.primaryOption === 'View All Employees') {
        viewEmployees();
    } else if (answer.primaryOption === 'View All Departments') {
        viewDepartments();
    } else if (answer.primaryOption === 'View All Roles') {
        viewRoles();
    } else if (answer.primaryOption === 'Exit') {
        endProgram();
    } else if (answer.primaryOption === 'Add a Department') {
        addDepartment();
    } else if (answer.primaryOption === 'Add a Role') {
        addRole();
    } else if (answer.primaryOption === 'Add an Employee') {
        addEmployee();
    } else if (answer.primaryOption === 'Update Employee Role') {
        updateEmployee();
    }
};
// function to view all employees
function viewEmployees() {
    db.execute(
        `SELECT a.id AS ID, a.first_name AS FIRST, a.last_name AS LAST, role.title AS TITLE, department.name AS DEPARTMENT, role.salary AS SALARY, b.full_name AS MANAGER
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
// function to view all departments
function viewDepartments() {
    db.execute(
        `SELECT id AS ID, name AS DEPARTMENT
        FROM department;`, function(err, results) {
            if (err) {
                console.log(err);
            }
            console.table(`
            
            `, results);
        }
    );
    primaryPrompt();
};
// function to view all roles
function viewRoles () {
    db.execute(
        `SELECT role.id AS ID, role.title AS TITLE, department.name AS DEPARTMENT, role.salary AS SALARY
        FROM role
        LEFT JOIN department
        ON role.department_id = department.id;`, function(err, results) {
            if (err) {
                console.log(err);
            }
            console.table(`
            
            `, results);
        }
    );
    primaryPrompt();
};
// function to add a department
function addDepartment() {
    inquirer.prompt(departmentQuery)
        .then(show => {
            db.execute(
                `INSERT INTO department (name)
                VALUES 
                (?)`, [show.departmentAdd], function(err, results) {
                    if (err) {console.log(err);}
                    console.table(`

                    DEPARTMENT ADDED
                    
                    `)
                }
            )
        })
        .then(primaryPrompt)
};
// function to add new role
async function addRole () {
    // code to add dynamic list to inquirer
    let allDepts = await getDepts();
    let finalDepts = (    {
        name: 'deptID',
        type: 'list',
        message: 'Choose Department:',
        choices: allDepts
    })
    inquirer.prompt([...roleQuery, finalDepts])
        .then(newRole => {
            // code to get the department id number
            let tempDept = newRole.deptID;
            let deptNum = tempDept.replace(/(^\d+)(.+$)/i,'$1');
            db.execute(`
            INSERT INTO role (title, salary, department_id)
            VALUES
                (?, ?, ?)`, [newRole.title, newRole.salary, deptNum], function (err, results) {
                    if (err) {console.log(err);}
                    console.table(`
                    
                    ROLE ADDED

                    `)
                }
            )
        }).then(primaryPrompt)
}
// function to add questions to 
async function addEmployee () {
    // code to add dynamic lists to pick a role and manager for add employee function
    let allRoles = await getRoles();
    let allManagers = await getManagers();
    let finalRoles = ( {
        name: 'role',
        type: 'list',
        message: 'Choose employee role',
        choices: allRoles
    })
    let finalManagers = ({
        name: 'manager',
        type: 'list',
        message: 'Choose employee manager',
        choices: allManagers
    })
    inquirer.prompt([...employeeQuery, finalRoles, finalManagers])
        .then(newEmployee => {// code to get role id number
            let tempRole = newEmployee.role;
            let tempRoleID = tempRole.replace(/(^\d+)(.+$)/i,'$1');
            // code to get manager id number
            let tempManager = newEmployee.manager;
            let tempManagerID
            if (tempManager === 'None') {
                tempManagerID = '';
            } else {
                tempManagerID = tempManager.replace(/(^\d+)(.+$)/i,'$1');
            }
            db.execute(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES
                (?, ?, ?, ?)`, [newEmployee.first_name, newEmployee.last_name, tempRoleID, tempManagerID],
                function (err, results) {
                    if (err) {console.log(err);}
                    console.table(`
                    
                    EMPLOYEE ADDED
                    
                    `)
                })
            db.execute('UPDATE employee SET full_name = CONCAT(?, " ", ?) WHERE first_name = ? AND last_name = ?', [newEmployee.first_name, newEmployee.last_name, newEmployee.first_name, newEmployee.last_name],
            function (err, results) {
                if (err) {console.log(err);}
            })
        })
        .then(primaryPrompt)

}

async function updateEmployee() {
    //code to get questions for inquirer to update employee
    let allRoles = await getRoles();
    let allEmployees = await getManagers();
    let finalEmployees = ({
        name: 'employee',
        type: 'list',
        message: 'Choose employee to update',
        choices: allEmployees
    })
    let finalRoles = ( {
        name: 'updatedRole',
        type: 'list',
        message: 'Update employee role',
        choices: allRoles
    })
    inquirer.prompt([...holder, finalEmployees, finalRoles])
        .then(updatedEmployee => {
            // code to get number of new role
            let newRole = updatedEmployee.updatedRole;
            let newRoleID = newRole.replace(/(^\d+)(.+$)/i,'$1');
            // code to get number of employee to update
            let employee = updatedEmployee.employee;
            if (employee === 'None') {
                return primaryPrompt;
            }
            let employeeID = employee.replace(/(^\d+)(.+$)/i,'$1');
            db.execute('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleID, employeeID], 
            function (err, results) {
                if(err) {console.log(err)}
                console.table(`
                
                EMPLOYEE UPDATED

                `)
            })
        })
        .then(primaryPrompt)

}
// function to get dynamic list of departments
function getDepts() {
    return new Promise ((resolve, reject)=> {
        db.query('SELECT name FROM department',
        function (err, results){
            let depts = []
            for (i = 0 ; i < results.length; i++) {
                depts.push((i+1) + ": " + results[i].name)
            }
            resolve (depts);
        })
    })
};
// function to get dynamic list of roles
function getRoles() {
    return new Promise ((resolve, reject) => {
        db.query('SELECT title FROM role',
        function (err, results){
            let roles = []
            for (i = 0 ; i < results.length; i++) {
                roles.push((i+1) + ': ' + results[i].title)
            }
            resolve (roles)
        })
    })
};
// function to get dynamic list of employees
function getManagers() {
    return new Promise ((resolve, reject) => {
        db.query('SELECT full_name FROM employee', 
        function (err, results){
            let managers = ['None']
            for (i = 0 ; i < results.length ; i++) {
                managers.push((i+1) + ': ' + results[i].full_name)
            }
            resolve (managers)
        }
        )
    })
};
// function to end the program
function endProgram() {
    db.end();
    console.log("Goodbye");
};
// function call to start the program
primaryPrompt();