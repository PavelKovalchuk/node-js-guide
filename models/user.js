const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    const db = getDb();

    // If collection does not exist MongoDB will create it
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("--- save user success");
      })
      .catch((error) => {
        console.error("save user error", error);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({_id: new ObjectId(userId)})
      .then((user) => {
        console.log("--- findById user success");
        return user;
      })
      .catch((error) => {
        console.error("findById user error", error);
      });
  }
}

module.exports = User;
