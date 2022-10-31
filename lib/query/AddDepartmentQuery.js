const Query = require('./Query');

class AddDepartmentQuery extends Query {
    static #AddDepartmentQuery =
        `INSERT INTO department (name) VALUE (?)`;

    constructor(db, departmentName) {
        super(db, AddDepartmentQuery.#AddDepartmentQuery);

        this.departmentName = departmentName;
    }

    query() {
        return this.db.promise().query(this.queryString, this.departmentName);
    }
}

module.exports = AddDepartmentQuery;