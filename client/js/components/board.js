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
      // submenu(form) under delete col

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

        const cardMoveButton = document.createElement('button');
        cardMoveButton.textContent = 'move card';
        cardMoveButton.classList.add('cardmovebutton')
          cardMoveButton.addEventListener('click',()=>{
            const cardMoveContainer = document.createElement('div');
            const curColumnId = column.column_id;
            const curCardId = card.card_id;
            const selectElement = document.createElement('select');
            for(const column of board.kanban_columns){
              const optionElement = document.createElement('option');
              optionElement.value = column.column_id;
              optionElement.textContent = column.column_title;
              selectElement.appendChild(optionElement);
            }
             // 创建提交按钮
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Move';

            // 创建取消按钮
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cardMoveContainer.append(selectElement,submitButton,cancelButton);
            colElem.appendChild(cardMoveContainer)
            // 绑定取消按钮的点击事件处理程序
            cancelButton.addEventListener('click', () => {
              // 从父元素中移除选择元素和按钮
              cardMoveContainer.removeChild(selectElement);
              cardMoveContainer.removeChild(submitButton);
              cardMoveContainer.removeChild(cancelButton);
            });

            // 绑定提交按钮的点击事件处理程序
            submitButton.addEventListener('click', () => {
              const targetColumnId = selectElement.value;

              // 调用移动卡片的函数，将卡片从当前列移动到目标列
              moveCard(boardId, curColumnId, curCardId, targetColumnId);

              // 从父元素中移除选择元素和按钮
              cardMoveContainer.removeChild(selectElement);
              cardMoveContainer.removeChild(submitButton);
              cardMoveContainer.removeChild(cancelButton);

              function moveCard(boardId, curColumnId, curCardId, targetColumnId) {
                // 发送 Axios PATCH 请求来更新卡片的所属列信息
                axios.patch(`/api/boards/${boardId}/columns/${curColumnId}/cards/${curCardId}`, { column_id: targetColumnId })
                  .then(() => {
                    renderBoard(boardId); // 处理成功响应
                  })
                  .catch((error) => {
                    console.log(error); // 处理错误
                  });
              }
            });
          })
        colElem.append(cardElem,cardMoveButton);
      }
      // add the column to columns section
      columnsContainerRow.appendChild(colElem);
    }

    // append the whole columns section to the board container
    columnsContainer.appendChild(columnsContainerRow);
    boardContainer.appendChild(columnsContainer);


    
    
    /************************* Board Component - Section 3 *************************/
    /**************** create the bootstrap modal for the moving column ***************/

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

    page.replaceChildren(boardContainer);

    // add event listener to the model body so that the form value gets undated based on the column selected
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
        const modalTitle = moveColModal.querySelector(".modal-title");
        const modalBodyInput = moveColModal.querySelector(".modal-body input");

        modalTitle.textContent = `Moving column ${curColumnId}`;
        // modalBodyInput.value = curColumnId;
      });
    }

    const moveColBtn = document.getElementById("move-col-btn");
    moveColBtn.addEventListener("click", (e) => {
      const selectValue = {
        toPosition: Number(document.getElementById("select-input").value),
      };
      axios
        .patch(`/api/boards/${boardId}/columns/${curColumnId}`, selectValue)
        .then(renderBoard(boardId))
        .catch((err) => console.error(err));
    });
  });
}



