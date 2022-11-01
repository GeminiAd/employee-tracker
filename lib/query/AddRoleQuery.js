const Query = require('./Query');

class AddRoleQuery extends Query {
    static #AddRoleQuery =
        `INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?)`;

    constructor(db, title, salary, departmentId) {
        super(db, AddRoleQuery.#AddRoleQuery, title, salary, departmentId);
    }
}

module.exports = AddRoleQuery;