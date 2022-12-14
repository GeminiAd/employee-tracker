const Query = require('./Query');

/* Defines a query to the database to add an employee. */
class AddEmployeeQuery extends Query {
    static #addEmployeeQuery =
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)`;

    constructor(db, firstName, lastName, roleID, managerID) {
        super(db, AddEmployeeQuery.#addEmployeeQuery, firstName, lastName, roleID, managerID);
    }
}

module.exports = AddEmployeeQuery;