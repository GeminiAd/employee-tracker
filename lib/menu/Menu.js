const inquirer = require('inquirer');
const cTable = require('console.table');
const fs = require('fs');

/*
 *  Things are getting too messy in my index.js. This class is my attempt to abstract what I'm doing a bit and
 *  clean up my code. Each Menu Object represents an abstraction of a menu in the employee tracker.
 */
class Menu {
    /* Each Menu Object needs a db reference to query to and a list of questions to feed into the inquirer prompt. */
    constructor(db, questions) {
        this.questions = questions;
        this.db = db;
    }

    /* 
     *  Each Menu will prompt the user for input using inquirer using the db reference and questions
     *  passed to the constructor, then do something with the answers.
     */
    prompt() {
        inquirer
            .prompt(this.questions)
            .then((answers) => {
                /* doSomethingWith(answers) is called automatically in every Menu after the prompt is done. */
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

    /* 
     *  The default action is to display the answers for debugging purposes before I define each Menu subclass's doSomethingWith function.
     *  Each Menu Object will do something different with the answers, so doSomethingWith() will be defined for each child
     *  of Menu differently.
     */
    doSomethingWith(answers) {
        console.log(answers);
    }

    /*
     *  The Menus for adding or removing or updating data will have to alter the .sql files in some way to record the
     *  change so that the change persists between sessions. I thought about having a file called "changes.sql" that
     *  records the changes made, but that comes with one flaw: if you keep adding and removing the same bit of data,
     *  changes.sql can grow indefinitely. Instead, I chose to alter the seeds.sql file every time a change is made,
     *  so this helper function does that work. Altering the seed file instead of recording the change is a lot harder,
     *  but both methods come with benefits and flaws, so I'll stick with it.
     */
    readSeedData() {
        return new Promise((resolve, reject) => {
            fs.readFile('./db/seeds.sql', 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /*
     *  Writes the updated data to the seeds.sql file. Any Menu that alters the data in any way needs this function,
     *  hence why it is defined in the Menu class.
     */
    writeSeedData(data) {
        fs.writeFile('./db/seeds.sql', data, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}

module.exports = Menu;