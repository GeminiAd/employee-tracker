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

function displayTable(data) {
    console.table(data);
}

/*
 *  Handles when the user selects the "View All Employees option".
 */
async function handleViewAllEmployees() {
    //console.log("VIEWING ALL EMPLOYEES");
    const [rows, fields] = await queryAllEmployees();
    console.log("\n");
    displayTable(rows);
    promptMainMenu();
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

/*
 *  Queries the database for all employee information.
 */
function queryAllEmployees() {
    return db.promise().query(
        `SELECT t1.id, t1.first_name, t1.last_name, role.title, department.name AS department, role.salary, CASE WHEN t1.manager_id IS NOT NULL THEN CONCAT(t2.first_name, " ", t2.last_name) ELSE NULL END AS manager
        FROM employee t1
        INNER JOIN role ON t1.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        LEFT JOIN employee t2 ON t1.manager_id = t2.id`
    );
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

//db.end();