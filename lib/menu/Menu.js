const inquirer = require('inquirer');
const cTable = require('console.table');

/*
 *  Things are getting too messy in my index.js. This class is my attempt to abstract what I'm doing a bit and
 *  clean up my code. Each Menu Object has a .prompt() function that prompts the user for input, then it does
 *  something with that response.
 */
class Menu {
    constructor(db, questions) {
        this.questions = questions;
        this.db = db;
    }

    prompt() {
        inquirer
            .prompt(this.questions)
            .then((answers) => {
                this.doSomethingWith(answers);
            })
            .catch((error) => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                } else {
                    // Something else went wrong
                }
            });
    }

    doSomethingWith(answers) {
        console.log(answers);
    }

    displayTable(data) {
        console.log();
        console.table(data);
    }
}

module.exports = Menu;