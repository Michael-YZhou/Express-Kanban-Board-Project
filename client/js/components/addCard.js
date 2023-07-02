import { renderBoard } from "./board.js";
//initialise some vailables to be used later
let name;
let email;
let column;
let columnTitle;
/*
The renderAddCardForm function takes boardId and columnId as parameters, 
which are used to fetch session data and the board data from the server.
*/
export function renderAddCardForm(boardId, columnId) {
  const heading = document.createElement("h1");
  /*
  Inside the function, an axios Promise.all is used to make two asynchronous requests to the server: 
  one to get the session data (axios.get("/api/session")) and another to get the board data (axios.get("/api/boards/${boardId}")).
  */
  Promise.all([
    axios.get(`/api/session`),
    axios.get(`/api/boards/${boardId}`)
  ])
    //Once both requests are resolved, the response data is destructured using array destructuring: [sessionResponse, boardResponse]
    .then(([sessionResponse, boardResponse]) => {
      //The session data (name and email) and the column data (column and columnTitle) are extracted from the response data.
      name = sessionResponse.data.name;
      email = sessionResponse.data.email;

      column = boardResponse.data.kanban_columns.find((column)=>{
        return column.column_id == columnId
      });
      columnTitle = column.column_title;
      console.log(columnTitle)
      heading.textContent = `Please add card, ${name}`;

      //Set page by getElementById
      const page = document.getElementById("page");

      //Set a form to get data from client side and update to server
      const form = document.createElement("form");
      form.innerHTML = `
            <label for="title">Title:</label>
            <input type="text" name="title" required>
            <label for="description">Description: </label>
            <input type="text" name="description">
            <input type="submit">
        `;
      const errorMsg = document.createElement("p");
      errorMsg.id = "error-msg";
      page.replaceChildren(heading, form, errorMsg);
  
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleString();
        let cardDecs = formData.get("description");
          if (cardDecs.trim() === '') {
            // input is empty return 'Add a more detailed description'
                cardDecs = 'Add a more detailed description';
            }

        const comment = {
          comment_creator: name,
          comment_create_time: formattedTime,
          comment_content: ` created this card to ${columnTitle} at`,
        };
        const data = {
          card_title: formData.get("title"),
          card_creator: name,
          card_members: [name],
          card_desc: cardDecs,
          card_comment: [comment]
        };
        console.log(data);
        axios
          .post(`/api/boards/${boardId}/columns/${columnId}`, data)
          .then((_) => {
            renderBoard(boardId)
          })
          .catch((error) => {
            errorMsg.textContent =
              error.response.status == 400 ? "invalid field(s)" : "unknown error";
          });
      });
    })
    .catch((error) => {
      //If an error occurs during the request, an error message is displayed based on the error response status.
      name = "there is an error";
    });
  }   
