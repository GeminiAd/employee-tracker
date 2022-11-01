const Query = require('./Query');

class AddDepartmentQuery extends Query {
    static #AddDepartmentQuery =
        `INSERT INTO department (name) VALUE (?)`;

    constructor(db, departmentName) {
        super(db, AddDepartmentQuery.#AddDepartmentQuery, departmentName);
    }
}

module.exports = AddDepartmentQuery;