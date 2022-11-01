const Query = require('./Query');

class UpdateEmployeeRoleQuery extends Query {
    static #updateEmployeeRoleQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';

    constructor(db, roleID, employeeID) {
        super(db, UpdateEmployeeRoleQuery.#updateEmployeeRoleQuery, roleID, employeeID);
    }
}

module.exports = UpdateEmployeeRoleQuery;