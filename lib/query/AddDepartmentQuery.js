const Query = require('./Query');

/* Represents a query to the database to add a new department. */
class AddDepartmentQuery extends Query {
    static #AddDepartmentQuery =
        `INSERT INTO department (name) VALUE (?)`;

    constructor(db, departmentName) {
        super(db, AddDepartmentQuery.#AddDepartmentQuery, departmentName);
    }
}

module.exports = AddDepartmentQuery;