export function renderBoard(boardId) {
  const page = document.getElementById("page");

  // display the loading text while data is being retrieved and page is renderred
  const paragraph = document.createComment("p");
  paragraph.textContent = "Loading";
  page.replaceChildren(paragraph);

  // axios.get(`/api/boards/${boardId}`).then((_) => {
  /*******************************use hardcoded data for testing****************************** */
  const board = {
    _id: "6495821ea11be8a937eb678c",
    kanban_title: "Express Backend Project 1",
    kanban_creator: "Yang",
    kanban_members: ["Andreina", "Eddie"],
    kanban_desc: "Use Express to build a web server",
    kanban_columns: [
      {
        column_position: 0,
        column_title: "column 1: Planning",
        cards: [
          {
            card_position: 0,
            card_title: "card 1: UI design confirmation",
            card_desc: "Design the UI for all components.",
            card_creator: "Yang",
            card_members: ["Andreina", "Eddie"],
            card_comment: [
              {
                comment_creator: "Yang",
                comment_create_time: "",
                comment_edit_time: "",
                comment_content: "This must be completed by Friday!",
              },
            ],
          },
        ],
      },
      {
        column_position: 1,
        column_title: "column 2: In-progress",
        cards: [
          {
            card_position: 0,
            card_title: "card 1: create APIs",
            card_desc: "code the APIs that passes data to the frontend",
            card_creator: "Yang",
            card_members: ["Andreina", "Eddie"],
            card_comment: [
              {
                comment_creator: "Yang",
                comment_create_time: "",
                comment_edit_time: "",
                comment_content: "This is one of the MVP features.",
              },
            ],
          },
        ],
      },
    ],
    total_columns: 2,
  };
  /******************************* hardcoded data finish ****************************** */

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

  // create the columns section that will be appended to the board
  const boardColumnsBox = document.createElement("div");
  boardColumnsBox.id = "board-columns-box";
  // create column elements and append to the columns section
  for (let column of board.kanban_columns) {
    const colElem = document.createElement("div");
    colElem.insertAdjacentHTML("beforeend", `<p>${column.column_title}</p>`); // display column title
    // create and append the cards to the column div
    for (let card of column["cards"]) {
      console.log(card);
      const cardElem = document.createElement("div");
      cardElem.insertAdjacentHTML("beforeend", `<p>${card.card_title}</p>`); // display card title
      colElem.appendChild(cardElem);
    }
    // add the column to columns section
    boardColumnsBox.appendChild(colElem);
  }
  // append the whole columns section to the board container
  boardContainer.appendChild(boardColumnsBox);

  page.replaceChildren(boardContainer);

  // });
}
