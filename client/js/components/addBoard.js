import { renderBoardList } from "./boardList.js";

export function renderAddBoardForm() {
  const page = document.getElementById("page");
  const heading = document.createElement("h1");
  heading.textContent = "Add board";
  const form = document.createElement("form");
  form.innerHTML = `
        <label for="name">Name:</label>
        <input type="text" name="name">
        <label for="description">Description: </label>
        <input type="text" name="description">
        <label for="address">Address: </label>
        <input type="text" name="address">
        <input type="submit">
    `;
  const errorMsg = document.createElement("p");
  errorMsg.id = "error-msg";
  page.replaceChildren(heading, form, errorMsg);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      address: formData.get("address"),
    };

    axios
      .post("/api/challenges", data)
      .then((_) => {
        renderBoardList();
      })
      .catch((error) => {
        errorMsg.textContent =
          error.response.status == 400 ? "invalid field(s)" : "unknown error";
      });
  });
}
