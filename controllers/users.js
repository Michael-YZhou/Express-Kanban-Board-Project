const express = require("express");
const router = express.Router();

const { MongoClient } = require("mongodb");
const mongoClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING);
let usersCollection;

mongoClient
  .connect()
  .then((_) => {
    const db = mongoClient.db("test");
    // uncomment below to reset users collection
    // db.dropCollection("users")
    usersCollection = db.collection("users");
  })
  .catch((error) => {
    console.log(error);
  });

router.get("/", (_, response) => {
  usersCollection
    .find()
    .toArray()
    .then((users) => {
      response.json(users);
    });
});

router.post("/", (request, response) => {
  const bcrypt = require("bcrypt");
  const passwordHash = bcrypt.hashSync(
    request.body.password,
    bcrypt.genSaltSync()
  );

  if (!request.body.name || !request.body.email || !request.body.password) {
    response.status(400).json({ message: "missing mandatory fields" });
    return;
  }

  // if (request.body.password.length < 8) {
  //     response.status(400).json({ message: "password must be 8 characters or more"});
  //     return;
  // }

  usersCollection.findOne({ email: request.body.email }).then((user) => {
    if (user) {
      response.status(400).json({
        message: `user with the email ${request.body.email} already exists`,
      });
      return;
    }

    usersCollection
      .insertOne({
        name: request.body.name,
        email: request.body.email,
        passwordHash: passwordHash,
      })
      .then((_) => {
        response.json();
      });
  });
});

module.exports = router;
