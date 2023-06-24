import { renderBoardList } from "./boardList.js";

export function renderUserProfile() {
  console.log("logged in");

  let name;
  axios
    .get("/api/session")
    .then((response) => {
      name = response.data.name;
      const page = document.getElementById("page");
      const heading = document.createElement("h1");
      heading.textContent = `hello, ${name}`;
      page.replaceChildren(heading);
    })
    .catch((error) => {
      heading.textContent = "not logged in";
      page.replaceChildren(heading);
    });
}
