const Menu = require('./Menu');
const ViewAllManagersQuery = require('../query/ViewAllManagersQuery');
const ViewEmployeesByManagerQuery = require('../query/ViewEmployeesByManagerQuery');

/* The menu for selecting a manager and displaying all employees with that manager. */
class ViewEmployeesByManagerMenu extends Menu {
    constructor(db, mainMenu) {
        super(db, [
            {
                type: "list",
                name: "manager",
                message: "View the employees of which manager?",
                choices: ViewEmployeesByManagerMenu.#managerChoices(db),
                loop: false
            }
        ]);

        this.mainMenu = mainMenu;
    }

    /*
     *  Does something with the answers from the inquirer prompt.
     *  When given the inquirer prompt answers we must:
     *      1. Get the manager ID of the manager selected in the prompt.
     *      2. Query the database for all employees with that manager ID as their manager_id field.
     *      3. Display those results.
     *      4. Return to the main menu.
     */
    doSomethingWith(answers) {
        /* 1. Get the manager ID of the manager selected in the prompt. */
        const managerID = this.#getManagerID(answers.managers, answers.manager);

        /* 2. Query the database for all employees with that manager ID as their manager_id field. */
        new ViewEmployeesByManagerQuery(this.db, managerID).query()
            .then(([rows, fields]) => {
                /* 3. Display those results. */
                this.displayTable(rows);
                /* 4. Return to the main menu. */
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    /* Returns the ID of the manager when given the rows returned by the database query and the manager name. */
    #getManagerID(managers, managerName) {
        for (const manager of managers) {
            if (manager.manager_name === managerName) {
                return manager.id;
            }
        }
    }

    /* Returns the choices for manager when given a database reference. */
    /* I wrapped the choices function in another function as I have to capture the reference to the db. */
    static #managerChoices(db) {
        /* We return a function with the first parameter as answers as specified by inquirer. */
        return (answers) => {
            /* Inquirer can do asynchronous choice functions, they just have to return a promise. */
            return new Promise((resolve, reject) => {
                /* Query the database for all managers. */
                new ViewAllManagersQuery(db).query()
                    .then(([rows, fields]) => {
                        /* Make a proper choices list from the raw data we get. */
                        const managerChoices = rows.map((element) => element.manager_name);

                        /* Save the raw data so we can get the manager id later. */
                        answers.managers = rows;

                        /* Return the choices for manager to the inquirer prompt. */
                        resolve(managerChoices);
                    })
                    .catch(console.log);
            });
        }
    }
}

module.exports = ViewEmployeesByManagerMenu;