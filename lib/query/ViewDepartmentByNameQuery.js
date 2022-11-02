const Query = require('./Query');

/* Queries the database to see if there exists a department with the name specified. */
/* Used to validate the input for the add department menu as no two departments with the same name can exist. */
class ViewDepartmentByNameQuery extends Query {
    static #viewDepartmentByNameQuery = `SELECT * FROM department WHERE name = ?`;

    constructor(db, departmentName) {
        super(db, ViewDepartmentByNameQuery.#viewDepartmentByNameQuery, departmentName);
    }
}

module.exports = ViewDepartmentByNameQuery;