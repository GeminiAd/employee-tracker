const Menu = require('./Menu');
const ViewAllDepartmentsQuery = require('../query/ViewAllDepartmentsQuery');
const ViewAllEmployeesByDepartmentQuery = require('../query/ViewEmployeesByDepartmentQuery');

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

    doSomethingWith(answers) {
        //super.doSomethingWith(answers);

        const departmentID = this.#getDepartmentId(answers.departments, answers.department);
        //console.log(departmentID);

        new ViewAllEmployeesByDepartmentQuery(this.db, departmentID).query()
            .then(([rows, fields]) => {
                if (rows.length) {
                    this.displayTable(rows);
                } else {
                    console.log("\nThere are no employees in the " + answers.department + " department!\n");
                }

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