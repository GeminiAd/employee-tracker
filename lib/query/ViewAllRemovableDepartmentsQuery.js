const Query = require('./Query');

class ViewAllRemovableDepartments extends Query {
    static #viewAllRemovableDepartmentsQuery =
        `SELECT * from department WHERE department.id NOT IN (SELECT department_id FROM role)`;

    constructor(db) {
        super(db, ViewAllRemovableDepartments.#viewAllRemovableDepartmentsQuery);
    }
}

module.exports = ViewAllRemovableDepartments;