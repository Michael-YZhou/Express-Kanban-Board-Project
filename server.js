const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static("client"));

// session is created and stored at server, a unique id is send to user as cookie.
// Express will create session and add a session object under request
require("dotenv").config();
const MongoStore = require("connect-mongo");
const expressSession = require("express-session"); // require express-session
// register a express session use a global middleware (must be in index.js/sever)
app.use(
  expressSession({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_CONNECTION_STRING,
      dbName: "test",
    }),
    secret: process.env.EXPRESS_SESSION_SECRET_KEY, // the session secret is used to create a hash to sign a cookie, prevent the cookie to be tenpered with.
  })
);

const boardsController = require("./controllers/boards.js");
app.use("/api/boards", boardsController);
const usersController = require("./controllers/users.js");
app.use("/api/users", usersController);
const sessionController = require("./controllers/session.js");
app.use("/api/session", sessionController);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
