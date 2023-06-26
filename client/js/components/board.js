export function renderBoard(boardId) {
  const page = document.getElementById("page");

  // display the loading text while data is being retrieved and page is renderred
  const paragraph = document.createComment("p");
  paragraph.textContent = "Loading";
  page.replaceChildren(paragraph);

  axios.get(`/api/boards/${boardId}`).then((board) => {
    board = board.data;
    const boardContainer = document.createElement("div");
    boardContainer.id = "board-container";

    // render the header section of the board
    const boardHeaderHTML = `
    <div id="board-header-box">
      <h1 id="board-title">${board.kanban_title}</h1>
      <div id="board-users">
        <div>
          <p>Created by: ${board.kanban_creator}</p>
          <p>Members: ${board.kanban_members.join(", ")}</p>
        </div>
      </div>
    </div>
  `;
    boardContainer.insertAdjacentHTML("beforeend", boardHeaderHTML);

    // this is a bootstrap container for the entire column section
    const columnsContainer = document.createElement("div");
    columnsContainer.id = "columns-container";
    columnsContainer.classList = "container test-center";

    //  this is a bootstrap row that contains all columns
    const columnsContainerRow = document.createElement("div");
    columnsContainerRow.id = "columns-container-row";
    columnsContainerRow.classList = "row test-center";

    // create column elements and append to the columns section
    for (let column of board.kanban_columns) {
      const colElem = document.createElement("div");
      // each column has the bootstrap col class
      colElem.classList = "col";
      // this is the dropdown menu for column actions (bootstrap used)
      const colHeaderHTML = `
        <div class="column-header">
        <div>
          <p>${column.column_title}</p>
        </div>

        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            ...
          </button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" type="button">Add card</button></li>
            <li>
              <button class="dropdown-item" type="button">Move list</button>
            </li>
            <li>
              <button class="dropdown-item" type="button">Delete list</button>
            </li>
          </ul>
        </div>
      </div>
      `;
      colElem.insertAdjacentHTML("beforeend", colHeaderHTML); // display column title
      // create and append the cards to the column div
      for (let card of column["cards"]) {
        const cardElem = document.createElement("div");
        cardElem.insertAdjacentHTML("beforeend", `<p>${card.card_title}</p>`); // display card title
        colElem.appendChild(cardElem);
      }
      // add the column to columns section
      columnsContainerRow.appendChild(colElem);
    }
    // append the whole columns section to the board container
    columnsContainer.appendChild(columnsContainerRow);
    boardContainer.appendChild(columnsContainer);

    page.replaceChildren(boardContainer);
  });
}
