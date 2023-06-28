import { renderAddCardForm } from "./addCard.js";
import { renderCard } from "./cardList.js";

export function renderBoard(boardId) {
  const page = document.getElementById("page");

  // display the loading text while data is being retrieved and page is renderred
  const paragraph = document.createComment("p");
  paragraph.textContent = "Loading";
  page.replaceChildren(paragraph);

  axios.get(`/api/boards/${boardId}`).then((board) => {
    board = board.data;
    // console.log(board);
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

      const colHeader = document.createElement("div");
      colHeader.className = "column-header";

      // col title and the dropdown menu will be appened to colHeader,
      // colHeader will be appended to colElem
      const columnTitle = document.createElement("div");
      columnTitle.innerHTML = `<p>${column.column_title}</p>`;

      // this is the dropdown menu for column actions (bootstrap used)
      const dropDown = document.createElement("div");
      dropDown.className = "dropdown";

      const dropDownBtn = document.createElement("button");
      dropDownBtn.setAttribute("class", "btn btn-secondary dropdown-toggle");
      dropDownBtn.setAttribute("type", "button");
      dropDownBtn.setAttribute("data-bs-toggle", "dropdown");
      dropDownBtn.setAttribute("aria-expanded", "false");
      dropDownBtn.textContent = "...";

      // create the dropdown ul element
      const dropDownList = document.createElement("ul");
      dropDownList.className = "dropdown-menu";

      // create the dropdown list items
      const addCardBtn = document.createElement("li");
      addCardBtn.setAttribute("id", "add-card");
      addCardBtn.setAttribute("class", "dropdown-item");
      addCardBtn.setAttribute("type", "button");
      addCardBtn.textContent = "Add card";

      const moveListBtn = document.createElement("li");
      moveListBtn.setAttribute("id", "move-list");
      moveListBtn.setAttribute("class", "dropdown-item");
      moveListBtn.setAttribute("type", "button");
      moveListBtn.textContent = "Move List";

      const deleteListBtn = document.createElement("li");
      deleteListBtn.setAttribute("id", "delete-list");
      deleteListBtn.setAttribute("class", "dropdown-item");
      deleteListBtn.setAttribute("type", "button");
      deleteListBtn.textContent = "Delete List";

      dropDownList.append(addCardBtn, moveListBtn, deleteListBtn);
      dropDown.append(dropDownBtn, dropDownList);
      colHeader.append(columnTitle, dropDown);

      // const colHeaderHTML = `
      //   <div class="column-header">
      //     <div>
      //       <p>${column.column_title}</p>
      //     </div>

      //     <div class="dropdown">
      //       <button
      //         class="btn btn-secondary dropdown-toggle"
      //         type="button"
      //         data-bs-toggle="dropdown"
      //         aria-expanded="false"
      //       >
      //         ...
      //       </button>
      //       <ul class="dropdown-menu">
      //         <li><button id="add-card" class="dropdown-item" type="button">Add card</button></li>
      //         <li>
      //           <button id="move-list" class="dropdown-item" type="button">Move list</button>
      //         </li>
      //         <li>
      //           <button id="delete-list" class="dropdown-item" type="button">Delete list</button>
      //         </li>
      //       </ul>
      //     </div>
      //   </div>
      // `;

      colElem.appendChild(colHeader); // display column title
      // console.log(column.column_id);
      addCardBtn.addEventListener("click", () => {
        renderAddCardForm(boardId, column.column_id);
      });

      // create and append the cards to the column div
      for (let card of column["cards"]) {
        const cardElem = document.createElement("div");
        cardElem.classList.add("card_label");
        cardElem.addEventListener("click", () => {
          console.log(column.column_id)
          console.log(card.card_id)
          renderCard(boardId,column.column_id,card.card_id);
        });
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
