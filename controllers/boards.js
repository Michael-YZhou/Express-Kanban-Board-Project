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
      .json({ message: "Title and description are mandatory fields" });
    return;
  }
  boardsCollection
    .insertOne(request.body)
    .then((_) => {
      response.json();
    })
    .catch((err) => console.error(err));
});

// Retrieve a given board from database
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
      response.json(); // include something to prompt user and ask if they are sure they want to delete
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

/******************************** columns apis ******************************* */
// Add a new column
// takes the board ID from param, take column title from request body {"title": string}
router.post("/:boardId/columns", (request, response) => {
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
      // update the column id tracker and total number of columns
      board.column_id += 1;
      board.total_columns += 1;
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
        (column) => column.column_id === Number(request.params.columnId)
      );
      console.log(indexToRemove);
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
router.put("/:boardId/columns/:columnId", (request, response) => {
  // retrieve the board from the db
  boardsCollection
    .findOne({ _id: new ObjectId(request.params.boardId) })
    .then((board) => {
      const curPosition = board.kanban_columns.findIndex(
        (column) => column.column_id === Number(request.params.columnId)
      );
      const newPosition = request.body.toPosition;
      console.log(curPosition, newPosition);
      // move the selected column from current index to the new index
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

router.patch("/:boardId/columns/:columnId", (request, response) => {
  boardsCollection
    .findOne({ _id: new ObjectId(request.params.boardId) })
    .then((board) => {
      const colIndex = board.kanban_columns.findIndex(
        (column) => column.column_id === Number(request.params.columnId)
      );
      board.kanban_columns[colIndex].column_title = request.body.title;
      const filter = { _id: new ObjectId(request.params.boardId) };
      const update = { $set: board };
      boardsCollection.updateOne(filter, update).then((_) =>
        response.json({
          message: `column has been renamed`,
        })
      );
    });
});

/******************************** cards apis ******************************* */

/*
The code you provided is a route handler for a GET request that retrieves a specific card from a board in a Kanban system.

The route path is defined as /:boardId/columns/:columnId/cards/:cardId,
which expects the board ID, column ID, and card ID as route parameters.
*/
router.get("/:boardId/columns/:columnId/cards/:cardId", (req, res) => {
  //The boardsCollection.findOne() method is used to find the board document in the database based on the provided board ID.
  boardsCollection
    .findOne({ _id: new ObjectId(req.params.boardId) })
    .then((board) => {
      // console.log(board);
      /*
      Once the board document is retrieved, the code finds the index of the column
      within the kanban_columns array using the column ID.
      */
      const columnIndex = board.kanban_columns.findIndex(
        (column) => column.column_id == req.params.columnId
      );
      //Next, the code finds the index of the card within the cards array of the specified column using the card ID.
      const cardIndex = board.kanban_columns[columnIndex].cards.findIndex(
        (card) => card.card_id == req.params.cardId
      );
      //the response is sent with the JSON representation of the retrieved card from the board.
      res.json(board.kanban_columns[columnIndex].cards[cardIndex]);
    });
});

/*
Add a new card

The code you provided is a route handler for a POST request that adds a new card to a specific column in a board in a Kanban system.
The route path is defined as /:boardId/columns/:columnId, which expects the board ID and column ID as route parameters.
*/
router.post("/:boardId/columns/:columnId", (request, response) => {
  //The boardsCollection.findOne() method is used to find the board document in the database based on the provided board ID.
  boardsCollection
    .findOne({
      _id: new ObjectId(request.params.boardId),
    })
    .then((board) => {
      // Once the board document is retrieved, the code accesses the specified column using the column ID.
      const columnIndex = board.kanban_columns.findIndex(
        (column) => column.column_id == request.params.columnId
      );
      console.log(request.body.data);
      /*
      Add a new card to column
      A new card object is created using the data from the request body.
      The card ID is incremented from the board's card_id property, 
      and other properties such as card_title, card_desc, card_creator, card_members, and card_comment are extracted from the request body.
      The new card object is pushed to the cards array of the specified column.
      */
      board.kanban_columns[columnIndex].cards.push({
        card_id: board.card_id,
        card_title: request.body.card_title,
        card_desc: request.body.card_desc,
        card_creator: request.session.name,
        card_members: request.body.card_members,
        card_comment: request.body.card_comment,
      });
      //The card_id property of the board is incremented to maintain uniqueness for future cards.
      board.card_id += 1;
      console.log(board);
      //The updated board document is stored back in the database using the boardsCollection.updateOne() method.
      const filter = { _id: new ObjectId(request.params.boardId) };
      const update = { $set: board };
      boardsCollection.updateOne(filter, update).then((_) => {
        //Once the update is complete, a JSON response is sent with a success message.
        response.json({ message: "a new card has been added to the board" });
      });
    })
    .catch((err) => console.error(err));
});

/*
The code you provided is a route handler for a PATCH request that moves a card from one column to another within a Kanban board.

The route path is defined as /:boardId/columns/:curColumnId/cards/:curCardId, which expects the board ID, current column ID, and current card ID as route parameters.
The request body is expected to contain the column_id property, which represents the target column ID where the card will be moved.
The code retrieves the board document from the database using the provided board ID.
*/
router.patch(
  "/:boardId/columns/:curColumnId/cards/:curCardId",
  async (req, res) => {
    try {
      const boardId = req.params.boardId;
      const curColumnId = parseInt(req.params.curColumnId);
      const curCardId = parseInt(req.params.curCardId);
      const targetColumnId = parseInt(req.body.column_id);
      console.log(curCardId);
      console.log(curColumnId);
      console.log(targetColumnId);

      const board = await boardsCollection.findOne({
        _id: new ObjectId(boardId),
      });
      console.log(board);
      //It initializes a removedCard variable to store the details of the card being moved.
      let removedCard;
      //It iterates over the columns of the board and finds the current column and card based on their IDs.
      board.kanban_columns.forEach((column) => {
        if (column.column_id == curColumnId) {
          console.log(column);
          column.cards.forEach((card) => {
            if (card.card_id == curCardId) {
              //Once the card is found, its details are copied to the removedCard variable.
              removedCard = { ...card };
            }
          });
        }
      });
      // console.log(removedCard);
      //The card is removed from the current column using the $pull operator in the boardsCollection.findOneAndUpdate() method.
      await boardsCollection.findOneAndUpdate(
        { _id: new ObjectId(boardId), "kanban_columns.column_id": curColumnId },
        { $pull: { "kanban_columns.$[].cards": { card_id: curCardId } } },
        { returnOriginal: false }
      );
      // The card is added to the target column using the $push operator and the arrayFilters option to filter the specific column based on its ID.
      //The board document is updated in the database using the boardsCollection.findOneAndUpdate() method.
      await boardsCollection.findOneAndUpdate(
        { _id: new ObjectId(boardId) },
        { $push: { "kanban_columns.$[column].cards": removedCard } },
        { arrayFilters: [{ "column.column_id": parseInt(targetColumnId) }] },
        { returnOriginal: false }
      );
      //If the operations are successful, a status code of 200 (OK) is sent in the response.
      res.sendStatus(200);
    } catch (error) {
      //Otherwise, a status code of 500 (Internal Server Error) is sent.
      console.error(error);
      res.sendStatus(500);
    }
  }
);

/*
Delete card
The code you provided is a route handler for a DELETE request that deletes a card from a specific column within a Kanban board. 

The route path is defined as /:boardId/columns/:columnId/cards/:cardId, which expects the board ID, column ID, 
and card ID as route parameters.
The board ID is converted to a MongoDB ObjectId using the ObjectId class from the appropriate driver or ORM.
The card ID is parsed as an integer using parseInt() to ensure it is in the correct format.
*/
router.delete("/:boardId/columns/:columnId/cards/:cardId", (req, res) => {
  const boardId = new ObjectId(req.params.boardId);
  const cardId = parseInt(req.params.cardId);
  //The boardsCollection.updateOne() method is called to update the board document in the database.
  boardsCollection
    .updateOne(
      //The first parameter of updateOne() specifies the query to match the board document based on its _id.
      { _id: boardId },
      //The second parameter uses the $pull operator to remove an element from the kanban_columns.cards array that has the specified card_id.
      { $pull: { "kanban_columns.$[].cards": { card_id: cardId } } }
    )
    .then(() => {
      res.json({ message: "Card deleted successfully" });
    })
    .catch((error) => {
      res.json({ message: "Error deleting card" });
    });
});

/*
Change title and description

The code you provided is a route handler for a PUT request that updates the details of a specific card within a Kanban board.
*/
router.put("/:boardId/columns/:columnId/cards/:cardId", (request, response) => {
  /*
The code you provided is a route handler for a PUT request that updates the details of a specific card within a Kanban board. 
The route path is defined as /:boardId/columns/:columnId/cards/:cardId, 
which expects the board ID, column ID, and card ID as route parameters.
The board ID is converted to a MongoDB ObjectId using the ObjectId class from the appropriate driver or ORM.
The column ID and card ID are parsed as integers using parseInt() to ensure they are in the correct format
*/
  const boardId = new ObjectId(request.params.boardId);
  const columnId = parseInt(request.params.columnId);
  const cardId = parseInt(request.params.cardId);
  //The desired updates for the card's title and description are extracted from the request body using destructuring assignment:
  const { card_title, card_desc } = request.body;
  //A filter object is created to match the board document in the database. The filter specifies the board ID, column ID, and card ID.
  const filter = {
    _id: boardId,
    "kanban_columns.column_id": columnId,
    "kanban_columns.cards.card_id": cardId,
  };
  //An empty update object is created.
  const update = {};
  /*
  Based on the presence of card_title and card_desc, 
  the update object is populated with the appropriate $set operation to update the card's title, description, or both.
  */
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
    /*
    If none of the fields (card_title and card_desc) are provided, 
    a response with a message indicating that no update fields were provided is sent.
    */
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
//
/********************************* cards finished ******************************** */

/********************************* comment start ******************************** */

/*
Change comment 
The code you provided is a route handler for a PUT request that updates the content of a specific comment within a card in a Kanban board.\
The route path is defined as /:boardId/columns/:columnId/cards/:cardId/comments/:commentId, 
which expects the board ID, column ID, card ID, and comment ID as route parameters.
*/
router.put(
  "/:boardId/columns/:columnId/cards/:cardId/comments/:commentId",
  (req, res) => {
    //The board ID, column ID, card ID, and comment ID are extracted from the request parameters:
    const boardId = req.params.boardId;
    const columnId = req.params.columnId;
    const cardId = req.params.cardId;
    const commentId = req.params.commentId;
    //The new comment content is extracted from the request body:
    const newCommentContent = req.body.comment_content;

    //A filter object is created to match the board document in the database.
    //The filter specifies the board ID, column ID, card ID, and comment ID using $[column], $[card], and $[comment] placeholders.
    boardsCollection
      //The boardsCollection.updateOne() method is called to update the board document in the database.
      .updateOne(
        {
          _id: new ObjectId(boardId),
          "kanban_columns.column_id": parseInt(columnId),
          "kanban_columns.cards.card_id": parseInt(cardId),
          "kanban_columns.cards.card_comment.comment_id": parseInt(commentId),
        },
        //An update object is created using the $set operator to update the comment_content field of the specified comment.
        {
          $set: {
            "kanban_columns.$[column].cards.$[card].card_comment.$[comment].comment_content":
              newCommentContent,
          },
        },
        //The arrayFilters option is set to match the specific column, card, and comment within the array of columns, cards, and comments, respectively.
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

/*
Delete comment

Same way used on put method
*/
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

//Add new comment section same way with Add card post mthod
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
        const columnIndex = board.kanban_columns.findIndex(
          (column) => column.column_id == request.params.columnId
        );
        const cardIndex = board.kanban_columns[columnIndex].cards.findIndex(
          (card) => card.card_id == request.params.cardId
        );
        // add a new comment to the json data
        const commentSection =
          board.kanban_columns[columnIndex].cards[cardIndex].card_comment;

        commentSection.push({
          comment_id: board.comment_id,
          comment_creator: request.session.name,
          comment_create_time: request.body.comment_create_time,
          comment_content: request.body.comment_content,
        });
        // update the comment id tracker
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

/********************************* comment finished ******************************** */

module.exports = router;
