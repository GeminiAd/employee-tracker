const Query = require('./Query');

/* Represents a query to the database for a list of departments with no roles that reference it. */
/* I was going to use this to remove a department, but I didn't have enough time to implement that feature. */
class ViewAllRemovableDepartments extends Query {
    static #viewAllRemovableDepartmentsQuery =
        `SELECT * from department WHERE department.id NOT IN (SELECT department_id FROM role)`;

    constructor(db) {
        super(db, ViewAllRemovableDepartments.#viewAllRemovableDepartmentsQuery);
    }
}

module.exports = ViewAllRemovableDepartments;