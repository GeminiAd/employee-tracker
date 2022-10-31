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

function validateDepartment(answer) {
    if (!answer.trim().length) {
        return "ERROR: Expected name to be a non-empty string";
    } else {
        return true;
    }
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