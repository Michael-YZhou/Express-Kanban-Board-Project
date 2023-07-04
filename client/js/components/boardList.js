import { renderBoard } from "./board.js";

export function renderBoardList() {
  const page = document.getElementById("page");
  page.classList.remove("d-flex", "flex-column", "flex-grow-1");

  const projectContainer = document.createElement("div");
  const dashHeader = document.createElement("h1");
  dashHeader.textContent = "Dashboard";
  projectContainer.classList.add(
    "row",
    "row-cols-1",
    "row-cols-md-3",
    "g-4",
    "justify-content-center",
    "h-50",
    "p-5"
  );

  projectContainer.style = "background-color: #eee;";

  const paragraph = document.createElement("p");
  paragraph.textContent = "Loading";
  page.replaceChildren(paragraph);

  axios.get("/api/boards").then((response) => {
    let listElements = [];

    page.replaceChildren(dashHeader, projectContainer);
    for (let board of response.data) {
      listElements.push(renderUserBoards(board));
    }
    projectContainer.replaceChildren(...listElements);
  });
}

function renderUserBoards(board) {
  const el = document.createElement("div");

  el.innerHTML = `
  <div class="col show-boards">
    <div class="card h-100 d-flex align-items-center justify-content-center">
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
      <form class = "mx-1 mx-md-4"id="edit-form-${board._id}">
      <div class="modal-body">
        <div class="d-flex flex-row align-items-center mb-4">
            <label class="form-label" for="title">Title:</label>'
            <input class ="form-control" type="text" name="title" value="${board.kanban_title}">
        </div>
      <div class="d-flex flex-row align-items-center mb-4">
          <label class="form-label" for="description"> Description: </label>
          <input class= "form-control" type="text" name="description" value="${board.kanban_desc}">
      </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-warning" data-bs-dismiss="modal" >Save changes</button>
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

export function renderEditForm(board, el) {
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
``;
