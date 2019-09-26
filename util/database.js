const mysql = require("mysql2");

/**
 * Rather than creating and managing connections one-by-one, this module also provides built-in connection pooling.
 * This is a shortcut for the pool.getConnection() -> connection.query() -> connection.release() code flow.
 * Using pool.getConnection() is useful to share connection state for subsequent queries. This is because two calls to pool.query() may use two different connections and run in parallel.
 */
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node_guide",
  password: "12081988",
});

module.exports = pool.promise();
