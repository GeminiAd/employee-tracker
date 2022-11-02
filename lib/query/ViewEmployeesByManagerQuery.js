const Query = require('./Query');

/* Defines a query to the database to view all employees under a specified manager. */
class ViewEmployeesByManagerQuery extends Query {
    static #viewEmployeesByManagerQuery =
        `SELECT t1.id, t1.first_name, t1.last_name, role.title, department.name AS department, role.salary, CASE WHEN t1.manager_id IS NOT NULL THEN CONCAT(t2.first_name, " ", t2.last_name) ELSE "None" END AS manager
        FROM employee t1
        INNER JOIN role ON t1.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        LEFT JOIN employee t2 ON t1.manager_id = t2.id
        WHERE t1.manager_id `;

    /* 
     *  I need to do extra work in the constructor to make the query string as the sql syntax for searching for NULL is 'IS NULL', whereas the
     *  syntax for searching for a non-null value is '= {value}'
     */
    constructor(db, managerID) {
        let queryString = ViewEmployeesByManagerQuery.#viewEmployeesByManagerQuery;

        if (managerID) {
            queryString += `= ?`;
        } else {
            queryString += `IS ?`;
        }

        super(db, queryString, managerID);
    }
}

module.exports = ViewEmployeesByManagerQuery;