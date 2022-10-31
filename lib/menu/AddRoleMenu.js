const Menu = require('./Menu');
const ViewAllDepartmentsQuery = require('../query/ViewAllDepartmentsQuery');
const AddRoleQuery = require('../query/AddRoleQuery');

class AddRoleMenu extends Menu {
    /*
    static #addRoleQuestions = [
        {
            name: "name",
            message: "What is the name of the role?",
            validate: AddRoleMenu.#validateRoleName
        },
        {
            name: "salary",
            message: "What is the salary of the role?",
            validate: AddRoleMenu.#validateRoleSalary
        }
    ]; */

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

    doSomethingWith(answers) {
        const departmentId = this.#getDepartmentId(answers.departments, answers.department);

        new AddRoleQuery(this.db, answers.title, answers.salary, departmentId).query()
            .then(([rows, fields]) => {
                this.#addRoleSeed(answers.title, answers.salary, departmentId);
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    #addRoleSeed(title, salary, departmentId) {
        this.readSeedData()
            .then((data) => {
                const lines = data.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    //console.log(lines[i], lines[i].includes('INSERT INTO department (name) VALUE'), lines[i + 1] === '');
                    if (lines[i].includes('INSERT INTO role (title, salary, department_id) VALUE') && lines[i + 1] === '') {
                        lines.splice(i + 1, 0, `INSERT INTO role (title, salary, department_id) VALUE ("${title}", ${salary}, ${departmentId});`);
                        this.writeSeedData(lines.join("\n"));
                        break;
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

    static #validateRoleName(answer) {
        if (!answer.trim().length) {
            return "ERROR: Expected name to be a non-empty string";
        } else {
            return true;
        }
    }

    static #validateRoleSalary(answer) {
        let officeNumber = Number(answer);
        if (typeof officeNumber !== "number" || isNaN(officeNumber) || officeNumber < 0 || !answer.trim().length) {
            return "ERROR: Expected role salary to be a non-negative number";
        } else {
            return true;
        }
    }

    static #departmentChoices(db) {
        return (answers) => {
            return new Promise((resolve, reject) => {
                new ViewAllDepartmentsQuery(db).query()
                    .then(([rows, fields]) => {
                        answers.departments = rows;
                        resolve(rows.map((element => element.name)));
                    })
            });
        }
    }
}

module.exports = AddRoleMenu;