const Menu = require('./Menu');
const ViewAllManagersQuery = require('../query/ViewAllManagersQuery');
const ViewEmployeesByManagerQuery = require('../query/ViewEmployeesByManagerQuery');

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

    doSomethingWith(answers) {
        const managerID = this.#getManagerID(answers.managers, answers.manager);

        new ViewEmployeesByManagerQuery(this.db, managerID).query()
            .then(([rows, fields]) => {
                this.displayTable(rows);
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    #getManagerID(managers, managerName) {
        for (const manager of managers) {
            if (manager.manager_name === managerName) {
                return manager.id;
            }
        }
    }

    static #managerChoices(db) {
        /* We return a function with the first parameter as answers as specified by inquirer. */
        return (answers) => {
            /* Inquirer can do asynchronous choice functions, they just have to return a promise. */
            return new Promise((resolve, reject) => {
                new ViewAllManagersQuery(db).query()
                    .then(([rows, fields]) => {
                        const managerChoices = rows.map((element) => element.manager_name);

                        answers.managers = rows;

                        resolve(managerChoices);
                    })
                    .catch(console.log);
            });
        }
    }
}

module.exports = ViewEmployeesByManagerMenu;