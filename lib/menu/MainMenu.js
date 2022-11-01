const Menu = require('./Menu');
const AddDepartmentMenu = require("./AddDepartmentMenu");
const ViewAllEmployeesQuery = require('../query/ViewAllEmployeesQuery');
const ViewAllRolesQuery = require('../query/ViewAllRolesQuery');
const ViewAllDepartmentsQuery = require('../query/ViewAllDepartmentsQuery');
const ViewAllRemovableDepartmentsQuery = require('../query/ViewAllRemovableDepartmentsQuery');
const ViewAllRemovableRolesQuery = require('../query/ViewAllRemovableRolesQuery');
const AddRoleMenu = require('./AddRoleMenu');
const AddEmployeeMenu = require('./AddEmployeeMenu');
const UpdateEmployeeRoleMenu = require('./UpdateEmployeeRoleMenu');
const ViewEmployeesByDepartmentMenu = require('./ViewEmployeesByDepartmentMenu');

const printSplashPage = require("../../utils/printSplashPage");

/* 
 *  The Main Menu is the, well, Main Menu of the Employee Tracker program. 
 */
class MainMenu extends Menu {
    /* 
     *  This object holds all the questions for inquirer. It's static because I need to pass it as a parameter
     *  to the super constructor (in JavaScript, you get bitched at by the compiler for referencing this before
     *  calling the parent constructor); It's private because no other class needs this information.
     
    static #mainMenuQuestions = [{
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
    }]; */

    /* 
     *  To create a new MainMenu, we need to:
     *      1. Call Menu's contructor with the db reference and the MainMenu prompt's questions to set those variables.
     *      2. Create any of the submenus that require additional prompting to add or remove data. 
     */
    constructor(db) {
        /* 1. Call Menu's contructor with the db reference and the MainMenu prompt's questions to set those variables. */
        super(db, [{
            type: "list",
            name: "mainMenuSelection",
            message: "What would you like to do?",
            choices: MainMenu.#mainMenuChoices(db),
            loop: false
        }]);

        /* 2. Create any of the submenus that require additional prompting to add or remove data.  */
        this.addDepartmentMenu = new AddDepartmentMenu(db, this);
        this.addRoleMenu = new AddRoleMenu(db, this);
        this.addEmployeeMenu = new AddEmployeeMenu(db, this);
        this.updateEmployeeRoleMenu = new UpdateEmployeeRoleMenu(db, this);
        this.viewEmployeesByDepartmentMenu = new ViewEmployeesByDepartmentMenu(db, this);
    }

    /*
     *  This function takes in the user's selection of what action to take, and does something with that
     *  information. When the user selects a "View All" option, the Main Menu can handle that request itself;
     *  If the user selects an action that requires additional prompting, it calls the appropriate Menu's
     *  .prompt() function.
     */
    doSomethingWith(answers) {
        if (answers.mainMenuSelection === "View All Employees") {
            this.#viewAllData(new ViewAllEmployeesQuery(this.db));
        } else if (answers.mainMenuSelection === "View Employees By Department") {
            this.viewEmployeesByDepartmentMenu.prompt();
        } else if (answers.mainMenuSelection === "Add Employee") {
            this.addEmployeeMenu.prompt();
        } else if (answers.mainMenuSelection === "Update Employee Role") {
            this.updateEmployeeRoleMenu.prompt();
        } else if (answers.mainMenuSelection === "View All Roles") {
            this.#viewAllData(new ViewAllRolesQuery(this.db));
        } else if (answers.mainMenuSelection === "Add Role") {
            this.addRoleMenu.prompt();
        } else if (answers.mainMenuSelection === "View All Departments") {
            this.#viewAllData(new ViewAllDepartmentsQuery(this.db));
        } else if (answers.mainMenuSelection === "Add Department") {
            this.addDepartmentMenu.prompt();
        } else if (answers.mainMenuSelection === "Quit") {
            this.quit();
        }
    }

    /* Print the splash page then start prompting on main menu start. */
    start() {
        printSplashPage();
        this.prompt();
    }

    /* User selects "Quit". */
    quit() {
        this.db.end();
        console.log("QUITTING");
    }

    /*
     *  Handles when the user selects a "View" option.
     */
    async #viewAllData(queryObj) {
        const [rows, fields] = await queryObj.query();
        this.displayTable(rows);
        this.prompt();
    }

    /*
     *  Returns the choices available to the main menu. In order to delete a department, there must be no roles referencing that department, and
     *  to delete a role, there must be no employees with that role. Thus, I have to check if there are any departments or roles available to delete
     *  before I allow that main menu option.
     */
    static #mainMenuChoices(db) {
        /* The function to generate a choices array for an inquirer prompt takes the answers array as the first argument. */
        return (answers) => {
            /* The choices function can be asyncronous, but it has to return a promise. */
            return new Promise((resolve, reject) => {
                const mainMenuChoices = [
                    "View All Employees",
                    "View Employees By Department",
                    "Add Employee",
                    "Update Employee Role",
                    "View All Roles",
                    "Add Role",
                    "View All Departments",
                    "Add Department",
                    "Quit"
                ];

                resolve(mainMenuChoices);

                /* Query if there are any departments with no roles referencing it.
                const promise1 = new ViewAllRemovableDepartmentsQuery(db).query();
                /* Query if there are any roles with no employees referencing it.
                const promise2 = new ViewAllRemovableRolesQuery(db).query();
                /* Wait for both queries to finish.
                Promise.all([promise1, promise2])
                    .then(([[departmentRows, departmentFields], [roleRows, roleFields]]) => {
                        /* If there are departments that can be removed, add that option to the list of choices.
                        if (departmentRows.length) {
                            mainMenuChoices.splice(8, 0, "Remove Department");
                        }

                        /* If there are roles that can be removed, add that option to the list of choices.
                        if (roleRows.length) {
                            mainMenuChoices.splice(6, 0, "Remove Role");
                        }

                        /* Send back the list of choices.
                        resolve(mainMenuChoices);
                    });
                */
            });
        }
    }
}

module.exports = MainMenu;