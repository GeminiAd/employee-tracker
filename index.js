/* Required NPM packages for this assignment. */
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

/* Adds support for importing .sql files into the database. */
const Importer = require('mysql-import');

const printSplashPage = require("./utils/printSplashPage");

/* Database parameters */
const host = 'localhost';
const user = 'root';
const password = 'password';
const database = 'employees_db';

const mainMenuQuestions = [{
    type: "list",
    name: "menuSelection",
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

/*
 *  Handles when the user selects the "View All Employees option".
 */
function handleViewAllEmployees() {
    console.log("VIEWING ALL EMPLOYEES");
}

function promptMainMenu() {
    inquirer
        .prompt(mainMenuQuestions)
        .then((answers) => {
            if (answers.menuSelection === "View All Employees") {
                handleViewAllEmployees();
            }
        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else went wrong
            }
        });
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

/* Import schema.sql and seeds.sql into the database. */
importer.import('./db/schema.sql', './db/seeds.sql').then(() => {
    var files_imported = importer.getImported();
    console.log(`${files_imported.length} SQL file(s) imported.`);

    printSplashPage();
    promptMainMenu();
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

db.end();