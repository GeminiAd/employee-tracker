const Query = require('./Query');

/* Defines a query to the database to view all employees with roles belonging to a certain department */
class ViewEmployeesByDepartmentQuery extends Query {
    static #viewEmployeesByDepartmentQuery =
        `SELECT t1.id, t1.first_name, t1.last_name, role.title, department.name AS department, role.salary, CASE WHEN t1.manager_id IS NOT NULL THEN CONCAT(t2.first_name, " ", t2.last_name) ELSE 'None' END AS manager
        FROM employee t1
        INNER JOIN role ON t1.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        LEFT JOIN employee t2 ON t1.manager_id = t2.id
        WHERE department.id = ?`;

    constructor(db, departmentId) {
        super(db, ViewEmployeesByDepartmentQuery.#viewEmployeesByDepartmentQuery, departmentId);
    }
}

module.exports = ViewEmployeesByDepartmentQuery;