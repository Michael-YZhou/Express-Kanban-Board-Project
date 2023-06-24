import { renderAddBoardForm } from "./addBoard.js";
import { renderBoardList } from "./boardList.js";
import { renderLoginForm } from "./login.js";
import { logout } from "./logout.js";
import { renderHomePage } from "./home.js";
import { renderSignUpForm } from "./signUp.js";
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
            <li id="boards">Boards</li>
            <li id="your-board">Your Board</li>
            <li id="add-board">Add Board</li>
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
    document
      .querySelector("#navlist>#user-profile")
      .addEventListener("click", () => renderUserProfile());
  } else {
    document
      .querySelector("#navlist>#signUp")
      .addEventListener("click", () => renderSignUpForm());
    document
      .querySelector("#navlist>#login")
      .addEventListener("click", () => renderLoginForm());
  }
}
