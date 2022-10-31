const Query = require('./Query');

class ViewAllDepartmentsQuery extends Query {
    static #viewAllDepartmentsQuery =
        `SELECT * FROM department ORDER BY id`;

    constructor(db) {
        super(db, ViewAllDepartmentsQuery.#viewAllDepartmentsQuery);
    }
}

module.exports = ViewAllDepartmentsQuery;