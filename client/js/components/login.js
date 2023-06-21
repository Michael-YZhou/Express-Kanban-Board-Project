import { renderHeader } from "./header.js";
import { renderBoardList } from "./boardList.js";

export function renderLoginForm() {
  const page = document.getElementById("page");
  const heading = document.createElement("h1");
  heading.textContent = "Login";
  const form = document.createElement("form");
  form.innerHTML = `
        <label for="email">Email: </label>
        <input type="email" name="email">
        <label for="password">Password: </label>
        <input type="password" name="password">
        <input type="submit">
    `;
  page.replaceChildren(heading, form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    axios.post("/api/session", data).then((_) => {
      renderHeader();
      renderBoardList();
    });
  });
}
