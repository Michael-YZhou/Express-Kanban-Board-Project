import { renderBoardList } from "./boardList.js";

export function renderUserProfile() {
  let name;
  axios
    .get("/api/session")
    .then((response) => {
      name = response.data.name;
      // const page = document.getElementById("page");
      // const heading = document.createElement("h1");
      // heading.textContent = `hello, ${name}`;
      // page.replaceChildren(heading);

      axios.get("/api/boards").then((response) => {
        if (name === response.data.kanban_creator) {
          const listElements = response.data.map((board) => renderBoard(board));
          page.replaceChildren(...listElements);
        }
      });
    })
    .catch((error) => {
      heading.textContent = "not logged in";
      page.replaceChildren(heading);
    });
}
