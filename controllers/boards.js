const express = require("express");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const mongoClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING);
let boardsCollection;

// initialise DB
mongoClient
  .connect()
  .then((_) => {
    const db = mongoClient.db("test");
    db.dropCollection("boards");
    boardsCollection = db.collection("boards");
    boardsCollection.insertMany([
      // board 1
      {
        kanban_title: "Express Backend Project 1",
        kanban_creator: "Yang",
        kanban_members: ["Andreina", "Eddie"],
        kanban_desc: "Use Express to build a web server",
        // each board contains multiple columns
        kanban_columns: [
          {
            column_id: 1,
            column_title: "Planning",
            // each column contains multiple cards/tasks
            cards: [
              {
                card_id: 1,
                card_title: "UI design confirmation",
                card_desc: "Design the UI for all components.",
                card_creator: "Yang",
                card_members: ["Andreina", "Eddie"],
                card_comment: [
                  {
                    comment_creator: "Yang",
                    comment_create_time: "",
                    comment_edit_time: "",
                    comment_content: "This must be completed by Friday!",
                  },
                ],
              },
            ],
          },
        ],
      },
      // board 2
      {
        kanban_title: "Express Backend Project 2",
        kanban_creator: "Andreina",
        kanban_members: ["Yang", "Eddie"],
        kanban_desc: "Use Express to build a web server",
        // each board contains multiple columns
        kanban_columns: [
          {
            column_id: 1,
            column_title: "Planning",
            // each column contains multiple cards/tasks
            cards: [
              {
                card_id: 1,
                card_title: "UI design confirmation",
                card_desc: "Design the UI for all components.",
                card_creator: "Andreina",
                card_members: ["Yang", "Eddie"],
                card_comment: [
                  {
                    comment_creator: "Andreina",
                    comment_create_time: "",
                    comment_edit_time: "",
                    comment_content: "This must be completed by Friday!",
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  })
  .catch((error) => {
    console.log(error);
  });

// enforce authentication for write operations to boards resource
router.use("*", (request, response, next) => {
  if (request.method !== "GET" && !request.session.email) {
    response
      .status(401)
      .json({ message: "must be logged in to perform this action" });
    return;
  }

  next();
});

router.all("/:id", (request, response, next) => {
  boardsCollection
    .findOne({ _id: new ObjectId(request.params.id) })
    .then((board) => {
      if (!board) {
        response
          .status(404)
          .json({ message: `board ${request.params.id} does not exist` });
      }
    });

  next();
});

// GET all boards
router.get("/", (_, response) => {
  boardsCollection
    .find()
    .toArray()
    .then((boards) => {
      response.json(boards);
    });
});

// POST board
router.post("/", (request, response) => {
  if (
    !request.body.name ||
    !request.body.description ||
    !request.body.address
  ) {
    response
      .status(400)
      .json({ message: "name, description and address are mandatory fields" });
    return;
  }
  boardsCollection.insertOne(request.body).then((_) => {
    response.json();
  });
});

// DELETE board
router.delete("/:id", (request, response) => {
  boardsCollection
    .deleteOne({ _id: new ObjectId(request.params.id) })
    .then((_) => {
      response.json();
    });
});

// PUT board
router.put("/:id", (request, response) => {
  const filter = { _id: new ObjectId(request.params.id) };
  const update = { $set: request.body };
  boardsCollection.updateOne(filter, update).then((_) => {
    response.json();
  });
});

// PATCH board
router.patch("/:id", (request, response) => {
  const filter = { _id: new ObjectId(request.params.id) };
  const update = { $set: request.body };
  boardsCollection.updateOne(filter, update).then((_) => {
    response.json();
  });
});

module.exports = router;
