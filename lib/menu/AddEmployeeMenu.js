const Menu = require('./Menu');
const ViewAllRolesQuery = require('../query/ViewAllRolesQuery');
const ViewAllEmployeesQuery = require('../query/ViewAllEmployeesQuery');
const AddEmployeeQuery = require('../query/AddEmployeeQuery');

/* The prompt to add an employee */
class AddEmployeeMenu extends Menu {

    /* 
     *  Constructor. Note that I can't use a static list to define the questions, as I need a reference to the database
     *  in order to query the database for role and manager options. Thus, the earliest I can define it is in the constructor,
     *  when we first get that db reference.
     */
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

    /*
     *  Does something with the answers. In this specific Menu we must:
     *      1. Get the roleID for the role selected for this employee.
     *      2. Get the managerID for the manager selected for this employee.
     *      3. Send a query to the database to add the employee.
     *      4. Print out that we've succesfully added the employee.
     *      5. Write the new employee to the seeds.sql file.
     *      6. Go back to the main menu.
     */
    doSomethingWith(answers) {
        /* 1. Get the roleID for the role selected for this employee. */
        const roleID = this.#getRoleID(answers.roles, answers.role);
        /* 2. Get the managerID for the manager selected for this employee. */
        const managerID = this.#getManagerID(answers.employees, answers.manager);

        /* 3. Send a query to the database to add the employee. */
        new AddEmployeeQuery(this.db, answers.firstName, answers.lastName, roleID, managerID).query()
            .then(([rows, fields]) => {
                /* 4. Print out that we've succesfully added the employee. */
                console.log("Added employee " + answers.firstName + " " + answers.lastName + " to the database.");
                /* 5. Write the new employee to the seeds.sql file. */
                this.#addEmployeeSeed(answers.firstName, answers.lastName, roleID, managerID);
                /* 6. Go back to the main menu. */
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    /*
     *  Adds the new employee INSERT statement into seeds.sql. To add a new employee we must:
     *      1. Read in seeds.sql.
     *      2. Split seeds.sql into lines.
     *      3. Add the new employee INSERT statement as the last line, as employees are added last.
     *      4. Join the lines together and write to file.
     */
    #addEmployeeSeed(firstName, lastName, roleID, managerID) {
        /* 1. Read in seeds.sql. */
        this.readSeedData()
            .then((data) => {
                /* 2. Split seeds.sql into lines. */
                const lines = data.split("\n");
                /* 3. Add the new employee INSERT statement as the last line, as employees are added last. */
                lines.push(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE ("${firstName}", "${lastName}", ${roleID}, ${managerID});`);
                /* 4. Join the lines together and write to file. */
                this.writeSeedData(lines.join("\n"));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    /*
     *  Gets the role ID for the choice of role the user selected in the prompt, when given the list of roles returned
     *  by the database and the role name selected.
     * 
     *  I could have sent a query to the db get this information, but I feel like I already have save that information,
     *  and I don't really want to deal with any more asyncronous functions, so I'm just going to get it the old
     *  fashioned way and not feel bad about it.
     */
    #getRoleID(roles, roleName) {
        for (const role of roles) {
            if (role.title === roleName) {
                return role.id;
            }
        }
    }

    /*
     *  Returns the ID of the employee when given the employee list returned by the database and the manager name, 
     *  or null if managerName is None.
     *  
     *  I could have sent a query to get that information, but I feel like I already save that information,
     *  and I don't really want to deal with any more asyncronous functions, so I'm just going to get it the old
     *  fashioned way and not feel bad about it.
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

    /*  
     *  Function to return a function that gets the choices for manager.
     *  The function to generate choices for the inquirer prompt is wrapped in this function to capture the 
     *  reference to the db to use it to query.
     */
    static #managerChoices(db) {
        /* The function to generate a choices array for an inquirer prompt takes the answers array as the first argument. */
        return (answers) => {
            /* The choices function can be asyncronous, but it has to return a promise. */
            return new Promise((resolve, reject) => {
                /* Query for a list of all the employees. */
                new ViewAllEmployeesQuery(db).query()
                    .then(([rows, fields]) => {
                        /* Make a list of all employee's names, add "None" to the beginning. */
                        const managerChoices = rows.map((element => (element.first_name + " " + element.last_name)));
                        managerChoices.unshift("None");

                        /* Save this information to get the manager ID later. */
                        answers.employees = rows;

                        /* Return the list of choices for manager to the prompt. */
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

    /* Validates the input employee names. */
    static #validateName(answer) {
        if (!answer.trim().length) {
            return "ERROR: Expected name to be a non-empty string";
        } else {
            return true;
        }
    }
}

module.exports = AddEmployeeMenu;