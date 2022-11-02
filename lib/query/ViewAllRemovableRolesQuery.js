const Query = require('./Query');

/* Represents a query to the database to view all roles that have no employees referencing it. */
/* I was going to use this to remove a role, but I didn't have enough time to implement that feature. */
class ViewAllRemovableRolesQuery extends Query {
    static #viewAllRemovableRolesQuery =
        `SELECT * from role WHERE role.id NOT IN (SELECT role_id FROM employee)`;

    constructor(db) {
        super(db, ViewAllRemovableRolesQuery.#viewAllRemovableRolesQuery);
    }
}

module.exports = ViewAllRemovableRolesQuery;