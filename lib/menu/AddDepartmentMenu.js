const Menu = require('./Menu');
const AddDepartmentQuery = require('../query/AddDepartmentQuery');

class AddDepartmentMenu extends Menu {
    static #addDepartmentQuestions = [{
        type: "input",
        name: "name",
        message: "What is the name of the department?",
        validate: AddDepartmentMenu.#validateDepartment
    }];

    constructor(db, mainMenu) {
        super(db, AddDepartmentMenu.#addDepartmentQuestions);

        this.mainMenu = mainMenu;
    }

    doSomethingWith(answers) {
        console.log(answers);
        new AddDepartmentQuery(this.db, answers.name).query()
            .then(([rows, fields]) => {
                this.#addDepartmentSeed(answers.name);
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    #addDepartmentSeed(name) {
        this.readSeedData()
            .then((data) => {
                const lines = data.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    //console.log(lines[i], lines[i].includes('INSERT INTO department (name) VALUE'), lines[i + 1] === '');
                    if (lines[i].includes('INSERT INTO department (name) VALUE') && lines[i + 1] === '') {
                        lines.splice(i + 1, 0, `INSERT INTO department (name) VALUE ("${name}");`);
                        this.writeSeedData(lines.join("\n"));
                        break;
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static #validateDepartment(answer) {
        if (!answer.trim().length) {
            return "ERROR: Expected name to be a non-empty string";
        } else {
            return true;
        }
    }
}

module.exports = AddDepartmentMenu;