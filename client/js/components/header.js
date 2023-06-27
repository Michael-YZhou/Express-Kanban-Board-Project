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
      <h1>Task Management Tool</h1>
      <ul id="navlist">
          <li id="home">Home</li>
          ${
            name
              ? `
            <li id="boards">My Boards</li>
            <li id="add-board">Create New Board</li>
            Hello ${name}!
            <li id="logout">Logout</li>
            <li id="user-profile">Profile</li>
            `
              : `
            <li id="signUp">Signup</li>
            <li id="login">Login</li>
            `
          }
      </ul>
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
