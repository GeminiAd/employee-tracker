const Menu = require('./Menu');
const ViewAllEmployeesQuery = require('../query/ViewAllEmployeesQuery');
const ViewAllRolesQuery = require('../query/ViewAllRolesQuery');
const UpdateEmployeeRoleQuery = require('../query/UpdateEmployeeRoleQuery');

class UpdateEmployeeRoleMenu extends Menu {
    constructor(db, mainMenu) {
        super(db, [
            {
                type: "list",
                name: "employee",
                message: "Which employee's role do you want to update?",
                choices: UpdateEmployeeRoleMenu.#employeeChoices(db),
                loop: false
            },
            {
                type: "list",
                name: "role",
                message: "Which role do you want to assign the selected employee?",
                choices: UpdateEmployeeRoleMenu.#employeeRoleChoices(db),
                loop: false
            }
        ]);

        this.mainMenu = mainMenu;
    }

    doSomethingWith(answers) {
        const roleID = this.#getRoleID(answers.roles, answers.role);
        const employeeID = this.#getEmployeeID(answers.employees, answers.employee);
        const [firstName, lastName] = answers.employee.split(" ");

        new UpdateEmployeeRoleQuery(this.db, roleID, employeeID).query()
            .then(([rows, fields]) => {
                this.#updateEmployeeSeed(answers.employees.length, roleID, employeeID);
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    #getRoleID(roles, roleName) {
        for (const role of roles) {
            if (role.title === roleName) {
                return role.id;
            }
        }
    }

    /*
     *  Returns the ID of the employee when given the employee list returned by the database and the employee name.
     */
    #getEmployeeID(employees, employeeName) {
        const [employeeFirstName, employeeLastName] = employeeName.split(" ");
        for (const employee of employees) {
            if (employee.first_name === employeeFirstName && employee.last_name === employeeLastName) {
                return employee.id;
            }
        }
    }

    #updateEmployeeSeed(numEmployees, roleID, employeeID) {
        this.readSeedData()
            .then((data) => {
                const lines = data.split("\n");
                const lineToUpdate = lines[(lines.length - 1) - (numEmployees - employeeID)];
                const [insert, values] = lineToUpdate.split(" VALUE ");
                const params = values.split(", ");
                params[2] = roleID.toString();
                const newValues = params.join(", ");
                lines[(lines.length - 1) - (numEmployees - employeeID)] = [insert, newValues].join(" VALUE ");
                this.writeSeedData(lines.join("\n"));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static #employeeChoices(db) {
        return (answers) => {
            return new Promise((resolve, reject) => {
                new ViewAllEmployeesQuery(db).query()
                    .then(([rows, fields]) => {
                        const employeeChoices = rows.map((element => (element.first_name + " " + element.last_name)));

                        answers.employees = rows;

                        resolve(employeeChoices);
                    })
            });
        }
    }

    static #employeeRoleChoices(db) {
        return (answers) => {
            return new Promise((resolve, reject) => {
                new ViewAllRolesQuery(db).query()
                    .then(([rows, fields]) => {
                        const employeeRoleChoices = rows.map((element => element.title));

                        answers.roles = rows;

                        resolve(employeeRoleChoices);
                    })
            });
        }
    }
}

module.exports = UpdateEmployeeRoleMenu;