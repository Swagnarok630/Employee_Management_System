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
            return viewDept();
            default:
        }
    })
}

function viewDept() {
    const view = connection.query(`SELECT * FROM department`)
    console.table(view)
}

start();