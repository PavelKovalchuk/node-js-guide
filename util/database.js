const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
let _db;

/**
 * File for connecting DB for raw MongoDb
 */

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb+srv://pavel:12081988@node-guide-gnpw9.mongodb.net/shop?retryWrites=true&w=majority")
    .then((client) => {
      console.log("Connected mongodb");
      _db = client.db();
      callback(client);
    })
    .catch((error) => {
      console.error("Error in connecting mongodb: ", error);
      throw error;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
