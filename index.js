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
            "Update An Employee Role",
            "Delete A Department",
            "Delete A Role",
            "Delete An Employee",
            "Exit Employee Management System"
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
            case "Delete A Department":
            return deleteDept();
            case "Delete A Role":
            return deleteRole();
            case "Delete An Employee":
            return deleteEmployee();
        case "Exit Employee Management System":
            return process.exit();
            default:
        }
    })
}

async function viewDepts() {
    const view = await connection.query(`SELECT * FROM department`)
    console.table(view)
    setTimeout(userPrompt, 1500)
}

async function viewRoles() {
    const view = await connection.query(`SELECT * FROM role`)
    console.table(view)
    setTimeout(userPrompt, 1500)
}

async function viewEmployees() {
    const view = await connection.query(`SELECT * FROM employee`)
    console.table(view)
    setTimeout(userPrompt, 1500)
}

async function addDept() {
    inquirer.prompt({
        type: "input",
        name: "newDept",
        message: "Enter the name of the department to be added",
    }).then((answer) => {
        connection.query(`INSERT INTO department (name) VALUES ("${answer.newDept}")`)
        console.log(`${answer.newDept} added as a new department!`)
        return setTimeout(userPrompt, 1500)
    })
}

async function addRole() {
    const department = await connection.query(`SELECT * FROM department`)
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
        return setTimeout(userPrompt, 1500)
    })
}

async function addEmployee() {
    const role = await connection.query(`SELECT * FROM role`)
    const roleList = role.map(roleInfo => {
        return {
            name: roleInfo.title,
            value: roleInfo.id
        }
    })
    const manager = await connection.query(`SELECT * FROM employee`)
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
        return setTimeout(userPrompt, 1500)
    })
}

async function updateEmployee() {
    const employee = await connection.query(`SELECT * FROM employee`)
    const employeeList = employee.map(employeeInfo => {
        return {
            name: `${employeeInfo.first_name} ${employeeInfo.last_name}`,
            value: employeeInfo.id
        }
    })
    const role = await connection.query(`SELECT * FROM role`)
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
        console.log(`Employee's role has been updated!`)
        return setTimeout(userPrompt, 1500)
    })
}

async function deleteDept() {
    const department = await connection.query(`SELECT * FROM department`)
    const departmentList = department.map(dept => {
        return {
            name: dept.name,
            value: dept.id
        }
    })
    inquirer.prompt({
        type: "list",
        name: "department",
        message: "Select a department to delete",
        choices: departmentList
    }).then((answer) => {
        connection.query(`DELETE FROM department WHERE id = ?`, answer.department)
        console.log(`Department has been deleted!`)
        return setTimeout(userPrompt, 1500)
    })
}

async function deleteRole() {
    const role = await connection.query(`SELECT * FROM role`)
    const roleList = role.map(roleInfo => {
        return {
            name: roleInfo.title,
            value: roleInfo.id
        }
    })
    inquirer.prompt({
        type: "list",
        name: "role",
        message: "Select a role to delete",
        choices: roleList
    }).then((answer) => {
        connection.query(`DELETE FROM role WHERE id = ?`, answer.role)
        console.log(`Role has been deleted!`)
        return setTimeout(userPrompt, 1500)
    })
}

async function deleteEmployee() {
    const employee = await connection.query(`SELECT * FROM employee`)
    const employeeList = employee.map(employeeInfo => {
        return {
            name: `${employeeInfo.first_name} ${employeeInfo.last_name}`,
            value: employeeInfo.id
        }
    })
    inquirer.prompt({
        type: "list",
        name: "employee",
        message: "Select an employee to delete",
        choices: employeeList
    }).then((answer) => {
        connection.query(`DELETE FROM employee WHERE id = ?`, answer.employee)
        console.log(`Employee has been deleted!`)
        return setTimeout(userPrompt, 1500)
    })
}

start();