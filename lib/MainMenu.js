const Menu = require('./Menu');
const ViewAllEmployeesQuery = require('./query/ViewAllEmployeesQuery');
const ViewAllRolesQuery = require('./query/ViewAllRolesQuery');
const ViewAllDepartmentsQuery = require('./query/ViewAllDepartmentsQuery');

class MainMenu extends Menu {
    /* This object holds all the questions for inquirer. */
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
    }];

    #mainMenuMap;

    constructor(db) {
        super(db, MainMenu.#mainMenuQuestions);

        /* This object maps the main menu options to the functions to handle those options. */
        this.#mainMenuMap = {
            "View All Employees": this.viewAllEmployees,
            "View All Departments": this.viewAllDepartments,
            "View All Roles": this.viewAllRoles,
            "Quit": this.quit
        };
    }

    doSomethingWith(answers) {
        if (answers.mainMenuSelection === "View All Employees") {
            this.viewAllData(new ViewAllEmployeesQuery(this.db));
        } else if (answers.mainMenuSelection === "View All Departments") {
            this.viewAllData(new ViewAllDepartmentsQuery(this.db));
        } else if (answers.mainMenuSelection === "View All Roles") {
            this.viewAllData(new ViewAllRolesQuery(this.db));
        } else if (answers.mainMenuSelection === "Quit") {
            this.quit();
        }
    }


    /*
     *  Handles when the user selects a "View all" option.
     */
    async viewAllData(queryObj) {
        const [rows, fields] = await queryObj.query();
        this.displayTable(rows);
        this.prompt();
    }

    quit() {
        this.db.end();
        console.log("QUITTING");
    }
}

module.exports = MainMenu;