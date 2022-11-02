const Query = require('./Query');

/* Queries the database to see if there exists a role with title specified. */
/* Used by the add role menu to validate the role title input as no two roles may exist with the same title. */
class ViewRoleByNameQuery extends Query {
    static #viewRoleByNameQuery = `SELECT * FROM role WHERE title = ?`;

    constructor(db, title) {
        super(db, ViewRoleByNameQuery.#viewRoleByNameQuery, title);
    }
}

module.exports = ViewRoleByNameQuery;