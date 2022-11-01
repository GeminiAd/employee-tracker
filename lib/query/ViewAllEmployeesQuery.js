const Query = require('./Query');

/* Represents a query to the database to view all employees and their related roles and departments. */
class ViewAllEmployeesQuery extends Query {
    static #viewAllEmployeesQuery =
        `SELECT t1.id, t1.first_name, t1.last_name, role.title, department.name AS department, role.salary, CASE WHEN t1.manager_id IS NOT NULL THEN CONCAT(t2.first_name, " ", t2.last_name) ELSE 'None' END AS manager
        FROM employee t1
        INNER JOIN role ON t1.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        LEFT JOIN employee t2 ON t1.manager_id = t2.id`;

    constructor(db) {
        super(db, ViewAllEmployeesQuery.#viewAllEmployeesQuery);
    }
}

module.exports = ViewAllEmployeesQuery;