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
const ViewEmployeesByManagerMenu = require('./ViewEmployeesByManagerMenu');

const printSplashPage = require("../../utils/printSplashPage");

/* 
 *  The Main Menu is the, well, Main Menu of the Employee Tracker program. 
 */
class MainMenu extends Menu {
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
        this.viewEmployeesByManagerMenu = new ViewEmployeesByManagerMenu(db, this);
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
        } else if (answers.mainMenuSelection === "View Employees By Manager") {
            this.viewEmployeesByManagerMenu.prompt();
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
     *  Handles when the user selects a "View All" option.
     */
    async #viewAllData(queryObj) {
        const [rows, fields] = await queryObj.query();
        this.displayTable(rows);
        this.prompt();
    }

    /*
     *  Returns the choices available to the main menu. I have these choices as a Promise as I had intended to add the
     *  "Remove Department" and "Remove Role" choices if there were departments with no roles assigned to it, and no 
     *  roles with employees that point to it, respectively. I didn't have time to implement those functions and
     *  provide polish to the README and input validation, so I'm just going to leave it as is.
     */
    static #mainMenuChoices(db) {
        /* The function to generate a choices array for an inquirer prompt takes the answers array as the first argument. */
        return (answers) => {
            /* The choices function can be asyncronous, but it has to return a promise. */
            return new Promise((resolve, reject) => {
                const mainMenuChoices = [
                    "View All Employees",
                    "View Employees By Department",
                    "View Employees By Manager",
                    "Add Employee",
                    "Update Employee Role",
                    "View All Roles",
                    "Add Role",
                    "View All Departments",
                    "Add Department",
                    "Quit"
                ];

                resolve(mainMenuChoices);
            });
        }
    }
}

module.exports = MainMenu;