import { renderBoard } from "./board.js";

export function renderBoardList() {
  const page = document.getElementById("page");
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
  el.classList.add("board");

  const creatorName = document.createElement("h2");
  creatorName.textContent = board.kanban_creator;

  const boardTitle = document.createElement("h3");
  boardTitle.textContent = board.kanban_title;

  const boardDesc = document.createElement("p");
  boardDesc.textContent = board.kanban_desc;

  el.addEventListener("click", () => {
    // console.log(board._id);
    renderBoard(board._id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    axios.delete(`api/boards/${board._id}`).then((_) => {
      //are you sure pop up should go here
      renderBoardList();
    });
  });

  const editDiv = document.createElement("div");
  editDiv.id = `edit-board-${board._id}`;
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    renderEditForm(board);
  });
  editDiv.append(editButton);

  // Extension: disable buttons if no logged in user
  axios
    .get("/api/session")
    .then((_) => {})
    .catch((error) => {
      deleteButton.disabled = true;
      editButton.disabled = true;
    });

  el.append(boardTitle, boardDesc, creatorName, deleteButton, editDiv);
  return el;
}

function renderEditForm(board) {
  const form = document.createElement("form");
  form.innerHTML = `
        <label for="name">Name:</label>
        <input type="text" name="name" value="${board.name}">
        <label for="description">Description: </label>
        <input type="text" name="description" value="${board.description}">
        <label for="address">Address: </label>
        <input type="text" name="address" value="${board.address}">
        <input type="submit">
    `;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      address: formData.get("address"),
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

  // Extension (PATCH)
  form.querySelector('input[name="name"]').addEventListener("blur", (event) => {
    axios
      .patch(`/api/boards/${board._id}`, { name: event.target.value })
      .then((_) => {
        renderBoardList();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  document.getElementById(`edit-board-${board._id}`).replaceChildren(form);
}
