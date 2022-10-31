/* Represents a query to the database. Essentially just a wrapper for DB queries. */
class Query {
    constructor(db, queryString) {
        this.db = db;
        this.queryString = queryString;
    }

    query() {
        return this.db.promise().query(this.queryString);
    }
}

module.exports = Query;