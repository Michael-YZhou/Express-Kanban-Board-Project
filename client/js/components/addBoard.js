import { renderBoardList } from "./boardList.js";

export function renderAddBoardForm() {
  let name;
  let email;
  const heading = document.createElement("h1");
  axios
    .get("/api/session")
    .then((response) => {
      name = response.data.name;
      email = response.data.email;

      heading.textContent = `Add board, ${name}`;
    })
    .catch((error) => {
      name = "there is an error";
    });
  const page = document.getElementById("page");

  const form = document.createElement("form");
  form.innerHTML = `
        <label for="title">Title:</label>
        <input type="text" name="title">
        <label for="description">Description: </label>
        <input type="text" name="description">
        <input type="submit">
    `;
  const errorMsg = document.createElement("p");
  errorMsg.id = "error-msg";
  page.replaceChildren(heading, form, errorMsg);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const data = {
      kanban_title: formData.get("title"),
      kanban_creator: name,
      kanban_members: [name],
      kanban_desc: formData.get("description"),
      column_id: 0,
      card_id: 0,
      comment_id: 0,
      kanban_columns: [
        {
          column_id: 1,
          column_title: "Column 1",
          // each column contains multiple cards/tasks
          cards: [
            {
              card_id: 1,
              card_title: "Card Title 1",
              card_desc: "Card Description.",
              card_creator: "Card Creator",
              card_members: ["Member 1", "Member 2"],
              card_comment: [
                {
                  comment_creator: "Comment Creator",
                  comment_create_time: "",
                  comment_edit_time: "",
                  comment_content: "Comment content",
                },
              ],
            },
          ],
        },
      ],
    };

    axios
      .post("/api/boards", data)
      .then((_) => {
        renderBoardList();
      })
      .catch((error) => {
        errorMsg.textContent = "unknown error";
        console.log(error);
        // error.response === 400 ? "invalid field(s)" : "unknown error";
      });
  });
}
