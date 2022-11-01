/* Represents a query to the database. Essentially just a wrapper for DB queries. */
class Query {
    constructor(db, queryString, ...queryParams) {
        this.db = db;
        this.queryString = queryString;
        this.queryParams = queryParams;
    }

    query() {
        if (this.queryParams.length === 0) {
            return this.db.promise().query(this.queryString);
        } else {
            return this.db.promise().query(this.queryString, this.queryParams);
        }
    }
}

module.exports = Query;