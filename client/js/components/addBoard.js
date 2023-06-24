import { renderBoardList } from "./boardList.js";

let name;
let email;

axios
  .get("/api/session")
  .then((response) => {
    name = response.data.name;
    email = response.data.email;
  })
  .catch((error) => {
    name = "undefined";
  });

export function renderAddBoardForm() {
  const page = document.getElementById("page");
  const heading = document.createElement("h1");

  heading.textContent = `Add board, ${name}`;
  const form = document.createElement("form");
  let getAllUsers = fetchUsers();
  for (users of getAllUsers) {
    let option = document.createElement("option");
    option.text;
  }

  form.innerHTML = `
        <label for="title">Title:</label>
        <input type="text" name="title">
        <label for="description">Description: </label>
        <input type="text" name="description">
        <label for="members">Choose project members </label>
        <select id="members" name = "members">
        </select> 
        <input type="submit">
    `;
  // need to add dropdown menu to select members
  const errorMsg = document.createElement("p");
  errorMsg.id = "error-msg";
  page.replaceChildren(heading, form, errorMsg);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const data = {
      kanban_title: formData.get("title"),
      kanban_desc: formData.get("description"),
      kanban_creator: name,

      //   {
      //     "_id": "649643a45ded1bddf4fe6dd4",
      //     "kanban_title": "Express Backend Project 1",
      //     "kanban_creator": "Yang",
      //     "kanban_members": [
      //         "Andreina",
      //         "Eddie"
      //     ],
      //     "kanban_desc": "Use Express to build a web server",
      //     "kanban_columns": [
      //         {
      //             "column_id": 1,
      //             "column_title": "Planning",
      //             "cards": [
      //                 {
      //                     "card_id": 1,
      //                     "card_title": "UI design confirmation",
      //                     "card_desc": "Design the UI for all components.",
      //                     "card_creator": "Yang",
      //                     "card_members": [
      //                         "Andreina",
      //                         "Eddie"
      //                     ],
      //                     "card_comment": [
      //                         {
      //                             "comment_creator": "Yang",
      //                             "comment_create_time": "",
      //                             "comment_edit_time": "",
      //                             "comment_content": "This must be completed by Friday!"
      //                         }
      //                     ]
      //                 }
      //             ]
      //         }
      //     ]
      // }
    };

    axios
      .post("/api/boards", data)
      .then((_) => {
        renderBoardList();
      })
      .catch((error) => {
        errorMsg.textContent =
          error.response.status == 400 ? "invalid field(s)" : "unknown error";
      });
  });
}

function fetchUsers() {
  let allUsers = [];
  axios
    .get("/api/users")
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        allUsers.push(response.data[i].name);
      }

      return allUsers;
    })
    .catch((error) => {
      errorMsg.textContent =
        error.response.status == 400 ? "invalid field(s)" : "unknown error";
    });
}

fetchUsers();
