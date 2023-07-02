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

      const page = document.getElementById("page");
      const addBoardFormContainer = document.createElement("div");
      addBoardFormContainer.innerHTML = `
      <section class="vh-100" style="background-color: #eee;">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-lg-12 col-xl-11">
            <div class="card text-black" style="border-radius: 25px;">
              <div class="card-body p-md-5">
                <div class="row justify-content-center">
                  <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Create Board</p>
                    <form class="mx-1 mx-md-4" id="create-board-form">
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="title" required>Card Title</label>
                          <input type="text" name="title" class="form-control" required />
                          
                        </div>
                      </div>
    
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="description">Description</label>
                          <input type="text" name="description" class="form-control" />
                        </div>
                      </div>
                      
                      <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" class="btn btn-warning btn-lg">Create</button>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
    
                    <img src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                      class="img-fluid" alt="Sample image">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </section>
      
      `;
      const form = addBoardFormContainer.querySelector("#create-board-form");
      const errorMsg = document.createElement("p");
      errorMsg.id = "error-msg";
      page.replaceChildren(addBoardFormContainer, errorMsg);
  
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
