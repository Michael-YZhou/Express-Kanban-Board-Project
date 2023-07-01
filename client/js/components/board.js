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
    console.log(board);
    const boardContainer = document.createElement("div");
    boardContainer.id = "board-container";

    /************************* Section 1 - Create Board Header Section *************************/
    const boardHeaderNavHTML = `
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">${board.kanban_title}</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mb-2 mb-lg-0 w-100">
            <li class="nav-item dropdown me-auto">
              <a
                class="nav-link"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                ❖ Menu
              </a>
              <ul class="dropdown-menu">
                <li><a id="rename-board-btn" class="dropdown-item" href="#">Rename Board</a></li>
                <li><a id="add-list" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#addColModal" href="#">Add List</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a id="delete-board-btn" class="dropdown-item" href="#">Delete Board</a>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="#"
                >Created by: ${board.kanban_creator}</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Members: ${board.kanban_members.join(
                ", "
              )}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    `;

    boardContainer.insertAdjacentHTML("beforeend", boardHeaderNavHTML);

    /******************* Section 2 - Create the Columns Section of the Board Page ******************/
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
        cardMoveButton.classList.add("cardmovebutton");
        cardMoveButton.addEventListener("click", () => {
          const cardMoveContainer = document.createElement("div");
          const curColumnId = column.column_id;
          const curCardId = card.card_id;
          const selectElement = document.createElement("select");
          for (const column of board.kanban_columns) {
            const optionElement = document.createElement("option");
            optionElement.value = column.column_id;
            optionElement.textContent = column.column_title;
            selectElement.appendChild(optionElement);
          }
          // 创建提交按钮
          const submitButton = document.createElement("button");
          submitButton.textContent = "Move";

          // 创建取消按钮
          const cancelButton = document.createElement("button");
          cancelButton.textContent = "Cancel";
          cardMoveContainer.append(selectElement, submitButton, cancelButton);
          colElem.appendChild(cardMoveContainer);
          // 绑定取消按钮的点击事件处理程序
          cancelButton.addEventListener("click", () => {
            // 从父元素中移除选择元素和按钮
            cardMoveContainer.removeChild(selectElement);
            cardMoveContainer.removeChild(submitButton);
            cardMoveContainer.removeChild(cancelButton);
          });

          // 绑定提交按钮的点击事件处理程序
          submitButton.addEventListener("click", () => {
            const targetColumnId = selectElement.value;

            // 调用移动卡片的函数，将卡片从当前列移动到目标列
            moveCard(boardId, curColumnId, curCardId, targetColumnId);

            // 从父元素中移除选择元素和按钮
            cardMoveContainer.removeChild(selectElement);
            cardMoveContainer.removeChild(submitButton);
            cardMoveContainer.removeChild(cancelButton);

            function moveCard(boardId, curColumnId, curCardId, targetColumnId) {
              // 发送 Axios PATCH 请求来更新卡片的所属列信息
              axios
                .patch(
                  `/api/boards/${boardId}/columns/${curColumnId}/cards/${curCardId}`,
                  { column_id: targetColumnId }
                )
                .then(() => {
                  renderBoard(boardId); // 处理成功响应
                })
                .catch((error) => {
                  console.log(error); // 处理错误
                });
            }
          });
        });
        colElem.append(cardElem, cardMoveButton);
      }
      // add the column to columns section
      columnsContainerRow.appendChild(colElem);
    }

    // append the whole columns section to the board container
    columnsContainer.appendChild(columnsContainerRow);
    boardContainer.appendChild(columnsContainer);

    /************************* Section 3 - Creating Bootstrap Modals *************************/
    /*********************** bootstrap modal for adding new column **********************/
    const addColModalHTML = `
      <div
        class="modal fade" id="addColModal" tabindex="-1" aria-labelledby="addColModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="addColModalLabel">Modal title</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="add-col-input" class="col-form-label">Name Your List ✏️</label>
                  <input type="text" class="form-control" id="add-col-input" />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button id="add-col-btn" type="button" class="btn btn-primary" data-bs-dismiss="modal">Add List</button>
            </div>
          </div>
        </div>
      </div>
    `;

    boardContainer.insertAdjacentHTML("beforeend", addColModalHTML);

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
              <select id="move-col-input" class="form-select form-select-sm" aria-label=".form-select-sm example">
                <option selected>Move to position:</option>
                ${optionHTML}
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button id="move-col-btn" type="button" class="btn btn-primary" data-bs-dismiss="modal">Move List</button>
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
              <button id="delete-col-btn" type="button" class="btn btn-primary" data-bs-dismiss="modal">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
    boardContainer.insertAdjacentHTML("beforeend", deleteColModalHTML);

    page.replaceChildren(boardContainer);

    /******************** Section 4 - Adding Eventlistener to Board Commponents *******************/

    // add eventListener to ADD column model -> Confirm btn. this will send a post request to the add_column api
    const addColBtn = document.getElementById("add-col-btn");
    addColBtn.addEventListener("click", (e) => {
      console.log(document.getElementById("add-col-input").value);
      const formValue = {
        // read value from the input of move column modal
        title: document.getElementById("add-col-input").value,
      };
      axios
        .post(`/api/boards/${boardId}/columns`, formValue)
        .then((_) => renderBoard(boardId))
        .catch((err) => console.error(err));
    });

    // add eventListener to the board title input field
    // this will show/hide input boarder when focus, and update title on keypress(Enter)
    // const boardTitle = document.getElementById("board-title");
    // boardTitle.style.border = "0px";
    // Blur or press Enter to confirm change (add event listener and send to api)

    // attach eventListener to the body of the MOVE column model so that when modal pops up, the form value gets undated based on the column selected
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

    // add eventListener to MOVE column -> confirm btn. Data in the select will be sent to the move column api
    const moveColBtn = document.getElementById("move-col-btn");
    moveColBtn.addEventListener("click", (e) => {
      const selectValue = {
        // read value from the input of move column modal
        toPosition: Number(document.getElementById("move-col-input").value),
      };
      axios
        .patch(`/api/boards/${boardId}/columns/${curColumnId}`, selectValue)
        .then((_) => renderBoard(boardId))
        .catch((err) => console.error(err));
    });

    // add eventListener to the DELETE column model
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

    // add eventListener to DELETE column -> confirm btn. Data in the select will be sent to the delete column api
    const deleteColBtn = document.getElementById("delete-col-btn");
    deleteColBtn.addEventListener("click", (e) => {
      axios
        .delete(`/api/boards/${boardId}/columns/${curColumnId}`)
        .then((_) => renderBoard(boardId))
        .catch((err) => console.error(err));
    });
  });
}
