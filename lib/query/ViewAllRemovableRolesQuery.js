const Query = require('./Query');

class ViewAllRemovableRolesQuery extends Query {
    static #viewAllRemovableRolesQuery =
        `SELECT * from role WHERE role.id NOT IN (SELECT role_id FROM employee)`;

    constructor(db) {
        super(db, ViewAllRemovableRolesQuery.#viewAllRemovableRolesQuery);
    }
}

module.exports = ViewAllRemovableRolesQuery;