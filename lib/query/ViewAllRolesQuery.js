const Query = require('./Query');

/* Defines a query to the database for information about all roles and their related departments. */
class ViewAllRolesQuery extends Query {
    static #viewAllRolesQuery =
        `SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id ORDER BY role.id`;

    constructor(db) {
        super(db, ViewAllRolesQuery.#viewAllRolesQuery);
    }
}

module.exports = ViewAllRolesQuery;