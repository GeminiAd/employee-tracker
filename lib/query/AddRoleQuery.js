const Query = require('./Query');

class AddRoleQuery extends Query {
    static #AddRoleQuery =
        `INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?)`;

    constructor(db, title, salary, departmentId) {
        super(db, AddRoleQuery.#AddRoleQuery);

        this.title = title;
        this.salary = salary;
        this.departmentId = departmentId;
    }

    query() {
        return this.db.promise().query(this.queryString, [this.title, this.salary, this.departmentId]);
    }
}

module.exports = AddRoleQuery;