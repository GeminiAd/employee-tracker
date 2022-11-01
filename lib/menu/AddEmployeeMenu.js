const Menu = require('./Menu');
const ViewAllRolesQuery = require('../query/ViewAllRolesQuery');
const ViewAllEmployeesQuery = require('../query/ViewAllEmployeesQuery');
const AddEmployeeQuery = require('../query/AddEmployeeQuery');

class AddEmployeeMenu extends Menu {
    constructor(db, mainMenu) {
        super(db, [
            {
                name: "firstName",
                message: "What is the employee's first name?",
                validate: AddEmployeeMenu.#validateName
            },
            {
                name: "lastName",
                message: "What is the employee's last name?",
                validate: AddEmployeeMenu.#validateName
            },
            {
                type: "list",
                name: "role",
                choices: AddEmployeeMenu.#roleChoices(db),
                loop: false
            },
            {
                type: "list",
                name: "manager",
                choices: AddEmployeeMenu.#managerChoices(db),
                loop: false
            }
        ]);

        this.mainMenu = mainMenu;
    }

    doSomethingWith(answers) {
        const roleID = this.#getRoleID(answers.roles, answers.role);
        const managerID = this.#getManagerID(answers.employees, answers.manager);

        new AddEmployeeQuery(this.db, answers.firstName, answers.lastName, roleID, managerID).query()
            .then(([rows, fields]) => {
                this.#addEmployeeSeed(answers.firstName, answers.lastName, roleID, managerID);
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    #addEmployeeSeed(firstName, lastName, roleID, managerID) {
        this.readSeedData()
            .then((data) => {
                const lines = data.split("\n");
                lines.push(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE ("${firstName}", "${lastName}", ${roleID}, ${managerID});`);
                this.writeSeedData(lines.join("\n"));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    #getRoleID(roles, roleName) {
        for (const role of roles) {
            if (role.title === roleName) {
                return role.id;
            }
        }
    }

    /*
     *  Returns the ID of the employee when given the employee list returned by the database and the manager name, 
     *  or null if managerName is None
     */
    #getManagerID(employees, managerName) {
        if (managerName === "None") {
            return null;
        } else {
            const [managerFirstName, managerLastName] = managerName.split(" ");
            for (const employee of employees) {
                if (employee.first_name === managerFirstName && employee.last_name === managerLastName) {
                    return employee.id;
                }
            }
        }
    }

    static #managerChoices(db) {
        return (answers) => {
            return new Promise((resolve, reject) => {
                new ViewAllEmployeesQuery(db).query()
                    .then(([rows, fields]) => {
                        const managerChoices = rows.map((element => (element.first_name + " " + element.last_name)));
                        managerChoices.unshift("None");

                        answers.employees = rows;

                        resolve(managerChoices);
                    })
            });
        }
    }

    /*
     *  Returns all the choices the user has when selecting a role for an employee.
     *  This function:
     *      - Is static since it needs to be referenced before I call the superconstructor;
     *      - Is private because only this class needs this function;
     *      - Wraps the function to return choices in another function because I have to capture the reference to the database;
     *      - Returns a function with answers as a parameter as that is how a function to return choices is specified in inquirer;
     *      - That function in turn returns a promise, as that is how asynchronous choice functions can be defined and invoked in inquirer.
     */
    static #roleChoices(db) {
        return (answers) => {
            return new Promise((resolve, reject) => {
                new ViewAllRolesQuery(db).query()
                    .then(([rows, fields]) => {
                        answers.roles = rows;
                        resolve(rows.map((element => element.title)));
                    })
            });
        }
    }

    static #validateName(answer) {
        if (!answer.trim().length) {
            return "ERROR: Expected name to be a non-empty string";
        } else {
            return true;
        }
    }
}

module.exports = AddEmployeeMenu;