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
                this.mainMenu.prompt();
            })
            .catch(console.log);
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