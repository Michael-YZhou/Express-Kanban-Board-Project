import { renderBoard } from "./board.js";

export function renderBoardList() {
  const page = document.getElementById("page");
  page.classList.add("row");
  const paragraph = document.createElement("p");
  paragraph.textContent = "Loading";
  page.replaceChildren(paragraph);

  axios.get("/api/boards").then((response) => {
    let listElements = [];

    for (let board of response.data) {
      listElements.push(renderUserBoards(board));
    }
    page.replaceChildren(...listElements);
  });
}

function renderUserBoards(board) {
  const el = document.createElement("div");
  el.innerHTML = `
  <div class="col-sm-3">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${board.kanban_title}</h5>
        <p class="card-text">${board.kanban_desc}.</p>
        <button class="btn btn-warning" id="open-${board._id}">Open</button>
        <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modal-${board._id}" id="edit-${board._id}">Edit</button>
        <button class="btn btn-warning" id="delete-${board._id}">Delete</button>
      </div>
    </div>
  </div>
  <div class="modal fade" id="modal-${board._id}" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" >Edit Board</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id= "edit-form-${board._id}">
      <div class="modal-body">
        
          <label for="title">Title:</label>
          <input type="text" name="title" value="${board.kanban_title}">
          <label for="description">Description: </label>
          <input type="text" name="description" value="${board.kanban_desc}">
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" >Save changes</button>
        </form>
      </div>
    </div>
  </div>
</div>
  `;

  let openBoard = el.querySelector(`#open-${board._id}`);
  openBoard.addEventListener("click", () => {
    renderBoard(board._id);
  });

  const deleteButton = el.querySelector(`#delete-${board._id}`);
  deleteButton.addEventListener("click", () => {
    axios.delete(`api/boards/${board._id}`).then((_) => {
      //are you sure pop up should go here
      renderBoardList();
    });
  });

  const editButton = el.querySelector(`#edit-${board._id}`);
  editButton.addEventListener("click", () => {
    renderEditForm(board, el);
    console.log("edit button pressed");
  });

  // Disable buttons if no logged in user
  axios
    .get("/api/session")
    .then((_) => {})
    .catch((error) => {
      deleteButton.disabled = true;
      editButton.disabled = true;
    });
  return el;
}

function renderEditForm(board, el) {
  let form = el.querySelector(`#edit-form-${board._id}`);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const data = {
      kanban_title: formData.get("title"),
      kanban_desc: formData.get("description"),
    };

    axios
      .put(`/api/boards/${board._id}`, data)
      .then((_) => {
        renderBoardList();
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
