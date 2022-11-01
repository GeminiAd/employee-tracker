const Query = require('./Query');

/* Defines a query to the database to add a new role. */
class AddRoleQuery extends Query {
    static #AddRoleQuery =
        `INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?)`;

    constructor(db, title, salary, departmentId) {
        super(db, AddRoleQuery.#AddRoleQuery, title, salary, departmentId);
    }
}

module.exports = AddRoleQuery;