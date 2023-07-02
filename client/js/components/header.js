import { renderAddBoardForm } from "./addBoard.js";
import { renderBoardList } from "./boardList.js";
import { renderLoginForm } from "./login.js";
import { logout } from "./logout.js";
import { renderHomePage } from "./home.js";
import { renderSignUpForm } from "./signUp.js";

export function renderHeader() {
  let name;
  axios
    .get("/api/session")
    .then((response) => {
      name = response.data.name;
      setHeaderHTML(name);
    })
    .catch((error) => {
      setHeaderHTML(undefined);
    });
}

function setHeaderHTML(name) {
  const header = document.getElementById("header-nav");
  header.innerHTML = `
      <div class="collapse navbar-collapse justify-content-center">
      <h1 class="navbar-brand mb-0 fs-1" style="cursor: pointer;" id="kanban-logo">Kanbanify</h1>
      <ul id="navlist" class="navbar-nav justify-content-center">
          
          ${
            name
              ? `
            <li id="boards" class="nav-item active"><p class="nav-link" style="cursor: pointer;">My Boards</p></li>
            <li id="add-board" class="nav-item active" ><p class="nav-link" style="cursor: pointer;">Create New Board</p></li>
            <li><p class="nav-link fw-bold">Hello ${name}!</p></li>
            <li id="logout" class="nav-item active"><p class="nav-link" style="cursor: pointer;">Logout</p></li>
            
            `
              : `
            <li id="signUp" class="nav-item active"><p class="nav-link" style="cursor: pointer;">Signup</p></li>
            <li id="login" class="nav-item active"><p class="nav-link" style="cursor: pointer;">Login</p></li>
            <li id="home" class="nav-item active"><p class="nav-link" style="cursor: pointer;">Home</p></li>
            
            `
          }
      </ul>
      </div>
    `;

  // add event listener to the header btns.
  // depending on whether a user has logged in (different btns will exist)

  if (name) {
    document
      .querySelector("#navlist>#add-board")
      .addEventListener("click", () => renderAddBoardForm());
    document
      .querySelector("#navlist>#logout")
      .addEventListener("click", () => logout());
    document
      .querySelector("#navlist>#boards")
      .addEventListener("click", () => renderBoardList());
    document
      .querySelector("#kanban-logo")
      .addEventListener("click", () => renderBoardList());
  } else {
    document
      .querySelector("#kanban-logo")
      .addEventListener("click", () => renderHomePage());
    document
      .querySelector("#navlist>#home")
      .addEventListener("click", () => renderHomePage());
    document
      .querySelector("#navlist>#signUp")
      .addEventListener("click", () => renderSignUpForm());
    document
      .querySelector("#navlist>#login")
      .addEventListener("click", () => renderLoginForm());
  }
}
