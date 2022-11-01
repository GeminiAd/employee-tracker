const Query = require('./Query');

class AddEmployeeQuery extends Query {
    static #addEmployeeQuery =
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)`;

    constructor(db, ...queryParameters) {
        super(db, AddEmployeeQuery.#addEmployeeQuery);

        this.queryParameters = queryParameters;
    }

    query() {
        return this.db.promise().query(this.queryString, this.queryParameters);
    }
}

module.exports = AddEmployeeQuery;