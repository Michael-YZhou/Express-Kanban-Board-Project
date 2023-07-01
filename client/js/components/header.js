import { renderAddBoardForm } from "./addBoard.js";
import { renderBoardList } from "./boardList.js";
import { renderLoginForm } from "./login.js";
import { logout } from "./logout.js";
import { renderHomePage } from "./home.js";
import { renderSignUpForm } from "./signUp.js";
import { renderBoard } from "./board.js";
import { renderUserProfile } from "./userProfile.js";

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
      <div class="collapse navbar-collapse">
      <h1 class="navbar-brand mb-0 h1">Kanban</h1>
      <ul id="navlist" class="navbar-nav">
          <li id="home" class="nav-item active"><p class="nav-link">Home</p></li>
          ${
            name
              ? `
            <li id="boards" class="nav-item active"><p class="nav-link">My Boards</p></li>
            <li id="add-board" class="nav-item active"><p class="nav-link">Create New Board</p></li>
            <li><p class="nav-link">Hello ${name}!</p></li>
            <li id="logout" class="nav-item active"><p class="nav-link">Logout</p></li>
            
            `
              : `
            <li id="signUp" class="nav-item active"><p class="nav-link">Signup</p></li>
            <li id="login" class="nav-item active"><p class="nav-link">Login</p></li>
            `
          }
      </ul>
      </div>
    `;

  // add event listener to the header btns.
  // depending on whether a user has logged in (different btns will exist)
  document
    .querySelector("#navlist>#home")
    .addEventListener("click", () => renderHomePage());

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
  } else {
    document
      .querySelector("#navlist>#signUp")
      .addEventListener("click", () => renderSignUpForm());
    document
      .querySelector("#navlist>#login")
      .addEventListener("click", () => renderLoginForm());
  }
}
