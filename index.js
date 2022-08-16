const connection = require("./config/connection")
const inquirer = require("inquirer")

function start() {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log("|                                                 |")
    console.log("|               EMPLOYEE MANAGEMENT               |")
    console.log("|                      SYSTEM                     |")
    console.log("|                                                 |")
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

    userPrompt();
}

function userPrompt() {
    inquirer.prompt({
        type: "list",
        name: "initialChoice",
        message: "What would you like to do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add A Department",
            "Add A Role",
            "Add An Employee",
            "Update An Employee Role"
        ]
    }).then(answer => {
        switch(answer.initialChoice) {
            case "View All Departments":
            return viewDepts();
            case "View All Roles":
            return viewRoles();
            case "View All Employees":
            return viewEmployees();
            case "Add A Department":
            return addDept();
            case "Add A Role":
            return addRole();
            case "Add An Employee":
            return addEmployee();
            case "Update An Employee Role":
            return updateEmployee();
            default:
        }
    })
}

function viewDepts() {
    const view = connection.query(`SELECT * FROM department`)
    console.table(view)
}

function viewRoles() {
    const view = connection.query(`SELECT * FROM role`)
    console.table(view)
}

function viewEmployees() {
    const view = connection.query(`SELECT * FROM employee`)
    console.table(view)
}

function addDept() {
    inquirer.prompt({
        type: "input",
        name: "newDept",
        message: "Enter the name of the department to be added",
    }).then((answer) => {
        connection.query(`INSERT INTO department (name) VALUES ("${answer.newDept}")`)
        console.log(`${answer.newDept} added as a new department!`)
    })
}

function addRole() {
    const [department] = connection.query(`SELECT * FROM department`)
    const departmentList = department.map(dept => {
        return {
            name: dept.name,
            value: dept.id
        }
    })
    inquirer.prompt([
        {
            type: "input",
            name: "newRole",
            message: "Enter the title of the role to be added",
        },
        {
            type: "input",
            name: "newRoleSalary",
            message: "Enter the salary of the role",
        },
        {
            type: "list",
            name: "deptName",
            message: "Select the department this role belongs to",
            choices: departmentList
        },
    ]).then((answer) => {
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answer.newRole, answer.newRoleSalary, answer.deptName])
        console.log(`${answer.newRole} added as a new role!`)
    })
}

function addEmployee() {
    const [role] = connection.query(`SELECT * FROM role`)
    const roleList = role.map(roleInfo => {
        return {
            name: roleInfo.title,
            value: roleInfo.id
        }
    })
    const [manager] = connection.query(`SELECT * FROM employee`)
    const managerList = manager.map(managerInfo => {
        return {
            name: `${managerInfo.first_name} ${managerInfo.last_name}`,
            value: managerInfo.id
        }
    })
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Enter the first name of the employee to be added",
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter the last name of the employee to be added",
        },
        {
            type: "list",
            name: "assignRole",
            message: "Select the role for the employee to be added",
            choices: roleList
        },
        {
            type: "list",
            name: "assignManager",
            message: "Select the manager the employee will be working under",
            choices: managerList
        },
    ]).then((answer) => {
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answer.firstName, answer.lastName, answer.assignRole, answer.assignManager])
        console.log(`${answer.firstName} ${answer.lastName} added as a new employee!`)
    })
}

function updateEmployee() {
    const [employee] = connection.query(`SELECT * FROM employee`)
    const employeeList = employee.map(employeeInfo => {
        return {
            name: `${employeeInfo.first_name} ${employeeInfo.last_name}`,
            value: employeeInfo.id
        }
    })
    const [role] = connection.query(`SELECT * FROM role`)
    const roleList = role.map(roleInfo => {
        return {
            name: roleInfo.title,
            value: roleInfo.id
        }
    })
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Select an employee to update",
            choices: employeeList
        },
        {
            type: "list",
            name: "role",
            message: "Select a role to update to",
            choices: roleList
        },
    ]).then((answer) => {
        connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [answer.role, answer.employee])
        console.log(`${answer.firstName} ${answer.lastName}'s role has been updated!`)
    })
}

start();