import { renderCard } from "./cardList.js";

let name;
let email;
let allUsers = [];

export function renderAddCardForm(boardId, columnId) {
  console.log(columnId);
  const heading = document.createElement("h1");
  axios
    .get("/api/session")
    .then((response) => {
      name = response.data.name;
      email = response.data.email;

      heading.textContent = `Add card, ${name}`;
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
      card_title: formData.get("title"),
      card_creator: name,
      card_members: [name],
      card_desc: formData.get("description"),
      comment: [
        {
          comment_creator: name,
          comment_content: "new comments here",
        },
      ],
    };

    axios
      .post(`/api/boards/${boardId}/columns/${columnId}`, data)
      .then((_) => {
        // renderCard();
      })
      .catch((error) => {
        errorMsg.textContent =
          error.response.status == 400 ? "invalid field(s)" : "unknown error";
      });
  });
}