const Menu = require('./Menu');
const ViewAllEmployeesQuery = require('../query/ViewAllEmployeesQuery');
const ViewAllRolesQuery = require('../query/ViewAllRolesQuery');
const UpdateEmployeeRoleQuery = require('../query/UpdateEmployeeRoleQuery');

/* The Menu that handles updating an employee role. */
class UpdateEmployeeRoleMenu extends Menu {
    /* Constructor. We create the questions as we are passing them in as they need a reference to the database to get a list of choices. */
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

    /* 
     *  Does something with the answers from the prompt. 
     *  After the prompt we must:
     *      1. Get the roleID of the role that was selected.
     *      2. Get the employeeID of the employee that was updated.
     *      3. Send a query to update the employee's role.
     *      4. Write the update to seeds.sql.
     *      5. Go back to the main menu.
     */
    doSomethingWith(answers) {
        /* 1. Get the roleID of the role that was selected. */
        const roleID = this.#getRoleID(answers.roles, answers.role);
        /* 2. Get the employeeID of the employee that was updated. */
        const employeeID = this.#getEmployeeID(answers.employees, answers.employee);

        /* 3. Send a query to update the employee's role. */
        new UpdateEmployeeRoleQuery(this.db, roleID, employeeID).query()
            .then(([rows, fields]) => {
                /* 4. Write the update to seeds.sql. */
                this.#updateEmployeeSeed(answers.employees.length, roleID, employeeID);
                /* 5. Go back to the main menu. */
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    /* Returns the ID of the role when given the list of roles and the name of the role. */
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

    /*
     *  Updates seeds.sql to reflect the updated employee role when given the number of employees, the updated roleID,
     *  and the employeeID.
     *  I use the employee ID and the number of employees to determine how far back the employee's INSERT statement is
     *  from the end of the file.
     *  I then parse out the first name, last name, and employee ID of the updated employee in a really
     *  messy way, then join those back together with the new roleID, join the insert statement back together, 
     *  and write it to file.
     *  This is where having a changes.sql would come in handy, as I would just write the update statement at the end of the file.
     */
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

    /* Returns the choices of employee to update the role for that the user has. */
    /* Wrapped in a function to capture the reference to the db. */
    static #employeeChoices(db) {
        /* Returns a function with the first parameter as the answers hash, as inquirer requires for a choices function. */
        return (answers) => {
            /* The choices function can be asyncronous, it just has to return a promise, as specified by inquirer. */
            return new Promise((resolve, reject) => {
                /* Query the database for a list of all employees. */
                new ViewAllEmployeesQuery(db).query()
                    .then(([rows, fields]) => {
                        /* Make an array containing each employee's first and last name joined. */
                        const employeeChoices = rows.map((element => (element.first_name + " " + element.last_name)));

                        /* Save information about the employees to get the ID of the employee updated later. */
                        answers.employees = rows;

                        /* Return the choices for updating an employee to the inquirer prompt. */
                        resolve(employeeChoices);
                    })
            });
        }
    }

    /* Returns the choices of role to update the employee with that the user has. */
    /* Wrapped in a function to capture the reference to the db. */
    static #employeeRoleChoices(db) {
        /* Returns a function with the first parameter as the answers hash, as inquirer requires for a choices function. */
        return (answers) => {
            /* The choices function can be asyncronous, it just has to return a promise, as specified by inquirer. */
            return new Promise((resolve, reject) => {
                /* Query the database for a list of all roles. */
                new ViewAllRolesQuery(db).query()
                    .then(([rows, fields]) => {
                        /* Make a list with the role titles from the list of roles returned by the db. */
                        const employeeRoleChoices = rows.map((element => element.title));

                        /* Save the list of roles later to get the role ID from. */
                        answers.roles = rows;

                        /* Send back the list of role titles to the inquirer prompt as choices. */
                        resolve(employeeRoleChoices);
                    })
            });
        }
    }
}

module.exports = UpdateEmployeeRoleMenu;