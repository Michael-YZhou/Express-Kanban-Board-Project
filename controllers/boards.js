const express = require("express");
const arrayMove = require("../helper/boards.helper.js");
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
        column_id: 2,
        card_id: 2,
        // each board contains multiple columns
        kanban_columns: [
          {
            column_id: 0,
            column_title: "Planning",
            // each column contains multiple cards/tasks
            cards: [
              {
                card_id: 0,
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
          {
            column_id: 1,
            column_title: "In-progress",
            // each column contains multiple cards/tasks
            cards: [
              {
                card_id: 1,
                card_title: "component/board",
                card_desc: "code the component that renders the board.",
                card_creator: "Yang",
                card_members: ["Andreina", "Eddie"],
                card_comment: [
                  {
                    comment_creator: "Yang",
                    comment_create_time: "",
                    comment_edit_time: "",
                    comment_content: "This is one of the MVP features.",
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
      //board 3
      {
        kanban_title: "Express Backend Project 2",
        kanban_creator: "Eddie",
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
  if (request.method !== "GET" && !request.session.name) {
    response
      .status(401)
      .json({ message: "must be logged in to perform this action" });
    return;
  }

  next();
});

// Board handling API
router.all("/:boardId", (request, response, next) => {
  boardsCollection
    .findOne({ _id: new ObjectId(request.params.boardId) })
    .then((board) => {
      if (!board) {
        response
          .status(404)
          .json({ message: `board ${request.params.boardId} does not exist` });
      }
    })
    .catch((err) => console.error(err));

  next();
});

// GET all boards
router.get("/", (request, response) => {
  console.log(request.session.name);

  boardsCollection
    .find({ kanban_creator: request.session.name })
    .toArray()
    .then((boards) => {
      response.json(boards);
    })
    .catch((err) => console.error(err));
});

// POST board
router.post("/", (request, response) => {
  if (
    !request.body.kanban_title ||
    !request.body.kanban_desc ||
    !request.body.kanban_creator
  ) {
    response
      .status(400)
      .json({ message: "title and description are mandatory fields" });
    return;
  }
  boardsCollection
    .insertOne(request.body)
    .then((_) => {
      response.json();
    })
    .catch((err) => console.error(err));
});

// retrieve a given board from database
router.get("/:boardId", (request, response) => {
  boardsCollection
    .findOne({ _id: new ObjectId(request.params.boardId) })
    .then((board) => {
      response.json(board);
    })
    .catch((err) => console.error(err));
});

// DELETE board
router.delete("/:boardId", (request, response) => {
  boardsCollection
    .deleteOne({ _id: new ObjectId(request.params.boardId) })
    .then((_) => {
      response.json();
    })
    .catch((err) => console.error(err));
});

// PUT board
router.put("/:boardId", (request, response) => {
  const filter = { _id: new ObjectId(request.params.boardId) };
  const update = { $set: request.body };
  boardsCollection
    .updateOne(filter, update)
    .then((_) => {
      response.json();
    })
    .catch((err) => console.error(err));
});

// PATCH board
router.patch("/:boardId", (request, response) => {
  const filter = { _id: new ObjectId(request.params.boardId) };
  const update = { $set: request.body };
  boardsCollection
    .updateOne(filter, update)
    .then((_) => {
      response.json();
    })
    .catch((err) => console.error(err));
});

/******************************** columns apis ******************************* */
// Add a new column
// takes the board ID from param, take column title from request body {"title": string}
router.put("/:boardId/columns", (request, response) => {
  // retrieve the specific board which the new column is added to using board id
  boardsCollection
    .findOne({
      _id: new ObjectId(request.params.boardId),
    })
    .then((board) => {
      console.log(board);
      // add a new column to the json data
      board.kanban_columns.push({
        column_id: board.column_id,
        column_title: request.body.title,
        cards: [],
      });
      // update the column id tracker
      board.column_id += 1;
      console.log(board);
      // store the updated json data in database
      const filter = { _id: new ObjectId(request.params.boardId) };
      const update = { $set: board };
      boardsCollection.updateOne(filter, update).then((_) => {
        response.json({ message: "a new column has been added to the board" });
      });
    })
    .catch((err) => console.error(err));
});

// Delete a column (takes the board ID and the column ID from param)
router.delete("/:boardId/columns/:columnId", (request, response) => {
  boardsCollection
    .findOne({ _id: new ObjectId(request.params.boardId) })
    .then((board) => {
      const indexToRemove = request.params.columnId - 1; // index of the col = position - 1
      console.log(board);
      // remove the element at the position
      board.kanban_columns.splice(indexToRemove, 1);
      // update the total number of columns
      board.total_columns = board.kanban_columns.length;
      // // substract 1 from the position of all elements after the removed column
      // for (let i = indexToRemove; i < board.total_columns; i++) {
      //   board.kanban_columns[i].column_position -= 1;
      // }
      console.log(board);
      // update the databese
      const filter = { _id: new ObjectId(request.params.boardId) };
      const update = { $set: board };
      boardsCollection.updateOne(filter, update).then((_) =>
        response.json({
          message: `column at position ${indexToRemove} has been deleted`,
        })
      );
    })
    .catch((err) => console.error(err));
});

// Move a column to a different position
// the destination position should be provided in request body {"toPosition": int}
router.patch("/:boardId/columns/:columnId", (request, response) => {
  // retrieve the board from the db
  boardsCollection
    .findOne({ _id: new ObjectId(request.params.boardId) })
    .then((board) => {
      const curPosition = board.kanban_columns.findIndex(
        (column) => column.column_id === request.params.columnId
      ); // index of the col = position - 1
      const newPosition = request.body.toPosition - 1;
      // move the selected column to the new index
      board.kanban_columns = arrayMove(
        board.kanban_columns,
        curPosition,
        newPosition
      );
      console.log(board);
      // update the database
      const filter = { _id: new ObjectId(request.params.boardId) };
      const update = { $set: board };
      boardsCollection.updateOne(filter, update).then((_) =>
        response.json({
          message: `Column ${curPosition} has been moved to position ${newPosition}`,
        })
      );
    })
    .catch((err) => console.error(err));
  //
});

/********************************* columns finished ******************************** */

/******************************** cards apis ******************************* */
// Add a new card
// takes the board ID from param, take column title from request body {"title": string}
router.post("/:boardId/columns/:columnId", (request, response) => {
  // retrieve the specific board which the new column is added to using board id
  console.log(request.params.boardId);
  console.log(request.params.columnId);
  boardsCollection
    .findOne({
      _id: new ObjectId(request.params.boardId),
    })
    .then((board) => {
      console.log(board);
      // filter the required column
      const column = request.params.columnId;
      console.log(request.body.data);
      // add a new column to the json data
      board.kanban_columns[column].cards.push({
        card_id: board.card_id,
        card_title: request.body.card_title,
        card_desc: request.body.card_desc,
        card_creator: request.session.name,
        card_members: [],
        cards_comment: [],
      });
      // update the column id tracker
      board.card_id += 1;
      console.log(board);
      // store the updated json data in database
      const filter = { _id: new ObjectId(request.params.boardId) };
      const update = { $set: board };
      boardsCollection.updateOne(filter, update).then((_) => {
        response.json({ message: "a new card has been added to the board" });
      });
    })
    .catch((err) => console.error(err));
});

// Delete a column (takes the board ID and the column ID from param)
router.delete(
  "/:boardId/colunms/:columnId/cards/:cardId",
  (request, response) => {
    boardsCollection
      .findOne({ _id: new ObjectId(request.params.boardId) })
      .then((board) => {
        const indexToRemove = request.params.columnId - 1; // index of the col = position - 1
        console.log(board);
        // remove the element at the position
        board.kanban_columns.card.splice(indexToRemove, 1);
        // update the total number of columns
        board.total_columns = board.kanban_columns.length;
        // // substract 1 from the position of all elements after the removed column
        // for (let i = indexToRemove; i < board.total_columns; i++) {
        //   board.kanban_columns[i].column_position -= 1;
        // }
        console.log(board);
        // update the databese
        const filter = { _id: new ObjectId(request.params.boardId) };
        const update = { $set: board };
        boardsCollection.updateOne(filter, update).then((_) =>
          response.json({
            message: `column at position ${indexToRemove} has been deleted`,
          })
        );
      })
      .catch((err) => console.error(err));
  }
);

// Move a card to a different position
// the destination position should be provided in request body {"toPosition": int}
router.patch(
  "/:boardId/columns/:columnId/cards/:cardId",
  (request, response) => {
    // retrieve the board from the db
    boardsCollection
      .findOne({ _id: new ObjectId(request.params.boardId) })
      .then((board) => {
        const curPosition = board.kanban_columns.card.findIndex(
          (card) => card.card_id === request.params.cardId
        ); // index of the col = position - 1
        const newPosition = request.body.toPosition - 1;
        // move the selected column to the new index
        board.kanban_columns.card = arrayMove(
          board.kanban_columns.card,
          curPosition,
          newPosition
        );
        console.log(board);
        // update the database
        const filter = { _id: new ObjectId(request.params.boardId) };
        const update = { $set: board };
        boardsCollection.updateOne(filter, update).then((_) =>
          response.json({
            message: `Column ${curPosition} has been moved to position ${newPosition}`,
          })
        );
      })
      .catch((err) => console.error(err));
    //
  }
);

/********************************* cards finished ******************************** */

module.exports = router;
