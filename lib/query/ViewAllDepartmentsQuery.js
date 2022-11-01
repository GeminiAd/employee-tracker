const Query = require('./Query');

/* Represents a query to the database to get all departments. */
class ViewAllDepartmentsQuery extends Query {
    static #viewAllDepartmentsQuery =
        `SELECT * FROM department ORDER BY id`;

    constructor(db) {
        super(db, ViewAllDepartmentsQuery.#viewAllDepartmentsQuery);
    }
}

module.exports = ViewAllDepartmentsQuery;