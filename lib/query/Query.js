/* 
 *  Represents a query to the database. Essentially just a wrapper for DB queries to keep information about the
 *  database queries - like the query string - more modularized and hidden. 
 */
class Query {
    /* 
     *  The Query takes in a db reference to use to query later, a query string to query the database with,
     *  and potentially some query parameters if we're altering data or selecting from a table on certain
     *  conditions.
     */
    constructor(db, queryString, ...queryParams) {
        this.db = db;
        this.queryString = queryString;
        this.queryParams = queryParams;
    }

    /* 
     *  Defines how a query is called to the database so no child class has to.
     *  We return a promise so the menu can take appropriate action when the query has finished.
     *  If there are no query parameters, we call query without query parameters.
     *  If there are query parameters, we call query 
     */
    query() {
        if (this.queryParams.length === 0) {
            return this.db.promise().query(this.queryString);
        } else {
            return this.db.promise().query(this.queryString, this.queryParams);
        }
    }
}

module.exports = Query;