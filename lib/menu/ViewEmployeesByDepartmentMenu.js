const Menu = require('./Menu');
const ViewAllDepartmentsQuery = require('../query/ViewAllDepartmentsQuery');
const ViewAllEmployeesByDepartmentQuery = require('../query/ViewEmployeesByDepartmentQuery');

/* The menu for selecting a department and displaying the employees of that department. */
class ViewEmployeesByDepartmentMenu extends Menu {
    constructor(db, mainMenu) {
        super(db, [
            {
                type: "list",
                name: "department",
                message: "View the employees of which department?",
                choices: ViewEmployeesByDepartmentMenu.#departmentChoices(db),
                loop: false
            }
        ]);

        this.mainMenu = mainMenu;
    }

    /*
     *  Does something with the answers from the inquirer prompt.
     *  When given the answers from an inquirer prompt we must:
     *      1. Get the department ID of the department selected.
     *      2. Query the database for all employees belonging to the department.
     *      3. If there are employees, display them in a table.
     *      4. Otherwise, notify the user that there are no employees belonging to that department.
     *      5. Go back to the main menu.
     */
    doSomethingWith(answers) {
        /* 1. Get the department ID of the department selected. */
        const departmentID = this.#getDepartmentId(answers.departments, answers.department);

        /* 2. Query the database for all employees belonging to the department. */
        new ViewAllEmployeesByDepartmentQuery(this.db, departmentID).query()
            .then(([rows, fields]) => {
                if (rows.length) {
                    /* 3. If there are employees, display them in a table. */
                    this.displayTable(rows);
                } else {
                    /* 4. Otherwise, notify the user that there are no employees belonging to that department. */
                    console.log("\nThere are no employees in the " + answers.department + " department!\n");
                }

                /* 5. Go back to the main menu. */
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    /* Returns the department ID when given the results from the database query and the department. */
    #getDepartmentId(departments, departmentName) {
        for (const department of departments) {
            if (department.name === departmentName) {
                return department.id;
            }
        }
    }

    /* The choices inquirer function is wrapped in a function to capture the db reference. */
    static #departmentChoices(db) {
        /* We return a function with the first parameter as answers as specified by inquirer. */
        return (answers) => {
            /* Inquirer can do asynchronous choice functions, they just have to return a promise. */
            return new Promise((resolve, reject) => {
                /* Query a list of all departments. */
                new ViewAllDepartmentsQuery(db).query()
                    .then(([rows, fields]) => {
                        /* Save all the departments so we can get the id later. */
                        answers.departments = rows;
                        /* Return the list of choices to the inquirer prompt. */
                        resolve(rows.map((element => element.name)));
                    })
            });
        }
    }
}

module.exports = ViewEmployeesByDepartmentMenu;