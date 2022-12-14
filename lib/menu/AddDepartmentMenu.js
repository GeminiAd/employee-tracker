const Menu = require('./Menu');
const AddDepartmentQuery = require('../query/AddDepartmentQuery');
const ViewDepartmentByNameQuery = require('../query/ViewDepartmentByNameQuery');

/* The prompt to add a department. */
class AddDepartmentMenu extends Menu {

    /* Constructor. Note that we pass along the MainMenu reference as we have to go back to it when we're done. */
    constructor(db, mainMenu) {
        super(db, [{
            type: "input",
            name: "name",
            message: "What is the name of the department?",
            validate: AddDepartmentMenu.#validateDepartment
        }]);

        this.mainMenu = mainMenu;
    }

    /*
     *  After this Menu prompts the user we must:
     *      1. Send a an add department query to the database using that info.
     *      2. Add the department to the seeds.sql file.
     *      3. Go back to the main menu.
     */
    doSomethingWith(answers) {
        new AddDepartmentQuery(this.db, answers.name).query()
            .then(([rows, fields]) => {
                this.#addDepartmentSeed(answers.name);
                console.log("Added " + answers.name + " department to the database.");
                this.mainMenu.prompt();
            })
            .catch(console.log);
    }

    /*
     *  Adds a new INSERT statement into the seeds.sql file with the given department name.
     *  I'm not going to go through every step but the gist of it is:
     *      1. We read the data
     *      2. Split the data up into lines
     *      3. We find where the INSERT into department statements end, and insert a new statement there.
     *      4. Join the lines together and write to file.
     */
    #addDepartmentSeed(name) {
        /* 1. We read the data */
        this.readSeedData()
            .then((data) => {
                /* 2. Split the data up into lines */
                const lines = data.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('INSERT INTO department (name) VALUE') && lines[i + 1] === '') {
                        /* 3. We find where the INSERT into department statements end, and insert a new statement there. */
                        lines.splice(i + 1, 0, `INSERT INTO department (name) VALUE ("${name}");`);
                        /* 4. Join the lines together and write to file. */
                        this.writeSeedData(lines.join("\n"));
                        break; // Must break here or infinite loop.
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    /* Validates the department field.*/
    static #validateDepartment(answer) {
        if (!answer.trim().length) {
            return "ERROR: Expected name to be a non-empty string";
        } else {
            return true;
        }
    }
}

module.exports = AddDepartmentMenu;