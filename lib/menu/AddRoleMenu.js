const Menu = require('./Menu');
const ViewAllDepartmentsQuery = require('../query/ViewAllDepartmentsQuery');
const AddRoleQuery = require('../query/AddRoleQuery');

/* Menu to add a new role. */
class AddRoleMenu extends Menu {

    /* Constructor. The list of questions is not static as I need the reference to the db to generate some choices. */
    constructor(db, mainMenu) {
        super(db, [
            {
                name: "title",
                message: "What is the name of the role?",
                validate: AddRoleMenu.#validateRoleName
            },
            {
                name: "salary",
                message: "What is the salary of the role?",
                validate: AddRoleMenu.#validateRoleSalary
            },
            {
                type: "list",
                name: "department",
                message: "Which department does the role belong to?",
                choices: AddRoleMenu.#departmentChoices(db),
                loop: false
            }
        ]);

        this.mainMenu = mainMenu;
    }

    /*
     *  Does something with the answers from the inquirer prompt to add a new role.
     *  To add a new role we must:
     *      1. Get the department ID of the name of the department that was selected from the list.
     *      2. Send a query to the database to add a new role.
     *      3. Print out that we've added the role to the database.
     *      4. Add an INSERT statement into seeds.sql for this role so the change persists.
     *      5. Go back to the main menu.
     */
    doSomethingWith(answers) {
        /* 1. Get the department ID of the name of the department that was selected from the list. */
        const departmentId = this.#getDepartmentId(answers.departments, answers.department);

        /* 2. Send a query to the database to add a new role. */
        new AddRoleQuery(this.db, answers.title, answers.salary, departmentId).query()
            .then(([rows, fields]) => {
                /* 3. Print out that we've added the role to the database. */
                console.log("Added " + answers.title + " role to the database.");
                /* 4. Add an INSERT statement into seeds.sql for this role so the change persists. */
                this.#addRoleSeed(answers.title, answers.salary, departmentId);
                /* 5. Go back to the main menu. */
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    /*
     *  Adds a new INSERT statement into seeds.sql for the new role we added.
     *  We basically:
     *      1. Read the data.
     *      2. Split the data into lines.
     *      3. Find where the lines to insert roles end.
     *      4. Add a new INSERT statement there.
     *      5. Write the data to the seeds.sql file.
     */
    #addRoleSeed(title, salary, departmentId) {
        /* 1. Read the data. */
        this.readSeedData()
            .then((data) => {
                /* 2. Split the data into lines. */
                const lines = data.split("\n");
                /* 3. Find where the lines to insert roles end. */
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('INSERT INTO role (title, salary, department_id) VALUE') && lines[i + 1] === '') {
                        /* 4. Add a new INSERT statement there. */
                        lines.splice(i + 1, 0, `INSERT INTO role (title, salary, department_id) VALUE ("${title}", ${salary}, ${departmentId});`);
                        /* 5. Write the data to the seeds.sql file. */
                        this.writeSeedData(lines.join("\n"));
                        break; // Break or we infite loop as we are always at the end of the role INSERT block and keep adding statements forever.
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    /* Returns the department ID when given the results from the database query and the department. */
    #getDepartmentId(departments, departmentName) {
        for (const department of departments) {
            if (department.name === departmentName) {
                return department.id;
            }
        }
    }

    /* Validates the role name from the user input. */
    static #validateRoleName(answer) {
        if (!answer.trim().length) {
            return "ERROR: Expected name to be a non-empty string";
        } else {
            return true;
        }
    }

    /* Validates the salary from the user input. */
    static #validateRoleSalary(answer) {
        let officeNumber = Number(answer);
        if (typeof officeNumber !== "number" || isNaN(officeNumber) || officeNumber < 0 || !answer.trim().length) {
            return "ERROR: Expected role salary to be a non-negative number";
        } else {
            return true;
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

module.exports = AddRoleMenu;