/* Required NPM packages for this assignment. */
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

/* Adds support for importing .sql files into the database. */
const Importer = require('mysql-import');

const printSplashPage = require("./utils/printSplashPage");
const MainMenu = require('./lib/MainMenu');

/* Database parameters */
const host = 'localhost';
const user = 'root';
const password = 'password';
const database = 'employees_db';

/* This object maps the main menu options to the functions to handle those options. */
const mainMenuMap = {
    "View All Employees": viewAllEmployees,
    "View All Departments": viewAllDepartments,
    "View All Roles": viewAllRoles,
    "Add Department": addDepartment,
    "Quit": quit
};

const mainMenuQuestions = [{
    type: "list",
    name: "mainMenuSelection",
    message: "What would you like to do?",
    choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit"
    ],
    loop: false
}];

const addDepartmentQuestions = [{
    type: "input",
    name: "name",
    message: "What is the name of the department?",
    validate: validateDepartment
}];

/* Prompts the user for the name of the department, then attempts to add the department to the database. */
function addDepartment() {
    addDepartmentPrompt();
}

function displayTable(data) {
    console.log();
    console.table(data);
}

function addDepartmentPrompt() {
    inquirer
        .prompt(addDepartmentQuestions)
        .then((answers) => {
            console.log(answers);
        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else went wrong
            }
        });
}

function promptMainMenu() {
    inquirer
        .prompt(mainMenuQuestions)
        .then((answers) => {
            mainMenuMap[answers.mainMenuSelection]();
        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else went wrong
            }
        });
}

/*
 *  Queries the database for all department information.
 */
function queryAllDepartments() {
    return db.promise().query(
        `SELECT * FROM department ORDER BY id`
    );
}

/*
 *  Queries the database for all employee information.
 */
function queryAllEmployees() {
    return db.promise().query(
        `SELECT t1.id, t1.first_name, t1.last_name, role.title, department.name AS department, role.salary, CASE WHEN t1.manager_id IS NOT NULL THEN CONCAT(t2.first_name, " ", t2.last_name) ELSE 'None' END AS manager
        FROM employee t1
        INNER JOIN role ON t1.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        LEFT JOIN employee t2 ON t1.manager_id = t2.id`
    );
}

/*
 *  Queries the database for information about all the roles.
 */
function queryAllRoles() {
    return db.promise().query(
        `SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id`
    );
}

function quit() {
    db.end();
}

function validateDepartment(answer) {
    if (!answer.trim().length) {
        return "ERROR: Expected name to be a non-empty string";
    } else {
        return true;
    }
}

/*
 *  Handles when the user selects "View all Roles" option.
 */
async function viewAllDepartments() {
    const [rows, fields] = await queryAllDepartments();
    displayTable(rows);
    promptMainMenu();
}

/*
 *  Handles when the user selects the "View All Employees" option.
 */
async function viewAllEmployees() {
    const [rows, fields] = await queryAllEmployees();
    displayTable(rows);
    promptMainMenu();
}

/*
 *  Handles when the user selects the "View All Roles" option.
 */
async function viewAllRoles() {
    const [rows, fields] = await queryAllRoles();
    displayTable(rows);
    promptMainMenu();
}

/* Interface for the package that imports .sql files into the database. */
const importer = new Importer({ host, user, password, database });

/* Connect to the database. */
const db = mysql.createConnection(
    {
        host: host,
        user: user,
        password: password,
        database: database
    },
    console.log('Connected to the local database.')
);

const mainMenu = new MainMenu(db);

/* Import schema.sql and seeds.sql into the database. */
importer.import('./db/schema.sql', './db/seeds.sql').then(() => {
    var files_imported = importer.getImported();
    console.log(`${files_imported.length} SQL file(s) imported.`);

    printSplashPage();
    mainMenu.prompt();
}).catch(err => {
    console.error(err);
});

/*
db.query(
    'SELECT * FROM `employee`',
    function (err, results, fields) {
        console.log(results); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
    }
);
*/

//db.end();