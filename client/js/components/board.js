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

    /************************* Board Component - Section 1 *************************/
    /******************** create the header section of the board page ************************ */
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

    /************************* Board Component - Section 2 *************************/
    /******************* create the columns section for the board page ***************** */
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

      // create the column dropdown ul element
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
      // connect this li to the move col modal
      moveListBtn.setAttribute("data-bs-toggle", "modal");
      moveListBtn.setAttribute("data-bs-target", "#moveColModal");
      // set a data attribute for the form in the model to read column id!!!
      moveListBtn.setAttribute("data-column-id", `${column.column_id}`);

      const deleteListBtn = document.createElement("li");
      deleteListBtn.setAttribute("id", "delete-list");
      deleteListBtn.setAttribute("class", "dropdown-item");
      deleteListBtn.setAttribute("type", "button");
      deleteListBtn.textContent = "Delete List";
      // connect this li to the move col modal
      deleteListBtn.setAttribute("data-bs-toggle", "modal");
      deleteListBtn.setAttribute("data-bs-target", "#deleteColModal");
      // set a data attribute for the form in the model to read column id!!!
      deleteListBtn.setAttribute("data-column-id", `${column.column_id}`);

      dropDownList.append(addCardBtn, moveListBtn, deleteListBtn);
      dropDown.append(dropDownBtn, dropDownList);
      colHeader.append(columnTitle, dropDown);
      colElem.appendChild(colHeader);

      // add event listener to column dropdown btns
      addCardBtn.addEventListener("click", () => {
        renderAddCardForm(boardId, column.column_id);
      });

      // create and append the cards to the column div
      for (let card of column["cards"]) {
        const cardElem = document.createElement("div");
        cardElem.classList.add("card_label");

        cardElem.addEventListener("click", () => {
          renderCard(boardId, column.column_id, card.card_id);
        });
        cardElem.insertAdjacentHTML("beforeend", `<p>${card.card_title}</p>`); // display card title

        const cardMoveButton = document.createElement("button");
        cardMoveButton.textContent = "move card";
        colElem.append(cardElem, cardMoveButton);
      }
      // add the column to columns section
      columnsContainerRow.appendChild(colElem);
    }

    // append the whole columns section to the board container
    columnsContainer.appendChild(columnsContainerRow);
    boardContainer.appendChild(columnsContainer);

    /************************* Board Modals - Section 3 *************************/
    /*********************** bootstrap modal for the moving column **********************/
    let optionHTML = "";
    for (let i = 0; i < board.total_columns; i++) {
      optionHTML += `<option value=${i}>${i + 1}</option>`;
    }

    const moveColModalHTML = `
      <div class="modal fade" id="moveColModal" tabindex="-1" aria-labelledby="moveColModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="moveColModalLabel">Modal title</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <select id="select-input" class="form-select form-select-sm" aria-label=".form-select-sm example">
                <option selected>Move to position:</option>
                ${optionHTML}
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button id="move-col-btn" type="button" class="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // append the model section to the boardContainer
    boardContainer.insertAdjacentHTML("beforeend", moveColModalHTML);

    /*********************** bootstrap modal for the delete column **********************/
    const deleteColModalHTML = `
      <div class="modal fade" id="deleteColModal" tabindex="-1" aria-labelledby="deleteColModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="deleteColModalLabel">Modal title</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button id="delete-col-btn" type="button" class="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    `;
    boardContainer.insertAdjacentHTML("beforeend", deleteColModalHTML);

    page.replaceChildren(boardContainer);

    // attach event listener to the body of the MOVE column model so that when modal pops up, the form value gets undated based on the column selected
    const moveColModal = document.getElementById("moveColModal");
    let curColumnId;
    if (moveColModal) {
      moveColModal.addEventListener("show.bs.modal", (event) => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        console.log(button);
        // Extract the current column id from data-column-id attributes
        curColumnId = button.getAttribute("data-column-id");
        // If necessary, you could initiate an Ajax request here
        // and then do the updating in a callback.

        // Update the modal's content.
        const modalTitle = moveColModal.querySelector("#moveColModalLabel");
        const modalBodyInput = moveColModal.querySelector(".modal-body input");

        modalTitle.textContent = `Moving column ${curColumnId}`;
        // modalBodyInput.value = curColumnId;
      });
    }

    // add event listener to MOVE column -> confirm btn. Data in the select will be sent to the move column api
    const moveColBtn = document.getElementById("move-col-btn");
    moveColBtn.addEventListener("click", (e) => {
      const selectValue = {
        toPosition: Number(document.getElementById("select-input").value),
      };
      axios
        .patch(`/api/boards/${boardId}/columns/${curColumnId}`, selectValue)
        .then((_) => renderBoard(boardId))
        .catch((err) => console.error(err));
    });

    // add event listener to the DELETE column model
    const deleteColModal = document.getElementById("deleteColModal");
    if (deleteColModal) {
      deleteColModal.addEventListener("show.bs.modal", (event) => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        console.log(button);
        // Extract the current column id from data-column-id attributes
        curColumnId = button.getAttribute("data-column-id");
        // If necessary, you could initiate an Ajax request here
        // and then do the updating in a callback.

        // Update the modal's content.
        const modalTitle = deleteColModal.querySelector("#deleteColModalLabel");

        modalTitle.textContent = `Delete column ${curColumnId}`;
        // modalBodyInput.value = curColumnId;
      });
    }

    // add event listener to DELETE column -> confirm btn. Data in the select will be sent to the delete column api
    const deleteColBtn = document.getElementById("delete-col-btn");
    deleteColBtn.addEventListener("click", (e) => {
      axios
        .delete(`/api/boards/${boardId}/columns/${curColumnId}`)
        .then((_) => renderBoard(boardId))
        .catch((err) => console.error(err));
    });
  });
}
