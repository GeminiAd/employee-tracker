const Query = require('./Query');

class ViewAllManagersQuery extends Query {
    static #viewAllManagersQuery =
        `SELECT t2.id, CASE WHEN t1.manager_id IS NOT NULL THEN CONCAT(t2.first_name, " ", t2.last_name) ELSE "None" END AS manager_name FROM employee t1
        LEFT JOIN employee t2 ON t1.manager_id = t2.id
        GROUP BY t1.manager_id;`;

    constructor(db) {
        super(db, ViewAllManagersQuery.#viewAllManagersQuery);
    }
}

module.exports = ViewAllManagersQuery;