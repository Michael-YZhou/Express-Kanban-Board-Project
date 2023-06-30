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
        card_id: 3,
        comment_id: 1,
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
                    comment_id: 0,
                    comment_creator: "Yang",
                    comment_create_time: "",
                    comment_edit_time: "",
                    comment_content: "This must be completed by Friday!",
                  },
                ],
              },
              {
                card_id: 2,
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
        get total_columns() {
          return this.kanban_columns.length;
        },
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

router.all("/:boardId", (request, response, next) => {
  boardsCollection
    .findOne({ _id: new ObjectId(request.params.boardId) })
    .then((board) => {
      if (!board) {
        response
          .status(404)
          .json({ message: `board ${request.params.boardId} does not exist` });
      }
    });

  next();
});

// GET all boards
router.get("/", (request, response) => {
  console.log(request.session.name);
  // response.json(request.session.name);
  boardsCollection
    .find({ kanban_creator: request.session.name })
    .toArray()
    .then((boards) => {
      response.json(boards);
    });
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
  boardsCollection.insertOne(request.body).then((_) => {
    response.json();
  });
});

// retrieve a given board from database
router.get("/:boardId", (request, response) => {
  boardsCollection
    .findOne({ _id: new ObjectId(request.params.boardId) })
    .then((board) => {
      response.json(board);
    });
});

// DELETE board
router.delete("/:boardId", (request, response) => {
  boardsCollection
    .deleteOne({ _id: new ObjectId(request.params.boardId) })
    .then((_) => {
      response.json();
    });
});

// PUT board
router.put("/:boardId", (request, response) => {
  const filter = { _id: new ObjectId(request.params.boardId) };
  const update = { $set: request.body };
  boardsCollection.updateOne(filter, update).then((_) => {
    response.json();
  });
});

// PATCH board
router.patch("/:boardId", (request, response) => {
  const filter = { _id: new ObjectId(request.params.boardId) };
  const update = { $set: request.body };
  boardsCollection.updateOne(filter, update).then((_) => {
    response.json();
  });
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
      const indexToRemove = board.kanban_columns.findIndex(
        (column) => column.column_id === request.params.columnId
      );
      console.log(board);
      // remove the element at the position
      board.kanban_columns.splice(indexToRemove, 1);
      // update the total number of columns
      board.total_columns = board.kanban_columns.length;
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

//Add cards
router.get("/:boardId/columns/:columnId/cards/:cardId", (req, res) => {
  boardsCollection
    .findOne({ _id: new ObjectId(req.params.boardId) })
    .then((board) => {
      console.log(board);
      const columnIndex = board.kanban_columns.findIndex(
        (column) => column.column_id == req.params.columnId
      ); // index of the col = position - 1
      const cardIndex = board.kanban_columns[columnIndex].cards.findIndex(
        (card) => card.card_id == req.params.cardId
      );
      res.json(board.kanban_columns[columnIndex].cards[cardIndex]);
    });
});

// Add a new card
// takes the board ID from param, take column title from request body {"title": string}
router.post("/:boardId/columns/:columnId", (request, response) => {
  // retrieve the specific board which the new column is added to using board id
  boardsCollection
    .findOne({
      _id: new ObjectId(request.params.boardId),
    })
    .then((board) => {
      // filter the required column
      const column = request.params.columnId;
      console.log(request.body.data);
      // add a new column to the json data
      board.kanban_columns[column].cards.push({
        card_id: board.card_id,
        card_title: request.body.card_title,
        card_desc: request.body.card_desc,
        card_creator: request.session.name,
        card_members: request.body.card_members,
        card_comment: request.body.card_comment,
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

//deleting card
router.delete("/:boardId/columns/:columnId/cards/:cardId", (req, res) => {
  const boardId = new ObjectId(req.params.boardId);
  const cardId = parseInt(req.params.cardId);

  boardsCollection
    .updateOne(
      { _id: boardId }, // 根据文档的 `_id` 进行匹配
      { $pull: { "kanban_columns.$[].cards": { card_id: cardId } } } // 从 `kanban_columns.cards` 数组中移除具有指定 `card_id` 的元素
    )
    .then(() => {
      res.json({ message: "Card deleted successfully" });
    })
    .catch((error) => {
      res.json({ message: "Error deleting card" });
    });
});

// a card to a different position
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

//cards description updates
// router.put("/:boardId/columns/:columnId/cards/:cardId", (request, response) => {
//   boardsCollection
//     .findOne({ _id: new ObjectId(request.params.boardId) })
//     .then((board) => {
//       console.log(board);
//       const columnIndex = board.kanban_columns.findIndex(
//         (column) => column.column_id == request.params.columnId
//       );
//       const cardIndex = board.kanban_columns[columnIndex].cards.findIndex(
//         (card) => card.card_id == request.params.cardId
//       );
//       board.kanban_columns[columnIndex].cards[cardIndex].card_desc =
//         request.body.card_desc;
//       const filter = { _id: new ObjectId(request.params.boardId) };
//       const update = { $set: board };
//       boardsCollection.updateOne(filter, update).then((_) =>
//         response.json({
//           message: `Description has been changedz`,
//         })
//       );
//     });
// });

//Change the title and description
router.put("/:boardId/columns/:columnId/cards/:cardId", (request, response) => {
  const boardId = new ObjectId(request.params.boardId);
  const columnId = parseInt(request.params.columnId);
  const cardId = parseInt(request.params.cardId);
  const { card_title, card_desc } = request.body;

  const filter = {
    _id: boardId,
    "kanban_columns.column_id": columnId,
    "kanban_columns.cards.card_id": cardId,
  };

  const update = {};

  if (card_title && !card_desc) {
    update.$set = {
      "kanban_columns.$[column].cards.$[card].card_title": card_title,
    };
  } else if (!card_title && card_desc) {
    update.$set = {
      "kanban_columns.$[column].cards.$[card].card_desc": card_desc,
    };
  } else if (card_title && card_desc) {
    update.$set = {
      "kanban_columns.$[column].cards.$[card].card_title": card_title,
      "kanban_columns.$[column].cards.$[card].card_desc": card_desc,
    };
  } else {
    response.json({ message: "No update fields provided" });
    return;
  }

  const options = {
    arrayFilters: [
      { "column.column_id": columnId },
      { "card.card_id": cardId },
    ],
  };

  boardsCollection
    .updateOne(filter, update, options)
    .then((_) => {
      response.json({
        message: "Card details have been updated",
      });
    })
    .catch((error) => {
      response.json({ message: "Error updating card details" });
    });
});

/********************************* cards finished ******************************** */

/********************************* comment finished ******************************** */
router.put(
  "/:boardId/columns/:columnId/cards/:cardId/comments/:commentId",
  (req, res) => {
    const boardId = req.params.boardId;
    const columnId = req.params.columnId;
    const cardId = req.params.cardId;
    const commentId = req.params.commentId;
    const newCommentContent = req.body.comment_content;

    // 更新数据库中的 comment_content
    boardsCollection
      .updateOne(
        {
          _id: new ObjectId(boardId),
          "kanban_columns.column_id": parseInt(columnId),
          "kanban_columns.cards.card_id": parseInt(cardId),
          "kanban_columns.cards.card_comment.comment_id": parseInt(commentId),
        },
        {
          $set: {
            "kanban_columns.$[column].cards.$[card].card_comment.$[comment].comment_content":
              newCommentContent,
          },
        },
        {
          arrayFilters: [
            { "column.column_id": parseInt(columnId) },
            { "card.card_id": parseInt(cardId) },
            { "comment.comment_id": parseInt(commentId) },
          ],
        }
      )
      .then(() => {
        res.json({ message: "Comment content updated successfully" });
      })
      .catch((error) => {
        res.json({ message: "Error updating comment content" });
      });
  }
);

router.delete(
  "/:boardId/columns/:columnId/cards/:cardId/comments/:commentId",
  (req, res) => {
    const boardId = new ObjectId(req.params.boardId);
    const columnId = parseInt(req.params.columnId);
    const cardId = parseInt(req.params.cardId);
    const commentId = parseInt(req.params.commentId);

    boardsCollection
      .updateOne(
        {
          _id: boardId,
          "kanban_columns.column_id": columnId,
          "kanban_columns.cards.card_id": cardId,
        },
        {
          $pull: {
            "kanban_columns.$.cards.$[card].card_comment": {
              comment_id: commentId,
            },
          },
        },
        { arrayFilters: [{ "card.card_id": cardId }] }
      )
      .then(() => {
        res.json({ message: "Comment deleted successfully" });
      })
      .catch((error) => {
        res.json({ message: "Error deleting comment" });
      });
  }
);

router.post(
  "/:boardId/columns/:columnId/cards/:cardId",
  (request, response) => {
    // retrieve the specific board which the new column is added to using board id
    boardsCollection
      .findOne({
        _id: new ObjectId(request.params.boardId),
      })
      .then((board) => {
        // filter the required column
        const column = request.params.columnId;
        console.log(column);
        const card = request.params.cardId;
        console.log(card);
        // add a new column to the json data
        const commentSection =
          board.kanban_columns[column].cards[card].card_comment;
        commentSection.push({
          comment_id: board.comment_id,
          comment_creator: request.session.name,
          comment_create_time: request.body.comment_create_time,
          comment_content: request.body.comment_content,
        });
        // update the column id tracker
        board.comment_id += 1;
        console.log(board);
        // store the updated json data in database
        const filter = { _id: new ObjectId(request.params.boardId) };
        const update = { $set: board };
        boardsCollection.updateOne(filter, update).then((_) => {
          response.json({ message: "a new card has been added to the board" });
        });
      })
      .catch((err) => console.error(err));
  }
);
// boardsCollection.findOne({
//   _id: new ObjectId(request.params.boardId),
// })
//   .then((board) => {
//     const columnId = parseInt(request.params.columnId);
//     const cardId = parseInt(request.params.cardId);

//     // Verify if the board and required column exist
//     if (!board || !board.kanban_columns || !Array.isArray(board.kanban_columns) || columnId < 0 || columnId >= board.kanban_columns.length) {
//       return response.status(404).json({ message: 'Board or column not found' });
//     }

//     const column = board.kanban_columns[columnId];

//     // Verify if the required card exists
//     if (!column.cards || !Array.isArray(column.cards) || cardId < 0 || cardId >= column.cards.length) {
//       return response.status(404).json({ message: 'Card not found' });
//     }

//     const card = column.cards[cardId];

//     // Verify if the card_comment property exists and is an array
//     if (!card.card_comment || !Array.isArray(card.card_comment)) {
//       return response.status(400).json({ message: 'Invalid card comment data' });
//     }

//     // Generate a new comment ID
//     const commentId = board.comment_id;

//     // Create a new comment object
//     const newComment = {
//       comment_id: commentId,
//       comment_creator: request.session.name,
//       comment_create_time: request.body.comment_create_time,
//       comment_content: request.body.comment_content,
//     };

//     // Push the new comment to the card's comment array
//     card.card_comment.push(newComment);

//     // Increment the comment_id counter
//     board.comment_id += 1;

//     // Update the board in the database
//     const filter = { _id: new ObjectId(request.params.boardId) };
//     const update = { $set: board };

//     boardsCollection.updateOne(filter, update)
//       .then(() => {
//         response.json({ message: "A new comment has been added to the card" });
//       })
//       .catch((err) => {
//         console.error(err);
//         response.status(500).json({ message: 'Internal server error' });
//       });
//   })
//   .catch((err) => {
//     console.error(err);
//     response.status(500).json({ message: 'Internal server error' });
//   });
// })
/********************************* comment finished ******************************** */

module.exports = router;
