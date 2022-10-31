/* Required NPM packages for this assignment. */
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

/* Adds support for importing .sql files into the database. */
const Importer = require('mysql-import');

const printSplashPage = require("./utils/printSplashPage");
const MainMenu = require('./lib/menu/MainMenu');

/* Database parameters */
const host = 'localhost';
const user = 'root';
const password = 'password';
const database = 'employees_db';

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